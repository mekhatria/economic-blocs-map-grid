import { useEffect, useMemo, useRef } from 'react';
import * as Grid from '@highcharts/grid-lite';

function BlocGrid({ blocs, selectedBloc, onSelectBloc }) {
  const gridContainerRef = useRef(null);
  const gridRef = useRef(null);
  const gridRows = useMemo(
    () =>
      Object.entries(blocs).map(([key, bloc]) => ({
        key,
        name: bloc.name,
        members: bloc.countries.length,
        founded: bloc.founded,
        gdp: bloc.gdp,
        population: bloc.population
      })),
    [blocs]
  );

  const dataColumns = useMemo(
    () => ({
      key: gridRows.map((row) => row.key),
      name: gridRows.map((row) => row.name),
      gdp: gridRows.map((row) => row.gdp),
      population: gridRows.map((row) => row.population),
      founded: gridRows.map((row) => row.founded),
      members: gridRows.map((row) => row.members)
    }),
    [gridRows]
  );

  useEffect(() => {
    const container = gridContainerRef.current;
    if (!container) return;

    if (gridRef.current?.destroy) {
      gridRef.current.destroy();
      gridRef.current = null;
    }

    gridRef.current = Grid.grid(container, {
      dataTable: { columns: dataColumns },
      columns: [
        {
          id: 'name',
          header: { format: 'Name' },
          sorting: { sortable: true },
          filtering: { enabled: true, inline: false }
        },
        {
          id: 'gdp',
          header: { format: 'GDP' },
          sorting: { sortable: true },
          filtering: { enabled: true, inline: false }
        },
        {
          id: 'population',
          header: { format: 'Population' },
          sorting: { sortable: true },
          filtering: { enabled: true, inline: false }
        },
        {
          id: 'founded',
          header: { format: 'Founded' },
          sorting: { sortable: true },
          filtering: { enabled: true, inline: false }
        },
        {
          id: 'members',
          header: { format: 'Members' },
          sorting: { sortable: true },
          filtering: { enabled: true, inline: false }
        },
        {
          id: 'key',
          enabled: false
        }
      ]
    });

    const handleRowClick = (event) => {
      const rowEl = event.target.closest('[data-row-index]');
      if (!rowEl) return;
      const rowIndex = Number(rowEl.getAttribute('data-row-index'));
      if (Number.isNaN(rowIndex)) return;
      const row = gridRef.current?.presentationTable?.getRowObject(rowIndex);
      if (row?.key) onSelectBloc(row.key);
    };

    container.addEventListener('click', handleRowClick);

    return () => {
      container.removeEventListener('click', handleRowClick);
      if (gridRef.current?.destroy) {
        gridRef.current.destroy();
        gridRef.current = null;
      }
    };
  }, [dataColumns, gridRows, onSelectBloc]);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const rowIndex =
      selectedBloc && grid.presentationTable?.getRowIndexBy('key', selectedBloc);
    grid.syncRow(rowIndex ?? void 0);
  }, [selectedBloc]);

  return (
    <section className="bloc-grid-section">
      <div className="bloc-grid-header">
        <h2>All Economic Blocs</h2>
        <p>Click a bloc to highlight its members on the map.</p>
      </div>
      <div className="bloc-grid-frame">
        <div ref={gridContainerRef} className="bloc-datagrid" />
      </div>
    </section>
  );
}

export default BlocGrid;
