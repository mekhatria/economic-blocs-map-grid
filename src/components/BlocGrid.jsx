import { useEffect, useMemo, useRef, useState } from "react";
import { grid as createGrid } from "@highcharts/grid-lite";
import "@highcharts/grid-lite/css/grid.css";

function BlocGrid({ blocs, selectedBloc, onSelectBloc }) {
  const gridContainerRef = useRef(null);
  const gridRef = useRef(null);
  const [isReady, setIsReady] = useState(false);

  const gridRows = useMemo(
    () =>
      Object.entries(blocs).map(([key, bloc]) => ({
        key,
        name: bloc.name,
        members: bloc.countries.length,
        founded: bloc.founded,
        gdp: bloc.gdp,
        population: bloc.population,
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
      members: gridRows.map((row) => row.members),
    }),
    [gridRows]
  );

  // Ensure container is mounted
  useEffect(() => {
    if (gridContainerRef.current) {
      setIsReady(true);
    }
  }, []);

  useEffect(() => {
    if (!isReady) return;

    const container = gridContainerRef.current;
    if (!container) return;

    // Clean up previous grid instance
    if (gridRef.current) {
      try {
        if (typeof gridRef.current.destroy === "function") {
          gridRef.current.destroy();
        }
      } catch (err) {
        console.warn("Grid destroy error:", err);
      }
      gridRef.current = null;
    }

    // Initialize grid after a brief delay
    const timeoutId = setTimeout(() => {
      try {
        gridRef.current = createGrid(container, {
          dataTable: { columns: dataColumns },
          columns: [
            {
              id: "name",
              header: { format: "Name" },
              sorting: { sortable: true },
            },
            {
              id: "gdp",
              header: { format: "GDP" },
              sorting: { sortable: true },
            },
            {
              id: "population",
              header: { format: "Population" },
              sorting: { sortable: true },
            },
            {
              id: "founded",
              header: { format: "Founded" },
              sorting: { sortable: true },
            },
            {
              id: "members",
              header: { format: "Members" },
              sorting: { sortable: true },
            },
            {
              id: "key",
              enabled: false,
            },
          ],
        });

        const handleRowClick = (event) => {
          const rowEl = event.target.closest("[data-row-index]");
          if (!rowEl) return;
          const rowIndex = Number(rowEl.getAttribute("data-row-index"));
          if (Number.isNaN(rowIndex)) return;
          const row =
            gridRef.current?.presentationTable?.getRowObject(rowIndex);
          if (row?.key) onSelectBloc(row.key);
        };

        container.addEventListener("click", handleRowClick);
      } catch (error) {
        console.error("Failed to initialize Grid:", error);
      }
    }, 100); // Increased delay

    return () => {
      clearTimeout(timeoutId);
      if (gridRef.current) {
        try {
          if (typeof gridRef.current.destroy === "function") {
            gridRef.current.destroy();
          }
        } catch (err) {
          console.warn("Grid cleanup error:", err);
        }
        gridRef.current = null;
      }
    };
  }, [dataColumns, onSelectBloc, isReady]);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid || !grid.presentationTable) return;

    try {
      const rowIndex =
        selectedBloc &&
        grid.presentationTable.getRowIndexBy("key", selectedBloc);
      if (rowIndex !== undefined && rowIndex !== null) {
        grid.syncRow(rowIndex);
      }
    } catch (error) {
      console.warn("Grid sync error:", error);
    }
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
