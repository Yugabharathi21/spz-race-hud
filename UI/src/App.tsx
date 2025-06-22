import { useState, useEffect } from 'react'
import './App.css'

// Check if we're in testing/development environment
const isTestingEnvironment = import.meta.env.VITE_TESTING_ENVIRONMENT === 'true';

interface VehicleData {
  speed: number;
  speedMph: number;
  rpm: number;
  gear: number;
  nitrous: number;
}

function App() {
  const [displayHud, setDisplayHud] = useState(false);
  const [vehicleData, setVehicleData] = useState<VehicleData>({
    speed: 0,
    speedMph: 0,
    rpm: 0,
    gear: 0,
    nitrous: 0
  });

  useEffect(() => {
    // This function handles messages from the Lua script
    function handleMessage(event: MessageEvent) {
      const data = event.data;
      
      if (!data || !data.action) return;
      
      switch (data.action) {
        case 'toggleDisplay':
          setDisplayHud(data.show);
          break;
        case 'updateSpeed':
          setVehicleData(data.data);
          break;
        default:
          break;
      }
    }
    
    // Test environment setup with mock data
    if (isTestingEnvironment) {
      // Force display to be visible in test environment
      setDisplayHud(true);
      
      // Create mock data that changes over time for testing
      const mockDataInterval = setInterval(() => {
        // Generate random but realistic values
        const mockSpeed = Math.floor(Math.random() * 200);
        const mockRpm = Math.min(0.1 + Math.random() * 0.9, 1); // Between 0.1 and 1.0
        const mockGear = Math.floor(Math.random() * 6) + 1; // Gears 1-6
        
        setVehicleData({
          speed: mockSpeed,
          speedMph: Math.floor(mockSpeed * 0.621371),
          rpm: mockRpm,
          gear: mockGear,
          nitrous: Math.random() // 0-1 value
        });
      }, 1000); // Update every second
      
      return () => {
        clearInterval(mockDataInterval);
      };
    } else {
      // Normal FiveM environment
      // Listen for messages from the NUI
      window.addEventListener('message', handleMessage);
      
      // Send a message to the Lua script that the UI is loaded
      fetch('https://spz-race-hud/uiLoaded', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify({})
      }).catch(err => {
        // Silently fail in testing environments
        console.log('Error sending uiLoaded event', err);
      });
      
      return () => {
        window.removeEventListener('message', handleMessage);
      };
    }
  }, []);

  // If HUD is not visible and not in testing mode, don't render anything
  if (!displayHud && !isTestingEnvironment) return null;

  return (
    <>
      <div className="race-hud">
        <div className="speed-container">
          <div className="speed-value">{vehicleData.speed}</div>
          <div className="speed-unit">KM/H</div>
        </div>
        
        <div className="additional-info">
          <div className="gear-info">
            <div className="gear-label">GEAR</div>
            <div className="gear-value">{vehicleData.gear}</div>
          </div>
          
          <div className="rpm-bar">
            <div 
              className="rpm-fill" 
              style={{ width: `${vehicleData.rpm * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Testing Controls - Only visible in testing environment */}
      {isTestingEnvironment && (
        <div className="testing-controls">
          <h3>Testing Controls</h3>
          <div className="control-group">
            <label>
              Speed (KM/H):
              <input 
                type="range" 
                min="0" 
                max="350" 
                value={vehicleData.speed} 
                onChange={(e) => setVehicleData({
                  ...vehicleData,
                  speed: Number(e.target.value),
                  speedMph: Math.floor(Number(e.target.value) * 0.621371)
                })}
              />
              {vehicleData.speed} km/h ({vehicleData.speedMph} mph)
            </label>
          </div>
          <div className="control-group">
            <label>
              RPM:
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={vehicleData.rpm * 100} 
                onChange={(e) => setVehicleData({
                  ...vehicleData,
                  rpm: Number(e.target.value) / 100
                })}
              />
              {Math.floor(vehicleData.rpm * 100)}%
            </label>
          </div>
          <div className="control-group">
            <label>
              Gear:
              <select 
                value={vehicleData.gear} 
                onChange={(e) => setVehicleData({
                  ...vehicleData, 
                  gear: Number(e.target.value)
                })}
              >
                {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((g) => (
                  <option key={g} value={g}>{g === 0 ? 'R' : g}</option>
                ))}
              </select>
            </label>
          </div>
        </div>
      )}
    </>
  )
}

export default App
