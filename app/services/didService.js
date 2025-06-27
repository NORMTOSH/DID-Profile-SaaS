// didService.js

import { ethers } from "ethers";
import { EthrDID } from "ethr-did";
import { Resolver } from "did-resolver";
import { getResolver } from "ethr-did-resolver";


/**
 * Create an Ethr-DID instance (and return its DID URI)
 * directly from a connected ethers.js Signer.
 */
export const createDidFromSigner = async (signer, registryAddress, chainName = "skaleTitanTestnet") => {
  if (!signer) throw new Error("Ethers signer is required");

  const address = await signer.getAddress();

  const ethrDid = new EthrDID({
    identifier: address,
    signer,
    chainNameOrId: chainName,
    registry: registryAddress,
  });

  return ethrDid.did;
};

/**
 * Resolve a DID and retrieve its document.
 */
export const resolveDid = async (did, infuraUrl, contractAddress) => {
  try {
    if (!did) throw new Error("DID is required for resolution");

    const resolver = new Resolver(
      getResolver({
        networks: [
          {
            name: "skaleTitanTestnet",
            name: "sepolia",
            rpcUrl: infuraUrl,
            registry: contractAddress,
          },
        ],
      })
    );

    const resolvedDid = await resolver.resolve(did);
    if (!resolvedDid || !resolvedDid.didDocument) {
      throw new Error("Failed to resolve DID.");
    }

    console.log("Resolved DID Document:", resolvedDid.didDocument);
    return resolvedDid.didDocument;
  } catch (error) {
    console.error("Error in resolveDid:", error.message);
    throw new Error(`DID resolution failed: ${error.message}`);
  }
};
