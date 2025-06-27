"use client";

import { useEffect, useState } from "react";
import WalletConnection from "./WallectConnection";
import { useProfile } from "../contexts/ProfileContext";
import ProfileConnection from "./ProfileConnection";
import Link from "next/link";

const Header = () => {
    const { profile } = useProfile();
    const [scrolled, setScrolled] = useState(false);

    // Handle scroll effect for floating navbar
    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 10;
            if (isScrolled !== scrolled) {
                setScrolled(isScrolled);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [scrolled]);

    return (
        <div className="fixed w-full z-50 top-0 left-0">
            <header
                className={`${scrolled
                        ? "bg-gray-900/90 backdrop-blur-lg shadow-lg"
                        : "bg-transparent"
                    } transition-all duration-300 px-4 py-3`}
            >
                <nav className="max-w-7xl mx-auto flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 relative overflow-hidden rounded-lg bg-blue-600 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                            <img src="/logo.png" alt="Logo" className="w-8 h-8 object-cover" />
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
                            ABYA DID
                        </span>
                    </div>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center space-x-1">
                        <ul className="flex mx-4">
                            <li>
                                <Link href="/" className="px-4 py-2 rounded-lg hover:bg-gray-800/50 transition-colors text-gray-300 hover:text-white">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="px-4 py-2 rounded-lg hover:bg-gray-800/50 transition-colors text-gray-300 hover:text-white">
                                    About
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="px-4 py-2 rounded-lg hover:bg-gray-800/50 transition-colors text-gray-300 hover:text-white">
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* User Connection */}
                    <div className="flex items-center space-x-3">
                        {profile.did !== null && <ProfileConnection />}
                        <div className="relative group">
                            <div className={`absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-60 group-hover:opacity-100 transition duration-200 ${scrolled ? '' : 'group-hover:opacity-70'}`}></div>
                            <WalletConnection />
                        </div>
                    </div>
                </nav>
            </header>
        </div>
    );
}

export default Header;