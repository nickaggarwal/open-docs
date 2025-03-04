import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink, useLocation } from 'react-router-dom';
import {
  Box,
  Typography,
  Breadcrumbs,
  Link,
  Chip,
  Divider,
  Paper,
  CircularProgress,
  Button,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import MDXRenderer from '../components/MDXRenderer';
import { siteConfig } from '../components';

// In a real application, you would use a dynamic import mechanism
// For this example, we're simulating content loading
const loadMDXContent = async (id: string): Promise<string | null> => {
  try {
    console.log(`Loading content for: ${id}`);
    
    // First, try to read the actual MDX file from the filesystem
    const mdxContent = await readMdxFile(id);
    if (mdxContent) {
      console.log(`Successfully loaded MDX content from file for ${id}`);
      return mdxContent;
    }
    
    console.log('Content file not found, falling back to hardcoded content map');
    
    // Fallback to hardcoded content map for demo purposes
    const contentMap: Record<string, string> = {
      'introduction/introduction': '# Introduction\n\nWelcome to Open Docs!',
      'getting-started/installation': '# Installation\n\nLearn how to install Open Docs.',
      'getting-started/configuration': '# Configuration\n\nConfigure your Open Docs installation.',
      'getting-started/quickstart': '# Quickstart\n\nGet started quickly with Open Docs.',
      'guides/styling': '# Styling\n\nCustomize the look and feel of your documentation.',
      'core-concepts/architecture': '# Architecture\n\nUnderstand the architecture of Open Docs.',
      'core-concepts/data-model': '# Data Model\n\nLearn about the data model in Open Docs.',
      'core-concepts/components/overview': '# Components Overview\n\nAn overview of components in Open Docs.',
      'guides/creating-pages': '# Creating Pages\n\nLearn how to create pages in Open Docs.'
    };
    
    console.log('Available content keys in fallback map:', Object.keys(contentMap));
    
    if (contentMap[id]) {
      console.log(`Found content for ${id} in fallback map`);
      return contentMap[id];
    }
    
    // If all else fails, generate a placeholder
    console.log(`No content found for ${id}, generating placeholder`);
    return `# ${id.split('/').pop()?.charAt(0).toUpperCase()}${id.split('/').pop()?.slice(1).replace(/-/g, ' ')}\n\nThis is a placeholder for ${id}.`;
  } catch (error) {
    console.error('Error loading MDX content:', error);
    return null;
  }
};

// Utility function to load content directly from the filesystem
// In a real application, this would be handled by a bundler or server
const readMdxFile = async (id: string): Promise<string | null> => {
  try {
    // In a production app, this would be done differently using webpack or a backend
    // For this demo, we'll directly read the file from src/content
    console.log(`Attempting to read MDX file for ${id}`);
    
    // Try multiple potential locations for the content
    const paths = [
      // From public/content
      `${process.env.PUBLIC_URL}/content/${id}.mdx`,
      // From src/content via direct access
      `/src/content/${id}.mdx`,
      // From public directory
      `/content/${id}.mdx`
    ];
    
    let content = null;
    
    // Try each path until we find the content
    for (const path of paths) {
      try {
        console.log(`Trying to load from: ${path}`);
        const response = await fetch(path);
        
        if (response.ok) {
          content = await response.text();
          console.log(`Successfully loaded content from: ${path}`);
          return content;
        }
      } catch (e) {
        console.log(`Failed to load from: ${path}`);
      }
    }
    
    console.error(`Could not load MDX file for ${id} from any location`);
    return null;
  } catch (error) {
    console.error(`Error reading MDX file for ${id}:`, error);
    return null;
  }
};

interface DocPageParams {
  [key: string]: string | undefined;
  id?: string;
  segment1?: string;
  segment2?: string;
  segment3?: string;
}

interface MDXMetadata {
  title: string;
  description: string;
  lastUpdated: string;
  category: string;
}

const DocPage: React.FC = () => {
  const params = useParams<DocPageParams>();
  const location = useLocation();
  
  // Handle different parameter formats
  // If we have segment parameters, combine them into an ID
  const constructId = (): string => {
    if (params.segment1 && params.segment2) {
      if (params.segment3) {
        return `${params.segment1}/${params.segment2}/${params.segment3}`;
      }
      return `${params.segment1}/${params.segment2}`;
    }
    return params.id || 'introduction/introduction';
  };
  
  const id = constructId();
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Determine if we're in the API section or docs section
  const isApiSection = location.pathname.startsWith('/api');
  const section = isApiSection ? 'api' : 'docs';

  useEffect(() => {
    // Reset state when ID changes
    setLoading(true);
    setError(null);
    setContent(null);
    
    console.log(`DocPage: Loading content for ID: ${id}`);
    console.log('Current URL path:', location.pathname);
    console.log('Is API section:', isApiSection);
    console.log('Section:', section);
    console.log('Route params:', params);

    // Load content from MDX files
    const fetchContent = async () => {
      try {
        const mdxContent = await loadMDXContent(id);
        
        if (mdxContent) {
          console.log(`Content loaded successfully for ${id}`);
          console.log(`Content length: ${mdxContent.length} characters`);
          // Log the first 100 characters to debug
          console.log(`Content preview: ${mdxContent.substring(0, 100)}...`);
          setContent(mdxContent);
          setLoading(false);
        } else {
          console.error(`Content for "${id}" not found.`);
          setError(`Content for "${id}" not found.`);
          setLoading(false);
        }
      } catch (err) {
        console.error('Failed to load content:', err);
        setError('Failed to load content. Please try again later.');
        setLoading(false);
      }
    };

    fetchContent();
  }, [id, isApiSection, section, location.pathname, params]);

  // Generate breadcrumbs based on the current path and metadata
  const generateBreadcrumbs = (pageTitle?: string) => {
    if (!id) return [];

    const parts = id.split('/');
    const breadcrumbs = [];

    // Add the section (docs or api)
    breadcrumbs.push({
      label: section === 'api' ? 'API' : 'Docs',
      path: `/${section}`,
    });

    // Add intermediate paths
    let currentPath = '';
    for (let i = 0; i < parts.length - 1; i++) {
      currentPath += `/${parts[i]}`;
      breadcrumbs.push({
        label: parts[i].charAt(0).toUpperCase() + parts[i].slice(1).replace(/-/g, ' '),
        path: `/${section}${currentPath}`,
      });
    }

    // Add the current page (last part) - use provided title if available
    breadcrumbs.push({
      label: pageTitle || parts[parts.length - 1].charAt(0).toUpperCase() + parts[parts.length - 1].slice(1).replace(/-/g, ' '),
      path: `/${section}/${id}`,
      current: true,
    });

    return breadcrumbs;
  };

  // Format the current date for the "Last updated" label
  const formatDate = () => {
    const date = new Date();
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Generate the GitHub edit URL
  const getEditUrl = () => {
    const githubRepo = siteConfig.footerSocials?.github || 'https://github.com/yourusername/open-docs';
    return `${githubRepo}/edit/main/src/content/${id}.mdx`;
  };

  // Get the title from the ID
  const getTitle = () => {
    const parts = id.split('/');
    return parts[parts.length - 1].charAt(0).toUpperCase() + parts[parts.length - 1].slice(1).replace(/-/g, ' ');
  };

  // Parse the content to extract title, body and metadata
  const parseContent = (content: string) => {
    const lines = content.split('\n');
    let title = getTitle();
    let body = content;
    let metadata: MDXMetadata | null = null;
    let description: string | undefined = undefined;

    // Extract frontmatter if it exists
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (frontmatterMatch) {
      const [, frontmatter, contentBody] = frontmatterMatch;
      body = contentBody;

      // Parse frontmatter
      const titleMatch = frontmatter.match(/title:\s*(.+)$/m);
      const descriptionMatch = frontmatter.match(/description:\s*(.+)$/m);
      const lastUpdatedMatch = frontmatter.match(/lastUpdated:\s*(.+)$/m);
      const categoryMatch = frontmatter.match(/category:\s*(.+)$/m);

      // Get description from frontmatter if it exists
      if (descriptionMatch) {
        description = descriptionMatch[1].trim();
      }
      
      // Get title from frontmatter
      if (titleMatch) {
        title = titleMatch[1].trim();
      }

      if (titleMatch || lastUpdatedMatch || categoryMatch || description) {
        metadata = {
          title,
          description: description || '',
          lastUpdated: lastUpdatedMatch ? lastUpdatedMatch[1].trim() : formatDate(),
          category: categoryMatch ? categoryMatch[1].trim() : (section === 'api' ? 'API' : 'Documentation')
        };
      }
    } else if (lines[0].startsWith('# ')) {
      // If no frontmatter but has title heading
      title = lines[0].substring(2).trim();
      body = lines.slice(1).join('\n').trim();
    }

    // Only update metadata if we have a description from frontmatter
    if (description && metadata) {
      metadata.description = description;
    } else if (description) {
      metadata = {
        title,
        description,
        lastUpdated: formatDate(),
        category: section === 'api' ? 'API' : 'Documentation'
      };
    }

    return { title, body, metadata };
  };

  // Render the content
  const renderContent = () => {
    if (!content) return null;

    const { title, body, metadata } = parseContent(content);
    const currentBreadcrumbs = generateBreadcrumbs(title);

    return (
      <Box>
        {/* Breadcrumbs */}
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
          sx={{ mb: 3 }}
        >
          {currentBreadcrumbs.map((crumb, index) => (
            <Box key={index}>
              {crumb.current ? (
                <Typography color="text.primary" fontWeight={500}>
                  {crumb.label}
                </Typography>
              ) : (
                <Link
                  component={RouterLink}
                  to={crumb.path}
                  color="inherit"
                  sx={{
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  {crumb.label}
                </Link>
              )}
            </Box>
          ))}
        </Breadcrumbs>

        {/* Title and metadata */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
            {title}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2, mb: 2 }}>
            <Chip
              label={`Last updated: ${metadata?.lastUpdated || formatDate()}`}
              size="small"
              sx={{
                backgroundColor: 'rgba(0, 0, 0, 0.06)',
                color: 'text.secondary',
                fontWeight: 500,
              }}
            />

            <Chip
              label={metadata?.category || (section === 'api' ? 'API' : 'Documentation')}
              size="small"
              color="primary"
              sx={{ fontWeight: 500 }}
            />
          </Box>

          {metadata?.description && metadata.description.length > 0 && (
            <Typography 
              variant="subtitle1" 
              color="text.secondary" 
              sx={{ 
                mb: 2,
                lineHeight: 1.6,
                maxWidth: '800px'
              }}
            >
              {metadata.description}
            </Typography>
          )}

          <Divider sx={{ my: 2 }} />
        </Box>

        {/* Main content */}
        <Box sx={{ mb: 6 }}>
          <MDXRenderer content={body} />
        </Box>

        {/* Edit on GitHub */}
        <Box sx={{ mt: 6, pt: 2, borderTop: '1px solid rgba(0, 0, 0, 0.1)' }}>
          <Button
            component="a"
            href={getEditUrl()}
            target="_blank"
            rel="noopener noreferrer"
            startIcon={<EditIcon />}
            variant="text"
            size="small"
            sx={{ color: 'text.secondary' }}
          >
            Edit this page on GitHub
          </Button>
        </Box>
      </Box>
    );
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* Loading state */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
          <CircularProgress color="primary" />
        </Box>
      )}

      {/* Error state */}
      {error && (
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 2,
            backgroundColor: 'rgba(211, 47, 47, 0.1)',
            border: '1px solid rgba(211, 47, 47, 0.3)',
            mb: 4,
          }}
        >
          <Typography color="error" variant="h6" gutterBottom>
            Error Loading Content
          </Typography>
          <Typography>{error}</Typography>
        </Paper>
      )}

      {/* Content */}
      {!loading && !error && content && renderContent()}
    </Box>
  );
};

export default DocPage; 