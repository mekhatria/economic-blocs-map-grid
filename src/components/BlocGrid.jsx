import { useMemo, useState } from 'react';

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'gdp', label: 'GDP' },
  { key: 'population', label: 'Population' },
  { key: 'founded', label: 'Founded' },
  { key: 'members', label: 'Members' }
];

function BlocGrid({ blocs, selectedBloc, onSelectBloc }) {
  const [sortKey, setSortKey] = useState('name');
  const [sortDir, setSortDir] = useState('asc');

  const entries = useMemo(() => {
    const rows = Object.entries(blocs).map(([key, bloc]) => ({
      key,
      name: bloc.name,
      members: bloc.countries.length,
      founded: bloc.founded,
      gdp: bloc.gdp,
      population: bloc.population
    }));

    rows.sort((a, b) => {
      const dir = sortDir === 'asc' ? 1 : -1;
      const aValue = a[sortKey];
      const bValue = b[sortKey];
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return (aValue - bValue) * dir;
      }
      return String(aValue).localeCompare(String(bValue)) * dir;
    });

    return rows;
  }, [blocs, sortKey, sortDir]);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
      return;
    }
    setSortKey(key);
    setSortDir('asc');
  };

  return (
    <section className="bloc-grid-section">
      <div className="bloc-grid-header">
        <h2>All Economic Blocs</h2>
        <p>Click a bloc to highlight its members on the map.</p>
      </div>
      <div className="bloc-table" role="table" aria-label="Economic bloc details">
        <div className="bloc-row bloc-row--header" role="row">
          {columns.map((column) => {
            const isActive = sortKey === column.key;
            const indicator = isActive ? (sortDir === 'asc' ? '▲' : '▼') : '↕';
            return (
              <button
                key={column.key}
                type="button"
                className={`bloc-header-button${isActive ? ' is-active' : ''}`}
                onClick={() => handleSort(column.key)}
                role="columnheader"
                aria-sort={
                  isActive ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'
                }
              >
                <span>{column.label}</span>
                <span className="bloc-header-indicator" aria-hidden="true">
                  {indicator}
                </span>
              </button>
            );
          })}
        </div>
        {entries.map((row) => {
          const isActive = row.key === selectedBloc;
          return (
            <button
              key={row.key}
              type="button"
              className={`bloc-row bloc-row--data${isActive ? ' bloc-row--active' : ''}`}
              onClick={() => onSelectBloc(row.key)}
              aria-pressed={isActive}
              role="row"
            >
              <div role="cell" data-label="Name">
                {row.name}
              </div>
              <div role="cell" data-label="GDP">
                {row.gdp}
              </div>
              <div role="cell" data-label="Population">
                {row.population}
              </div>
              <div role="cell" data-label="Founded">
                {row.founded}
              </div>
              <div role="cell" data-label="Members">
                {row.members}
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default BlocGrid;
