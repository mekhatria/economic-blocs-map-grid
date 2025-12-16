import './App.css';
import { useMemo, useState } from 'react';
import BlocDropdown from './components/BlocDropdown';
import BlocInfo from './components/BlocInfo';
import MapChart from './components/MapChart';
import { economicBlocs } from './economicBlocs';
import { useMapData } from './hooks/useMapData';
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
    if (!selectedBloc) return [];

    return economicBlocs[selectedBloc].countries.map((code) => ({
      'hc-key': code.toLowerCase(),
      value: 1
    }));
  }, [selectedBloc]);

  return (
    <div className="App" style={{ backgroundColor: '#000000', minHeight: '100vh', padding: '20px' }}>
      <h1 style={{ color: 'white', margin: '20px 0' }}>Economic Blocs Map</h1>

      <BlocDropdown options={blocOptions} selectedBloc={selectedBloc} onSelectBloc={setSelectedBloc} />

      <BlocInfo blocKey={selectedBloc} bloc={selectedBloc ? economicBlocs[selectedBloc] : null} />

      <MapChart mapData={mapData} seriesData={seriesData} />
    </div>
  );
}

export default App;
