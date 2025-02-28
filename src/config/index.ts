import siteConfig from './site.config.json';

export interface PageLink {
  id: string;
  label: string;
  path: string;
}

export interface NavigationItem {
  type: 'category' | 'doc';
  id?: string;
  label: string;
  items?: NavigationItem[];
  to?: string;
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
  const docsItems: NavigationItem[] = [];
  const apiItems: NavigationItem[] = [];

  navigationConfig.forEach(section => {
    const categoryItem: NavigationItem = {
      type: 'category',
      label: section.group || 'Main',
      items: []
    };

    // Process pages in this section
    section.pages.forEach((page: string | any) => {
      if (typeof page === 'string') {
        // Simple page reference
        const parts = page.split('/');
        const id = parts[parts.length - 1];
        const label = id.charAt(0).toUpperCase() + id.slice(1).replace(/-/g, ' ');
        
        categoryItem.items!.push({
          type: 'doc',
          id,
          label,
          to: `/docs/${page}`
        });
      } else if (typeof page === 'object') {
        // Nested category
        const nestedCategory: NavigationItem = {
          type: 'category',
          label: page.group,
          items: []
        };

        // Process nested pages
        page.pages.forEach((nestedPage: string) => {
          const parts = nestedPage.split('/');
          const id = parts[parts.length - 1];
          const label = id.charAt(0).toUpperCase() + id.slice(1).replace(/-/g, ' ');
          
          nestedCategory.items!.push({
            type: 'doc',
            id,
            label,
            to: `/docs/${nestedPage}`
          });
        });

        categoryItem.items!.push(nestedCategory);
      }
    });

    // Only add categories with items
    if (categoryItem.items!.length > 0) {
      // Determine if this is for docs or API based on the group name or content
      if (section.group.toLowerCase().includes('api')) {
        apiItems.push(categoryItem);
      } else {
        docsItems.push(categoryItem);
      }
    }
  });

  return { docs: docsItems, api: apiItems };
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