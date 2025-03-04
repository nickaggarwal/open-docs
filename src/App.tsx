import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import DocPage from './pages/DocPage';
import { siteConfig, navigationConfig } from './components';

/**
 * Main Application Component
 * 
 * Handles routing, theme management, and overall application structure
 */
function App() {
  // Theme state management
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light');
  
  // Function to toggle theme
  const toggleThemeMode = () => {
    setThemeMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', themeMode);
    document.body.className = themeMode === 'dark' ? 'bg-dark text-light' : 'bg-light text-dark';
  }, [themeMode]);

  // Apply colors from config
  useEffect(() => {
    document.documentElement.style.setProperty('--primary-color', siteConfig.colors.primary);
    document.documentElement.style.setProperty('--primary-light-color', siteConfig.colors.light);
    document.documentElement.style.setProperty('--primary-dark-color', siteConfig.colors.dark);
  }, []);

  // Find first doc and API page for default navigation
  const defaultDocPage = navigationConfig.sidebar.docs[0]?.items?.[0]?.id || 'introduction';
  const defaultApiPage = navigationConfig.sidebar.api[0]?.items?.[0]?.id || 'overview';
  
  // Helper function to find the default page for a specific tab/section
  const findDefaultPageForSection = (sectionName: string): string => {
    // First, look for the section in the navigation config
    const section = navigationConfig.sidebar.docs.find(
      item => item.label === sectionName
    );
    
    if (section && section.items && section.items.length > 0) {
      // If we found the section and it has items, return the first item's ID or path
      if (section.items[0].to) {
        // Extract the ID from the path (removing the /docs/ prefix)
        return section.items[0].to.replace(/^\/docs\//, '');
      }
    }
    
    // Fallback: Check the navigation from the raw config
    const rawSection = siteConfig.navigation.find(
      nav => nav.group === sectionName
    );
    
    if (rawSection && rawSection.pages && rawSection.pages.length > 0) {
      // Get the first page
      const firstPage = typeof rawSection.pages[0] === 'string' 
        ? rawSection.pages[0] 
        : rawSection.pages[0].pages ? rawSection.pages[0].pages[0] : '';
      
      // For nested structure, extract just the path
      return firstPage;
    }
    
    // If all else fails, return the section name in lowercase as a fallback
    return sectionName.toLowerCase();
  };

  console.log('Default doc page:', defaultDocPage);
  console.log('Default API page:', defaultApiPage);
  console.log('Navigation config:', navigationConfig);

  return (
    <Router>
      <MainLayout toggleTheme={toggleThemeMode} mode={themeMode}>
        <Routes>
          {/* Home page */}
          <Route path="/" element={<HomePage />} />
          
          {/* Documentation routes */}
          <Route 
            path="/docs" 
            element={<Navigate to={`/docs/${defaultDocPage}`} replace />} 
          />
          <Route 
            path="/docs/:id" 
            element={<DocPage />} 
          />
          <Route 
            path="/docs/:segment1/:segment2" 
            element={<DocPage />} 
          />
          <Route 
            path="/docs/:segment1/:segment2/:segment3" 
            element={<DocPage />} 
          />
          
          {/* API routes */}
          <Route 
            path="/api" 
            element={<Navigate to={`/api/${defaultApiPage}`} replace />} 
          />
          <Route 
            path="/api/:id" 
            element={<DocPage />} 
          />
          <Route 
            path="/api/:segment1/:segment2" 
            element={<DocPage />} 
          />
          <Route 
            path="/api/:segment1/:segment2/:segment3" 
            element={<DocPage />} 
          />
          
          {/* Dynamically generated tab routes */}
          {siteConfig.tabs.map(tab => (
            <Route 
              key={tab.url}
              path={`/${tab.url}`} 
              element={
                tab.url === 'api'
                  ? <Navigate to={`/api/${defaultApiPage}`} replace />
                  : <Navigate to={`/docs/${findDefaultPageForSection(tab.name)}`} replace />
              } 
            />
          ))}
          
          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App; 