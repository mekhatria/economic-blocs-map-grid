import Highcharts from 'highcharts';
import mapModule from 'highcharts/modules/map.js';
import { setHighcharts } from '@highcharts/react';
import worldMap from '@highcharts/map-collection/custom/world.topo.json';

// Register the bundled world map so Highcharts can render immediately
const mapKey = 'custom/world';
Highcharts.maps = Highcharts.maps || {};
Highcharts.maps[mapKey] = worldMap;

// Initialize the map module on the Highcharts instance
const mapFactory = mapModule && (mapModule.default || mapModule);
if (typeof mapFactory === 'function') {
  mapFactory(Highcharts);
}

// Attach Highcharts to the React wrapper (needed for maps)
setHighcharts(Highcharts);

export { Highcharts, mapKey, worldMap };
