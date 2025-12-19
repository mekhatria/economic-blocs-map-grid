import { MapsChart } from '@highcharts/react/Maps';
import { MapSeries } from '@highcharts/react/series/Map';

const mapOptions = {
    chart: {
        backgroundColor: '#1a1a1a',
        animation: false
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
    return (
        <div style={{ maxWidth: '800px', margin: '20px auto', padding: '0 20px' }}>
            <MapsChart chartConstructor="mapChart" options={mapOptions}>
                <MapSeries options={{
                    mapData,
                    name: 'Countries',
                    data: seriesData,
                    joinBy: 'hc-key',
                    nullColor: '#2a2a2a',
                    borderColor: '#555555',
                    borderWidth: 1
                }} />
            </MapsChart>
        </div>
    );
}

export default MapChart;