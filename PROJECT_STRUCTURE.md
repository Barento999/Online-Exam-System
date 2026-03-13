# Project Structure

This project follows standard React conventions with a clean, organized folder structure.

## Directory Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components (buttons, cards, dialogs, etc.)
│   ├── layout/         # Layout components (Navbar, Sidebar, Layout)
│   ├── common/         # Common components (ConfirmDialog, Loader)
│   └── figma/          # Figma-specific components
├── pages/              # Page components (one per route)
├── context/            # React Context providers (AuthContext)
├── routes/             # Route configuration and protection
├── services/           # API services and external integrations
├── hooks/              # Custom React hooks
├── lib/                # Library configurations and utilities
├── utils/              # Utility functions
├── styles/             # Global styles and themes
├── App.jsx             # Main App component
├── main.jsx            # Application entry point
└── routes.jsx          # Route definitions
```

## Import Aliases

The project uses the `@` alias for cleaner imports:

```javascript
// Instead of: import { Button } from '../../../components/ui/button'
import { Button } from "@/components/ui/button";

// Instead of: import { useAuth } from '../../context/AuthContext'
import { useAuth } from "@/context/AuthContext";
```

## Key Folders

- **components/ui**: All shadcn/ui components with consistent styling
- **components/layout**: Navbar, Sidebar, and Layout wrapper components
- **components/common**: Shared components like dialogs and loaders
- **pages**: Each file represents a route in the application
- **context**: React Context for global state (authentication, theme, etc.)
- **services**: API calls and external service integrations
- **lib**: Utility functions like `cn()` for className merging

## Configuration

- Path aliases are configured in `vite.config.js`
- All imports use the `@` alias pointing to the `src` directory
