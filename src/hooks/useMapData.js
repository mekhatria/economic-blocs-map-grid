import { useEffect, useState } from 'react';
import { worldMap } from '../lib/highchartsSetup';

// Fetches world map data with a baked-in fallback so the map always renders
export function useMapData() {
  const [mapData, setMapData] = useState(worldMap);

  useEffect(() => {
    let isMounted = true;

    fetch('https://code.highcharts.com/mapdata/custom/world.topo.json')
      .then((response) => response.json())
      .then((data) => {
        if (isMounted) {
          setMapData(data);
        }
      })
      .catch(() => {
        if (isMounted) {
          setMapData(worldMap);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return { mapData };
}
