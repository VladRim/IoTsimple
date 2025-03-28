// src/components/ui/Input.jsx
import React from 'react';
import './Input.css';

const Input = ({ type, value, onChange }) => {
  return <input type={type} value={value} onChange={onChange} />;
};

export default Input;
