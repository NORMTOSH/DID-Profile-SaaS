import React, { useRef, useState } from 'react';
import clsx from 'clsx';
import { useProfile } from '../contexts/ProfileContext';
import { Avatar } from '../components/ui/avatar';
import ProfileForm from '../components/UpdateProfileForm';
import DelegateList from '../components/DelegateList';
import {
  Edit3,
  Eye,
  EyeOff,
  IdCard,
  MailIcon,
  MapPin,
  PenLineIcon,
  Home,
  FileText,
  PlusCircle,
  User,
  CheckCircle,
  ShieldCheck,
  XCircle,
  Menu,
  X as CloseIcon,
  Calendar,
  Users,
} from 'lucide-react';
import { ToolKitSidebar } from '../components/ToolKitSidebar';

// Modal wrapper
const Modal = ({ onClose, children }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div className="relative bg-white dark:bg-gray-900 rounded-lg overflow-auto max-w-lg w-full p-6">
      <button
        onClick={onClose}
        aria-label="Close modal"
        className="absolute top-8 right-8 text-gray-700 dark:text-gray-200 hover:text-gray-900"
      >
        <CloseIcon size={20} />
      </button>
      {children}
    </div>
  </div>
);

// Modal components
import DidDoc from '../components/modals/DidDoc';
import AddDelegate from '../components/modals/AddDelegate';
import ChangeOwner from '../components/modals/ChangeOwner';
import CheckDelegate from '../components/modals/CheckDelegate';
import DidOwnerCheck from '../components/modals/DidOwnerCheck';
import RevokeDelegate from '../components/modals/RevokeDelegate';

// Card component
export const Card = ({ className = '', children, title, ...props }) => (
  <div
    {...props}
    className={clsx(
      'bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700 shadow-md',
      className
    )}
    role={title ? 'group' : undefined}
    aria-labelledby={
      title ? `${title.replace(/\s+/g, '-').toLowerCase()}-title` : undefined
    }
  >
    {title && (
      <h2
        id={`${title.replace(/\s+/g, '-').toLowerCase()}-title`}
        className="text-2xl font-semibold text-white mb-4"
      >
        {title}
      </h2>
    )}
    {children}
  </div>
);

