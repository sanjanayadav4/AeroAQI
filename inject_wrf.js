const fs = require('fs');
const path = 'c:/Users/sonis/Documents/FINAL/frontend/src/App.jsx';
let app = fs.readFileSync(path, 'utf8');

const wrfChemComponent = `

// ─── WRF-Chem Model Section ────────────────────────────────────────────────
function WRFChemSection() {
  const [activeParam, setActiveParam] = useState('PM2.5');

  const parameters = [
    { id: 'PM2.5', label: 'PM2.5', max: 300, unit: 'µg/m³', color: '#dc2626' },
    { id: 'PM10', label: 'PM10', max: 400, unit: 'µg/m³', color: '#c2410c' },
    { id: 'NO2', label: 'NO2', max: 150, unit: 'µg/m³', color: '#b91c1c' },
    { id: 'O3', label: 'O3', max: 200, unit: 'µg/m³', color: '#4338ca' },
    { id: 'Wind', label: 'Wind', max: 15, unit: 'm/s', color: '#0369a1' },
    { id: 'PBL Height', label: 'PBL Height', max: 2000, unit: 'm', color: '#65a30d' }
  ];

  const currentParam = parameters.find(p => p.id === activeParam);

  const getMapStyle = (param) => {
    const bases = {
      'PM2.5': 'radial-gradient(circle at 45% 45%, #ef4444 0%, #f97316 20%, #eab308 40%, #10b981 70%, #3b82f6 100%)',
      'PM10': 'radial-gradient(circle at 50% 50%, #ea580c 0%, #f59e0b 25%, #84cc16 50%, #06b6d4 80%, #3b82f6 100%)',
      'NO2': 'radial-gradient(circle at 55% 40%, #dc2626 0%, #c2410c 30%, #eab308 55%, #10b981 75%, #0ea5e9 100%)',
      'O3': 'radial-gradient(circle at 40% 60%, #4338ca 0%, #6366f1 20%, #a855f7 45%, #f472b6 70%, #38bdf8 100%)',
      'Wind': 'radial-gradient(circle at 60% 60%, #0284c7 0%, #0ea5e9 30%, #38bdf8 60%, #7dd3fc 90%, #e0f2fe 100%)',
      'PBL Height': 'radial-gradient(circle at 45% 55%, #facc15 0%, #a3e635 25%, #4ade80 50%, #2dd4bf 75%, #3b82f6 100%)'
    };
    return {
      background: bases[param] || bases['PM2.5'],
      opacity: 0.85,
      transition: 'background 0.5s ease-in-out'
    };
  };

  const getLegendGradient = (param) => {
    const bases = {
      'PM2.5': 'linear-gradient(to top, #3b82f6, #06b6d4, #84cc16, #facc15, #f97316, #ef4444)',
      'PM10': 'linear-gradient(to top, #3b82f6, #06b6d4, #84cc16, #f59e0b, #ea580c)',
      'NO2': 'linear-gradient(to top, #0ea5e9, #10b981, #eab308, #c2410c, #dc2626)',
      'O3': 'linear-gradient(to top, #38bdf8, #f472b6, #a855f7, #6366f1, #4338ca)',
      'Wind': 'linear-gradient(to top, #e0f2fe, #7dd3fc, #38bdf8, #0ea5e9, #0284c7)',
      'PBL Height': 'linear-gradient(to top, #3b82f6, #2dd4bf, #4ade80, #a3e635, #facc15)'
    };
    return bases[param] || bases['PM2.5'];
  };

  return (
    <div className="mt-10 mb-6">
      <div className="mb-5">
        <h3 className="text-2xl font-bold text-[var(--text-primary)]">WRF-Chem Model</h3>
        <p className="text-xs text-[var(--text-muted)] mt-1">Coupled weather-chemistry simulation (Prototype)</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {parameters.map(p => (
          <button
            key={p.id}
            onClick={() => setActiveParam(p.id)}
            className="px-6 py-2 rounded-xl text-xs font-bold transition-all duration-300"
            style={{
              background: activeParam === p.id ? 'var(--text-primary)' : 'var(--surface)',
              color: activeParam === p.id ? '#ffffff' : 'var(--text-secondary)',
              border: activeParam === p.id ? '1px solid var(--text-primary)' : '1px solid var(--border)',
              boxShadow: activeParam === p.id ? 'var(--shadow-sm)' : 'none'
            }}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
        <div className="rounded-3xl p-2 relative overflow-hidden" style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-md)' }}>
          <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] rounded-2xl overflow-hidden bg-slate-100">
            <div className="absolute inset-0 bg-slate-200/50 map-grid" style={{ zIndex: 0 }} />
            
            <div className="absolute inset-0" style={{ ...getMapStyle(activeParam), mixBlendMode: 'multiply', zIndex: 1, filter: 'blur(16px)' }} />
            
            <div className="absolute inset-0" style={{ zIndex: 10 }}>
              <div className="absolute top-[25%] left-[30%] -translate-x-1/2 -translate-y-1/2 text-[11px] font-bold text-white drop-shadow-md">Sonipat</div>
              <div className="absolute top-[35%] left-[70%] -translate-x-1/2 -translate-y-1/2 text-[11px] font-bold text-white drop-shadow-md flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-white opacity-80"/>Meerut</div>
              <div className="absolute top-[50%] left-[20%] -translate-x-1/2 -translate-y-1/2 text-[11px] font-bold text-white drop-shadow-md">Rohtak</div>
              <div className="absolute top-[55%] left-[45%] -translate-x-1/2 -translate-y-1/2 text-[13px] font-black text-white drop-shadow-lg">Delhi</div>
              <div className="absolute top-[58%] left-[65%] -translate-x-1/2 -translate-y-1/2 text-[11px] font-bold text-white drop-shadow-md flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-yellow-300 opacity-90"/>Ghaziabad</div>
              <div className="absolute top-[75%] left-[35%] -translate-x-1/2 -translate-y-1/2 text-[11px] font-bold text-white drop-shadow-md flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-yellow-300 opacity-90"/>Gurugram</div>
              <div className="absolute top-[70%] left-[58%] -translate-x-1/2 -translate-y-1/2 text-[11px] font-bold text-white drop-shadow-md flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-white opacity-80"/>Noida</div>
              <div className="absolute top-[85%] left-[55%] -translate-x-1/2 -translate-y-1/2 text-[11px] font-bold text-white drop-shadow-md">Faridabad</div>
            </div>

            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2" style={{ zIndex: 20 }}>
              <span className="text-[10px] font-bold text-[var(--text-primary)] bg-white/80 px-2 py-0.5 rounded backdrop-blur drop-shadow-sm">{currentParam.unit}</span>
              <div className="flex gap-2 h-[200px]">
                <div className="w-4 rounded-full border border-white/40 shadow-sm transition-all duration-500" style={{ background: getLegendGradient(activeParam) }} />
                <div className="flex flex-col justify-between text-[10px] font-bold text-[var(--text-primary)] drop-shadow-sm px-1 py-1 h-full">
                  <span>{currentParam.max}</span>
                  <span>{Math.round(currentParam.max * 0.66)}</span>
                  <span>{Math.round(currentParam.max * 0.33)}</span>
                  <span>0</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <div className="rounded-2xl p-6" style={{ background: 'var(--surface-secondary)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
            <h4 className="text-sm font-bold text-[var(--text-primary)] mb-4">Simulation Info</h4>
            <div className="space-y-4">
              <div>
                <p className="text-[10px] text-[var(--text-muted)]">Model</p>
                <p className="text-xs font-semibold text-[var(--text-secondary)] mt-0.5">WRF-Chem (Prototype)</p>
              </div>
              <div>
                <p className="text-[10px] text-[var(--text-muted)]">Time</p>
                <p className="text-xs font-semibold text-[var(--text-secondary)] mt-0.5">8 Jan 2026, 10:00 AM</p>
              </div>
              <div>
                <p className="text-[10px] text-[var(--text-muted)]">Parameter</p>
                <p className="text-xs font-bold text-[var(--text-primary)] mt-0.5">{currentParam.label}</p>
              </div>
              <div>
                <p className="text-[10px] text-[var(--text-muted)]">Domain</p>
                <p className="text-xs font-semibold text-[var(--text-secondary)] mt-0.5">Delhi-NCR (d02)</p>
              </div>
            </div>
          </div>
          
          <p className="text-[11px] text-[var(--text-muted)] leading-relaxed px-2">
            WRF-Chem simulates the interaction between weather and atmospheric chemistry to predict pollutant concentrations.
          </p>
        </div>
      </div>
    </div>
  );
}
`;

// Insert the component before the export
if (!app.includes('function WRFChemSection')) {
  app = app.replace('export default App;', wrfChemComponent + '\nexport default App;');
}

// Inject `<WRFChemSection />` at the end of `ForecastPage`
const searchTarget = `    </FeatureSection>
  </>;
}

function ForecastTooltip`;

const replacement = `    </FeatureSection>
    <WRFChemSection />
  </>;
}

function ForecastTooltip`;

if (app.includes(searchTarget)) {
  app = app.replace(searchTarget, replacement);
  fs.writeFileSync(path, app);
  console.log('App.jsx updated with WRFChemSection successfully!');
} else {
  console.log('Error: Could not find the insertion point for WRFChemSection.');
}
