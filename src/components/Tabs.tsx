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

  // Convert children to array for easier handling
  const childrenArray = React.Children.toArray(children);
  
  // Extract tab titles from children
  const tabTitles = childrenArray.map((child) => {
    if (React.isValidElement(child) && 'title' in child.props) {
      return child.props.title;
    }
    return 'Untitled';
  });

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <TabGroupContext.Provider value={{ activeTab, setActiveTab }}>
      <Box sx={{ width: '100%', mb: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={activeTab} 
            onChange={handleChange} 
            aria-label="code tabs"
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 500,
                fontSize: '0.9rem',
                minWidth: 100,
              },
            }}
          >
            {tabTitles.map((title, index) => (
              <MuiTab key={index} label={title} id={`tab-${index}`} aria-controls={`tabpanel-${index}`} />
            ))}
          </Tabs>
        </Box>
        {childrenArray.map((child, index) => (
          <Box
            key={index}
            role="tabpanel"
            hidden={activeTab !== index}
            id={`tabpanel-${index}`}
            aria-labelledby={`tab-${index}`}
            sx={{ pt: 2 }}
          >
            {activeTab === index && (
              <Typography component="div">
                {child}
              </Typography>
            )}
          </Box>
        ))}
      </Box>
    </TabGroupContext.Provider>
  );
}; 