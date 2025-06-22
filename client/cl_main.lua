-- cl_main.lua - Client-side script for SPZ Race HUD
-- This script gets vehicle speed and sends it to the UI

-- Variables
local isInVehicle = false
local currentVehicle = 0
local displayActive = false

-- Config
local updateFrequency = 200 -- milliseconds between updates

-- Main thread to check if player is in a vehicle
Citizen.CreateThread(function()
    while true do
        local player = PlayerPedId()
        local isPlayerInVehicle = IsPedInAnyVehicle(player, false)
        
        if isPlayerInVehicle and not isInVehicle then
            -- Player just entered a vehicle
            isInVehicle = true
            currentVehicle = GetVehiclePedIsIn(player, false)
            ActivateDisplay()
        elseif not isPlayerInVehicle and isInVehicle then
            -- Player just exited a vehicle
            isInVehicle = false
            DeactivateDisplay()
        end
        
        Citizen.Wait(500) -- Check every 500ms
    end
end)

-- Thread to update the vehicle data
Citizen.CreateThread(function()
    while true do
        if isInVehicle and displayActive and DoesEntityExist(currentVehicle) then
            UpdateVehicleData(currentVehicle)
        end
        Citizen.Wait(updateFrequency)
    end
end)

-- Function to activate the display
function ActivateDisplay()
    displayActive = true
    SendNUIMessage({
        action = "toggleDisplay",
        show = true
    })
end

-- Function to deactivate the display
function DeactivateDisplay()
    displayActive = false
    SendNUIMessage({
        action = "toggleDisplay",
        show = false
    })
end

-- Function to update vehicle data
function UpdateVehicleData(vehicle)
    -- Get speed in meters per second
    local speedVector = GetEntitySpeed(vehicle)
    
    -- Convert to kilometers per hour (multiply by 3.6)
    local speedKmh = math.floor(speedVector * 3.6)
    
    -- Convert to miles per hour (multiply by 2.236936)
    local speedMph = math.floor(speedVector * 2.236936)
    
    -- Get RPM
    local rpm = GetVehicleCurrentRpm(vehicle)
    
    -- Get gear
    local gear = GetVehicleCurrentGear(vehicle)
    
    -- Get nitrous level (if you're using a nitrous script)
    -- This is just a placeholder, you'd need to implement this according to your nitrous script
    local nitrous = 0
    
    -- Send data to NUI
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
end

-- Register NUI callback for when the UI is loaded
RegisterNUICallback('uiLoaded', function(data, cb)
    -- UI is ready to receive data
    cb('ok')
end)

-- Optional: Add command to toggle the HUD
RegisterCommand('racinghud', function()
    if displayActive then
        DeactivateDisplay()
    else
        ActivateDisplay()
    end
end, false)

-- Optional: Add keybind to toggle the HUD
RegisterKeyMapping('racinghud', 'Toggle Racing HUD', 'keyboard', 'F7')

-- Debug command to show speed in chat
RegisterCommand('speed', function()
    local player = PlayerPedId()
    if IsPedInAnyVehicle(player, false) then
        local vehicle = GetVehiclePedIsIn(player, false)
        local speed = GetEntitySpeed(vehicle)
        local speedKmh = math.floor(speed * 3.6)
        TriggerEvent('chat:addMessage', {
            args = {'^2Speed', speedKmh .. ' km/h'}
        })
    else
        TriggerEvent('chat:addMessage', {
            args = {'^1Error', 'You are not in a vehicle!'}
        })
    end
end, false)
