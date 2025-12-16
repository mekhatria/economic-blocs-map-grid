import StatCard from './StatCard';

function BlocInfo({ blocKey, bloc }) {
  if (!blocKey || !bloc) return null;

  return (
    <div
      style={{
        margin: '20px auto',
        padding: '20px',
        maxWidth: '800px',
        backgroundColor: '#1a1a1a',
        color: 'white',
        borderRadius: '8px'
      }}
    >
      <h2 style={{ margin: '0 0 20px 0', fontSize: '28px' }}>{bloc.name}</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0' }}>
        <StatCard label="GDP" value={bloc.gdp} showBorder={true} />
        <StatCard label="Population" value={bloc.population} showBorder={true} />
        <StatCard label="Founded" value={bloc.founded} showBorder={true} />
        <StatCard label="Members" value={bloc.countries.length} showBorder={false} />
      </div>
    </div>
  );
}

export default BlocInfo;
