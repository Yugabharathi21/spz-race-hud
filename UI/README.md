# SPZ Race HUD - UI Component

This directory contains the front-end UI for the SPZ Race HUD FiveM resource. It's built with React, TypeScript, and Vite.

## Development Setup

### Prerequisites

- Node.js (v18+)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install
```

### Available Scripts

```bash
# Run in development mode with testing controls
npm run dev

# Run in production-like mode (no testing controls)
npm run dev:prod

# Build for production (no testing features)
npm run build

# Build with testing features enabled
npm run build:dev

# Lint the code
npm run lint

# Preview the production build
npm run preview
```

## Testing Environment

The UI includes a testing environment that makes development easier without needing to run FiveM.

### Features

- **Mock Data Generation**: Simulates vehicle data like speed, RPM, and gear
- **Visual Controls**: Sliders and inputs to manually adjust values
- **Auto-refresh**: Changes are immediately visible during development

### Toggling Test Mode

Test mode is controlled by environment variables:

- Development: `.env` file with `VITE_TESTING_ENVIRONMENT=true`
- Production: `.env.production` file with `VITE_TESTING_ENVIRONMENT=false`

## Project Structure

```
UI/
├── index.html            # Main HTML template
├── package.json          # NPM configuration and dependencies
├── tsconfig.json         # TypeScript configuration
├── vite.config.ts        # Vite configuration
├── .env                  # Development environment variables
├── .env.production       # Production environment variables
├── public/               # Static assets
└── src/
    ├── App.tsx           # Main React component
    ├── App.css           # Styles for the HUD
    ├── main.tsx          # Application entry point
    └── assets/           # Images, fonts, etc.
```

## Integration with FiveM

The UI communicates with FiveM using the NUI (Native UI) message system:

### Receiving Data

The UI listens for messages from the Lua script:

```typescript
window.addEventListener('message', handleMessage);
```

### Sending Data

The UI can send data back to Lua:

```typescript
fetch('https://spz-race-hud/uiLoaded', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json; charset=UTF-8',
  },
  body: JSON.stringify({})
});
```

## Building for Production

When ready to deploy:

1. Run `npm run build`
2. The output will be in the `dist/` directory
3. The FiveM resource automatically serves these files

## Customizing the UI

### Styling

The UI styling is in `App.css`. Key sections include:

- `.race-hud`: Main container - controls position and background
- `.speed-container`, `.speed-value`: Speed display styling
- `.rpm-bar`, `.rpm-fill`: RPM gauge styling
- `.gear-info`: Gear indicator styling

### Layout and Structure

The layout is defined in `App.tsx` in the return statement of the App component.

### Adding New Elements

To add new HUD elements:

1. Update the `VehicleData` interface to include new data fields
2. Add the data handling in the `handleMessage` function
3. Add new UI elements to the JSX in the return statement
4. Add CSS styles for the new elements

## Troubleshooting

### Common Issues

- **White Screen**: Check browser console for JavaScript errors
- **No Data**: Verify the Lua script is sending data properly
- **Style Issues**: Check for CSS conflicts or browser compatibility issues

## Contributing

When contributing to the UI:

1. Follow the existing code style
2. Test in both development and production modes
3. Ensure compatibility with different screen resolutions
