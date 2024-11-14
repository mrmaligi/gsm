import React, { useState, useEffect } from 'react';
import Input from './Input';

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

export default Relay;
