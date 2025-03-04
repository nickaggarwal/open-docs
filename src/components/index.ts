import siteConfig from '../config/site.config.json';

export interface PageLink {
  id: string;
  label: string;
  path: string;
}

export interface NavigationItem {
  type: 'category' | 'doc' | 'link' | 'section';
  id?: string;
  label: string;
  items?: NavigationItem[];
  to?: string;
  href?: string;
}

export interface TabItem {
  name: string;
  url: string;
}

// Define the interface for top bar items
export interface TopBarItem {
  label: string;
  position: string;
  to?: string;
  href?: string;
}

export interface SiteConfig {
  name: string;
  logo: string;
  favicon: string;
  api: {
    baseUrl: string;
    auth: {
      method: string;
      name: string;
    };
  };
  colors: {
    primary: string;
    light: string;
    dark: string;
  };
  topbarCtaButton: {
    name: string;
    url: string;
  };
  primaryTab: {
    name: string;
  };
  tabs: TabItem[];
  navigation: any[];
  footerSocials: {
    twitter?: string;
    github?: string;
    linkedin?: string;
    [key: string]: string | undefined;
  };
}

// Process navigation items to convert them to the format expected by the sidebar
const processNavigationItems = (navigationConfig: any[]): { docs: NavigationItem[], api: NavigationItem[] } => {
  // Process the navigation items from the config
  const docsItems: NavigationItem[] = [];
  const apiItems: NavigationItem[] = [];

  navigationConfig.forEach(navGroup => {
    if (navGroup.group === '') {
      // Top-level pages without a group go directly into the navigation
      navGroup.pages.forEach((page: string) => {
        const pagePath = page.startsWith('/') ? page : `/${page}`;
        docsItems.push({
          type: 'doc',
          label: getPageTitle(page),
          to: `/docs${pagePath}`.replace(/\.mdx?$/, ''),
        });
      });
    } else {
      // Create a section for each top-level group
      const sectionItems: NavigationItem[] = [];
      
      navGroup.pages.forEach((page: any) => {
        if (typeof page === 'string') {
          // Simple page
          const pagePath = page.startsWith('/') ? page : `/${page}`;
          sectionItems.push({
            type: 'doc',
            label: getPageTitle(page),
            to: `/docs${pagePath}`.replace(/\.mdx?$/, ''),
          });
        } else if (typeof page === 'object' && page.group) {
          // Nested group - this is converted to a category
          const categoryItems: NavigationItem[] = [];
          
          page.pages.forEach((subPage: string) => {
            const pagePath = subPage.startsWith('/') ? subPage : `/${subPage}`;
            categoryItems.push({
              type: 'doc',
              label: getPageTitle(subPage),
              to: `/docs${pagePath}`.replace(/\.mdx?$/, ''),
            });
          });
          
          sectionItems.push({
            type: 'category',
            label: page.group,
            items: categoryItems,
          });
        }
      });
      
      // Add section with its items to the appropriate navigation
      if (navGroup.group.toLowerCase().includes('api')) {
        apiItems.push({
          type: 'section',
          label: navGroup.group,
          items: sectionItems,
        });
      } else {
        docsItems.push({
          type: 'section',
          label: navGroup.group,
          items: sectionItems,
        });
      }
    }
  });

  return { docs: docsItems, api: apiItems };
};

// Helper to convert slug to title (e.g. "getting-started/installation" -> "Installation")
const getPageTitle = (page: string): string => {
  const parts = page.split('/');
  const lastPart = parts[parts.length - 1];
  return lastPart
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase())
    .replace(/mdx?$/, '');
};

// Process tabs to convert them to the format expected by the top navigation
const processTabItems = (tabsConfig: TabItem[], primaryTab: { name: string }): TopBarItem[] => {
  const topBarItems: TopBarItem[] = [
    {
      label: primaryTab.name,
      to: '/docs',
      position: 'left'
    }
  ];

  tabsConfig.forEach(tab => {
    topBarItems.push({
      label: tab.name,
      to: `/${tab.url}`,
      position: 'left'
    });
  });

  // Add GitHub as a right-positioned item
  if (siteConfig.footerSocials.github) {
    topBarItems.push({
      label: 'GitHub',
      href: siteConfig.footerSocials.github,
      position: 'right'
    });
  }

  return topBarItems;
};

// Process the CTA button
const processCTAButton = (ctaButton: { name: string, url: string }): TopBarItem => {
  return {
    label: ctaButton.name,
    href: ctaButton.url,
    position: 'right'
  };
};

// Generate the navigation configuration
const { docs, api } = processNavigationItems(siteConfig.navigation);
const topBarItems = processTabItems(siteConfig.tabs, siteConfig.primaryTab);

// Add CTA button if configured
if (siteConfig.topbarCtaButton) {
  topBarItems.push(processCTAButton(siteConfig.topbarCtaButton));
}

// Create the final navigation configuration
const navigationConfig = {
  topBar: {
    logo: {
      alt: `${siteConfig.name} Logo`,
      src: siteConfig.logo
    },
    title: siteConfig.name,
    items: topBarItems
  },
  sidebar: {
    docs,
    api
  }
};

export { siteConfig, navigationConfig };

// Default export for convenience
export default {
  siteConfig,
  navigationConfig
}; 