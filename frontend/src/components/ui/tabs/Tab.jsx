// src/components/ui/Tab.jsx
import React from 'react';
import './Tab.css';

const Tab = ({ children, onClick, isActive }) => {
  return (
    <div
      className={`tab ${isActive ? 'active' : ''}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Tab;
