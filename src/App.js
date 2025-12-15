// Import the default CSS styling for the app
import './App.css';

// Import React hooks - useState manages component state, useEffect handles side effects like data fetching
import { useState, useEffect, useRef, useMemo } from 'react';

// Import Highcharts core and map module, then register with the new React wrapper
import Highcharts from 'highcharts';
import mapModule from 'highcharts/modules/map.js';
import { Chart, setHighcharts } from '@highcharts/react';

// Local world topojson as a fallback/default
import worldMap from '@highcharts/map-collection/custom/world.topo.json';

// Import our economic blocs data
import { economicBlocs } from './economicBlocs';

import StatCard from './components/StatCard';

// Initialize the map module on the Highcharts instance (module export can vary)
const mapFactory = mapModule && (mapModule.default || mapModule);
if (typeof mapFactory === 'function') {
  mapFactory(Highcharts);
}
// Register Highcharts instance for the React wrapper (needed for maps/constructorType)
setHighcharts(Highcharts);

function App() {
  // useState creates a state variable 'mapData' and a function 'setMapData' to update it
  // Seed with local topojson so the map renders even if the CDN is blocked
  const [mapData, setMapData] = useState(worldMap);
  
  // State to track which bloc is selected - starts with null (none selected)
  const [selectedBloc, setSelectedBloc] = useState(null);
  
  // State to track if dropdown is open
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Ref to detect clicks outside dropdown
  const dropdownRef = useRef(null);

  // useEffect runs after the component renders
  // The empty array [] means it only runs once when component first mounts
  useEffect(() => {
    // Fetch the world map topology data from Highcharts CDN (best-effort)
    fetch('https://code.highcharts.com/mapdata/custom/world.topo.json')
      .then(response => response.json()) // Convert response to JSON
      .then(data => setMapData(data)) // Store the map data in state
      .catch(() => {
        // Keep fallback mapData if fetch fails
        setMapData(worldMap);
      });
  }, []); // Empty dependency array = run only once
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Handle selecting a bloc
  const handleSelectBloc = (key) => {
    setSelectedBloc(key);
    setIsDropdownOpen(false);
  };
  
  // Get sorted bloc entries
  const sortedBlocs = Object.keys(economicBlocs)
    .sort((a, b) => economicBlocs[a].name.localeCompare(economicBlocs[b].name));

  // Series data memoized so Highcharts doesn't receive a new array on every render
  const seriesData = useMemo(() => {
    if (!selectedBloc) return [];
    return economicBlocs[selectedBloc].countries.map(code => ({
      'hc-key': code.toLowerCase(),
      value: 1
    }));
  }, [selectedBloc]);

  // Configuration object for Highcharts map; memoized to reduce unnecessary re-renders
  const mapOptions = useMemo(() => ({
    chart: {
      map: mapData, // Assign the fetched map topology data
      backgroundColor: '#1a1a1a'
    },
    title: {
      text: '', // Remove duplicate title
      style: {
        color: 'white'
      }
    },
    tooltip: {
      formatter: function() {
        return this.point.name;
      },
      backgroundColor: '#1a1a1a',
      borderColor: '#00bcd4',
      style: {
        color: 'white'
      }
    },
    colorAxis: {
      min: 0,
      max: 1,
      stops: [
        [0, '#2a2a2a'], // Dark gray for non-selected countries
        [1, '#ff6b6b']  // Red/coral for selected countries
      ],
      visible: false // Hide the color axis legend
    },
    series: [{
      type: 'map', // Explicit map series for the new wrapper
      mapData, // Attach map topology here (in addition to chart.map)
      name: 'Countries', // Series name (shows in tooltip/legend)
      data: seriesData, // Memoized array of countries in the selected bloc
      joinBy: 'hc-key', // Match data to map using ISO country codes
      nullColor: '#2a2a2a', // Dark gray for countries not in selected bloc
      borderColor: '#555555', // Medium gray border color
      borderWidth: 1 // Border thickness in pixels
    }]
  }), [mapData, seriesData]);

  // If map data hasn't loaded yet, show loading message
  if (!mapData) return <div style={{ color: 'white', backgroundColor: '#000000', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading map...</div>;

  // Render the app once map data is loaded
  return (
    <div className="App" style={{ backgroundColor: '#000000', minHeight: '100vh', padding: '20px' }}>
      <h1 style={{ color: 'white', margin: '20px 0' }}>Economic Blocs Map</h1>
      
      {/* Custom Dropdown */}
      <div ref={dropdownRef} style={{ position: 'relative', width: '400px', margin: '20px auto' }}>
        {/* Dropdown button */}
        <div
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          style={{
            width: '100%',
            padding: '12px 16px',
            fontSize: '16px',
            cursor: 'pointer',
            border: '2px solid #00bcd4',
            borderRadius: '8px',
            backgroundColor: '#1a1a1a',
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: isDropdownOpen ? '0 0 10px rgba(0, 188, 212, 0.5)' : 'none'
          }}
        >
          <span>{selectedBloc ? economicBlocs[selectedBloc].name : '- None -'}</span>
          <span style={{ marginLeft: '10px' }}>{isDropdownOpen ? '▲' : '▼'}</span>
        </div>
        
        {/* Dropdown list */}
        {isDropdownOpen && (
          <div style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            maxHeight: '300px',
            overflowY: 'auto',
            backgroundColor: '#1a1a1a',
            border: '2px solid #00bcd4',
            borderTop: 'none',
            borderRadius: '0 0 8px 8px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
            zIndex: 1000
          }}>
            <div
              onClick={() => handleSelectBloc(null)}
              style={{
                padding: '12px 16px',
                cursor: 'pointer',
                fontSize: '16px',
                color: 'white',
                backgroundColor: !selectedBloc ? '#2a2a2a' : '#1a1a1a',
                borderBottom: '1px solid #333'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#2a2a2a'}
              onMouseLeave={(e) => e.target.style.backgroundColor = !selectedBloc ? '#2a2a2a' : '#1a1a1a'}
            >
              - None -
            </div>
            {sortedBlocs.map(key => (
              <div
                key={key}
                onClick={() => handleSelectBloc(key)}
                style={{
                  padding: '12px 16px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  color: 'white',
                  backgroundColor: selectedBloc === key ? '#2a2a2a' : '#1a1a1a',
                  borderBottom: '1px solid #333'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#2a2a2a'}
                onMouseLeave={(e) => e.target.style.backgroundColor = selectedBloc === key ? '#2a2a2a' : '#1a1a1a'}
              >
                {economicBlocs[key].name}
              </div>
            ))}
          </div>
        )}
      </div>
    {/* UPDATED: Display bloc info using StatCard components */}
    {selectedBloc && (
        <div style={{ margin: '20px auto', padding: '20px', maxWidth: '800px', backgroundColor: '#1a1a1a', color: 'white', borderRadius: '8px' }}>
          <h2 style={{ margin: '0 0 20px 0', fontSize: '28px' }}>{economicBlocs[selectedBloc].name}</h2>
          
          {/* Grid container for the 4 StatCards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0' }}>
            
            {/* Using StatCard component instead of manual divs */}
            <StatCard 
              label="GDP" 
              value={economicBlocs[selectedBloc].gdp}
              showBorder={true}
            />
            
            <StatCard 
              label="Population" 
              value={economicBlocs[selectedBloc].population}
              showBorder={true}
            />
            
            <StatCard 
              label="Founded" 
              value={economicBlocs[selectedBloc].founded}
              showBorder={true}
            />
            
            <StatCard 
              label="Members" 
              value={economicBlocs[selectedBloc].countries.length}
              showBorder={false}  // Last card has no border
            />
            
          </div>
        </div>
      )}

      <div style={{ maxWidth: '800px', margin: '20px auto', padding: '0 20px' }}>
        <Chart
          constructorType={'mapChart'} // Tell it to create a map, not a regular chart
          options={mapOptions} // Pass our configuration
        />
      </div>
    </div>
  );
}

export default App;
