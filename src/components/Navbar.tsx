import React from 'react';

interface NavbarProps {
  activeTab: 'Settings' | 'Relay' | 'Users';
  setActiveTab: React.Dispatch<React.SetStateAction<'Settings' | 'Relay' | 'Users'>>;
}

const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const tabs: Array<'Settings' | 'Relay' | 'Users'> = ['Settings', 'Relay', 'Users'];

  return (
    <nav className="bg-gray-800 p-4">
      <div className="flex space-x-4 justify-center">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              activeTab === tab
                ? 'bg-gray-900 text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
