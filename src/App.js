import './App.css';
import { useMemo, useState } from 'react';
import BlocDropdown from './components/BlocDropdown';
import BlocInfo from './components/BlocInfo';
import BlocGrid from './components/BlocGrid';
import MapChart from './components/MapChart';
import { economicBlocs } from './economicBlocs';
import { useMapData } from './hooks/useMapData';
import { Highcharts } from './lib/highchartsSetup';
import './lib/highchartsSetup';

function App() {
  const { mapData } = useMapData();
  const [selectedBloc, setSelectedBloc] = useState(null);

  const blocOptions = useMemo(
    () =>
      Object.keys(economicBlocs)
        .map((key) => ({ key, name: economicBlocs[key].name }))
        .sort((a, b) => a.name.localeCompare(b.name)),
    []
  );

  const seriesData = useMemo(() => {
    if (!mapData) return [];

    const geojson = Highcharts.geojson(mapData);
    const selectedSet = new Set(
      selectedBloc ? economicBlocs[selectedBloc].countries.map((code) => code.toLowerCase()) : []
    );

    return geojson.map((feature) => {
      const key =
        (feature.properties && (feature.properties['hc-key'] || feature.properties['iso-a2'])) || '';
      const normalizedKey = key.toLowerCase();

      return {
        'hc-key': normalizedKey,
        value: selectedSet.has(normalizedKey) ? 1 : 0
      };
    });
  }, [mapData, selectedBloc]);

  return (
    <div
      className="App"
      style={{
        backgroundColor: '#000000',
        minHeight: '100vh',
        padding: '16px 12px',
        width: '100%',
        maxWidth: '960px',
        margin: '0 auto',
        boxSizing: 'border-box',
        overflowX: 'hidden'
      }}
    >
      <h1 style={{ color: 'white', margin: '12px 0 16px' }}>Economic Blocs Map</h1>

      <BlocDropdown options={blocOptions} selectedBloc={selectedBloc} onSelectBloc={setSelectedBloc} />

      <BlocInfo blocKey={selectedBloc} bloc={selectedBloc ? economicBlocs[selectedBloc] : null} />

      <MapChart mapData={mapData} seriesData={seriesData} />

      <BlocGrid blocs={economicBlocs} selectedBloc={selectedBloc} onSelectBloc={setSelectedBloc} />
    </div>
  );
}

export default App;
