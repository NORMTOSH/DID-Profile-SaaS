// ipfsService.js

import { PinataSDK } from "pinata-web3";

// Initialize Pinata SDK using JWT and Gateway URL from environment variables
const pinata = new PinataSDK({
  pinataJwt: process.env.NEXT_PUBLIC_PINATA_JWT,
  pinataGateway: process.env.NEXT_PUBLIC_GATEWAY_URL,
});

/**
 * Uploads a DID document to Pinata with a filename that includes the DID.
 * @param {string} did - The DID for which the document is generated.
 * @param {Object} didDocument - The DID document object.
 * @returns {Promise<string>} - The IPFS hash (CID) of the uploaded document.
 */
export const storeDidDocument = async (did, didDocument) => {
  try {
    const documentString = JSON.stringify(didDocument, null, 2);
    const blob = new Blob([documentString], { type: "application/json" });
    const safeDid = did.replace(/:/g, ":");
    const fileName = `diddoc-${safeDid}.json`;
    const file = new File([blob], fileName, { type: "application/json" });
    const uploadResponse = await pinata.upload.file(file);
    return uploadResponse.IpfsHash;
  } catch (error) {
    console.error("Error uploading DID document to Pinata:", error);
    throw error;
  }
};

/**
 * Fetches a DID document from Pinata using the provided CID.
 * @param {string} cid - The IPFS CID of the DID document.
 * @returns {Promise<Object>} - The fetched DID document object.
 */
export const fetchDidDocument = async (cid) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${cid}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch DID document from IPFS");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching DID document from Pinata:", error);
    throw error;
  }
};


/**
 * Stores a student profile on Pinata by creating a JSON file that maps the student profile 
 * with the associated DID and the CID of the DID document.
 *
 * @param {string} did - The DID of the student.
 * @param {Object} profileData - The profile data including student information.
 * @returns {Promise<string>} - The IPFS hash (CID) of the stored profile.
 */
export const storeStudentProfile = async (did, profileData) => {
  try {
    const profileString = JSON.stringify(profileData, null, 2);
    const blob = new Blob([profileString], { type: "application/json" });
    const safeDid = did.replace(/:/g, ":");
    const fileName = `profile-${safeDid}.json`;
    const file = new File([blob], fileName, { type: "application/json" });
    const uploadResponse = await pinata.upload.file(file, {
      pinataMetadata: { name: `profile-${safeDid}` },
    });
    return uploadResponse.IpfsHash;
  } catch (error) {
    console.error("Error uploading student profile to Pinata:", error);
    throw error;
  }
};



/**
 * Unpins a given CID from Pinata to free up space.
 * @param {string} cid - The IPFS CID to unpin.
 */
export const unpinCID = async (cid) => {
  try {
    await pinata.unpin(cid);
    console.log(`Successfully unpinned CID: ${cid}`);
  } catch (error) {
    console.error(`Failed to unpin CID ${cid}:`, error);
    throw error;
  }
};





// Optional Wallet Connection


/**
 * Append a new DID + timestamp to a global DID registry on Pinata.
 * @param {string} did
 * @returns {Promise<string>}  the new registry CID
 */
export const registerDidOnIpfs = async (did) => {
  try {
    const existingCid = await getDidRegistryCid();
    let registry;

    if (existingCid) {
      registry = await fetchDidDocument(existingCid);
    } else {
      registry = { dids: [] };
    }

    registry.dids.push({
      did,
      timestamp: new Date().toISOString(),
    });

    const registryString = JSON.stringify(registry, null, 2);
    const blob = new Blob([registryString], { type: "application/json" });
    // const file = new File([blob], "did-registry.json", { type: "application/json" });

    const uploadResponse = await pinata.upload.file(file, {
      pinataMetadata: { name: "did-registry.json" },
    });

    return uploadResponse.IpfsHash;
  } catch (err) {
    console.error("Error updating DID registry:", err);
    throw err;
  }
};

