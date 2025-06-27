import React from 'react';
import { useProfile } from '../contexts/ProfileContext';
import clsx from 'clsx';

// Reusable Card component matching dark frosted style
export const Card = ({ className = '', children, title }) => (
  <div
    className={clsx(
      'bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700 shadow-md',
      className
    )}
    role={title ? 'group' : undefined}
    aria-labelledby={title ? `${title.replace(/\s+/g, '-').toLowerCase()}-title` : undefined}
  >
    {title && (
      <h2 id={`${title.replace(/\s+/g, '-').toLowerCase()}-title`} className="text-2xl font-semibold text-white mb-4">
        {title}
      </h2>
    )}
    {children}
  </div>
);

// Reusable Definition List for label-value pairs
export const InfoList = ({ data }) => {
  // data: array of { label: string, value: ReactNode }
  return (
    <dl className="grid grid-cols-1 gap-y-3 gap-x-4">
      {data.map(({ label, value }) => (
        <div key={label} className="flex flex-col sm:flex-row">
          <dt className="w-full sm:w-1/3 text-gray-300 font-medium">{label}:</dt>
          <dd className="w-full sm:w-2/3 text-white break-all">{value}</dd>
        </div>
      ))}
    </dl>
  );
};

const ProfileConsumer = () => {
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
  } = profile || {};

  if (!did) {
    return (
      <Card title="User Profile">
        <p className="text-gray-400">No profile loaded.</p>
      </Card>
    );
  }

  const renderLanguages = () => {
    if (Array.isArray(preferredLanguages)) {
      return preferredLanguages.length > 0 ? preferredLanguages.join(', ') : '—';
    }
    return preferredLanguages ? preferredLanguages : '—';
  };

  const infoData = [
    { label: 'DID', value: <code className="font-mono text-sm">{did}</code> },
    { label: 'First Name', value: firstName || '—' },
    { label: 'Second Name', value: secondName || '—' },
    { label: 'Date Of Birth', value: dateOfBirth || '—' },
    { label: 'Gender', value: gender || '—' },
    { label: 'Email', value: email || '—' },
    { label: 'Country', value: countryOfResidence || '—' },
    { label: 'Language(s)', value: renderLanguages() },
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <Card title="User Profile">
          <InfoList data={infoData} />

          <details className="mt-6 bg-gray-700/30 p-4 rounded-lg">
            <summary className="cursor-pointer text-sm text-gray-300">
              Inspect raw profile object
            </summary>
            <pre className="mt-2 text-xs text-gray-200 whitespace-pre-wrap break-words">
              {JSON.stringify(profile, null, 2)}
            </pre>
          </details>
        </Card>
      </div>
    </div>
  );
};

export default ProfileConsumer;
