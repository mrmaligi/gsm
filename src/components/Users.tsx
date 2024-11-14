import React, { useState, useEffect } from 'react';
import Input from './Input';

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

export default Users;
