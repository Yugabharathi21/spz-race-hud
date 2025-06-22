# SPZ Race HUD

A customizable racing heads-up display resource for FiveM that shows vehicle speed, RPM, gear, and other information.

![SPZ Race HUD](https://via.placeholder.com/800x400?text=SPZ+Race+HUD)

## Features

- **Real-time Speed Display**: Shows speed in both KM/H and MPH
- **RPM Visualization**: Visual RPM gauge that changes color as RPM increases
- **Gear Indicator**: Shows the current gear of the vehicle
- **Automatic Activation**: Automatically appears when entering a vehicle
- **Toggleable**: Can be toggled on/off with a keybind or command
- **Modern UI**: Sleek, customizable interface built with React and Vite
- **Development Mode**: Built-in testing environment for UI development

## Installation

### Requirements
- FiveM Server
- Basic knowledge of FiveM resource structure

### Step 1: Clone or Download
```bash
git clone https://github.com/Yugabharathi21/spz-race-hud.git
```
Or download as ZIP and extract to your resources folder.

### Step 2: Install Dependencies and Build UI
```bash
cd spz-race-hud/UI
npm install
npm run build
```

### Step 3: Add to server.cfg
```
ensure spz-race-hud
```

## Usage

### In-Game Controls
- **Automatic**: The HUD appears automatically when entering a vehicle
- **Toggle HUD**: Press F7 (default key) or use command `/racinghud`
- **Check Speed**: Type `/speed` in chat to display current speed

### Configuration

The HUD behavior can be modified in `client/cl_main.lua`:

```lua
-- Config
local updateFrequency = 200 -- milliseconds between updates
```

### Customizing the UI

The UI is built with React and can be customized in the `UI/src` directory:

1. Modify styles in `App.css`
2. Change UI components in `App.tsx`
3. Rebuild with `npm run build`

## Development

### Testing Environment

This resource includes a testing environment that allows you to develop and preview the UI without launching FiveM.

#### Development Mode (with testing tools)
```bash
cd UI
npm run dev
```
This will start a local development server with mock data and testing controls.

#### Production-like Mode
```bash
cd UI
npm run dev:prod
```
This will start a local server simulating the production environment.

### Environment Variables

The project uses environment variables to control the testing environment:

- `.env` - Used during development (`VITE_TESTING_ENVIRONMENT=true`)
- `.env.production` - Used in production (`VITE_TESTING_ENVIRONMENT=false`)

You can change these values to toggle testing features.

## Project Structure

```
spz-race-hud/
├── fxmanifest.lua          # FiveM resource manifest
├── client/
│   └── cl_main.lua         # Client-side Lua script
├── server/                 # Server-side scripts (if needed)
└── UI/
    ├── index.html          # Entry HTML file
    ├── package.json        # NPM dependencies
    ├── vite.config.ts      # Vite configuration
    ├── .env                # Development environment variables
    ├── .env.production     # Production environment variables
    └── src/
        ├── App.tsx         # Main React component
        ├── App.css         # Styles for the HUD
        ├── main.tsx        # React entry point
        └── assets/         # Images and other assets
```

## Customization Guide

### Changing the Position
To move the HUD position, edit the CSS in `UI/src/App.css`:

```css
.race-hud {
  position: absolute;
  bottom: 10vh;  /* Change this to move vertically */
  right: 2vw;    /* Change this to move horizontally */
  /* ... */
}
```

### Changing the Colors
To modify the color scheme, edit the CSS variables in `UI/src/App.css`:

```css
.rpm-fill {
  background: linear-gradient(90deg, #2ecc71, #f1c40f, #e74c3c);
  /* Change the colors above for different RPM colors */
}
```

### Adding Additional Features
To add new HUD elements:

1. Modify the `VehicleData` interface in `App.tsx`
2. Add new data gathering in `cl_main.lua`
3. Update the UI component to display the new data
4. Style the new elements in `App.css`

## Troubleshooting

### HUD Not Showing
- Ensure the resource is started (`ensure spz-race-hud` in server.cfg)
- Check the client console for errors (`F8` in-game)
- Verify the UI is built correctly (`npm run build` in the UI folder)

### UI Development Issues
- Check the browser console for JavaScript errors
- Make sure all dependencies are installed (`npm install`)
- Verify environment variables are set correctly

## License

[MIT License](LICENSE)

## Credits

Developed by S P i c e Z [ 🧊 ]

## Support

For issues, questions, or feature requests, please [open an issue](https://github.com/Yugabharathi21/spz-race-hud/issues) on GitHub.
