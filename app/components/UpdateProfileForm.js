"use client";

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    AlertOctagonIcon,
    ArrowLeft,
    Clipboard,
    Loader,
    Trash2,
    Plus,
} from "lucide-react";
import { useDid } from "../contexts/DidContext";
import { resolveDid } from "../services/didService";
import { storeStudentProfile, unpinCID } from "../services/ipfsService";
import { ethers } from "ethers";
import EthereumDIDRegistryArtifact from "../artifacts/contracts/did_contract.json";

const UpdateProfileForm = (setShowCreateProfileModal) => {
    const navigate = useNavigate();
    const { ethrDid } = useDid();

    const [resolvedDid, setResolvedDid] = useState(null);
    const [existingProfile, setExistingProfile] = useState(null);
    const [formData, setFormData] = useState({
        firstName: "",
        secondName: "",
        dateOfBirth: "",
        gender: "",
        email: "",
        countryOfResidence: "",
        preferredLanguages: [""],
    });
    const [genderOptions] = useState(["Male", "Female", "Other"]);
    const [profileCid, setProfileCid] = useState("");
    const [oldCid, setOldCid] = useState("");
    const [profileTxHash, setProfileTxHash] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [copySuccess, setCopySuccess] = useState(false);


    console.log("UpdateProfileForm mounted with ethrDid:", ethrDid);

    const rpc_url = process.env.NEXT_PUBLIC_RPC_URL;
    const contract_address = process.env.NEXT_PUBLIC_DID_REGISTRY_CONTRACT_ADDRESS;


    // Fetch existing DID and profile
    useEffect(() => {
        if (!ethrDid) return;
        (async () => {

            console.log("Fetching existing profile for DID:", ethrDid);
            console.log("Using RPC URL:", rpc_url);
            console.log("Using contract address:", contract_address);



            try {
                const doc = await resolveDid(
                    ethrDid,
                    rpc_url,
                    contract_address
                );
                setResolvedDid(doc);

                const provider = new ethers.JsonRpcProvider(
                    rpc_url
                );
                const contract = new ethers.Contract(
                    contract_address,
                    EthereumDIDRegistryArtifact.abi,
                    provider
                );
                const identity = ethrDid.split(":")[3];
                const existingCid = await contract.getProfileCID(identity);
                if (existingCid) {
                    setOldCid(existingCid);
                    const profileJson = await (
                        await fetch(`https://ipfs.io/ipfs/${existingCid}`)
                    ).json();
                    setExistingProfile(profileJson);
                    setProfileCid(existingCid);
                    setFormData({
                        firstName: profileJson.profile.firstName || "",
                        secondName: profileJson.profile.secondName || "",
                        dateOfBirth: profileJson.profile.dateOfBirth || "",
                        gender: profileJson.profile.gender || "",
                        email: profileJson.profile.email || "",
                        countryOfResidence: profileJson.profile.countryOfResidence || "",
                        preferredLanguages: profileJson.profile.preferredLanguages || [""],
                    });
                }
            } catch (err) {
                console.error("Error loading existing profile:", err);
            }
        })();
    }, [ethrDid]);

    // Browser signer helper
    const getBrowserSigner = async () => {
        if (!window.ethereum) throw new Error("No Ethereum provider");
        const browserProvider = new ethers.BrowserProvider(window.ethereum);
        return browserProvider.getSigner();
    };

    // Form handlers
    const handleInputChange = (field, value) =>
        setFormData((prev) => ({ ...prev, [field]: value }));
    const handleArrayChange = (field, idx, value) => {
        const arr = [...formData[field]];
        arr[idx] = value;
        setFormData((prev) => ({ ...prev, [field]: arr }));
    };
    const addArrayItem = (field) =>
        setFormData((prev) => ({ ...prev, [field]: [...prev[field], ""] }));
    const removeArrayItem = (field, idx) => {
        const arr = prev[field].filter((_, i) => i !== idx);
        setFormData((prev) => ({ ...prev, [field]: arr }));
    };

    const handleUpdateProfile = async () => {
        setError("");
        setSuccessMessage("");
        const {
            firstName,
            secondName,
            dateOfBirth,
            gender,
            email,
            countryOfResidence,
        } = formData;
        if (!ethrDid) return setError("Connect wallet first");
        if (
            !firstName ||
            !secondName ||
            !dateOfBirth ||
            !gender ||
            !email ||
            !countryOfResidence
        )
            return setError("All fields required");

        setLoading(true);
        try {
            const updated = {
                did: ethrDid,
                owner: existingProfile.owner,
                profile: { ...formData },
                didDocumentCid: existingProfile.didDocumentCid,
                timestamp: new Date().toISOString(),
            };

            // store updated on IPFS
            const newCid = await storeStudentProfile(ethrDid, updated);
            setProfileCid(newCid);

            // unpin old
            if (oldCid) await unpinCID(oldCid);

            // on-chain update
            const signer = await getBrowserSigner();
            const contract = new ethers.Contract(
                process.env.NEXT_PUBLIC_DID_REGISTRY_CONTRACT_ADDRESS,
                EthereumDIDRegistryArtifact.abi,
                signer
            );
            const identity = ethrDid.split(":")[3];
            const tx = await contract.setProfileCID(identity, newCid);
            const receipt = await tx.wait();
            setProfileTxHash(receipt.transactionHash);
            setSuccessMessage("Profile updated and old data unpinned successfully");
        } catch (err) {
            setError(err.message || "Error updating profile");
        } finally {
            setLoading(false);
        }
    };

    if (!ethrDid)
        return (
            <p className="p-4 text-red-500 flex items-center">
                <AlertOctagonIcon size={24} className="mr-2" /> Please connect your
                wallet first.
            </p>
        );

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="w-[500px] bg-gray-900 text-white p-6 rounded-lg shadow-lg">
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="mb-4 flex items-center text-sm text-gray-400 hover:text-gray-200 transition"
                >
                    <ArrowLeft size={16} className="mr-1" /> Back
                </button>

                <h2 className="text-2xl font-semibold mb-4 text-center">Update Student Profile</h2>
                <section className="bg-gray-800 p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-medium mb-4">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-300">First Name</label>
                            <input
                                type="text"
                                value={formData.firstName}
                                onChange={(e) => handleInputChange("firstName", e.target.value)}
                                className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded focus:ring-2 focus:ring-yellow-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-300">Second Name</label>
                            <input
                                type="text"
                                value={formData.secondName}
                                onChange={(e) => handleInputChange("secondName", e.target.value)}
                                className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded focus:ring-2 focus:ring-yellow-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-300">Date of Birth</label>
                            <input
                                type="date"
                                value={formData.dateOfBirth}
                                onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                                className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded focus:ring-2 focus:ring-yellow-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-300">Gender</label>
                            <select
                                value={formData.gender}
                                onChange={(e) => handleInputChange("gender", e.target.value)}
                                className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded focus:ring-2 focus:ring-yellow-500"
                            >
                                <option value="">Select Gender</option>
                                {genderOptions.map((opt) => (
                                    <option key={opt} value={opt}>
                                        {opt}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-300">Email</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleInputChange("email", e.target.value)}
                                className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded focus:ring-2 focus:ring-yellow-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-300">Country of Residence</label>
                            <input
                                type="text"
                                value={formData.countryOfResidence}
                                onChange={(e) => handleInputChange("countryOfResidence", e.target.value)}
                                className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded focus:ring-2 focus:ring-yellow-500"
                            />
                        </div>
                    </div>

                    <div className="mt-4">
                        <label className="block text-sm font-medium mb-2 text-gray-300">Preferred Languages</label>
                        {formData.preferredLanguages.map((lang, i) => (
                            <div key={i} className="flex items-center gap-2 mb-2">
                                <input
                                    type="text"
                                    value={lang}
                                    onChange={(e) => handleArrayChange("preferredLanguages", i, e.target.value)}
                                    className="flex-1 p-3 bg-gray-700 text-white border border-gray-600 rounded focus:ring-2 focus:ring-yellow-500"
                                    placeholder="Language"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeArrayItem("preferredLanguages", i)}
                                    className="text-red-500 hover:text-red-400 transition"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => addArrayItem("preferredLanguages")}
                            className="flex items-center text-yellow-500 hover:text-yellow-400 transition"
                        >
                            <Plus size={16} /> Add Language
                        </button>
                    </div>
                </section>

                <button
                    onClick={handleUpdateProfile}
                    disabled={loading}
                    className={`mt-4 w-full p-3 rounded text-white flex items-center justify-center ${loading ? "bg-gray-500" : "bg-blue-500 hover:bg-blue-600 transition"
                        }`}
                >
                    {loading ? (
                        <Loader className="animate-spin" size={18} />
                    ) : (
                        "Update Profile"
                    )}
                </button>

                {error && <p className="mt-2 text-red-500">{error}</p>}
                {successMessage && <p className="mt-2 text-green-500">{successMessage}</p>}
            </div>
        </div>
    );
};

export default UpdateProfileForm;