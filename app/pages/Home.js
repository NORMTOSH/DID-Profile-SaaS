"use client";

import { useState } from "react";
import { useProfile } from "../contexts/ProfileContext";
import ProfileForm from "../components/ProfileForm";
import UpdateProfileForm from "../components/UpdateProfileForm";
import { Shield, Lock, UserCheck, Key, Database } from "lucide-react";
import ConnectProfile from "../components/ConnectProfile";

const Homepage = () => {
    const [showCreateProfileModal, setShowCreateProfileModal] = useState(false);
    const [showConnectProfileModal, setShowConnectProfileModal] = useState(false);
    const { profile } = useProfile();

    const handleProfileConnected = (did, profileData) => {
        // Handle the profile connection
        setShowConnectProfileModal(false);
    };

    return (
        <>
            <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
                {/* Hero Section */}
                <section className="relative pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                    <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10"></div>

                    {/* Connection Banner */}
                    {profile.did === null && (
                        <div className="mb-12 p-4 bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-xl backdrop-blur-sm border border-purple-700/30 shadow-xl animate-pulse flex justify-between items-center">
                            <div className="text-white">
                                <span className="font-medium">Get started with ABYA DID</span>
                                <p className="text-sm text-gray-300">Connect your profile to access all features</p>
                            </div>
                            <button
                                onClick={() => setShowConnectProfileModal(true)}
                                className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium rounded-lg transition shadow-md hover:shadow-lg py"
                            >
                                Connect Profile
                            </button>
                        </div>
                    )}

                    <div className="relative z-10 text-center">
                        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-blue-400 via-violet-400 to-purple-400 inline-block text-transparent bg-clip-text">
                            Decentralized Identity Management
                        </h1>
                        <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto text-gray-300">
                            Secure your digital identity with blockchain technology. Take control of your personal data with ABYA DID.
                        </p>
                        <button
                            onClick={() => setShowCreateProfileModal(true)}
                            className="relative group px-8 py-3 bg-gradient-to-r from-violet-600 to-blue-600 rounded-lg hover:from-violet-700 hover:to-blue-700 transition-all duration-300 shadow-lg"
                        >
                            <span className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-200"></span>
                            <span className="relative flex items-center justify-center space-x-2">
                                <UserCheck size={20} />
                                <span className="font-semibold">Create Your DID Profile</span>
                            </span>
                        </button>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-16 px-4">
                    <div className="max-w-7xl mx-auto">
                        <h2 className="text-3xl font-bold mb-12 text-center">Why Choose Decentralized Identity?</h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700 hover:border-purple-500/40 transition-all duration-300 hover:shadow-purple-500/10 hover:shadow-lg">
                                <div className="bg-gradient-to-br from-purple-500 to-blue-500 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                                    <Shield size={24} />
                                </div>
                                <h3 className="text-xl font-bold mb-2">Enhanced Security</h3>
                                <p className="text-gray-400">Your identity is secured by blockchain technology, making it resistant to unauthorized access and tampering.</p>
                            </div>

                            <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700 hover:border-blue-500/40 transition-all duration-300 hover:shadow-blue-500/10 hover:shadow-lg">
                                <div className="bg-gradient-to-br from-blue-500 to-cyan-500 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                                    <Lock size={24} />
                                </div>
                                <h3 className="text-xl font-bold mb-2">Full Control</h3>
                                <p className="text-gray-400">You decide what information to share and with whom. No central authority can access your data without consent.</p>
                            </div>

                            <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700 hover:border-cyan-500/40 transition-all duration-300 hover:shadow-cyan-500/10 hover:shadow-lg">
                                <div className="bg-gradient-to-br from-cyan-500 to-emerald-500 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                                    <Database size={24} />
                                </div>
                                <h3 className="text-xl font-bold mb-2">Interoperability</h3>
                                <p className="text-gray-400">Use your DID across different platforms and services without creating multiple accounts.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* How It Works */}
                <section className="py-16 px-4 bg-gradient-to-b from-gray-800 to-gray-900">
                    <div className="max-w-7xl mx-auto">
                        <h2 className="text-3xl font-bold mb-12 text-center">How ABYA DID Works</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="relative">
                                <div className="bg-gray-700/30 p-6 rounded-xl border border-gray-700">
                                    <span className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center font-bold text-xl">1</span>
                                    <h3 className="text-lg font-medium mb-2 mt-2">Connect Wallet</h3>
                                    <p className="text-gray-400 text-sm">Link your blockchain wallet to establish your unique identity.</p>
                                </div>
                            </div>

                            <div className="relative">
                                <div className="bg-gray-700/30 p-6 rounded-xl border border-gray-700">
                                    <span className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-xl">2</span>
                                    <h3 className="text-lg font-medium mb-2 mt-2">Create Profile</h3>
                                    <p className="text-gray-400 text-sm">Set up your decentralized identity with personal information you choose to include.</p>
                                </div>
                            </div>

                            <div className="relative">
                                <div className="bg-gray-700/30 p-6 rounded-xl border border-gray-700">
                                    <span className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-cyan-600 flex items-center justify-center font-bold text-xl">3</span>
                                    <h3 className="text-lg font-medium mb-2 mt-2">Secure Storage</h3>
                                    <p className="text-gray-400 text-sm">Your data is securely stored on IPFS with cryptographic protection.</p>
                                </div>
                            </div>

                            <div className="relative">
                                <div className="bg-gray-700/30 p-6 rounded-xl border border-gray-700">
                                    <span className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-xl">4</span>
                                    <h3 className="text-lg font-medium mb-2 mt-2">Control Access</h3>
                                    <p className="text-gray-400 text-sm">Grant and revoke access to your identity information as needed.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Call To Action */}
                <section className="py-16 px-4">
                    <div className="max-w-3xl mx-auto text-center">
                        <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 p-8 rounded-2xl backdrop-blur-sm border border-purple-700/30 shadow-lg">
                            <h2 className="text-2xl font-bold mb-4">Ready to take control of your digital identity?</h2>
                            <p className="mb-6 text-gray-300">Create your DID profile now and join the decentralized identity revolution.</p>
                            <button
                                onClick={() => setShowCreateProfileModal(true)}
                                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 font-semibold"
                            >
                                Get Started
                            </button>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="py-8 px-4 border-t border-gray-800">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
                        <div className="flex items-center space-x-3 mb-4 md:mb-0">
                            <div className="h-10 w-10 relative overflow-hidden rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                <img src="/logo.png" alt="Logo" className="w-8 h-8" />
                            </div>
                            <span className="font-bold">ABYA DID</span>
                        </div>
                        <p className="text-gray-400 text-sm">© {new Date().getFullYear()} ABYA DID. All rights reserved.</p>
                        <div className="mt-4 md:mt-0">
                            <a href="https://nextjs.org/docs" className="text-blue-400 hover:text-blue-300 transition" target="_blank" rel="noopener noreferrer">
                                Documentation
                            </a>
                        </div>
                    </div>
                </footer>
            </div>

            {/* Modal for profile connection - rendered at the root level */}
            {showConnectProfileModal && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                    <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-[500px] max-h-[90vh] overflow-y-auto">
                        <ConnectProfile
                            onClose={() => setShowConnectProfileModal(false)}
                            onProfileConnected={handleProfileConnected}
                        />
                        <button
                            onClick={() => setShowConnectProfileModal(false)}
                            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {showCreateProfileModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div
                className="bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto"
                >
                <h2 className="text-xl font-bold mb-4 text-white">Update Profile</h2>
                <ProfileForm state={setShowCreateProfileModal} />
                <button
                    onClick={() => setShowCreateProfileModal(false)}
                    className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                    Close
                </button>
                </div>
            </div>
            )}

        </>
    );
}

export default Homepage;