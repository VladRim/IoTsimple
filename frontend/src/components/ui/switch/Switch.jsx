// src/components/ui/Switch.jsx
import React from 'react';
import './Switch.css';

const Switch = ({ checked, onCheckedChange }) => {
  return (
    <label className="switch">
      <input type="checkbox" checked={checked} onChange={onCheckedChange} />
      <span className="slider"></span>
    </label>
  );
};

export default Switch;
