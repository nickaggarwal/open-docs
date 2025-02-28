import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  ListItemIcon,
  Collapse,
  Typography,
  TextField,
  InputAdornment,
  Divider,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import SearchIcon from '@mui/icons-material/Search';
import ArticleIcon from '@mui/icons-material/Article';
import FolderIcon from '@mui/icons-material/Folder';
import { siteConfig } from '../config';

interface NavigationItem {
  type: 'category' | 'doc' | 'link';
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

  // Initialize first-level categories as expanded on mount
  useEffect(() => {
    const initialExpanded: Record<string, boolean> = {};
    items.forEach(item => {
      if (item.type === 'category') {
        initialExpanded[item.label] = true; // First level categories are expanded by default
      }
    });
    setExpandedCategories(initialExpanded);
  }, [items]);

  // Toggle category expansion
  const toggleCategory = (label: string, level: number) => {
    // Only toggle if not first level
    if (level > 0) {
      setExpandedCategories((prev) => ({
        ...prev,
        [label]: !prev[label],
      }));
    }
  };

  // Check if a category should be expanded
  const isCategoryExpanded = (item: NavigationItem, level: number): boolean => {
    // First level categories are always expanded
    if (level === 0) {
      return expandedCategories[item.label] !== false; // Default to true unless explicitly set to false
    }
    
    // If explicitly set in state, use that value
    if (expandedCategories[item.label] !== undefined) {
      return expandedCategories[item.label];
    }

    // Otherwise, expand if any child is active
    if (item.items) {
      return item.items.some((child) => {
        if (child.type === 'doc' && child.to) {
          return currentPath === child.to || currentPath.startsWith(child.to);
        }
        if (child.type === 'category') {
          return isCategoryExpanded(child, level + 1);
        }
        return false;
      });
    }

    return false;
  };

  // Check if an item is active
  const isItemActive = (item: NavigationItem): boolean => {
    console.log('Checking if item is active:', item, 'Current path:', currentPath);
    if (item.to) {
      // For doc items, check if the current path matches the item's path
      // or if it's a sub-path (for nested routes)
      const itemPath = item.to;
      const isExactMatch = currentPath === itemPath;
      
      // For nested paths, check if the current path starts with the item's path
      // but only if the item path is not just a root path like "/docs" or "/api"
      const isSubPath = itemPath.split('/').length > 2 && 
                        currentPath.startsWith(itemPath);
      
      const isActive = isExactMatch || isSubPath;
      console.log(`Item ${item.label} with path ${itemPath} active: ${isActive} (exact: ${isExactMatch}, sub: ${isSubPath})`);
      return isActive;
    }
    if (item.href) {
      const isActive = currentPath === item.href;
      console.log(`Item ${item.label} with href ${item.href} active: ${isActive}`);
      return isActive;
    }
    return false;
  };

  // Get icon for item
  const getItemIcon = (item: NavigationItem, level: number) => {
    // Don't show icons for top-level categories
    if (level === 0 && item.type === 'category') {
      return null;
    }
    
    if (item.type === 'category') {
      return <FolderIcon fontSize="small" />;
    }
    return <ArticleIcon fontSize="small" />;
  };

