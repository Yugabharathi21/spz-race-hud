# SPZ Race HUD - Lua Script Documentation

This document details the client-side Lua script (`cl_main.lua`) that powers the SPZ Race HUD resource.

## Overview

The client script is responsible for:
1. Detecting when a player enters or exits a vehicle
2. Collecting vehicle data (speed, RPM, gear)
3. Sending this data to the UI component
4. Managing HUD visibility

## Key Functions

### Main Threads

#### Vehicle Detection Thread
```lua
Citizen.CreateThread(function()
    while true do
        local player = PlayerPedId()
        local isPlayerInVehicle = IsPedInAnyVehicle(player, false)
        
        -- Check if player entered or exited a vehicle
        if isPlayerInVehicle and not isInVehicle then
            -- Player entered vehicle logic
        elseif not isPlayerInVehicle and isInVehicle then
            -- Player exited vehicle logic
        end
        
        Citizen.Wait(500) -- Check every 500ms
    end
end)
```

This thread continuously checks if the player is in a vehicle and triggers appropriate events when they enter or exit.

#### Data Update Thread
```lua
Citizen.CreateThread(function()
    while true do
        if isInVehicle and displayActive and DoesEntityExist(currentVehicle) then
            UpdateVehicleData(currentVehicle)
        end
        Citizen.Wait(updateFrequency)
    end
end)
```

This thread updates vehicle data at regular intervals (defined by `updateFrequency`).

### Core Functions

#### ActivateDisplay()
Activates the HUD display and sends a message to the UI to show itself.

#### DeactivateDisplay()
Hides the HUD display and informs the UI to hide.

#### UpdateVehicleData(vehicle)
Collects and sends vehicle data to the UI:
- Speed in km/h and mph
- RPM
- Current gear
- Other vehicle data (optional)

## NUI Messaging

### Sending Data to UI
```lua
SendNUIMessage({
    action = "updateSpeed",
    data = {
        speed = speedKmh,
        speedMph = speedMph,
        rpm = rpm,
        gear = gear,
        nitrous = nitrous
    }
})
```

### Receiving Data from UI
```lua
RegisterNUICallback('uiLoaded', function(data, cb)
    -- UI is ready to receive data
    cb('ok')
end)
```

## Commands and Keybinds

### Toggle Command
```lua
RegisterCommand('racinghud', function()
    if displayActive then
        DeactivateDisplay()
    else
        ActivateDisplay()
    end
end, false)
```

This registers the `/racinghud` command to toggle the HUD.

### Keybind
```lua
RegisterKeyMapping('racinghud', 'Toggle Racing HUD', 'keyboard', 'F7')
```

This maps the F7 key to toggle the racing HUD.

## Configuration Options

At the top of the script:
```lua
-- Config
local updateFrequency = 200 -- milliseconds between updates
```

## Native Functions Reference

The script uses these FiveM native functions:

- **GetEntitySpeed(entity)**: Gets the entity speed in meters per second
- **GetVehicleCurrentRpm(vehicle)**: Gets the current RPM as a value from 0.0 to 1.0
- **GetVehicleCurrentGear(vehicle)**: Gets the current gear number
- **IsPedInAnyVehicle(ped, atGetIn)**: Checks if a ped is in any vehicle
- **GetVehiclePedIsIn(ped, lastVehicle)**: Gets the vehicle a ped is in

## Extending the Script

### Adding New Vehicle Data

To add new vehicle data (e.g., fuel level):

1. Add the data collection in `UpdateVehicleData()`:
```lua
-- Get fuel level (example)
local fuel = GetVehicleFuelLevel(vehicle)
```

2. Include it in the data sent to the UI:
```lua
SendNUIMessage({
    action = "updateSpeed",
    data = {
        -- Existing data...
        fuel = fuel
    }
})
```

3. Update the UI to display the new data (in `App.tsx`).

### Adding New Commands

To add a new command, use the `RegisterCommand` function:

```lua
RegisterCommand('hidehud', function()
    DeactivateDisplay()
end, false)
```

### Performance Optimization

For better performance, consider:

- Increasing the wait times in threads for less resource usage
- Using distance checks to reduce unnecessary processing
- Caching values that don't change frequently

## Troubleshooting

### Common Issues

- **HUD Not Appearing**: Check if the UI is loaded properly and events are firing
- **Flickering**: Check thread timing or reduce update frequency
- **High Resource Usage**: Increase the wait times in threads
