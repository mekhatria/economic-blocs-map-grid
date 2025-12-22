import { useEffect, useRef } from 'react';
import { MapsChart } from '@highcharts/react/Maps';
import { MapSeries } from '@highcharts/react/series/Map';

const mapOptions = {
  chart: {
    backgroundColor: '#1a1a1a',
    animation: false // avoid full chart reflow animation
  },
  plotOptions: {
    series: { animation: { duration: 800 } }
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
  }
};

function MapChart({ mapData, seriesData }) {
  const chartRef = useRef(null);
  const initializedRef = useRef(false);

  // Ensure mapData updates propagate to the series
  useEffect(() => {
    const chart = chartRef.current?.chart;
    const series = chart?.get('bloc-series');
    if (!series || !mapData) return;
    series.update({ mapData }, false);
    chart.redraw();
  }, [mapData]);

  // Drive point updates manually to animate color changes
  useEffect(() => {
    const chart = chartRef.current?.chart;
    const series = chart?.get('bloc-series');
    if (!series || !seriesData || seriesData.length === 0) return;

    if (!initializedRef.current) {
      // Initial render: set data without animation
      series.setData(seriesData, true, { duration: 0 });
      initializedRef.current = true;
      return;
    }

    // Map values by hc-key for quick lookup
    const valueByKey = new Map(seriesData.map((point) => [point['hc-key'], point.value]));

    // Update each point with animation; redraw on the last one
    series.points.forEach((point, idx, arr) => {
      const nextValue = valueByKey.get(point['hc-key']) ?? 0;
      const isLast = idx === arr.length - 1;
      point.update({ value: nextValue }, isLast, { duration: 900 });
    });
  }, [seriesData]);

  return (
    <div style={{ maxWidth: '800px', width: '100%', margin: '20px auto', padding: '0', boxSizing: 'border-box' }}>
      <MapsChart
        chartConstructor="mapChart"
        options={mapOptions}
        oneToOne
        ref={chartRef}
      >
        <MapSeries
          id="bloc-series" // keep same series identity
          options={{
            mapData,
            name: 'Countries',
            data: [], // start empty; setData will populate with animation
            joinBy: 'hc-key',
            nullColor: '#2a2a2a',
            borderColor: '#555555',
            borderWidth: 1
          }}
        />
      </MapsChart>
    </div>
  );
}

export default MapChart;
