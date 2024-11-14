import React, { useState, useEffect, ChangeEvent } from 'react';
import './App.css'; // Ensure Tailwind directives are included here

// Reusable Input Component
interface InputProps {
  type: string;
  value: string | number;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  ariaLabel?: string;
}

const Input: React.FC<InputProps> = ({ type, value, onChange, placeholder, ariaLabel }) => (
  <input
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    aria-label={ariaLabel || placeholder}
    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
);

// Main App Component
const App: React.FC = () => {
  // Navigation State
  const [activeTab, setActiveTab] = useState<'Settings' | 'Relay' | 'Users'>('Settings');

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="max-w-4xl mx-auto p-6">
        {activeTab === 'Settings' && <Settings />}
        {activeTab === 'Relay' && <Relay />}
        {activeTab === 'Users' && <Users />}
      </main>
    </div>
  );
};

// Navbar Component
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

// Settings Component
const Settings: React.FC = () => {
  const [adminNumber, setAdminNumber] = useState<string>('');
  const [gsmNumber, setGsmNumber] = useState<string>('');
  const [password, setPassword] = useState<string>('1234');
  const [newPassword, setNewPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Load data from localStorage on mount
  useEffect(() => {
    const storedAdminNumber = localStorage.getItem('adminNumber') || '';
    const storedGsmNumber = localStorage.getItem('gsmNumber') || '';
    const storedPassword = localStorage.getItem('password') || '1234';
    setAdminNumber(storedAdminNumber);
    setGsmNumber(storedGsmNumber);
    setPassword(storedPassword);
  }, []);

  // Validate phone number (E.164 format)
  const isValidPhoneNumber = (number: string): boolean => {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/; // E.164 format
    return phoneRegex.test(number);
  };

  // Send Admin Setup Command
  const sendAdminSetup = () => {
    if (adminNumber && gsmNumber) {
      if (!isValidPhoneNumber(adminNumber) || !isValidPhoneNumber(gsmNumber)) {
        alert('Please enter valid phone numbers in E.164 format.');
        return;
      }
      setIsLoading(true);
      localStorage.setItem('adminNumber', adminNumber);
      localStorage.setItem('gsmNumber', gsmNumber);
      const command = `${password}TEL00${adminNumber}#`;
      sendSMS(gsmNumber, command);
      setIsLoading(false);
      alert('Admin setup command sent successfully.');
    } else {
      alert('Please enter both Admin and GSM module phone numbers.');
    }
  };

  // Change Password
  const changePassword = () => {
    if (/^\d{4}$/.test(newPassword)) {
      if (window.confirm('Are you sure you want to change the password?')) {
        const command = `${password}P${newPassword}`;
        sendSMS(gsmNumber, command);
        setPassword(newPassword);
        localStorage.setItem('password', newPassword);
        alert('Password change command sent. New password will be used for future commands.');
      }
    } else {
      alert('Please enter a valid 4-digit password.');
    }
  };

  // Send SMS Command
  const sendSMS = (number: string, message: string) => {
    if (number) {
      const smsWindow = window.open(`sms:${number}?body=${encodeURIComponent(message)}`, '_blank');
      if (!smsWindow) {
        alert('Failed to open SMS application. Please check your device settings.');
      }
    } else {
      alert('GSM module phone number is not set. Please set it in the Admin Setup.');
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Settings</h2>

      {/* Admin Setup */}
      <div className="space-y-4 border p-4 rounded-lg bg-white shadow">
        <h3 className="text-xl font-semibold">Admin Setup</h3>
        <Input
          type="tel"
          value={adminNumber}
          onChange={(e) => setAdminNumber(e.target.value)}
          placeholder="Admin Phone Number"
        />
        <Input
          type="tel"
          value={gsmNumber}
          onChange={(e) => setGsmNumber(e.target.value)}
          placeholder="GSM Module Phone Number"
        />
        <button
          onClick={sendAdminSetup}
          disabled={isLoading}
          className={`w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? 'Sending...' : 'Send Admin Setup'}
        </button>
      </div>

      {/* Change Password */}
      <div className="space-y-4 border p-4 rounded-lg bg-white shadow">
        <h3 className="text-xl font-semibold">Change Password</h3>
        <Input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="New Password (4 digits)"
        />
        <button onClick={changePassword} className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Change Password
        </button>
      </div>
    </div>
  );
};

// Relay Component
const Relay: React.FC = () => {
  const [gsmNumber, setGsmNumber] = useState<string>('');
  const [password, setPassword] = useState<string>('1234');
  const [latchTime, setLatchTime] = useState<number>(5);

  // Load data from localStorage on mount
  useEffect(() => {
    const storedGsmNumber = localStorage.getItem('gsmNumber') || '';
    const storedPassword = localStorage.getItem('password') || '1234';
    setGsmNumber(storedGsmNumber);
    setPassword(storedPassword);
  }, []);

  // Send Relay Command (ON/OFF)
  const sendCommand = (action: 'ON' | 'OFF') => {
    const command = action === 'ON' ? `${password}CC` : `${password}DD`;
    sendSMS(gsmNumber, command);
  };

  // Set Latch Time Command
  const setLatchTimeCommand = () => {
    if (latchTime && !isNaN(latchTime)) {
      const formattedTime = latchTime.toString().padStart(3, '0');
      const command = `${password}GOT${formattedTime}#`;
      sendSMS(gsmNumber, command);
    } else {
      alert('Please enter a valid latch time in seconds.');
    }
  };

  // Send SMS Command
  const sendSMS = (number: string, message: string) => {
    if (number) {
      const smsWindow = window.open(`sms:${number}?body=${encodeURIComponent(message)}`, '_blank');
      if (!smsWindow) {
        alert('Failed to open SMS application. Please check your device settings.');
      }
    } else {
      alert('GSM module phone number is not set. Please set it in the Settings.');
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Relay Control</h2>

      {/* Relay Actions */}
      <div className="space-y-4 border p-4 rounded-lg bg-white shadow">
        <h3 className="text-xl font-semibold">Control Relay</h3>
        <button
          onClick={() => sendCommand('ON')}
          className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Turn ON
        </button>
        <button
          onClick={() => sendCommand('OFF')}
          className="w-full p-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Turn OFF
        </button>
      </div>

      {/* Set Latch Time */}
      <div className="space-y-4 border p-4 rounded-lg bg-white shadow">
        <h3 className="text-xl font-semibold">Set Latch Time</h3>
        <Input
          type="number"
          value={latchTime}
          onChange={(e) => setLatchTime(Number(e.target.value))}
          placeholder="Latch Time (seconds)"
        />
        <button onClick={setLatchTimeCommand} className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Set Latch Time
        </button>
      </div>
    </div>
  );
};

// Users Component
const Users: React.FC = () => {
  const [gsmNumber, setGsmNumber] = useState<string>('');
  const [password, setPassword] = useState<string>('1234');
  const [authorizedNumber, setAuthorizedNumber] = useState<string>('');
  const [authorizedIndex, setAuthorizedIndex] = useState<string>('');

  // Load data from localStorage on mount
  useEffect(() => {
    const storedGsmNumber = localStorage.getItem('gsmNumber') || '';
    const storedPassword = localStorage.getItem('password') || '1234';
    setGsmNumber(storedGsmNumber);
    setPassword(storedPassword);
  }, []);

  // Validate phone number (E.164 format)
  const isValidPhoneNumber = (number: string): boolean => {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/; // E.164 format
    return phoneRegex.test(number);
  };

  // Add Authorized Number
  const addAuthorizedNumber = () => {
    if (authorizedNumber && authorizedIndex && !isNaN(Number(authorizedIndex))) {
      const index = Number(authorizedIndex).toString().padStart(3, '0');
      if (Number(index) >= 0 && Number(index) <= 200) {
        if (!isValidPhoneNumber(authorizedNumber)) {
          alert('Please enter a valid phone number in E.164 format.');
          return;
        }
        const command = `${password}A${index}#${authorizedNumber}#`;
        sendSMS(gsmNumber, command);
      } else {
        alert('Please enter an index between 000 and 200.');
      }
    } else {
      alert('Please enter a valid phone number and index.');
    }
  };

  // Send SMS Command
  const sendSMS = (number: string, message: string) => {
    if (number) {
      const smsWindow = window.open(`sms:${number}?body=${encodeURIComponent(message)}`, '_blank');
      if (!smsWindow) {
        alert('Failed to open SMS application. Please check your device settings.');
      }
    } else {
      alert('GSM module phone number is not set. Please set it in the Settings.');
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Users Management</h2>

      {/* Add Authorized Number */}
      <div className="space-y-4 border p-4 rounded-lg bg-white shadow">
        <h3 className="text-xl font-semibold">Add Authorized Number</h3>
        <Input
          type="tel"
          value={authorizedNumber}
          onChange={(e) => setAuthorizedNumber(e.target.value)}
          placeholder="Authorized Phone Number"
        />
        <Input
          type="number"
          value={authorizedIndex}
          onChange={(e) => setAuthorizedIndex(e.target.value)}
          placeholder="Index (000-200)"
        />
        <button onClick={addAuthorizedNumber} className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Add Authorized Number
        </button>
      </div>
    </div>
  );
};

export default App;
