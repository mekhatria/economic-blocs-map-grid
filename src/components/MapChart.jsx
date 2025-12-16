import { useMemo } from 'react';
import { Chart } from '@highcharts/react';
import { mapKey } from '../lib/highchartsSetup';

function MapChart({ mapData, seriesData }) {
  const mapOptions = useMemo(
    () => ({
      chart: {
        map: mapData || mapKey,
        backgroundColor: '#1a1a1a'
      },
      title: {
        text: '',
        style: { color: 'white' }
      },
      tooltip: {
        formatter: function formatter() {
          return this.point.name;
        },
        backgroundColor: '#1a1a1a',
        borderColor: '#00bcd4',
        style: { color: 'white' }
      },
      colorAxis: {
        min: 0,
        max: 1,
        stops: [
          [0, '#2a2a2a'],
          [1, '#ff6b6b']
        ],
        visible: false
      },
      series: [
        {
          type: 'map',
          mapData,
          name: 'Countries',
          data: seriesData,
          joinBy: 'hc-key',
          nullColor: '#2a2a2a',
          borderColor: '#555555',
          borderWidth: 1
        }
      ]
    }),
    [mapData, seriesData]
  );

  return (
    <div style={{ maxWidth: '800px', margin: '20px auto', padding: '0 20px' }}>
      <Chart chartConstructor="mapChart" options={mapOptions} />
    </div>
  );
}

export default MapChart;
