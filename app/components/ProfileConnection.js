"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { useProfile } from "../contexts/ProfileContext";
import {
  UserCircle,
  CopyIcon,
  CopyCheckIcon,
  Power,
  ChartNetwork,
  Check,
  X as XIcon,
} from "lucide-react";
import ConnectProfile from "./ConnectProfile";
import ProfileDashboard from "../pages/ProfileDashboard";

export default function ProfileConnection() {
  const { profile, setProfile, clearProfile } = useProfile();
  const navigate = useNavigate();

  const [showConnectModal, setShowConnectModal] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [showDashboardModal, setShowDashboardModal] = useState(false);
  const [isDidCopied, setIsDidCopied] = useState(false);
  const [isEmailCopied, setIsEmailCopied] = useState(false);

  const dropdownRef = useRef(null);
  const toggleRef = useRef(null);
  const modalContentRef = useRef(null);

  // Close dropdown on outside click or ESC
  useEffect(() => {
    const handleClick = (e) => {
      if (
        dropdownVisible &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        !toggleRef.current.contains(e.target)
      ) {
        setDropdownVisible(false);
      }
    };
    const handleKey = (e) => {
      if (e.key === "Escape" && dropdownVisible) {
        setDropdownVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [dropdownVisible]);

  // Lock body scroll when dashboard modal is open, and avoid layout shift
  useEffect(() => {
    if (showDashboardModal) {
      const scrollBarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      const originalOverflow = document.body.style.overflow;
      const originalPaddingRight = document.body.style.paddingRight;
      document.body.style.overflow = "hidden";
      if (scrollBarWidth > 0) {
        document.body.style.paddingRight = `${scrollBarWidth}px`;
      }
      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.paddingRight = originalPaddingRight;
      };
    }
    return;
  }, [showDashboardModal]);

  // Close dashboard modal on outside click or ESC
  useEffect(() => {
    if (!showDashboardModal) return;
    const handleKey = (e) => {
      if (e.key === "Escape") {
        setShowDashboardModal(false);
      }
    };
    const handleClick = (e) => {
      if (
        modalContentRef.current &&
        !modalContentRef.current.contains(e.target)
      ) {
        setShowDashboardModal(false);
      }
    };
    document.addEventListener("keydown", handleKey);
    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.removeEventListener("mousedown", handleClick);
    };
  }, [showDashboardModal]);

  const copyText = (text, setter) => {
    navigator.clipboard.writeText(text).then(() => {
      setter(true);
      setTimeout(() => setter(false), 2000);
    });
  };

  const signOut = () => {
    clearProfile();
    setDropdownVisible(false);
    navigate("/");
  };

  // Called by <ConnectProfile> once it has DID + profile data
  const handleProfileConnected = (didDocument, profileData) => {
    setProfile({
      ...profileData,
      did: didDocument,
    });
    setShowConnectModal(false);
  };

  // If not connected yet, show ConnectProfile button + modal
  if (!profile?.did) {
    return (
      <>
        <button
          onClick={() => setShowConnectModal(true)}
          className="flex items-center space-x-2 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
        >
          <UserCircle size={20} />
          <span>Connect Profile</span>
        </button>
        {showConnectModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto">
              <ConnectProfile
                onClose={() => setShowConnectModal(false)}
                onProfileConnected={handleProfileConnected}
              />
              <button
                onClick={() => setShowConnectModal(false)}
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

  const { did, firstName, secondName, email } = profile;

  const dashboardModal = showDashboardModal
    ? typeof document !== "undefined"
      ? createPortal(
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]"
            aria-modal="true"
            role="dialog"
          >
            <div
              ref={modalContentRef}
              className="bg-white dark:bg-gray-900 rounded-lg shadow-lg w-full max-w-7xl max-h-[70vh] flex flex-col relative"
            >
              {/* Sticky header */}
              <div className="sticky top-0 bg-white dark:bg-gray-900 z-10 p-4 border-b dark:border-gray-700 flex justify-between items-center">
                <h2 className="text-lg font-semibold dark:text-white">
                  Profile Dashboard
                </h2>
                <button
                  onClick={() => setShowDashboardModal(false)}
                  className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
                  aria-label="Close Profile Dashboard"
                >
                  <XIcon size={24} />
                </button>
              </div>
              {/* Scrollable content */}
              <div className="p-6 overflow-y-auto flex-1">
                <ProfileDashboard onClose={() => setShowDashboardModal(false)} />
              </div>
            </div>
          </div>,
          document.body
        )
      : null
    : null;

  return (
    <div className="relative">
      <button
        ref={toggleRef}
        onClick={() => setDropdownVisible((v) => !v)}
        className="flex items-center space-x-2 bg-gray-200 dark:bg-gray-700 text-white px-4 py-2 rounded-lg shadow-lg"
        aria-haspopup="menu"
        aria-expanded={dropdownVisible}
      >
        <UserCircle size={20} className="text-gray-700 dark:text-gray-50" />
        <span className="text-gray-700 font-semibold dark:text-gray-50">
          {firstName}
        </span>
      </button>

      {dropdownVisible && (
        <div
          ref={dropdownRef}
          role="menu"
          className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl shadow-2xl overflow-hidden z-50"
        >
          <div className="bg-blue-500/10 p-4 flex items-center space-x-3 border-b dark:border-gray-700">
            <UserCircle className="w-10 h-10 text-blue-600 dark:text-blue-400" />
            <div>
              {/* Name button: opens ProfileDashboard modal */}
              <button
                onClick={() => {
                  setShowDashboardModal(true);
                  setDropdownVisible(false);
                }}
                className="font-bold text-lg text-gray-800 dark:text-white text-left"
              >
                {firstName} {secondName}
              </button>
            </div>
          </div>

          <div className="p-4 space-y-3">
            {/* Status */}
            <div className="flex justify-between">
              <span className="flex items-center space-x-2 dark:text-gray-300">
                <ChartNetwork />
                <span>Status</span>
              </span>
              <span className="flex items-center space-x-1 text-green-500">
                <Check />
                <span>Connected</span>
              </span>
            </div>

            {/* DID */}
            <div className="flex justify-between">
              <button
                onClick={() => copyText(did, setIsDidCopied)}
                className="flex items-center space-x-1 hover:underline"
              >
                {isDidCopied ? (
                  <CopyCheckIcon className="w-5 h-5 text-yellow-500" />
                ) : (
                  <CopyIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                )}
                <span className="dark:text-gray-300">DID</span>
              </button>
              <span className="font-semibold text-sm truncate max-w-[150px] dark:text-gray-400">
                {did.replace(/^(.{12}).*(.{4})$/, "$1…$2")}
              </span>
            </div>

            {/* Email */}
            <div className="flex justify-between">
              <button
                onClick={() => copyText(email, setIsEmailCopied)}
                className="flex items-center space-x-1 hover:underline"
              >
                {isEmailCopied ? (
                  <CopyCheckIcon className="w-5 h-5 text-yellow-500" />
                ) : (
                  <CopyIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                )}
                <span className="dark:text-gray-300">Email</span>
              </button>
              <span className="font-semibold text-sm truncate max-w-[150px] dark:text-yellow-500">
                {email}
              </span>
            </div>

            {/* Disconnect */}
            <button
              onClick={signOut}
              className="w-full flex items-center justify-center space-x-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950 p-2 rounded-lg"
            >
              <Power />
              <span>Disconnect</span>
            </button>
          </div>
        </div>
      )}

      {/* Render the portal-based ProfileDashboard modal */}
      {dashboardModal}
    </div>
  );
}
