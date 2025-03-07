# Open Docs

A documentation website built with React, TypeScript, Bootstrap, and MDX, inspired by Docusaurus.

## Features

- 📝 MDX for content authoring
- 🎨 Material UI for styling
- 🧭 JSON-driven navigation (top bar and sidebar)
- 📱 Responsive design
- 🔍 Search functionality
- 🌙 Dark/Light mode toggle

## Project Structure

```
open-docs/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable UI components
│   ├── layouts/         # Page layout components
│   ├── pages/           # React components for each route
│   ├── content/         # MDX content files
│   ├── data/            # JSON configuration files
│   ├── theme/           # Material UI theme customization
│   ├── App.tsx          # Main application component
│   └── index.tsx        # Entry point
└── package.json         # Project dependencies and scripts
```

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

2. Start the development server:
   ```bash
   npm start
   # or
   yarn start
   ```

3. Build for production:
   ```bash
   npm run build
   # or
   yarn build
   ```

## Adding Content

1. Create new MDX files in the `src/content` directory
2. Update navigation in `src/data/navigation.json`
3. Add new routes in `src/App.tsx` if needed

## Customization

- Modify the theme in `src/theme/theme.ts`
- Update site metadata in `public/index.html`
- Customize components in the `src/components` directory 
