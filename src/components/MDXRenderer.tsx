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
  console.log("Preprocessing MDX content");
  
  // Extract frontmatter
  let processedContent = mdxContent.replace(/^---\n([\s\S]*?)\n---\n/, '');
  
  // Replace <Callout> components
  processedContent = processedContent.replace(
    /<Callout type="([^"]*)">\s*([\s\S]*?)\s*<\/Callout>/g,
    (_, type, content) => {
      return `\n\n> **${type.toUpperCase()}**: ${content.trim()}\n\n`;
    }
  );
  
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
  
  // Process HTML image tags to convert them to markdown with special data attributes
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
      
      let markdown = `![${altMatch?.[1] || titleMatch?.[1] || ''}](${src}`;
      
      // Add title if available
      if (titleMatch) {
        markdown += ` "${titleMatch[1]}"`;
      }
      markdown += ')';
      
      // Add data attributes as HTML comments that we can parse later
      const dataAttrs = [];
      if (heightMatch) dataAttrs.push(`height="${heightMatch[1]}"`);
      if (widthMatch) dataAttrs.push(`width="${widthMatch[1]}"`);
      if (hasNoZoom) dataAttrs.push('noZoom="true"');
      if (isLightOnly) dataAttrs.push('data-mode="light-only"');
      if (isDarkOnly) dataAttrs.push('data-mode="dark-only"');
      
      if (dataAttrs.length > 0) {
        markdown += `<!-- ${dataAttrs.join(' ')} -->`;
      }
      
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
      const isLightOnly = imgAttributes.includes('light-only') || imgAttributes.includes('data-light-only');
      const isDarkOnly = imgAttributes.includes('dark-only') || imgAttributes.includes('data-dark-only');
      
      if (!srcMatch) return fullMatch; // If no src, leave as is
      
      let src = srcMatch[1];
      // Append mode markers to src if needed
      if (isLightOnly) {
        src += '#light-only';
      } else if (isDarkOnly) {
        src += '#dark-only';
      }
      
      // For linked images, create a special markdown format
      let markdown = `[![${altMatch?.[1] || titleMatch?.[1] || ''}](${src}`;
      
      // Add title if available
      if (titleMatch) {
        markdown += ` "${titleMatch[1]}"`;
      }
      markdown += `)](${href})`;
      
      // Add data attributes as HTML comments that we can parse later
      const dataAttrs = [];
      if (heightMatch) dataAttrs.push(`height="${heightMatch[1]}"`);
      if (widthMatch) dataAttrs.push(`width="${widthMatch[1]}"`);
      if (hasNoZoom) dataAttrs.push('noZoom="true"');
      
      if (dataAttrs.length > 0) {
        markdown += `<!-- ${dataAttrs.join(' ')} -->`;
      }
      
      return markdown;
    }
  );
  
  // Remove any remaining JSX component imports
  processedContent = processedContent.replace(/import.*?from.*?;/g, '');
  
  // Handle export statements
  processedContent = processedContent.replace(/export.*?function.*?{[\s\S]*?}.*?<\/.*>/g, '');
  
  console.log("Preprocessed content:", processedContent.substring(0, 200) + "...");
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
      setCurrentTheme(document.documentElement.getAttribute('data-theme') || 'light');
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
    
    // Clean up
    return () => {
      observer.disconnect();
    };
  }, []);
  
  // Determine if we're in dark mode
  const isDarkMode = currentTheme === 'dark';
  
  // Check if this is a dark/light mode specific image
  const modeFromHash = src?.includes('#light-only') ? 'light-only' : src?.includes('#dark-only') ? 'dark-only' : null;
  const modeFromClass = className?.includes('light-only') ? 'light-only' : className?.includes('dark-only') ? 'dark-only' : null;
  const modeFromAttr = dataMode; // From the data-mode attribute
  
  const imageMode = modeFromAttr || modeFromHash || modeFromClass || null;
  
  // If this is a mode-specific image and doesn't match current mode, don't render
  if ((imageMode === 'light-only' && isDarkMode) || (imageMode === 'dark-only' && !isDarkMode)) {
    return null;
  }
  
  // Clean up the src URL by removing mode-specific tags
  const cleanSrc = src?.replace(/#(light|dark)-only/g, '') || '';
  
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
        className={`${className || ''} img-fluid`}
        style={{ 
          height: height ? `${height}px` : 'auto',
          width: width ? `${width}px` : 'auto',
          cursor: noZoom ? 'default' : 'zoom-in',
          maxWidth: '100%',
          borderRadius: '4px'
        }}
        onClick={handleOpen}
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
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
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
          code: ({ inline, className, children, ...props }: CodeBlockProps) => {
            const match = /language-(\w+)/.exec(className || '');
            
            if (!inline && match) {
              // Check if there's a filename in the language (format: language:filename)
              const languageParts = match[1].split(':');
              const language = languageParts[0];
              const filename = languageParts.length > 1 ? languageParts[1] : undefined;
              
              return (
                <CodeBlock language={language} filename={filename}>
                  {String(children).replace(/\n$/, '')}
                </CodeBlock>
              );
            } 
            
            return (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
          img: ({ src, alt, title, className, ...rest }: ImageProps) => {
            // Extract custom attributes from HTML comments if available
            let noZoom = false;
            let height = undefined;
            let width = undefined;
            let dataMode = undefined;
            
            // Check for HTML comment with data attributes
            const commentMatch = rest.node?.position?.end?.column && rest.node?.children?.[0]?.value;
            if (commentMatch && typeof commentMatch === 'string') {
              // Extract attributes from HTML comment
              const heightMatch = commentMatch.match(/height="([^"]*)"/);
              const widthMatch = commentMatch.match(/width="([^"]*)"/);
              const noZoomMatch = commentMatch.match(/noZoom="true"/);
              const dataModeMatch = commentMatch.match(/data-mode="([^"]*)"/);
              
              if (heightMatch) height = heightMatch[1];
              if (widthMatch) width = widthMatch[1];
              if (noZoomMatch) noZoom = true;
              if (dataModeMatch) dataMode = dataModeMatch[1];
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
          }
        }}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  );
};

export default MDXRenderer;