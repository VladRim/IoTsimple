import React, { useState, Children } from 'react';
import './Tabs.css';

const Tabs = ({ children }) => {
  const [selectedTab, setSelectedTab] = useState(0);

  return (
    <div className="tabs">
      {/* Рендеринг заголовков табов */}
      <ul className="tab-titles">
        {Children.map(children, (child, index) => (
          <li key={index}>
            <button onClick={() => setSelectedTab(index)}>
              {child.props.title}
            </button>
          </li>
        ))}
      </ul>
      
      {/* Рендеринг содержимого выбранного таба */}
      {Children.toArray(children)[selectedTab]}
    </div>
  );
};

export default Tabs;