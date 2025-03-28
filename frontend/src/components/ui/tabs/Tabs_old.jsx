// src/components/ui/Tabs.jsx
import React, { useState } from 'react';
import './Tabs.css';

const Tabs = ({ children }) => {
  const [selectedTab, setSelectedTab] = useState(0);

  return (
    <div className="tabs">
      {children(selectedTab, setSelectedTab)}
    </div>
  );
};

export default Tabs;
