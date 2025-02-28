export const navigationConfig = {
  // Top navigation bar items
  topNav: [
    { label: 'Home', path: '/' },
    { label: 'Docs', path: '/docs/introduction' },
    { label: 'GitHub', path: 'https://github.com/yourusername/open-docs', external: true },
  ],
  
  // Sidebar navigation items
  sidebar: [
    {
      label: 'Getting Started',
      items: [
        { label: 'Introduction', path: '/docs/introduction' },
        { label: 'Installation', path: '/docs/installation' },
        { label: 'Configuration', path: '/docs/configuration' },
      ],
    },
    {
      label: 'Guides',
      items: [
        { label: 'Styling', path: '/docs/styling' },
        { label: 'Components', path: '/docs/components' },
        { label: 'Writing Content', path: '/docs/writing-content' },
      ],
    },
    {
      label: 'Advanced',
      items: [
        { label: 'Deployment', path: '/docs/deployment' },
        { label: 'SEO', path: '/docs/seo' },
        { label: 'Performance', path: '/docs/performance' },
      ],
    },
    {
      label: 'Resources',
      items: [
        { 
          label: 'Material UI', 
          path: 'https://mui.com/material-ui/getting-started/', 
          external: true 
        },
        { 
          label: 'React', 
          path: 'https://reactjs.org/docs/getting-started.html', 
          external: true 
        },
        { 
          label: 'TypeScript', 
          path: 'https://www.typescriptlang.org/docs/', 
          external: true 
        },
      ],
    },
  ],
}; 