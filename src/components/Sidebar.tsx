import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Form, ListGroup, Accordion, InputGroup, Collapse } from 'react-bootstrap';
import { siteConfig } from '.';

interface NavigationItem {
  type: 'category' | 'doc' | 'link' | 'section';
  label: string;
  items?: NavigationItem[];
  id?: string;
  href?: string;
  to?: string;
}

interface NavigationSidebarProps {
  items: NavigationItem[];
  currentPath: string;
  hideSearch?: boolean;
}

const NavigationSidebar: React.FC<NavigationSidebarProps> = ({ items, currentPath, hideSearch = false }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  // Initialize categories
  useEffect(() => {
    const initialExpanded: Record<string, boolean> = {};
    
    const processItems = (navItems: NavigationItem[], isTopLevel: boolean) => {
      navItems.forEach(item => {
        if (item.type === 'category') {
          // Categories are collapsed by default unless they contain active items
          const hasActiveChild = item.items?.some(child => 
            (child.to && currentPath.startsWith(child.to)) || 
            (child.type === 'category' && child.items?.some(grandchild => 
              grandchild.to && currentPath.startsWith(grandchild.to)
            ))
          ) || false;
          
          initialExpanded[item.label] = hasActiveChild;
          
          // Process children recursively
          if (item.items) {
            processItems(item.items, false);
          }
        } else if (item.type === 'section') {
          // Section headers always have their items visible
          // But we still need to process nested categories
          if (item.items) {
            processItems(item.items, false);
          }
        }
      });
    };
    
    processItems(items, true);
    setExpandedCategories(initialExpanded);
  }, [items, currentPath]);

  const toggleCategory = (label: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedCategories(prev => ({ 
      ...prev, 
      [label]: !prev[label] 
    }));
  };

  const isCategoryExpanded = (item: NavigationItem): boolean => {
    return expandedCategories[item.label] === true;
  };

  const isItemActive = (item: NavigationItem): boolean => {
    if (item.to && currentPath.startsWith(item.to)) {
      return true;
    }
    
    if (item.href && currentPath.startsWith(item.href)) {
      return true;
    }
    
    if ((item.type === 'category' || item.type === 'section') && item.items) {
      return item.items.some(child => isItemActive(child));
    }
    
    return false;
  };

  const getItemIcon = (item: NavigationItem) => {
    if (item.type === 'section') {
      return null;
    }
    
    if (item.type === 'category') {
      // Don't render an icon for categories - we'll use only the right-aligned chevron
      return null;
    }
    
    // Use icons similar to Mintlify for different content types
    switch (item.label.toLowerCase()) {
      case 'quickstart':
        return <i className="bi bi-rocket"></i>;
      case 'playground':
        return <i className="bi bi-play"></i>;
      case 'editing':
        return <i className="bi bi-pencil"></i>;
      case 'navigation':
        return <i className="bi bi-signpost"></i>;
      case 'themes':
        return <i className="bi bi-palette"></i>;
      case 'migration':
        return <i className="bi bi-box-arrow-up-right"></i>;
      case 'global settings':
        return <i className="bi bi-gear"></i>;
      case 'headers and text':
        return <i className="bi bi-type"></i>;
      case 'code blocks':
        return <i className="bi bi-code"></i>;
      case 'images':
      case 'images, videos, and embeds':
        return <i className="bi bi-image"></i>;
      case 'lists and tables':
        return <i className="bi bi-list-ul"></i>;
      case 'reusable snippets':
        return <i className="bi bi-clipboard"></i>;
      case 'page titles and metadata':
        return <i className="bi bi-file-earmark-text"></i>;
      default:
        return item.type === 'doc' ? <i className="bi bi-file-text"></i> : <i className="bi bi-folder"></i>;
    }
  };

  const renderItems = (items: NavigationItem[], level = 0) => {
    return items.map((item, index) => {
      // Section headers (like "Getting Started")
      if (item.type === 'section') {
        return (
          <div key={`${item.label}-${index}`} className="mt-4 mb-2">
            <div className="text-uppercase text-secondary small fw-semibold ps-3">
              {item.label}
            </div>
            {item.items && (
              <div className="mt-2">
                {renderItems(item.items, 0)}
              </div>
            )}
          </div>
        );
      }
      
      // Categories with children (expandable/collapsible)
      if (item.type === 'category') {
        const isActive = isItemActive(item);
        const isExpanded = isCategoryExpanded(item);
        
        return (
          <div key={`${item.label}-${index}`} className="nav-item mb-1">
            <div 
              className={`d-flex align-items-center position-relative ${isActive ? 'active-nav-item' : ''}`}
              style={{ cursor: 'pointer' }}
            >
              {isActive && (
                <div 
                  className="position-absolute" 
                  style={{ 
                    width: '2px', 
                    backgroundColor: 'var(--primary-color)',
                    top: '0',
                    bottom: '0',
                    left: '0'
                  }}
                ></div>
              )}
              
              <div 
                className={`d-flex align-items-center w-100 py-2 ps-3 ${isActive ? 'text-dark fw-medium' : 'text-secondary'}`}
                onClick={(e) => toggleCategory(item.label, e)}
              >
                <span className="me-2 text-secondary" style={{ width: '20px', textAlign: 'center' }}>
                  {getItemIcon(item)}
                </span>
                <span>{item.label}</span>
                
                {item.items && item.items.length > 0 && (
                  <span className="ms-auto me-3">
                    <i className={`bi bi-chevron-${isExpanded ? 'down' : 'right'} fs-8`}></i>
                  </span>
                )}
              </div>
            </div>
            
            {item.items && (
              <Collapse in={isExpanded}>
                <div className="ms-3">
                  {renderItems(item.items, level + 1)}
                </div>
              </Collapse>
            )}
          </div>
        );
      }
      
      // Regular nav items with 'to' property (internal links)
      if ((item.type === 'doc' || item.type === 'link') && item.to) {
        const isActive = isItemActive(item);
        
        return (
          <div 
            key={`${item.label}-${index}`} 
            className={`nav-item mb-1 position-relative ${isActive ? 'active-nav-item' : ''}`}
          >
            {isActive && (
              <div 
                className="position-absolute" 
                style={{ 
                  width: '2px', 
                  backgroundColor: 'var(--primary-color)',
                  top: '0',
                  bottom: '0',
                  left: '0'
                }}
              ></div>
            )}
            
            <RouterLink 
              to={item.to} 
              className={`text-decoration-none d-flex align-items-center py-2 ps-3 ${isActive ? 'text-dark fw-medium' : 'text-secondary'}`}
            >
              <span className="me-2 text-secondary" style={{ width: '20px', textAlign: 'center' }}>
                {getItemIcon(item)}
              </span>
              {item.label}
            </RouterLink>
          </div>
        );
      }
      
      // External links
      if (item.href) {
        return (
          <div 
            key={`${item.label}-${index}`} 
            className="nav-item mb-1"
          >
            <a 
              href={item.href}
              className="text-decoration-none d-flex align-items-center py-2 ps-3 text-secondary"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="me-2" style={{ width: '20px', textAlign: 'center' }}>
                {getItemIcon(item)}
              </span>
              {item.label}
            </a>
          </div>
        );
      }
      
      return null;
    });
  };

  const filteredItems = searchQuery.trim() === '' ? items : filterItems(items, searchQuery.toLowerCase());

  function filterItems(items: NavigationItem[], query: string): NavigationItem[] {
    return items.reduce<NavigationItem[]>((filtered, item) => {
      if (item.label.toLowerCase().includes(query)) {
        filtered.push(item);
      } else if ((item.type === 'category' || item.type === 'section') && item.items) {
        const matchedChildren = filterItems(item.items, query);
        if (matchedChildren.length > 0) {
          filtered.push({
            ...item,
            items: matchedChildren,
          });
        }
      }
      return filtered;
    }, []);
  }

  return (
    <div className="sidebar-nav">
      {!hideSearch && (
        <div className="mb-3">
          <InputGroup className="search-box">
            <InputGroup.Text className="bg-light border-light">
              <i className="bi bi-search"></i>
            </InputGroup.Text>
            <Form.Control
              type="search"
              placeholder="Search or ask..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-light bg-light"
            />
            <InputGroup.Text className="bg-light border-light text-secondary">
              ⌘K
            </InputGroup.Text>
          </InputGroup>
        </div>
      )}
      
      <div className="sidebar-content">
        {renderItems(filteredItems)}
      </div>
      
      <div className="mt-4 pt-3 border-top">
        <div className="text-secondary small mb-1">
          Powered by
        </div>
        <div className="small">
          <a 
            href={siteConfig.footerSocials?.github || "https://github.com/inferless/open-docs"} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-decoration-none text-primary"
          >
            {siteConfig.name || "Open Docs"}
          </a>
        </div>
      </div>
    </div>
  );
};

export default NavigationSidebar; 