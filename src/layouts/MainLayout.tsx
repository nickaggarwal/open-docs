import React, { useState, useEffect, ReactNode } from 'react';
import { useLocation, Link as RouterLink } from 'react-router-dom';
import { Container, Navbar, Nav, Button, Offcanvas, Form } from 'react-bootstrap';
import NavigationSidebar from '../components/Sidebar';
import { navigationConfig, siteConfig } from '../config';

// Define the drawer width
const DRAWER_WIDTH = 280;

export interface MainLayoutProps {
  children: ReactNode;
  toggleTheme?: () => void;
  mode?: 'light' | 'dark';
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, toggleTheme, mode = 'light' }) => {
  // State for drawer open/closed
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // TODO: Implement search functionality in future
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    console.log('Navigation config:', navigationConfig);
    
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
    
    console.log('Navigation items:', JSON.stringify(navigationItems, null, 2));
    return navigationItems;
  };

  // TODO: Implement search functionality in future
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Search query:', searchQuery);
    // Implement search functionality
  };

  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      {/* Top Navigation Bar */}
      <Navbar 
        fixed="top" 
        bg={mode === 'dark' ? 'dark' : 'light'} 
        variant={mode === 'dark' ? 'dark' : 'light'} 
        className="border-bottom"
        style={{ backgroundColor: 'var(--paper-color)', color: 'var(--text-color)' }}
      >
        <Container fluid>
          <Navbar.Toggle 
            aria-controls="sidebar-nav" 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="d-md-none"
          />
          
          <Navbar.Brand as={RouterLink} to="/" className="d-flex align-items-center">
            {siteConfig.logo && (
              <img
                src={siteConfig.logo}
                alt={`${siteConfig.name} logo`}
                height="32"
                className="me-2"
              />
            )}
            <span className="fw-semibold">{siteConfig.name}</span>
          </Navbar.Brand>
          
          {/* Main Navigation */}
          <Nav className="me-auto d-none d-md-flex">
            {navigationConfig.topBar.items
              .filter(item => item.position === 'left')
              .map((item, index) => {
                // If there's a "to" property (internal link), use RouterLink
                if (item.to) {
                  return (
                    <Nav.Link 
                      key={index}
                      as={RouterLink}
                      to={item.to}
                      className={`mx-1 ${currentPath.startsWith(item.to) ? 'text-primary' : 'text-secondary'}`}
                    >
                      {item.label}
                    </Nav.Link>
                  );
                }
                // Otherwise, use a regular href link
                return (
                  <Nav.Link 
                    key={index}
                    href={item.href}
                    className={`mx-1 ${item.href && currentPath.startsWith(item.href) ? 'text-primary' : 'text-secondary'}`}
                  >
                    {item.label}
                  </Nav.Link>
                );
              })}
          </Nav>
          
          {/* Right Side Items */}
          <div className="d-flex align-items-center">
            {/* Search */}
            <Button 
              variant="outline-secondary" 
              className="me-2"
              onClick={() => console.log('Search clicked')}
            >
              <i className="bi bi-search"></i>
            </Button>
            
            {/* Theme Toggle */}
            {toggleTheme && (
              <Button 
                variant="outline-secondary" 
                className="me-2"
                onClick={toggleTheme}
              >
                {mode === 'dark' ? <i className="bi bi-sun"></i> : <i className="bi bi-moon"></i>}
              </Button>
            )}
            
            {/* GitHub Link */}
            <a 
              href={siteConfig.footerSocials?.github || 'https://github.com'} 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn btn-outline-secondary me-2"
            >
              <i className="bi bi-github"></i>
            </a>
            
            {/* CTA Button */}
            {siteConfig.topbarCtaButton && (
              <Button 
                variant="primary"
                href={siteConfig.topbarCtaButton.url}
                className="fw-semibold"
                style={{
                  backgroundColor: 'var(--primary-color)',
                }}
              >
                {siteConfig.topbarCtaButton.name}
              </Button>
            )}
          </div>
        </Container>
      </Navbar>

      {/* Sidebar */}
      <div 
        className="d-none d-md-block" 
        style={{ 
          width: DRAWER_WIDTH,
          backgroundColor: 'var(--paper-color)',
          borderRight: '1px solid var(--border-color)',
          position: 'fixed',
          top: '56px',
          bottom: 0,
          overflowY: 'auto',
          padding: '1rem 0.5rem 1rem 1.5rem'
        }}
      >
        <NavigationSidebar items={getNavigationItems()} currentPath={currentPath} />
      </div>

      {/* Mobile Sidebar */}
      <Offcanvas 
        show={sidebarOpen} 
        onHide={() => setSidebarOpen(false)} 
        placement="start"
        className="d-md-none"
        style={{ 
          width: DRAWER_WIDTH,
          backgroundColor: 'var(--paper-color)',
          color: 'var(--text-color)'
        }}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Navigation</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <NavigationSidebar items={getNavigationItems()} currentPath={currentPath} />
        </Offcanvas.Body>
      </Offcanvas>

      {/* Main Content */}
      <main 
        className="flex-grow-1 px-3 pt-5 mt-3" 
        style={{ 
          marginLeft: window.innerWidth >= 768 ? DRAWER_WIDTH : 0,
          backgroundColor: 'var(--background-color)',
          minHeight: '100vh',
          paddingTop: '56px'
        }}
      >
        <Container 
          className="py-4"
          style={{ 
            maxWidth: '100%',
            paddingLeft: window.innerWidth >= 768 ? '2rem' : '1rem',
            paddingRight: window.innerWidth >= 768 ? '4rem' : '1rem'
          }}
        >
          {children}
        </Container>
      </main>
    </div>
  );
};

export default MainLayout; 