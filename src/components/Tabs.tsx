import React, { useState, ReactNode, createContext, useContext } from 'react';
import { Box, Tabs, Tab as MuiTab, Typography } from '@mui/material';

// Create context for tab group
interface TabGroupContextType {
  activeTab: number;
  setActiveTab: (index: number) => void;
}

const TabGroupContext = createContext<TabGroupContextType | undefined>(undefined);

interface TabProps {
  children: ReactNode;
  title: string;
}

export const Tab: React.FC<TabProps> = ({ children }) => {
  // This component doesn't render anything directly
  // It's used to structure content for TabGroup
  return <>{children}</>;
};

interface TabGroupProps {
  children: ReactNode | ReactNode[];
}

export const TabGroup: React.FC<TabGroupProps> = ({ children }) => {
  const [activeTab, setActiveTab] = useState(0);
  
  // Extract tab titles and content
  const tabs: { title: string; content: React.ReactNode }[] = [];
  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child) && child.type === Tab) {
      tabs.push({
        title: child.props.title,
        content: child.props.children,
      });
    }
  });
  
  return (
    <div className="mt-4 mb-5">
      <ul className="nav nav-tabs">
        {tabs.map((tab, index) => (
          <li className="nav-item" key={index}>
            <button
              className={`nav-link ${activeTab === index ? 'active' : ''}`}
              onClick={() => setActiveTab(index)}
            >
              {tab.title}
            </button>
          </li>
        ))}
      </ul>
      <div className="tab-content p-3 border border-top-0 rounded-bottom">
        {tabs.map((tab, index) => (
          <div
            key={index}
            className={`tab-pane ${activeTab === index ? 'show active' : ''}`}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
}; 