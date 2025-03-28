// src/components/ui/TabPanel.jsx
import React from 'react';
import './TabPanel.css';

const TabPanel = ({ children, isActive }) => {
  return isActive ? <div className="tab-panel">{children}</div> : null;
};

export default TabPanel;
