import React, { useState, useEffect } from 'react';
import { CodeBlock } from './CodeBlock';
// We need the import for the JSX preprocessor pattern matching, but not for direct use
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { TabGroup, Tab } from './Tabs';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MDXRendererProps {
  content: string;
}

/**
 * Preprocesses MDX content to make it compatible with markdown rendering
 * 
 * Handles conversion of custom components to markdown-friendly format
 */
const preprocessMDXContent = (mdxContent: string): string => {
  // console.log("Preprocessing MDX content");
  
  // Extract frontmatter
  let processedContent = mdxContent.replace(/^---\n([\s\S]*?)\n---\n/, '');
  
  // First, identify and protect code blocks from processing
  const codeBlocks: string[] = [];
  processedContent = processedContent.replace(/```[\s\S]*?```/g, (match) => {
    codeBlocks.push(match);
    return `___CODE_BLOCK_${codeBlocks.length - 1}___`;
  });
  
  // Process image tags to add width and height directly to the markdown
  // This converts ![alt](/path/to/image.jpg)<!-- width="300" --> to ![alt](/path/to/image.jpg#w=300)
  processedContent = processedContent.replace(
    /!\[(.*?)\]\((.*?)\)(?:\s*<!--\s*(?:width="(\d+)").*?-->)?/g,
    (match, alt, src, width) => {
      if (width) {
        return `![${alt}](${src}#w=${width})`;
      }
      return match;
    }
  );
  
  // Replace <Callout> components to preserve their type
  processedContent = processedContent.replace(
    /<Callout type="([^"]*)">\s*([\s\S]*?)\s*<\/Callout>/g,
    (_, type, content) => {
      const title = type.charAt(0).toUpperCase() + type.slice(1);
      // Make sure we add specific placeholder markers for the renderer to detect
      return `\n\n> **${title}:** ${content.trim()}\n\n`;
    }
  );
  
  // Replace new callout components to preserve their type
  const calloutTypes = ['Note', 'Warning', 'Tip', 'Info', 'Caution', 'Error', 'Success'];
  calloutTypes.forEach(calloutType => {
    const regex = new RegExp(`<${calloutType}>\\s*([\\s\\S]*?)\\s*<\\/${calloutType}>`, 'g');
    processedContent = processedContent.replace(
      regex,
      (_, content) => {
        // Make sure the callout type is explicitly included in the content
        return `\n\n> **${calloutType}:** ${content.trim()}\n\n`;
      }
    );
  });
  
  // Replace <TabGroup> and <Tab> components
  processedContent = processedContent.replace(
    /<TabGroup>\s*([\s\S]*?)\s*<\/TabGroup>/g,
    (_, content) => {
      // Extract tabs
      const tabs: { title: string; content: string }[] = [];
      const tabRegex = /<Tab title="([^"]*)">\s*([\s\S]*?)\s*<\/Tab>/g;
      let match;
      
      while ((match = tabRegex.exec(content)) !== null) {
        tabs.push({
          title: match[1],
          content: match[2]
        });
      }
      
      // Format tabs as markdown sections
      return tabs.map(tab => `\n\n### ${tab.title}\n\n${tab.content}\n\n`).join('');
    }
  );
  
  // Revert to the original HTML image tag processing
  processedContent = processedContent.replace(
    /<img\s+([^>]*)>/g,
    (fullMatch, attributes) => {
      // Extract src, height, width, noZoom attributes
      const srcMatch = attributes.match(/src="([^"]*)"/);
      const heightMatch = attributes.match(/height="([^"]*)"/);
      const widthMatch = attributes.match(/width="([^"]*)"/);
      const altMatch = attributes.match(/alt="([^"]*)"/);
      const titleMatch = attributes.match(/title="([^"]*)"/);
      const hasNoZoom = attributes.includes('noZoom');
      const isLightOnly = attributes.includes('light-only') || attributes.includes('data-light-only');
      const isDarkOnly = attributes.includes('dark-only') || attributes.includes('data-dark-only');
      
      if (!srcMatch) return fullMatch; // If no src, leave as is
      
      let src = srcMatch[1];
      let themeParam = '';
      
      // Add theme parameter based on attribute
      if (isLightOnly) {
        themeParam = 'theme=light';
      } else if (isDarkOnly) {
        themeParam = 'theme=dark';
      }
      
      // Add width and height directly to the URL as hash parameters
      let hashParams = [];
      if (widthMatch) {
        hashParams.push(`w=${widthMatch[1]}`);
      }
      if (heightMatch) {
        hashParams.push(`h=${heightMatch[1]}`);
      }
      if (themeParam) {
        hashParams.push(themeParam);
      }
      if (hasNoZoom) {
        hashParams.push('no-zoom');
      }
      
      // Add hash parameters if any
      if (hashParams.length > 0) {
        src += `#${hashParams.join('&')}`;
      }
      
      let markdown = `![${altMatch?.[1] || titleMatch?.[1] || ''}](${src}`;
      
      // Add title if available
      if (titleMatch) {
        markdown += ` "${titleMatch[1]}"`;
      }
      markdown += ')';
      
      return markdown;
    }
  );
  
  // Process HTML image tags wrapped in anchor tags
  processedContent = processedContent.replace(
    /<a\s+href="([^"]*)">\s*<img\s+([^>]*)>\s*<\/a>/g,
    (fullMatch, href, imgAttributes) => {
      // Extract src, height, width, noZoom attributes from the img tag
      const srcMatch = imgAttributes.match(/src="([^"]*)"/);
      const heightMatch = imgAttributes.match(/height="([^"]*)"/);
      const widthMatch = imgAttributes.match(/width="([^"]*)"/);
      const altMatch = imgAttributes.match(/alt="([^"]*)"/);
      const titleMatch = imgAttributes.match(/title="([^"]*)"/);
      const hasNoZoom = imgAttributes.includes('noZoom');
      
      if (!srcMatch) return fullMatch; // If no src, leave as is
      
      let src = srcMatch[1];
      
      // Add width and height directly to the URL as hash parameters
      if (widthMatch) {
        src += `#w=${widthMatch[1]}`;
      }
      if (heightMatch) {
        src += src.includes('#') ? `,h=${heightMatch[1]}` : `#h=${heightMatch[1]}`;
      }
      
      // For linked images, create a special markdown format
      let markdown = `[![${altMatch?.[1] || titleMatch?.[1] || ''}](${src}`;
      
      // Add title if available
      if (titleMatch) {
        markdown += ` "${titleMatch[1]}"`;
      }
      markdown += `)](${href})`;
      
      if (hasNoZoom) {
        markdown = markdown.replace(/\)\]\(/, '#no-zoom)](');
      }
      
      return markdown;
    }
  );
  
  // Remove any import statements or export statements that might be causing issues
  processedContent = processedContent.replace(/import\s+.*?from\s+['"].*?['"]/g, '');
  processedContent = processedContent.replace(/export\s+default\s+.*?[;{]/g, '');
  processedContent = processedContent.replace(/export\s+const\s+.*?=/g, 'const _removed_=');
  processedContent = processedContent.replace(/export\s+function\s+.*?[\s(]/g, 'function _removed_$1');
  
  // Finally, restore code blocks
  processedContent = processedContent.replace(/___CODE_BLOCK_(\d+)___/g, (_, index) => {
    return codeBlocks[parseInt(index)];
  });
  
  // Remove the debug output
  // console.log("Final processed content snippet:", processedContent.substring(0, 500));
  return processedContent;
};

// Define proper types for ReactMarkdown components
interface MarkdownComponentProps {
  node?: any;
  children?: React.ReactNode;
  [key: string]: any;
}

interface CodeBlockProps extends MarkdownComponentProps {
  inline?: boolean;
  className?: string;
}

interface ImageProps extends MarkdownComponentProps {
  src?: string;
  alt?: string;
  title?: string;
  noZoom?: boolean;
  className?: string;
  height?: string | number;
  width?: string | number;
  'data-mode'?: string;
}

/**
 * Image component with zoom functionality
 */
const ImageComponent: React.FC<ImageProps> = ({ src, alt, title, noZoom, className, height, width, 'data-mode': dataMode, ...rest }) => {
  const [open, setOpen] = useState(false);
  // State to track theme changes
  const [currentTheme, setCurrentTheme] = useState(document.documentElement.getAttribute('data-theme') || 'light');
  
  // Listen for theme changes
  useEffect(() => {
    const handleThemeChange = () => {
      const newTheme = document.documentElement.getAttribute('data-theme') || 'light';
      setCurrentTheme(newTheme);
      console.log("Theme changed to:", newTheme);
    };
    
    // Create a MutationObserver to watch for attribute changes on the html element
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
          handleThemeChange();
        }
      });
    });
    
    // Start observing
    observer.observe(document.documentElement, { attributes: true });
    
    // Initial theme check
    handleThemeChange();
    
    // Clean up
    return () => {
      observer.disconnect();
    };
  }, []);
  
  // Determine if we're in dark mode
  const isDarkMode = currentTheme === 'dark';
  
  // Check theme from hash parameter for theme-specific images
  // Look for #theme=light or #theme=dark or &theme=light or &theme=dark in the src URL
  let themeFromHash = null;
  if (src) {
    // First try exact parameter match
    if (src.includes('#theme=light') || src.includes('&theme=light')) {
      themeFromHash = 'light';
    } else if (src.includes('#theme=dark') || src.includes('&theme=dark')) {
      themeFromHash = 'dark';
    }
    
    // If not found, try regex for more complex cases
    if (!themeFromHash) {
      const themeMatch = src.match(/[#&]theme=(light|dark)(?:&|$)/);
      if (themeMatch) {
        themeFromHash = themeMatch[1];
      }
    }
  }
  
  // Check all other potential theme indicators as fallbacks
  const modeFromClass = className?.includes('light-only') ? 'light' : 
                       className?.includes('dark-only') ? 'dark' : null;
                       
  // Check parent node classes and properties for backward compatibility
  const parentNode = rest.node?.parentNode;
  const parentClass = parentNode?.properties?.className || '';
  const parentLightClass = typeof parentClass === 'string' ? parentClass.includes('light-only') : 
                          Array.isArray(parentClass) ? parentClass.includes('light-only') : false;
  const parentDarkClass = typeof parentClass === 'string' ? parentClass.includes('dark-only') : 
                         Array.isArray(parentClass) ? parentClass.includes('dark-only') : false;
  const modeFromParent = parentLightClass ? 'light' : parentDarkClass ? 'dark' : null;
  
  // Check data attributes for backward compatibility
  const modeFromAttr = dataMode === 'light-only' ? 'light' : 
                      dataMode === 'dark-only' ? 'dark' : 
                      rest['light-only'] ? 'light' : 
                      rest['dark-only'] ? 'dark' : null;
  
  // Final theme determination with priority order:
  // 1. Hash parameter (#theme=)
  // 2. Data attribute
  // 3. Class name
  // 4. Parent class
  const imageTheme = themeFromHash || modeFromAttr || modeFromClass || modeFromParent;

  console.log("Image theme detection:", {
    src,
    themeFromHash,
    modeFromClass,
    modeFromParent,
    modeFromAttr,
    finalTheme: imageTheme,
    currentTheme,
    isDarkMode
  });
  
  // If this is a theme-specific image and doesn't match current theme, don't render
  const shouldRender = !imageTheme || 
                      (imageTheme === 'light' && !isDarkMode) || 
                      (imageTheme === 'dark' && isDarkMode);
  
  if (!shouldRender) {
    console.log("Not rendering image due to theme mismatch:", src);
    return null;
  }
  
  // Clean up the src URL by removing theme parameters
  const cleanSrc = src?.replace(/[#&]theme=(light|dark)(&|$)/g, (match, theme, endChar) => {
    return endChar === '&' ? '&' : '';
  }).replace(/^([^#]*)[#]&/, '$1#').replace(/[#]$/, '') || '';
  
  // Build a class that includes original class
  const enhancedClassName = `${className || ''} img-fluid`;
  
  const handleOpen = () => {
    if (!noZoom) {
      setOpen(true);
    }
  };
  
  const handleClose = () => {
    setOpen(false);
  };
  
  return (
    <>
      <img
        src={cleanSrc}
        alt={alt || title || 'Image'}
        title={title || alt}
        className={enhancedClassName}
        width={width}
        height={height}
        style={{ 
          cursor: noZoom ? 'default' : 'zoom-in',
          maxWidth: '100%',
          borderRadius: '4px'
        }}
        onClick={handleOpen}
        data-theme={imageTheme}
        {...(noZoom && { 'data-no-zoom': 'true' })}
        {...rest}
      />
      
      {!noZoom && open && (
        <div 
          className="modal show" 
          style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={handleClose}
        >
          <div 
            className="modal-dialog modal-dialog-centered modal-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header">
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={handleClose}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body text-center">
                <img
                  src={cleanSrc}
                  alt={alt || title || 'Image'}
                  className="img-fluid"
                  style={{ 
                    maxHeight: '80vh',
                    objectFit: 'contain',
                    borderRadius: '4px'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

/**
 * MDX Renderer Component
 * 
 * Renders MDX content with support for custom components
 */
const MDXRenderer: React.FC<MDXRendererProps> = ({ content }) => {
  const processedContent = preprocessMDXContent(content);
  
  return (
    <div className="mdx-content">
      <style>
        {`
          .callout-body p {
            margin-top: 0;
            margin-bottom: 0;
          }

          /* Theme-specific image styling */
          html[data-theme="dark"] .light-only {
            display: none;
          }
          
          html[data-theme="light"] .dark-only {
            display: none;
          }
          
          [light-only] {
            display: var(--light-only-display, block);
          }
          
          [dark-only] {
            display: var(--dark-only-display, block);
          }
          
          html[data-theme="dark"] {
            --light-only-display: none;
            --dark-only-display: block;
          }
          
          html[data-theme="light"] {
            --light-only-display: block;
            --dark-only-display: none;
          }
        `}
      </style>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Enhanced blockquote component for callouts
          blockquote: ({ children, ...props }: MarkdownComponentProps) => {
            // Default callout type and title
            let type = 'note';
            let title = 'Note';
            
            // Try to extract the content as a string to detect callout type
            let contentStr = '';
            const childrenArray = React.Children.toArray(children);
            
            // Traverse the children to find the first paragraph with text
            for (const child of childrenArray) {
              if (React.isValidElement(child) && child.props && child.props.children) {
                // Handle direct string content
                if (typeof child.props.children === 'string') {
                  contentStr = child.props.children;
                  break;
                }
                // Handle array of content (more common)
                else if (Array.isArray(child.props.children)) {
                  // Stringify the first few elements to check for callout markers
                  contentStr = child.props.children
                    .slice(0, 3) // Only need first few elements to check for callout type
                    .map((item: React.ReactNode) => {
                      if (typeof item === 'string') return item;
                      if (React.isValidElement(item) && item.props) {
                        // Try to get text content from child elements like <strong>
                        if (typeof item.props.children === 'string') {
                          return item.props.children;
                        }
                      }
                      return '';
                    })
                    .join(' ');
                  break;
                }
              }
            }
            
            // Detect callout type from content
            if (contentStr.toUpperCase().includes('NOTE:') || contentStr.toUpperCase().includes('**NOTE**')) {
              type = 'note';
              title = 'Note';
            } else if (contentStr.toUpperCase().includes('INFO:') || contentStr.toUpperCase().includes('**INFO**')) {
              type = 'info';
              title = 'Info';
            } else if (contentStr.toUpperCase().includes('TIP:') || contentStr.toUpperCase().includes('**TIP**')) {
              type = 'tip';
              title = 'Tip';
            } else if (contentStr.toUpperCase().includes('WARNING:') || contentStr.toUpperCase().includes('**WARNING**')) {
              type = 'warning';
              title = 'Warning';
            } else if (contentStr.toUpperCase().includes('CAUTION:') || contentStr.toUpperCase().includes('**CAUTION**')) {
              type = 'caution';
              title = 'Caution';
            } else if (contentStr.toUpperCase().includes('ERROR:') || contentStr.toUpperCase().includes('**ERROR**')) {
              type = 'error';
              title = 'Error';
            } else if (contentStr.toUpperCase().includes('SUCCESS:') || contentStr.toUpperCase().includes('**SUCCESS**')) {
              type = 'success';
              title = 'Success';
            }
            
            // Get the appropriate icon class for this callout type
            const iconClass = getIconClass(type);
            
            // CSS variables for styling based on type
            const cssVariables = {
              '--callout-bg-color': type === 'note' ? 'rgba(13, 110, 253, 0.1)' :
                                    type === 'info' ? 'rgba(13, 202, 240, 0.1)' :
                                    type === 'tip' ? 'rgba(25, 135, 84, 0.1)' :
                                    type === 'warning' ? 'rgba(255, 193, 7, 0.1)' :
                                    type === 'caution' ? 'rgba(253, 126, 20, 0.1)' :
                                    type === 'error' ? 'rgba(220, 53, 69, 0.1)' :
                                    type === 'success' ? 'rgba(25, 135, 84, 0.1)' :
                                    'rgba(13, 110, 253, 0.1)',
              '--callout-border-color': type === 'note' ? '#0d6efd' :
                                       type === 'info' ? '#0dcaf0' :
                                       type === 'tip' ? '#198754' :
                                       type === 'warning' ? '#ffc107' :
                                       type === 'caution' ? '#fd7e14' :
                                       type === 'error' ? '#dc3545' :
                                       type === 'success' ? '#198754' :
                                       '#0d6efd',
              '--callout-text-color': type === 'note' ? '#084298' :
                                     type === 'info' ? '#055160' :
                                     type === 'tip' ? '#0a3622' :
                                     type === 'warning' ? '#664d03' :
                                     type === 'caution' ? '#664d03' :
                                     type === 'error' ? '#842029' :
                                     type === 'success' ? '#0a3622' :
                                     '#084298',
            } as React.CSSProperties;
            
            // Apply appropriate styling based on callout type
            return (
              <div 
                role="note" 
                className={`callout callout-${type}`} 
                style={{
                  ...cssVariables,
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem',
                  padding: '1rem',
                  borderRadius: '0.25rem',
                  borderLeft: `4px solid var(--callout-border-color)`
                }}
                {...props}
              >
                <i className={iconClass} style={{ 
                  flexShrink: 0, 
                  marginTop: '0rem',
                  color: 'var(--callout-border-color)'
                }}></i>
                <div className="callout-body" style={{
                  // Simple styles for the callout body itself
                }}>
                  {children}
                </div>
              </div>
            );
          },
          h1: ({ children, ...props }: MarkdownComponentProps) => {
            // Convert children to string safely for ID generation
            const headingText = Array.isArray(children) 
              ? children.join('') 
              : String(children || '');
            const id = headingText.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
            
            return (
              <h1 id={id} className="h1" {...props}>
                {id && (
                  <a href={`#${id}`} className="anchor-link" aria-hidden="true">
                    #
                  </a>
                )}
                {children}
              </h1>
            );
          },
          h2: ({ children, ...props }: MarkdownComponentProps) => {
            // Convert children to string safely for ID generation
            const headingText = Array.isArray(children) 
              ? children.join('') 
              : String(children || '');
            const id = headingText.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
            
            return (
              <h2 id={id} className="h2 mb-3" {...props}>
                {id && (
                  <a href={`#${id}`} className="anchor-link" aria-hidden="true">
                    #
                  </a>
                )}
                {children}
              </h2>
            );
          },
          pre: ({ children, ...props }: MarkdownComponentProps) => {
            // Pass pre content directly to maintain MDX syntax in code blocks
            return <div {...props}>{children}</div>;
          },
          code: ({ inline, className, children, ...props }: CodeBlockProps) => {
            const match = /language-(\w+)/.exec(className || '');
            // Don't preprocess - keep raw content exactly as written
            const codeContent = String(children).replace(/\n$/, '');
            
            if (!inline && match) {
              // Check if there's a filename in the language (format: language:filename)
              const languageParts = match[1].split(':');
              const language = languageParts[0];
              const filename = languageParts.length > 1 ? languageParts[1] : undefined;
              
              return (
                <CodeBlock 
                  language={language} 
                  filename={filename}
                >
                  {codeContent}
                </CodeBlock>
              );
            } 
            
            return (
              <code 
                className={className} 
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.05)',
                  padding: '0.2em 0.4em',
                  borderRadius: '3px',
                  fontFamily: 'ui-monospace, SFMono-Regular, SF Mono, Menlo, Monaco, Consolas, monospace',
                  fontSize: '0.85em',
                  whiteSpace: 'break-spaces',
                }}
                {...props}
              >
                {children}
              </code>
            );
          },
          img: ({ src, alt, title, className, ...rest }: ImageProps) => {
            // Extract custom attributes from URL hash parameters
            let noZoom = false;
            let height = undefined;
            let width = undefined;
            let dataMode = undefined;
            
            // Extract parameters from the URL hash
            if (src && src.includes('#')) {
              // Keep the original src for theme detection
              // But extract other parameters for the component
              
              // Parse hash parameters
              const hashParts = src.split('#')[1].split('&');
              for (const part of hashParts) {
                if (part.startsWith('w=')) {
                  width = part.substring(2);
                } else if (part.startsWith('h=')) {
                  height = part.substring(2);
                } else if (part === 'no-zoom') {
                  noZoom = true;
                } else if (part.startsWith('theme=')) {
                  const theme = part.substring(6);
                  if (theme === 'light') {
                    dataMode = 'light-only';
                  } else if (theme === 'dark') {
                    dataMode = 'dark-only';
                  }
                }
              }
            }
            
            return (
              <ImageComponent 
                src={src} 
                alt={alt} 
                title={title} 
                noZoom={noZoom} 
                className={className} 
                height={height} 
                width={width} 
                data-mode={dataMode}
                {...rest} 
              />
            );
          },
          span: ({ className, children, ...props }: MarkdownComponentProps) => {
            return (
              <span className={className} {...props}>
                {children}
              </span>
            );
          }
        }}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  );
};

// Helper function to get the appropriate icon class based on callout type
const getIconClass = (type: string): string => {
  switch (type) {
    case 'note':
      return 'bi bi-journal-text';
    case 'info':
      return 'bi bi-info-circle-fill';
    case 'tip':
      return 'bi bi-lightbulb-fill';
    case 'warning':
      return 'bi bi-exclamation-triangle-fill';
    case 'caution':
      return 'bi bi-shield-exclamation';
    case 'error':
      return 'bi bi-exclamation-circle-fill';
    case 'success':
      return 'bi bi-check-circle-fill';
    default:
      return 'bi bi-info-circle-fill';
  }
};

export default MDXRenderer;