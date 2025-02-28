import React, { useState, useEffect, ReactNode } from 'react';
import { useLocation, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  useMediaQuery,
  useTheme,
  Container,
  Button,
  Paper,
  alpha,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import GitHubIcon from '@mui/icons-material/GitHub';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { navigationConfig, siteConfig } from '../config';
import NavigationSidebar from '../components/Sidebar';

// Define the drawer width
const DRAWER_WIDTH = 280;

export interface MainLayoutProps {
  children: ReactNode;
  toggleTheme?: () => void;
  mode?: 'light' | 'dark';
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, toggleTheme, mode = 'light' }) => {
  // Get the theme and media query
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // State for drawer open/closed
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  // State for search query
  const [searchQuery, setSearchQuery] = useState('');

  const location = useLocation();

  // Get current path
  const currentPath = location.pathname;

  // Track path changes for debugging
  useEffect(() => {
    console.log('MainLayout detected path change:', currentPath);
  }, [currentPath]);

  // Update theme colors based on site config
  useEffect(() => {
    document.documentElement.style.setProperty('--primary-color', siteConfig.colors.primary);
    document.documentElement.style.setProperty('--primary-light-color', siteConfig.colors.light);
    document.documentElement.style.setProperty('--primary-dark-color', siteConfig.colors.dark);
  }, []);

  // Get navigation items based on current path
  const getNavigationItems = () => {
    console.log('Getting navigation items for path:', currentPath);
    let navigationItems;
    
    // Determine which navigation items to show based on the current path
    if (currentPath.startsWith('/api')) {
      console.log('Using API navigation items');
      navigationItems = navigationConfig.sidebar.api;
    } else {
      // Default to docs for all other paths
      console.log('Using docs navigation items');
      navigationItems = navigationConfig.sidebar.docs;
    }
    
    console.log('Navigation items:', navigationItems);
    return navigationItems;
  };

  // Handle search form submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Search query:', searchQuery);
    // Implement search functionality
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: 'var(--paper-color)',
          color: 'var(--text-color)',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
        }}
      >
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={() => setDrawerOpen(!drawerOpen)}
              sx={{ mr: 2 }}
            >
              {drawerOpen ? <CloseIcon /> : <MenuIcon />}
            </IconButton>
          )}

          {/* Logo and Title */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {siteConfig.logo && (
              <img
                src={siteConfig.logo}
                alt={`${siteConfig.name} logo`}
                style={{ height: '32px', marginRight: '12px' }}
              />
            )}
            <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 600 }}>
              {siteConfig.name}
            </Typography>
          </Box>

          {/* Navigation Items */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, ml: 4 }}>
            {navigationConfig.topBar.items
              .filter(item => item.position === 'left')
              .map((item, index) => (
                <Button
                  key={index}
                  color="inherit"
                  component={item.to ? RouterLink : 'a'}
                  to={item.to}
                  href={item.href}
                  sx={{
                    mx: 1,
                    fontWeight: 500,
                    color: (item.to && currentPath.startsWith(item.to)) || (item.href && currentPath.startsWith(item.href))
                      ? 'var(--primary-color)'
                      : 'var(--text-secondary-color)',
                    '&:hover': {
                      backgroundColor: 'transparent',
                      color: 'var(--primary-color)',
                    },
                  }}
                >
                  {item.label}
                </Button>
              ))}
          </Box>

          {/* Right-side Items */}
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {/* Search Button */}
            <IconButton color="inherit" aria-label="search" onClick={() => console.log('Search clicked')}>
              <SearchIcon />
            </IconButton>

            {/* Theme Toggle */}
            {toggleTheme && (
              <IconButton color="inherit" onClick={toggleTheme} sx={{ ml: 1 }}>
                {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
            )}

            {/* GitHub Link */}
            <IconButton
              color="inherit"
              aria-label="github"
              href={siteConfig.footerSocials?.github || 'https://github.com'}
              target="_blank"
              rel="noopener noreferrer"
              sx={{ ml: 1 }}
            >
              <GitHubIcon />
            </IconButton>

            {/* CTA Button */}
            {siteConfig.topbarCtaButton && (
              <Button
                variant="contained"
                color="primary"
                href={siteConfig.topbarCtaButton.url}
                sx={{
                  ml: 2,
                  fontWeight: 600,
                  backgroundColor: 'var(--primary-color)',
                  '&:hover': {
                    backgroundColor: 'var(--primary-dark-color)',
                  },
                }}
              >
                {siteConfig.topbarCtaButton.name}
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Navigation Drawer */}
      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={isMobile ? drawerOpen : true}
        onClose={() => setDrawerOpen(false)}
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            backgroundColor: 'var(--paper-color)',
            color: 'var(--text-color)',
            borderRight: '1px solid var(--border-color)',
            boxShadow: 'none',
            height: '100vh',
            position: 'fixed',
            overflowY: 'auto',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ 
          overflow: 'auto', 
          p: 0,
          pl: 1.5,
          pr: 0.5,
          height: 'calc(100vh - 64px)',
          '&::-webkit-scrollbar': {
            width: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            borderRadius: '2px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'transparent',
          },
        }}>
          <NavigationSidebar items={getNavigationItems()} currentPath={currentPath} />
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, md: 3 },
          pl: { md: 0 },
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { md: `${DRAWER_WIDTH}px` },
          backgroundColor: 'var(--background-color)',
          minHeight: '100vh',
        }}
      >
        <Toolbar />
        <Container 
          maxWidth="lg" 
          sx={{ 
            mt: 2,
            pl: { xs: 2, md: 2 },
            pr: { xs: 2, md: 4 },
            maxWidth: '100%' 
          }}
        >
          {children}
        </Container>
      </Box>
    </Box>
  );
};

export default MainLayout; 