const ProfileDashboard = () => {
  const [activeModal, setActiveModal] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const { profile } = useProfile();
  const {
    did,
    firstName,
    secondName,
    dateOfBirth,
    gender,
    email,
    countryOfResidence,
    preferredLanguages,
    profileImage,
    userRole = 'Member',
  } = profile || {};

  const [showDid, setShowDid] = useState(false);
  const profileInputRef = useRef(null);

  const fullName = [firstName, secondName].filter(Boolean).join(' ') || 'Unnamed User';

  // Upload handler
  const handleProfileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log('Uploading new profile image:', file);
      // implement actual upload logic here
    }
  };

  if (!did) {
    return (
      <Card title="User Profile">
        <p className="text-gray-400">No profile loaded.</p>
      </Card>
    );
  }

  const openModal = (modal) => () => setActiveModal(modal);
  const closeModal = () => setActiveModal(null);

  const toolkitItems = [
    { label: 'Home', icon: Home, onClick: () => document.getElementById('profile-section')?.scrollIntoView({ behavior: 'smooth' }) },
    { label: 'View DID Doc', icon: FileText, onClick: openModal('didDoc') },
    { label: 'Add Delegate', icon: PlusCircle, onClick: openModal('addDelegate') },
    { label: 'Change Owner', icon: User, onClick: openModal('changeOwner') },
    { label: 'Check Delegate', icon: CheckCircle, onClick: openModal('checkDelegate') },
    { label: 'DID Owner Check', icon: ShieldCheck, onClick: openModal('didOwnerCheck') },
    { label: 'Revoke Delegate', icon: XCircle, onClick: openModal('revokeDelegate') },
  ];

  const renderLanguages = () => preferredLanguages?.length ? preferredLanguages.join(', ') : '—';

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="hidden md:block sticky top-0 h-full">
        <ToolKitSidebar items={toolkitItems} initialCollapsed={false} />
      </div>
      {showSidebar && (
        <div className="fixed inset-0 z-50 flex">
          <div className="w-64">
            <ToolKitSidebar items={toolkitItems} initialCollapsed={false} />
          </div>
          <div className="flex-1" onClick={() => setShowSidebar(false)} aria-hidden="true" />
        </div>
      )}

      {/* Main */}
      <div className="flex-1 overflow-y-auto h-screen bg-gray-900">
        <header className="md:hidden flex items-center justify-between bg-gray-800 p-4 sticky top-0 z-10">
          <button onClick={() => setShowSidebar(true)} aria-label="Open sidebar" className="text-white">
            <Menu size={24} />
          </button>
          <h1 className="text-lg font-semibold text-white">Profile Dashboard</h1>
          <div />
        </header>

        <div className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-start gap-8">
            {/* Avatar in Card */}
            <Card className="flex-shrink-0 p-4 text-center" title="Profile Picture">
              <div className="relative inline-block">
                <Avatar
                  className="h-32 w-32 border-4 border-white rounded-full"
                  src={profileImage}
                  alt="Profile Picture"
                  loading="lazy"
                />
                <button
                  onClick={() => profileInputRef.current?.click()}
                  aria-label="Change Profile Picture"
                  className="absolute bottom-0 right-0 bg-gray-900 text-white p-2 rounded-full hover:bg-gray-600 transition transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-600"
                >
                  <Edit3 size={16} />
                </button>
                <input
                  type="file"
                  ref={profileInputRef}
                  className="hidden"
                  onChange={handleProfileChange}
                  aria-hidden="true"
                />
              </div>
            </Card>

            {/* Profile Info Card */}
            <Card className="flex-1 bg-gray-100 dark:bg-gray-800 dark:text-gray-100 p-8" title="User Profile Overview">
              <h2 className="text-3xl font-extrabold mt-2 tracking-tight">{fullName}</h2>
              <p className="text-lg text-gray-500 dark:text-gray-400 mb-4">{userRole}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <MapPin size={18} /> <span>{countryOfResidence}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MailIcon size={18} /> <span>{email}</span>
                </div>
                {/* <div className="flex items-center gap-2">
                  <Calendar size={18} /> <span>{dateOfBirth || '—'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users size={18} /> <span>{gender || '—'}</span>
                </div> */}
              </div>

              <div className="mb-4">
                <strong>Languages:</strong> {renderLanguages()}
              </div>

              {/* DID Section */}
              <h3 className="text-xl font-bold flex items-center gap-2 mb-2">
                <IdCard size={20} /> DID
                <button
                  onClick={() => setShowDid(!showDid)}
                  aria-label={showDid ? 'Hide DID' : 'Show DID'}
                  className="ml-2 p-2 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-600"
                >
                  {showDid ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </h3>
              <div className="overflow-x-auto max-w-sm">
                <p className="text-sm whitespace-nowrap">
                  {showDid ? did : '••••••••••••••••••••••••••••'}
                </p>
              </div>

              {/* Edit Button */}
              <button
                onClick={openModal('updateProfile')}
                className="w-12 h-12 rounded-full relative group bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 transition-all duration-300 shadow-lg flex items-center justify-center"
                title="Edit Profile"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full blur opacity-30 group-hover:opacity-100 transition duration-200"></span>
                <span className="relative flex items-center justify-center">
                  <PenLineIcon size={18} />
                </span>
              </button>
            </Card>
          </div>

          <div className="mt-8">
            <DelegateList did={did} />
          </div>
          <details className="mt-6 bg-gray-700/30 p-4 rounded-lg">
            <summary className="cursor-pointer text-sm text-gray-300">Inspect raw profile</summary>
            <pre className="mt-2 text-xs text-gray-200 break-words">{JSON.stringify(profile, null, 2)}</pre>
          </details>
        </div>

        {/* Modals */}
        {activeModal === 'updateProfile' && (
          <Modal onClose={closeModal}>
            <ProfileForm onClose={closeModal} />
          </Modal>
        )}
        {activeModal === 'didDoc' && (
          <Modal onClose={closeModal}>
            <DidDoc />
          </Modal>
        )}
        {activeModal === 'addDelegate' && (
          <Modal onClose={closeModal}>
            <AddDelegate did={did} onClose={closeModal} />
          </Modal>
        )}
        {activeModal === 'changeOwner' && (
          <Modal onClose={closeModal}>
            <ChangeOwner did={did} onClose={closeModal} />
          </Modal>
        )}
        {activeModal === 'checkDelegate' && (
          <Modal onClose={closeModal}>
            <CheckDelegate did={did} onClose={closeModal} />
          </Modal>
        )}
        {activeModal === 'didOwnerCheck' && (
          <Modal onClose={closeModal}>
            <DidOwnerCheck did={did} onClose={closeModal} />
          </Modal>
        )}
        {activeModal === 'revokeDelegate' && (
          <Modal onClose={closeModal}>
            <RevokeDelegate did={did} onClose={closeModal} />
          </Modal>
        )}
      </div>
    </div>
  );
};

export default ProfileDashboard;
