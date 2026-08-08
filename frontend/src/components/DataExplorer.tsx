import { useEffect, useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  SortingState
} from '@tanstack/react-table';

interface Movie {
  title: string;
  genre: string;
  productionBudget: number;
  boxOffice: number;
  vfxIntensity: string;
}

export default function DataExplorer() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [genre, setGenre] = useState('Sci-Fi');
  const [vfx, setVfx] = useState('High');
  const [sorting, setSorting] = useState<SortingState>([]);

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:5000/api/analytics/movies?genre=${genre}&vfxIntensity=${vfx}`)
      .then(res => res.json())
      .then(json => {
        if (json.data) setMovies(json.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching movies", err);
        setLoading(false);
      });
  }, [genre, vfx]);

  const columns = useMemo(() => [
    {
      header: 'Title',
      accessorKey: 'title',
      cell: (info: any) => <span style={{ fontWeight: 500 }}>{info.getValue()}</span>
    },
    {
      header: 'Budget',
      accessorKey: 'productionBudget',
      cell: (info: any) => `$${(info.getValue() / 1_000_000).toFixed(1)}M`
    },
    {
      header: 'Box Office',
      accessorKey: 'boxOffice',
      cell: (info: any) => `$${(info.getValue() / 1_000_000).toFixed(1)}M`
    },
    {
      id: 'roi',
      header: 'ROI (%)',
      accessorFn: (row: Movie) => ((row.boxOffice - row.productionBudget) / row.productionBudget) * 100,
      cell: (info: any) => {
        const roi = info.getValue();
        return (
          <span style={{ color: roi > 0 ? 'var(--success)' : 'inherit', fontWeight: roi > 0 ? 600 : 400 }}>
            {roi > 0 ? '+' : ''}{roi.toFixed(1)}%
          </span>
        );
      }
    }
  ], []);

  const table = useReactTable({
    data: movies,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="widget" style={{ gridColumn: '1 / -1', marginTop: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 className="widget-title" style={{ margin: 0 }}>Enterprise Data Grid</h3>

        <div className="controls-row" style={{ margin: 0 }}>
          <select className="select-control" value={genre} onChange={e => setGenre(e.target.value)}>
            <option value="Sci-Fi">Sci-Fi</option>
            <option value="Action">Action</option>
            <option value="Drama">Drama</option>
            <option value="Comedy">Comedy</option>
            <option value="Horror">Horror</option>
          </select>
          <select className="select-control" value={vfx} onChange={e => setVfx(e.target.value)}>
            <option value="High">High VFX</option>
            <option value="Medium">Medium VFX</option>
            <option value="Low">Low VFX</option>
          </select>
        </div>
      </div>

      <div className="table-container">
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-secondary)' }}>
            <i className="ph ph-spinner-gap" style={{ fontSize: 24, animation: 'spin 1s linear infinite' }}></i>
            <p>Querying ClickHouse Cloud...</p>
          </div>
        ) : movies.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-secondary)' }}>
            No movies found for these filters.
          </div>
        ) : (
          <table className="data-table">
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                      style={{ cursor: 'pointer', userSelect: 'none' }}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {{
                        asc: ' 🔼',
                        desc: ' 🔽',
                      }[header.column.getIsSorted() as string] ?? null}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map(row => (
                <tr key={row.id}>
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
