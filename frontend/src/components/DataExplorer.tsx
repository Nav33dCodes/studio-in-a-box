import { useEffect, useState } from 'react';

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

  return (
    <div className="widget" style={{ gridColumn: '1 / -1', marginTop: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 className="widget-title" style={{ margin: 0 }}>Data Explorer</h3>
        
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
            <p>Querying ClickHouse...</p>
          </div>
        ) : movies.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-secondary)' }}>
            No movies found for these filters.
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Budget</th>
                <th>Box Office</th>
                <th>ROI</th>
              </tr>
            </thead>
            <tbody>
              {movies.map((m, idx) => {
                const roi = ((m.boxOffice - m.productionBudget) / m.productionBudget) * 100;
                return (
                  <tr key={idx}>
                    <td style={{ fontWeight: 500 }}>{m.title}</td>
                    <td>${(m.productionBudget / 1_000_000).toFixed(1)}M</td>
                    <td>${(m.boxOffice / 1_000_000).toFixed(1)}M</td>
                    <td style={{ color: roi > 0 ? 'var(--success)' : 'inherit', fontWeight: roi > 0 ? 600 : 400 }}>
                      {roi > 0 ? '+' : ''}{roi.toFixed(1)}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
