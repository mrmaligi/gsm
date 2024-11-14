import React, { ChangeEvent } from 'react';

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

export default Input;
