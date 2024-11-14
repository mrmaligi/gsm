import React, { useState, useEffect, ChangeEvent } from 'react';
import Input from './Input';

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

export default Settings;
