Building an Economic Blocs Map with Highcharts React (Grid Version)

Highcharts now ships a modern React integration via @highcharts/react. In the first version of this demo, we focused on the map experience: select a bloc, highlight member countries, and show quick stats. In this short update, we add Highcharts Grid Lite under the map so users can scan all blocs at once and click any row to highlight it on the map.

What’s new in Version 2
- A fixed-height Highcharts Grid Lite table under the map (about 5 rows visible).
- Scroll to see all blocs without the page getting too long.
- Clickable headers for sorting: Name, GDP, Population, Founded, Members.
- Row click still highlights the bloc on the map.

User flow (unchanged, now faster)
- Pick a bloc from the dropdown or click a grid row.
- The map highlights member countries.
- Stats update with GDP, population, and founding year.

Grid architecture (new)
App
├─ BlocDropdown
├─ BlocInfo
├─ MapChart
└─ BlocGrid  <-- new

BlocGrid in a nutshell
- It renders a Highcharts Grid Lite table.
- Columns are sortable by clicking the header.
- Each row click highlights the bloc on the map.

Why a grid helps
- It exposes all blocs at once instead of hiding them behind a dropdown.
- Sorting makes it easy to compare by GDP or population.
- The fixed-height container keeps the map visible.

High-level implementation
1) Install Grid Lite: @highcharts/grid-lite
2) Create a new component: src/components/BlocGrid.jsx
3) Add column definitions (Name, GDP, Population, Founded, Members)
4) Maintain sortKey + sortDir state
5) Compute sorted rows with useMemo
6) Feed columns into Highcharts Grid Lite
7) Wire row clicks to highlight the bloc on the map

Minimal example (sorting logic)
const [sortKey, setSortKey] = useState('name');
const [sortDir, setSortDir] = useState('asc');

const rows = useMemo(() => {
  const data = Object.entries(blocs).map(([key, bloc]) => ({
    key,
    name: bloc.name,
    members: bloc.countries.length,
    founded: bloc.founded,
    gdp: bloc.gdp,
    population: bloc.population
  }));

  const dir = sortDir === 'asc' ? 1 : -1;
  data.sort((a, b) => {
    const aValue = a[sortKey];
    const bValue = b[sortKey];
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return (aValue - bValue) * dir;
    }
    return String(aValue).localeCompare(String(bValue)) * dir;
  });

  return data;
}, [blocs, sortKey, sortDir]);

Styling notes
- The Grid Lite table lives inside a fixed-height container with overflow-y: auto.
- Active rows get a border highlight.
- Header buttons show a sort indicator (▲/▼).

Wrap-up
This grid update makes the app feel more like a data explorer: users can scan, sort, and compare blocs without losing the map context. If you’re showcasing the new @highcharts/react integration, this version adds a clean, practical UI enhancement on top of the map foundation.