  // Render sidebar items recursively
  const renderItems = (items: NavigationItem[], level = 0) => {
    return items.map((item, index) => {
      const isActive = isItemActive(item);
      const isExpanded = item.type === 'category' && isCategoryExpanded(item, level);

      if (item.type === 'category') {
        return (
          <React.Fragment key={`${item.label}-${index}`}>
            <ListItem 
              disablePadding
              sx={level === 0 ? {
                borderLeft: isActive ? '3px solid var(--primary-color)' : '3px solid transparent',
                mb: 1.5,
                mt: index > 0 ? 2 : 0,
              } : {}}
            >
              <ListItemButton
                onClick={() => toggleCategory(item.label, level)}
                sx={{
                  py: level === 0 ? 0.5 : 1.2,
                  pl: level === 0 ? 2 : 4,
                  '&:hover': {
                    backgroundColor: 'transparent',
                    '& .MuiTypography-root': {
                      color: 'var(--primary-color)',
                    }
                  },
                }}
              >
                {level > 0 && (
                  <ListItemIcon sx={{ 
                    minWidth: 28, 
                    color: isActive 
                      ? 'var(--primary-color)' 
                      : 'var(--text-secondary-color)' 
                  }}>
                    {getItemIcon(item, level)}
                  </ListItemIcon>
                )}
                <ListItemText
                  primary={
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: level === 0 ? 700 : 500,
                        color: isActive 
                          ? 'var(--primary-color)' 
                          : level === 0 ? 'var(--text-color)' : 'var(--text-secondary-color)',
                        fontSize: level === 0 ? '0.875rem' : '0.875rem',
                        textTransform: level === 0 ? 'none' : 'none',
                        letterSpacing: 'normal',
                      }}
                    >
                      {item.label}
                    </Typography>
                  }
                />
                {level > 0 && (isExpanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />)}
              </ListItemButton>
            </ListItem>
            {item.items && (
              <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                <List component="div" disablePadding sx={{ ml: level === 0 ? 1 : 1 }}>
                  {renderItems(item.items, level + 1)}
                </List>
              </Collapse>
            )}
          </React.Fragment>
        );
      }

      return (
        <ListItem disablePadding key={`${item.label}-${index}`}>
          <ListItemButton
            component={item.to ? RouterLink : 'a'}
            to={item.to}
            href={item.href}
            target={item.href ? '_blank' : undefined}
            rel={item.href ? 'noopener noreferrer' : undefined}
            onClick={(e) => {
              console.log('Clicked on item:', item);
              if (item.to) {
                console.log('Navigating to:', item.to);
                // Don't need to call e.preventDefault for RouterLink as it handles navigation properly
                
                try {
                  // For debugging - log URL info
                  const currentUrl = window.location.href;
                  console.log('Current URL before navigation:', currentUrl);
                  
                  // Additional check to ensure the URL format is correct
                  if (item.to.includes('/docs/') || item.to.includes('/api/')) {
                    console.log('Valid doc/api path detected');
                  }
                } catch (error) {
                  console.error('Error accessing window object:', error);
                }
              }
            }}
            sx={{
              pl: level > 0 ? 4 : 2,
              py: 0.8,
              backgroundColor: 'transparent',
              '&:hover': {
                backgroundColor: 'transparent',
                '& .MuiTypography-root': {
                  color: 'var(--primary-color)',
                }
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 28, color: isActive ? 'var(--primary-color)' : 'var(--text-secondary-color)' }}>
              {getItemIcon(item, level)}
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? 'var(--primary-color)' : 'var(--text-secondary-color)',
                    fontSize: '0.875rem',
                  }}
                >
                  {item.label}
                </Typography>
              }
            />
          </ListItemButton>
        </ListItem>
      );
    });
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* Search box */}
      {!hideSearch && (
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search docs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
                backgroundColor: 'var(--hover-color)',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.06)',
                },
                '& fieldset': {
                  borderColor: 'var(--border-color)',
                },
              },
            }}
          />
        </Box>
      )}

      {/* Navigation */}
      <List component="nav" sx={{ p: 0 }}>
        {renderItems(items)}
      </List>

      {/* Footer */}
      <Box sx={{ mt: 4, pt: 2, borderTop: '1px solid var(--border-color)' }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Need help?
        </Typography>
        <Typography variant="body2">
          <Box
            component="a"
            href={siteConfig.footerSocials?.github || 'https://github.com'}
            target="_blank"
            rel="noopener noreferrer"
            sx={{ color: 'var(--primary-color)', textDecoration: 'none', fontWeight: 500 }}
          >
            Contact us
          </Box>
        </Typography>
      </Box>
    </Box>
  );
};

export default NavigationSidebar; 