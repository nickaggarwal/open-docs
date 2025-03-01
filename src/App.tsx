import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import DocPage from './pages/DocPage';
import { siteConfig, navigationConfig } from './config';

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
          
          {/* Additional tab routes */}
          <Route path="/guides" element={<Navigate to="/docs/guides/creating-pages" replace />} />
          <Route path="/changelog" element={<Navigate to="/docs/changelog/overview" replace />} />
          <Route path="/references" element={<Navigate to="/docs/resources/faq" replace />} />
          
          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App; 