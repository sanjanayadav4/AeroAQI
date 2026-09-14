/**
 * AeroAQI — Premium Dashboard
 * Delhi-NCR Air Intelligence Platform
 * Interactive Delhi-NCR air intelligence dashboard
 */

import { useState, useEffect, useRef } from "react";
import {
  AreaChart, Area, LineChart, Line, ResponsiveContainer,
  XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine,
} from "recharts";
import {
  Activity, AlertTriangle, ArrowUpRight, BarChart3, Bell,
  ChevronDown, ChevronRight, CloudSun, Droplets, Flame,
  Gauge, Info, LayoutDashboard, Layers, Map, MapPin, Menu,
  Navigation, Settings, TrendingUp, TrendingDown, Wind,
  FileText, ZoomIn, ZoomOut, Crosshair, Radio, Thermometer,
  Eye, Clock, X, LogOut, User, Save, Lock, Mail, CheckCircle2, Phone, Upload, Gift, Sparkles, Bot, MessageCircle, Play, Pause, RefreshCw, Download, Award, Check, ChevronLeft, ChevronUp, ShieldCheck, FileSpreadsheet, SlidersHorizontal, Search, CircleHelp, Heart, Target, Zap, Users, CalendarDays, GaugeCircle, CloudRain, Wind as WindIcon, BellRing, ExternalLink, RotateCcw, Layers3, MapPinned, CircleDot, Star, Send, Image as ImageIcon,
} from "lucide-react";

// Dashboard hero: place the exact India Gate image at public/hero.png
// Keep the filename exactly "hero.png" so the dashboard hero path remains stable.

// Atmospheric chart data is read from the AeroAQI backend at runtime.

// ─── AQI helpers ─────────────────────────────────────────
function aqiColor(v) {
  if (v <= 50)  return "#22c55e";
  if (v <= 100) return "#eab308";
  if (v <= 150) return "#f97316";
  if (v <= 200) return "#ef4444";
  if (v <= 300) return "#a855f7";
  return "#b91c1c";
}
function aqiLabel(v) {
  if (v <= 50)  return "Good";
  if (v <= 100) return "Moderate";
  if (v <= 150) return "Unhealthy (Sensitive)";
  if (v <= 200) return "Unhealthy";
  if (v <= 300) return "Very Unhealthy";
  return "Hazardous";
}
function aqiBgClass(v) {
  if (v <= 50)  return "bg-aqi-good";
  if (v <= 100) return "bg-aqi-moderate";
  if (v <= 150) return "bg-aqi-sensitive";
  if (v <= 200) return "bg-aqi-unhealthy";
  if (v <= 300) return "bg-aqi-very";
  return "bg-aqi-hazardous";
}

// ─── Custom Tooltip ───────────────────────────────────────
// ─── AQI Ambient Motion ───────────────────────────────────


// ─── Nav Item ─────────────────────────────────────────────

// ─── Account Auth: Create Account / Login / OTP ────────────

// ─── AeroAQI Brand Logo ─────────────────────────────────────
function AeroAQILogo({ className = "", compact = false }) {
  return (
    <img
      src="/icon.png"
      alt="AeroAQI — Clean Air, Forecasted"
      className={
        (compact ? "h-12 w-auto" : "h-16 sm:h-20 w-auto") +
        " object-contain object-left " + className
      }
    />
  );
}

function NavItem({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 text-left group
        ${active
          ? "nav-active text-emerald-300"
          : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)]"
        }`}
    >
      <span className={`${active ? "text-emerald-400" : "text-[var(--text-muted)] group-hover:text-emerald-400"} transition-colors`}>
        {icon}
      </span>
      <span className="truncate">{label}</span>
      {active && <ChevronRight size={14} className="ml-auto text-emerald-400/60" />}
    </button>
  );
}

// ─── Sidebar ──────────────────────────────────────────────
const NAV = [
  { icon:<LayoutDashboard size={16}/>, label:"Dashboard" },
  { icon:<Map size={16}/>,            label:"NCR Map" },
  { icon:<BarChart3 size={16}/>,      label:"AQI Forecast" },
  { icon:<Layers3 size={16}/>,        label:"WRF-Chem" },
  { icon:<CloudSun size={16}/>,       label:"Weather & Atmosphere" },
  { icon:<Flame size={16}/>,          label:"Plume Tracker" },
  { icon:<Bell size={16}/>,           label:"Alerts & Notifications" },
  { icon:<Navigation size={16}/>,     label:"Stations" },
  { icon:<FileText size={16}/>,       label:"Reports" },
  { icon:<Activity size={16}/>,       label:"Data Pipeline" },
  { icon:<Bot size={16}/>,             label:"AI Insights" },
  { icon:<Settings size={16}/>,       label:"Profile & Settings" },
];

const AQI_SCALE = [
  { range:"0-50",   label:"Good",                    dot:"#22c55e" },
  { range:"51-100", label:"Moderate",                dot:"#eab308" },
  { range:"101-150",label:"Unhealthy for Sensitive", dot:"#f97316" },
  { range:"151-200",label:"Unhealthy",               dot:"#ef4444" },
  { range:"201-300",label:"Very Unhealthy",          dot:"#a855f7" },
  { range:"301+",   label:"Hazardous",               dot:"#b91c1c" },
];

function Sidebar({ active, setActive, mobile, onClose, user }) {
  const initial = (user?.name || "A").trim().charAt(0).toUpperCase() || "A";
  return (
    <aside className={`flex flex-col h-full w-[232px] bg-[var(--surface)] border-r border-[var(--border)] ${mobile ? "" : "fixed left-0 top-0"}`}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 pt-6 pb-5 border-b border-[var(--border)]">
  <img
    src="/icon.png"
    alt="AeroAQI"
    className="w-12 h-12 object-contain"
  />

  <div>
          <h1 className="text-base font-bold text-[var(--text-primary)] tracking-tight">AeroAQI</h1>
          <p className="text-[10px] text-[var(--text-muted)] leading-tight">Clean Air, Better Tomorrow</p>
        </div>
        {mobile && (
          <button onClick={onClose} className="ml-auto text-[var(--text-muted)] hover:text-[var(--text-primary)]">
            <X size={18}/>
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="px-3 pt-1 pb-2 text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)]">
          Navigation
        </p>
        {NAV.map((n, i) => (
          <NavItem key={n.label} icon={n.icon} label={n.label}
            active={active === i} onClick={() => { setActive(i); if (onClose) onClose(); }} />
        ))}
      </nav>

      {/* AQI Legend */}
      <div className="mx-3 mb-3 rounded-xl p-3 glass-dark">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-2.5">
          AQI Index Scale
        </p>
        {AQI_SCALE.map(s => (
          <div key={s.range} className="flex items-center gap-2 py-0.5">
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{background:s.dot,boxShadow:`0 0 5px ${s.dot}80`}}/>
            <span className="text-[10px] text-[var(--text-muted)] w-11 flex-shrink-0">{s.range}</span>
            <span className="text-[10px] text-[var(--text-muted)]">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Profile */}
      <button onClick={() => setActive(NAV.length - 1)}
        className="mx-3 mb-4 p-3 rounded-xl glass-subtle flex items-center gap-2.5 text-left hover:bg-[var(--surface-hover)] transition">
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-[var(--text-primary)]"
          style={{background:"linear-gradient(135deg,#16a34a,#22c55e)"}}>{initial}</div>
        <div className="min-w-0">
          <p className="text-xs font-semibold text-[var(--text-primary)] truncate">{user?.name || "AeroAQI User"}</p>
          <p className="text-[10px] text-[var(--text-muted)] truncate">Profile & Settings</p>
        </div>
      </button>
    </aside>
  );
}

function AmbientMelodyButton(){
  const [on,setOn]=useState(false); const ctxRef=useRef(null); const timerRef=useRef(null);
  const notes=[261.63,329.63,392,329.63,293.66,349.23,440,392];
  const stop=()=>{if(timerRef.current){clearInterval(timerRef.current);timerRef.current=null} if(ctxRef.current){ctxRef.current.close();ctxRef.current=null}setOn(false)};
  const start=()=>{try{const Ctx=window.AudioContext||window.webkitAudioContext; if(!Ctx)return; const ctx=new Ctx();ctxRef.current=ctx;let i=0;const play=()=>{const o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.frequency.value=notes[i%notes.length];g.gain.setValueAtTime(.0001,ctx.currentTime);g.gain.exponentialRampToValueAtTime(.075,ctx.currentTime+.03);g.gain.exponentialRampToValueAtTime(.0001,ctx.currentTime+.55);o.connect(g);g.connect(ctx.destination);o.start();o.stop(ctx.currentTime+.58);i++};play();timerRef.current=setInterval(play,620);setOn(true)}catch{setOn(false)}};
  useEffect(()=>()=>stop(),[]);
  return <button onClick={on?stop:start} title="Original ambient melody" className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-semibold" style={{background:on?"rgba(34,197,94,.12)":"rgba(255,255,255,.035)",border:`1px solid ${on?"rgba(74,222,128,.22)":"var(--surface-hover)"}`,color:on?"#86efac":"#94a3b8"}}>{on?<Pause size={11}/>:<Play size={11}/>} Melody</button>;
}

// ─── Header ───────────────────────────────────────────────
function Header({ onMenu, onAlerts, onProfile, onLocation, user }) {
  const [time, setTime] = useState(new Date());
  const { data: weather } = useLiveWeather();
  const wc = weather?.data?.observations?.at(-1) || {};
  const headerTemp = Number.isFinite(Number(wc.temperature)) ? Math.round(Number(wc.temperature)) : null;
  const headerWind = Number.isFinite(Number(wc.wind_speed)) ? Number(wc.wind_speed).toFixed(1) : null;
  const headerHumidity = Number.isFinite(Number(wc.relative_humidity)) ? Math.round(Number(wc.relative_humidity)) : null;
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const fmt = time.toLocaleTimeString("en-IN", {hour:"2-digit",minute:"2-digit",second:"2-digit"});
  const dat = time.toLocaleDateString("en-IN", {day:"numeric",month:"short",year:"numeric"});

  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 px-5 py-3 border-b border-[var(--border)]"
      style={{background:"var(--surface)",backdropFilter:"blur(20px)"}}>
      {/* Mobile menu */}
      <button onClick={onMenu} className="lg:hidden p-2 rounded-lg glass text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
        <Menu size={18}/>
      </button>

      {/* Location */}
      <button aria-label="Selected location: Delhi"
        onClick={onLocation}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass text-sm font-medium text-[var(--text-primary)] hover:border-emerald-500/30 transition-all">
        <MapPin size={13} className="text-emerald-400"/>
        Delhi
        <ChevronDown size={13} className="text-[var(--text-muted)]"/>
      </button>

      {/* Live */}
      <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium"
        style={{background:"rgba(34,197,94,.1)",border:"1px solid rgba(34,197,94,.2)"}}>
        <span className="live-dot w-1.5 h-1.5 rounded-full bg-green-400"/>
        <span className="text-green-400 hidden sm:inline">LIVE</span>
      </div>

      {/* Time */}
      <div className="hidden md:flex items-center gap-1 px-2.5 py-1 rounded-lg glass text-xs text-[var(--text-muted)]">
        <Clock size={11} className="text-[var(--text-muted)]"/>
        <span>{dat} · {fmt}</span>
      </div>

      {/* Spacer */}
      <div className="flex-1"/>

      {/* Weather info */}
      <div className="hidden lg:flex items-center gap-4 text-sm text-[var(--text-secondary)]">
        <div className="flex items-center gap-1.5">
          <Thermometer size={14} className="text-orange-400"/>
          <span className="font-semibold text-[var(--text-primary)]">{headerTemp == null ? "—" : `${headerTemp}°C`}</span>
          <span className="text-[var(--text-muted)] text-xs">{headerTemp == null ? "Weather unavailable" : "Backend observation"}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Wind size={14} className="text-emerald-400"/>
          <span>{headerWind == null ? "—" : `${headerWind} m/s`}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Droplets size={14} className="text-emerald-300"/>
          <span>{headerHumidity == null ? "—" : `${headerHumidity}%`}</span>
        </div>
      </div>

      <AmbientMelodyButton/>

      {/* Bell */}
      <button aria-label="Open alerts" onClick={onAlerts}
        className="relative p-2 rounded-lg glass text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition">
        <Bell size={16}/>
        <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-red-500"/>
      </button>

      {/* Avatar */}
      <button onClick={onProfile} aria-label="Open profile settings"
        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-[var(--text-primary)] cursor-pointer hover:ring-2 hover:ring-emerald-400/40 transition"
        style={{background:"linear-gradient(135deg,#16a34a,#22c55e)"}}>
        {(user?.name || "A").trim().charAt(0).toUpperCase() || "A"}
      </button>
    </header>
  );
}

// ─── Hero Section ─────────────────────────────────────────
function Hero() {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const { stations } = useLiveStations();
  const liveStation = stations.find(s => s.hasObs === true) || stations.find(s => s.aqi != null) || stations[0] || null;
  const currentAqi = liveStation?.aqi;
  const currentPm25 = liveStation?.pm25;
  const [heroForecast, setHeroForecast] = useState([]);
  const heroRef = useRef(null);

  useEffect(() => {
    const stationId = stations.find(s => s.station_id)?.station_id;
    if (!stationId) {
      setHeroForecast([]);
      return undefined;
    }
    let alive = true;
    apiGet(`/forecast/${encodeURIComponent(stationId)}?hours=72`)
      .then(data => {
        if (!alive) return;
        setHeroForecast((data?.hourly ?? []).map(h => ({
          t: `+${h.forecast_hour}h`,
          aqi: h.aqi_computed != null ? Math.round(h.aqi_computed) : null,
          pm25: h.pm25 != null ? Math.round(h.pm25) : null,
        })));
      })
      .catch(() => alive && setHeroForecast([]));
    return () => { alive = false; };
  }, [stations]);

  const handleMouseMove = (e) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  return (
    <section 
      ref={heroRef}
      className="relative overflow-hidden rounded-2xl group"
      style={{minHeight:440,border:"1px solid var(--surface-hover)"}}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
    >

      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <img src="/hero.png" alt="India Gate, Delhi"
          className="w-full h-full object-cover object-center aero-hero-image" />
          
        {/* Dynamic Overlays: opacity reduces slightly on hover to reveal image */}
        <div className="absolute inset-0 transition-opacity duration-500 ease-out"
          style={{
            background:"linear-gradient(90deg, rgba(2,8,23,.82) 0%, rgba(2,8,23,.58) 34%, rgba(2,8,23,.20) 62%, transparent 82%)",
            opacity: isHovered ? 0.82 : 1
          }}/>
        <div className="absolute inset-0 transition-opacity duration-500 ease-out"
          style={{
            background:"linear-gradient(180deg, rgba(2,8,23,.18) 0%, transparent 48%, rgba(2,8,23,.34) 100%)",
            opacity: isHovered ? 0.55 : 1
          }}/>
          
        {/* Subtle Cursor Reveal */}
        <div className="absolute inset-0 pointer-events-none transition-opacity duration-300 hidden md:block"
             style={{
               background: `radial-gradient(circle 400px at ${mousePos.x}% ${mousePos.y}%, transparent 0%, rgba(2,8,23,0.16) 100%)`,
               opacity: isHovered ? 1 : 0
             }}
        />
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-6 p-7 lg:p-10 aero-hero-copy" style={{minHeight:440}}>

        {/* LEFT */}
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 live-dot"/>
            <p className="text-xs font-semibold tracking-[0.18em] uppercase text-emerald-400">
              Delhi-NCR Air Intelligence
            </p>
          </div>

          <div 
            className="transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] origin-left"
            style={{ transform: isHovered ? 'scale(0.88)' : 'scale(1)' }}
          >
            <h2 className="text-4xl lg:text-5xl font-black leading-[1.12] text-[var(--text-primary)] mb-1">
              Air Quality
            </h2>
            <h2 className="text-4xl lg:text-5xl font-black leading-[1.12] mb-1">
              <span className="grad-cyan">Forecasting</span>
            </h2>
            <h2 className="text-4xl lg:text-5xl font-black leading-[1.12] text-[var(--text-primary)] mb-5">
              for a Better Tomorrow
            </h2>

            <p className="text-[var(--text-secondary)] text-sm max-w-sm leading-relaxed mb-2">
              Weather–Chemistry Coupled AQI Forecast
            </p>
            <p className="text-[var(--text-muted)] text-sm max-w-sm leading-relaxed mb-6">
              72-Hour Prediction Horizon · CPCB · IMD · Weather · Forecast models
            </p>
          </div>

          {/* Meta chips */}
          <div className="flex flex-wrap gap-2.5 mb-7">
            {[
              { icon:<Clock size={11}/>, label:"Last Updated", val:liveStation?.timestamp ? new Date(liveStation.timestamp).toLocaleString("en-IN", { day:"numeric", month:"short", hour:"2-digit", minute:"2-digit" }) : "Waiting for backend" },
              { icon:<Layers size={11}/>, label:"Data Sources", val:"AeroAQI Backend" },
            ].map(m => (
              <div key={m.label} className="flex items-center gap-2 px-3 py-2 rounded-lg glass text-xs">
                <span className="text-emerald-400">{m.icon}</span>
                <span className="text-[var(--text-muted)]">{m.label}:</span>
                <span className="text-[var(--text-secondary)] font-medium">{m.val}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => document.getElementById("forecast-section")?.scrollIntoView({behavior:"smooth",block:"start"})}
            className="btn-primary w-fit flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-[var(--text-primary)]">
            Explore Dashboard
            <ArrowUpRight size={16}/>
          </button>
        </div>

        {/* RIGHT — Intelligence panel */}
        <div className="flex flex-col gap-3 justify-center">

          {/* Current AQI card */}
          <div className="rounded-2xl p-5" style={{
            background:"rgba(6,28,18,.88)",
            backdropFilter:"blur(24px)",
            border:"1px solid rgba(74,222,128,.2)",
            boxShadow:"0 0 40px rgba(34,197,94,.1), 0 8px 32px rgba(0,0,0,.4)"
          }}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-semibold tracking-widest uppercase text-[var(--text-muted)]">
                Current Conditions
              </span>
              <span className="flex items-center gap-1 text-[10px] text-green-400 font-medium px-2 py-0.5 rounded-full"
                style={{background:"rgba(34,197,94,.1)",border:"1px solid rgba(34,197,94,.2)"}}>
                <span className="live-dot w-1 h-1 rounded-full bg-green-400"/>Live
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {/* AQI */}
              <div className="text-center p-3 rounded-xl" style={{background:"rgba(139,92,246,.12)",border:"1px solid rgba(139,92,246,.2)"}}>
                <p className="text-[10px] text-[var(--text-muted)] mb-1">AQI</p>
                <p className="text-3xl font-black text-purple-300 leading-none">
  {currentAqi != null ? Math.round(currentAqi) : "—"}
</p>
<p className="text-[10px] text-purple-400 mt-1 font-medium">
  {currentAqi != null ? aqiLabel(currentAqi) : "No data"}
</p>
              </div>
              {/* PM2.5 */}
              <div className="text-center p-3 rounded-xl" style={{background:"rgba(6,182,212,.08)",border:"1px solid rgba(6,182,212,.18)"}}>
                <p className="text-[10px] text-[var(--text-muted)] mb-1">PM2.5</p>
                <p className="text-2xl font-black text-emerald-300 leading-none">
  {currentPm25 != null ? Math.round(currentPm25) : "—"}
</p>
                <p className="text-[10px] text-[var(--text-muted)] mt-1">µg/m³</p>
              </div>
              {/* Trend */}
              <div className="text-center p-3 rounded-xl" style={{background:"rgba(239,68,68,.08)",border:"1px solid rgba(239,68,68,.18)"}}>
                <p className="text-[10px] text-[var(--text-muted)] mb-1">vs Yesterday</p>
                <p className="text-xl font-black text-slate-300 leading-none">—</p>
                <p className="text-[10px] text-[var(--text-muted)] mt-1 font-medium">Backend trend unavailable</p>
              </div>
            </div>
          </div>

          {/* 72-h forecast chart */}
          <div className="rounded-2xl p-4" style={{
            background:"rgba(6,28,18,.88)",
            backdropFilter:"blur(24px)",
            border:"1px solid rgba(74,222,128,.15)",
            boxShadow:"0 0 30px rgba(34,197,94,.07), 0 8px 24px rgba(0,0,0,.35)"
          }}>
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs font-semibold text-[var(--text-primary)]">72-Hour AQI Forecast</p>
                <p className="text-[10px] text-[var(--text-muted)] mt-0.5">XGBoost · Weather-Chemistry Coupled</p>
              </div>
              <Gauge size={16} className="text-purple-400"/>
            </div>

            {/* Reference bands */}
            <div className="relative">
              <ResponsiveContainer width="100%" height={130}>
                <AreaChart data={heroForecast} margin={{top:5,right:5,left:-28,bottom:0}}>
                  <defs>
                    <linearGradient id="aqiGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0.03}/>
                    </linearGradient>
                    <linearGradient id="pm25Grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4ade80" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#4ade80" stopOpacity={0.02}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="2 4" stroke="var(--surface-hover)" vertical={false}/>
                  <XAxis dataKey="t" tick={{fill:"#64748b",fontSize:9}} axisLine={false} tickLine={false}/>
                  <YAxis tick={{fill:"#64748b",fontSize:9}} axisLine={false} tickLine={false}/>
                  <Tooltip content={<ForecastTooltip/>}/>
                  <ReferenceLine y={150} stroke="rgba(239,68,68,.3)" strokeDasharray="3 3"/>
                  <ReferenceLine y={100} stroke="rgba(234,179,8,.25)" strokeDasharray="3 3"/>
                  <Area type="monotone" dataKey="aqi"  stroke="#22c55e" strokeWidth={2}
                    fill="url(#aqiGrad)" dot={false}
                    activeDot={{r:4,fill:"#22c55e",stroke:"#061b12",strokeWidth:2}}/>
                  <Area type="monotone" dataKey="pm25" stroke="#4ade80" strokeWidth={1.5}
                    fill="url(#pm25Grad)" dot={false}
                    activeDot={{r:3,fill:"#4ade80",stroke:"#061b12",strokeWidth:2}}/>
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center gap-4 mt-1">
              <div className="flex items-center gap-1.5 text-[10px] text-[var(--text-muted)]">
                <span className="w-4 h-0.5 rounded bg-emerald-400"/>AQI
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-[var(--text-muted)]">
                <span className="w-4 h-0.5 rounded bg-emerald-300"/>PM2.5
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-[var(--text-muted)] ml-auto">
                <span className="w-3 h-px border-t border-dashed border-red-500/50"/>150 AQI threshold
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

// ─── KPI Strip ────────────────────────────────────────────
function KpiStrip() {
  const { stations } = useLiveStations();
  const { data: weather } = useLiveWeather();
  const station = stations.find(s => s.hasObs === true) || stations.find(s => s.aqi != null) || stations[0] || null;
  const current = weather?.data?.observations?.at(-1) || {};
  const pbl = station?.pbl_height ?? null;

  const kpis = [
    { icon:<Radio size={16}/>, label:"Stations Online", val:stations.length ? String(stations.length) : "—", unit:"backend", color:"text-green-400", glow:"rgba(34,197,94,.15)" },
    { icon:<Thermometer size={16}/>, label:"Temperature", val:Number.isFinite(Number(current.temperature)) ? String(Math.round(current.temperature)) : "—", unit:"°C", color:"text-red-400", glow:"rgba(249,115,22,.15)" },
    { icon:<Wind size={16}/>, label:"Wind Speed", val:Number.isFinite(Number(current.wind_speed)) ? Number(current.wind_speed).toFixed(1) : "—", unit:"m/s", color:"text-cyan-400", glow:"rgba(6,182,212,.15)" },
    { icon:<Droplets size={16}/>, label:"Humidity", val:Number.isFinite(Number(current.relative_humidity)) ? String(Math.round(current.relative_humidity)) : "—", unit:"%", color:"text-yellow-400", glow:"rgba(59,130,246,.15)" },
    { icon:<Gauge size={16}/>, label:"PBL Height", val:Number.isFinite(Number(pbl)) ? String(Math.round(pbl)) : "—", unit:"m", color:"text-purple-400", glow:"rgba(139,92,246,.15)" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-4">
      {kpis.map(k => (
        <div key={k.label} className="card-hover flex items-center gap-3 px-4 py-3 rounded-xl"
          style={{background:`rgba(6,28,18,.86)`,border:"1px solid rgba(74,222,128,.1)",backdropFilter:"blur(12px)"}}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{background:k.glow}}>
            <span className={k.color}>{k.icon}</span>
          </div>
          <div className="min-w-0">
            <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wide leading-none mb-1">{k.label}</p>
            <p className="text-base font-bold text-[var(--text-primary)] leading-none">
              {k.val}<span className="text-xs text-[var(--text-muted)] font-normal ml-1">{k.unit}</span>
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Weather & Atmosphere Panel ───────────────────────────
// ─── Live backend helpers ──────────────────────────────────
const API_BASE = (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_API_BASE_URL) || "";

async function apiGet(path) {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 15000);
  try {
    const r = await fetch(`${API_BASE}${path}`, {
      method: "GET",
      headers: { Accept: "application/json", "Cache-Control": "no-cache" },
      cache: "no-store",
      signal: controller.signal,
    });
    if (!r.ok) throw new Error(`API ${r.status} ${r.statusText}`);
    return await r.json();
  } finally {
    window.clearTimeout(timeout);
  }
}

async function apiPost(path, body) {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 30000);
  try {
    const r = await fetch(`${API_BASE}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    if (!r.ok) throw new Error(`API ${r.status} ${r.statusText}`);
    return await r.json();
  } finally {
    window.clearTimeout(timeout);
  }
}
function aqiStatus(v){if(v<=50)return "good";if(v<=100)return "moderate";if(v<=150)return "sensitive";if(v<=200)return "unhealthy";return "very";}
function useLiveWeather(){
  const [state,setState]=useState({loading:true,data:null,error:""});
  useEffect(()=>{
    let alive=true;
    const load=()=>apiGet("/weather?hours=168")
      .then(payload=>{
        const observations=Array.isArray(payload)
          ? payload
          : (payload?.observations ?? payload?.data ?? []);
        if (!alive) return;
        setState({loading:false,data:{observations},error:""});
      })
      .catch(()=>alive&&setState({loading:false,data:null,error:"Backend weather unavailable"}));
    load();
    const id=setInterval(load,300000);
    return()=>{alive=false;clearInterval(id)};
  },[]);
  return state;
}
function useLiveStations() {
  const [state, setState] = useState({ stations: [], live: false, loading: true, error: "" });

  useEffect(() => {
    let alive = true;

    const load = async () => {
      try {
        // The backend's latest-observation response is authoritative for the
        // prototype: { count: 79, observations: [...] }.
        const [stationsResult, obsResult] = await Promise.allSettled([
          apiGet("/stations"),
          apiGet("/observations/latest"),
        ]);

        if (!alive) return;

        const stationsRaw = stationsResult.status === "fulfilled" ? stationsResult.value : null;
        const obsRaw = obsResult.status === "fulfilled" ? obsResult.value : null;

        const stationRows = Array.isArray(stationsRaw)
          ? stationsRaw
          : (stationsRaw?.stations ?? stationsRaw?.data ?? stationsRaw?.items ?? []);
        const obsRows = Array.isArray(obsRaw)
          ? obsRaw
          : (obsRaw?.observations ?? obsRaw?.data ?? obsRaw?.items ?? []);

        // Index latest observations by station_id.
        const obsMap = {};
        for (const o of obsRows) {
          if (o?.station_id) obsMap[o.station_id] = o;
        }

        // IMPORTANT: if /stations is incomplete/empty, build the station list
        // directly from /observations/latest. This guarantees that the 79
        // backend observation rows are not discarded by a metadata mismatch.
        const mergedRows = [...stationRows];
        const knownIds = new Set(mergedRows.map(s => s?.station_id).filter(Boolean));
        for (const o of obsRows) {
          if (o?.station_id && !knownIds.has(o.station_id)) {
            mergedRows.push(o);
            knownIds.add(o.station_id);
          }
        }

        if (!mergedRows.length) throw new Error("empty_stations");

        const stations = mergedRows
          .map((s, i) => {
            const obs = obsMap[s?.station_id] ?? (s?.pm25 != null || s?.aqi != null ? s : null);
            const aqiRaw = obs?.aqi_computed ?? obs?.aqi_raw ?? obs?.aqi ?? null;
            const aqi = aqiRaw != null ? Number(aqiRaw) : null;
            const lat = Number(s?.latitude ?? s?.lat);
            const lon = Number(s?.longitude ?? s?.lon);

            return {
              name: s?.name ?? s?.station_name ?? obs?.station_name ?? s?.station_id ?? `Station ${i + 1}`,
              station_id: s?.station_id ?? obs?.station_id,
              lat,
              lon,
              city: s?.city ?? obs?.city ?? null,
              state: s?.state ?? obs?.state ?? null,
              agency: s?.agency ?? obs?.agency ?? null,
              zone: s?.zone ?? obs?.zone ?? null,
              aqi: Number.isFinite(aqi) ? aqi : null,
              pm25: obs?.pm25 != null ? Number(obs.pm25) : null,
              pm10: obs?.pm10 != null ? Number(obs.pm10) : null,
              no2: obs?.no2 != null ? Number(obs.no2) : null,
              o3: obs?.o3 != null ? Number(obs.o3) : null,
              so2: obs?.so2 != null ? Number(obs.so2) : null,
              co: obs?.co != null ? Number(obs.co) : null,
              temperature_c: obs?.temperature_c != null ? Number(obs.temperature_c) : null,
              humidity: obs?.humidity != null ? Number(obs.humidity) : null,
              wind_speed_ms: obs?.wind_speed_ms != null ? Number(obs.wind_speed_ms) : null,
              pbl_height: obs?.pbl_height ?? obs?.boundary_layer_height_m ?? null,
              timestamp: obs?.timestamp_utc ?? obs?.timestamp ?? null,
              data_source: obs?.data_source ?? null,
              status: Number.isFinite(aqi) ? aqiStatus(aqi) : "unknown",
              source: obs ? "AeroAQI Backend" : "metadata-only",
              hasObs: obs !== null,
            };
          })
          .filter(x => x.station_id && Number.isFinite(x.lat) && Number.isFinite(x.lon));

        if (alive) {
          setState({
            stations,
            live: stations.length > 0,
            loading: false,
            error: stations.length ? "" : "No valid station rows returned by backend.",
          });
        }
      } catch (err) {
        if (!alive) return;
        setState({
          stations: [],
          live: false,
          loading: false,
          error: "Station data unavailable. Ensure the AeroAQI backend is running on port 8000.",
        });
      }
    };

    load();
    const id = setInterval(load, 300_000);
    return () => { alive = false; clearInterval(id); };
  }, []);

  return state;
}

function WeatherPanel() {
  const {loading,data,error}=useLiveWeather(); const [day,setDay]=useState(0);
  const observations=(data?.observations||[]).filter(row=>row && row.timestamp_utc).sort((a,b)=>new Date(a.timestamp_utc)-new Date(b.timestamp_utc));
  const current=observations[observations.length-1]||{};
  const recent=observations.slice(-7).reverse();
  const selected=recent[day]||current;
  const pbl=Number(current.pbl_height);
  const inversionStrength=Number(current.inversion_strength);
  const inv=Number.isFinite(inversionStrength)?{strength:inversionStrength,status:current.inversion_flag?"Active":"None"}:null;
  const metrics=[
    ["Temperature",Number(current.temperature), v=>`${Math.round(v)}°C`,<Thermometer size={15}/>,"#86efac"],
    ["Humidity",Number(current.relative_humidity),v=>`${Math.round(v)}%`,<Droplets size={15}/>,"#6ee7b7"],
    ["Wind",Number(current.wind_speed),v=>`${Math.round(v)} m/s`,<Wind size={15}/>,"#34d399"],
    ["Pressure",Number(current.surface_pressure),v=>`${Math.round(v)} hPa`,<Gauge size={15}/>,"#a7f3d0"],
    ["PBL / Mixing",pbl,v=>Number.isFinite(v)?`${Math.round(v)} m`:"Unavailable",<Layers3 size={15}/>,"#4ade80"],
    ["Inversion",inv?.strength,v=>inv?`${inv.status} · ${v>0?"+":""}${v}°C`:"Unavailable",<Activity size={15}/>,"#fbbf24"]
  ];
  return <div id="weather-section" className="aero-readable card-hover rounded-2xl p-5 flex flex-col gap-4" style={{background:"linear-gradient(145deg,rgba(7,35,24,.86),rgba(5,22,18,.78))",border:"1px solid rgba(74,222,128,.13)",backdropFilter:"blur(18px)"}}>
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3"><div><p className="text-sm font-bold text-slate-100 flex items-center gap-2"><CloudSun size={18} className="text-emerald-300"/>Weather & Atmosphere</p><p className="text-[10px] text-slate-400 mt-1">Backend weather observations and atmospheric conditions</p></div><span className="source-pill">{loading?"Updating…":error?"Unavailable":"LIVE · AeroAQI Backend"}</span></div>
    {error&&<div className="rounded-xl p-3 text-[10px] text-amber-200" style={{background:"rgba(245,158,11,.06)",border:"1px solid rgba(245,158,11,.15)"}}>Live weather unavailable right now. No fake weather values are shown.</div>}
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">{metrics.map(([label,val,fmt,icon,color])=><div key={label} className="science-card p-3 rounded-xl"><span style={{color}}>{icon}</span><p className="text-[9px] text-slate-400 mt-2">{label}</p><p className="text-sm font-extrabold text-slate-100 mt-1">{Number.isFinite(val)?fmt(val):"Unavailable"}</p></div>)}</div>
    <div className="rounded-2xl p-4" style={{background:"linear-gradient(135deg,rgba(34,197,94,.09),rgba(16,185,129,.035),rgba(255,255,255,.015))",border:"1px solid rgba(74,222,128,.1)"}}>
      <div className="flex items-center justify-between mb-3"><div><p className="text-xs font-bold text-[var(--text-primary)]">7-day weather & atmosphere outlook</p><p className="text-[9px] text-[var(--text-muted)]">Temperature · humidity · wind · pressure · mixing</p></div><span className="text-[9px] text-emerald-300">Delhi-NCR</span></div>
      <div className="flex gap-2 overflow-x-auto pb-1">{recent.map((row,i)=><button key={`${row.station_id}-${row.timestamp_utc}`} onClick={()=>setDay(i)} className="min-w-[150px] p-3 rounded-xl text-left" style={{background:i===day?"rgba(34,197,94,.12)":"var(--surface-secondary)",border:`1px solid ${i===day?"rgba(74,222,128,.25)":"var(--surface-hover)"}`}}><p className="text-[9px] text-[var(--text-muted)]">{new Date(row.timestamp_utc).toLocaleString("en-IN",{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"})}</p><p className="text-sm font-black text-[var(--text-primary)] mt-2">{Number.isFinite(Number(row.temperature))?`${Math.round(row.temperature)}°C`:"Unavailable"}</p><p className="text-[9px] text-emerald-300 mt-1">RH {Number.isFinite(Number(row.relative_humidity))?`${Math.round(row.relative_humidity)}%`:"Unavailable"}</p><p className="text-[9px] text-[var(--text-muted)] mt-1">Wind {Number.isFinite(Number(row.wind_speed))?`${Math.round(row.wind_speed)} m/s`:"Unavailable"}</p></button>)}</div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3">{[["Humidity",Number.isFinite(Number(selected.relative_humidity))?`${Math.round(selected.relative_humidity)}%`:"Unavailable"],["Wind",Number.isFinite(Number(selected.wind_speed))?`${Math.round(selected.wind_speed)} m/s`:"Unavailable"],["Pressure",Number.isFinite(Number(selected.surface_pressure))?`${Math.round(selected.surface_pressure)} hPa`:"Unavailable"],["PBL",Number.isFinite(Number(selected.pbl_height))?`${Math.round(selected.pbl_height)} m`:"Unavailable"]].map(([a,b])=><div key={a} className="p-3 rounded-xl bg-white/[.025]"><p className="text-[9px] text-[var(--text-muted)]">{a}</p><p className="text-xs font-bold text-[var(--text-primary)] mt-1">{b}</p></div>)}</div>
    </div>
    <p className="text-[9px] text-[var(--text-muted)]">PBL is a direct atmospheric model variable. Inversion is a derived indicator from real pressure-level temperatures (1000 hPa vs 925 hPa); it is not presented as a direct observation.</p>
  </div>;
}

// ─── Plume Tracker Panel ──────────────────────────────────
function PlumePanel() {
  const [tab,setTab]=useState(0);
  const [timeIdx,setTimeIdx]=useState(0);
  const [playing,setPlaying]=useState(false);
  const tabs=["Plume Map","Source Regions","Transport Animation"];
  const times=["Now","+12h","+24h","+48h","+72h"];
  useEffect(()=>{if(!playing)return;const id=setInterval(()=>setTimeIdx(v=>{if(v>=times.length-1){setPlaying(false);return 0}return v+1}),900);return()=>clearInterval(id)},[playing]);
  return <div id="plume-section" className="card-hover rounded-2xl p-5 flex flex-col gap-4" style={{background:"var(--surface)",border:"1px solid var(--surface-hover)",backdropFilter:"blur(16px)"}}>
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3"><div><p className="text-sm font-bold text-[var(--text-primary)]">Plume Tracker</p><p className="text-[10px] text-[var(--text-muted)] mt-0.5">Stubble burning · source attribution · transport toward NCR</p></div><span className="flex items-center gap-1 text-[10px] text-amber-300 px-2 py-1 rounded-full" style={{background:"rgba(245,158,11,.08)",border:"1px solid rgba(245,158,11,.18)"}}><Info size={11}/> Fire-source backend not exposed</span></div>
    <div className="flex gap-1 p-1 rounded-lg" style={{background:"var(--surface-hover)"}}>{tabs.map((t,i)=><button key={t} onClick={()=>setTab(i)} className={`flex-1 text-[10px] py-2 rounded-md font-semibold transition-all ${tab===i?"text-[var(--text-primary)]":"text-[var(--text-muted)] hover:text-[var(--text-secondary)]"}`} style={tab===i?{background:"linear-gradient(135deg,rgba(6,182,212,.25),rgba(59,130,246,.2))",border:"1px solid rgba(6,182,212,.2)"}:{}}>{t}</button>)}</div>
    {tab===0&&<div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-4">
      <div className="relative rounded-xl overflow-hidden min-h-[360px]" style={{background:"#051a0e",border:"1px solid var(--surface-hover)"}}>
        <div className="absolute inset-0 map-grid opacity-30"/>
        <div className="absolute inset-0 flex items-center justify-center"><div className="text-center max-w-sm px-5"><div className="mx-auto w-14 h-14 rounded-full flex items-center justify-center" style={{background:"rgba(34,211,238,.08)",border:"1px solid rgba(34,211,238,.18)"}}><Flame size={22} className="text-cyan-300"/></div><p className="text-sm font-bold text-[var(--text-primary)] mt-4">Awaiting fire detections</p><p className="text-[10px] text-[var(--text-muted)] mt-2 leading-relaxed">No fire/FRP endpoint is exposed by the current backend, so no fire counts, hotspots or plume values are invented in the frontend.</p></div></div>
        <div className="absolute bottom-3 left-3 right-3 flex items-center gap-3 text-[9px] text-[var(--text-muted)]"><span><i className="inline-block w-2 h-2 rounded-full bg-slate-500 mr-1"/>Backend fire data unavailable</span></div>
      </div>
      <div className="space-y-3"><div className="rounded-xl p-3" style={{background:"var(--surface-secondary)",border:"1px solid var(--surface-hover)"}}><p className="text-[10px] uppercase tracking-widest text-[var(--text-muted)]">Source region</p><div className="mt-3 rounded-lg p-3" style={{background:"rgba(245,158,11,.05)",border:"1px solid rgba(245,158,11,.12)"}}><p className="text-xs font-semibold text-amber-200">No backend fire-region data</p><p className="text-[10px] text-[var(--text-muted)] mt-1">Connect FIRMS/fire API to populate this panel.</p></div></div><div className="rounded-xl p-3" style={{background:"var(--surface-secondary)",border:"1px solid var(--surface-hover)"}}><p className="text-[10px] uppercase tracking-widest text-[var(--text-muted)]">Timeline</p><div className="flex items-center gap-2 mt-2"><button onClick={()=>setPlaying(v=>!v)} className="w-7 h-7 rounded-lg flex items-center justify-center text-emerald-300" style={{background:"rgba(6,182,212,.1)",border:"1px solid rgba(6,182,212,.2)"}}>{playing?<Pause size={12}/>:<Play size={12}/>}</button><span className="text-[10px] text-[var(--text-muted)]">{times[timeIdx]} · visualization only until fire backend is wired</span></div></div></div>
    </div>}
    {tab===1&&<div className="rounded-xl p-6 text-center" style={{background:"var(--surface-secondary)",border:"1px solid var(--surface-hover)"}}><p className="text-sm font-bold text-[var(--text-primary)]">Source-region data unavailable</p><p className="text-[10px] text-[var(--text-muted)] mt-2">This frontend intentionally does not fabricate Punjab/Haryana/Rajasthan/UP fire counts.</p></div>}
    {tab===2&&<div className="rounded-xl p-6 text-center" style={{background:"var(--surface-secondary)",border:"1px solid var(--surface-hover)"}}><p className="text-sm font-bold text-[var(--text-primary)]">Transport animation ready for backend data</p><p className="text-[10px] text-[var(--text-muted)] mt-2">The timeline control works, but plume intensity and fire transport values will appear only when the backend exposes them.</p></div>}
  </div>;
}

// ─── Alerts Panel ─────────────────────────────────────────
function playAlertTone(){try{const C=window.AudioContext||window.webkitAudioContext;if(!C)return;const ctx=new C();[0,0.16,0.32].forEach((t,i)=>{const o=ctx.createOscillator(),g=ctx.createGain();o.type="sine";o.frequency.value=[660,880,740][i];g.gain.setValueAtTime(.0001,ctx.currentTime+t);g.gain.exponentialRampToValueAtTime(.11,ctx.currentTime+t+.02);g.gain.exponentialRampToValueAtTime(.0001,ctx.currentTime+t+.13);o.connect(g);g.connect(ctx.destination);o.start(ctx.currentTime+t);o.stop(ctx.currentTime+t+.14)});setTimeout(()=>ctx.close(),700)}catch{}}
function AlertsPanel(){
  const [filter,setFilter]=useState("all");const [read,setRead]=useState({});const [muted,setMuted]=useState(()=>localStorage.getItem("aeroaqi_notifications")==="false");const [pulse,setPulse]=useState(0);
  const alerts=[
    {id:1,severity:"high",icon:<AlertTriangle size={15}/>,title:"High AQI Expected",desc:"Forecast risk window indicates possible AQI deterioration over the next 12 hours.",areas:"Delhi · Noida · Ghaziabad",time:"Updated recently",badge:"High risk",badgeC:"text-red-300",bg:"rgba(239,68,68,.07)",border:"rgba(239,68,68,.22)"},
    {id:2,severity:"mod",icon:<Info size={15}/>,title:"Moderate AQI Expected",desc:"Several NCR locations may cross the moderate-risk threshold during the next forecast window.",areas:"Gurugram · Faridabad",time:"Forecast window",badge:"Moderate",badgeC:"text-yellow-300",bg:"rgba(234,179,8,.07)",border:"rgba(234,179,8,.2)"},
    {id:3,severity:"info",icon:<Wind size={15}/>,title:"Dispersion Watch",desc:"Lower wind or shallow mixing can reduce pollutant dispersion near the surface.",areas:"NCR Region",time:"Monitoring",badge:"Advisory",badgeC:"text-emerald-300",bg:"rgba(6,182,212,.06)",border:"rgba(6,182,212,.18)"},
    {id:4,severity:"high",icon:<Flame size={15}/>,title:"Biomass Transport Risk",desc:"Upwind fire activity can increase particulate transport risk when wind aligns toward NCR.",areas:"Punjab · Haryana → Delhi",time:"Source watch",badge:"Source risk",badgeC:"text-orange-300",bg:"rgba(249,115,22,.07)",border:"rgba(249,115,22,.2)"},
  ];
  useEffect(()=>{const id=setInterval(()=>{setPulse(v=>v+1);if(!muted)playAlertTone()},4*60*60*1000);return()=>clearInterval(id)},[muted]);
  const filtered=alerts.filter(a=>filter==="all"||a.severity===filter);const unread=alerts.filter(a=>!read[a.id]).length;
  const toggleMute=()=>{const n=!muted;setMuted(n);localStorage.setItem("aeroaqi_notifications",String(!n));if(!n)playAlertTone()};
  return <div id="alerts-section" className="card-hover rounded-2xl p-5 flex flex-col gap-4" style={{background:"var(--surface)",border:"1px solid var(--surface-hover)",backdropFilter:"blur(18px)"}}>
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3"><div><p className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2"><BellRing size={18} className="text-amber-300"/>Alerts & Notifications <span className="notification-badge">{unread}</span></p><p className="text-[10px] text-[var(--text-muted)] mt-1">AQI · weather · source-risk monitoring with optional alert tone</p></div><div className="flex gap-2"><button onClick={()=>{setRead(Object.fromEntries(alerts.map(a=>[a.id,true])));}} className="text-[10px] px-3 py-1.5 rounded-lg text-[var(--text-secondary)]" style={{background:"var(--surface-hover)",border:"1px solid var(--surface-hover)"}}>Mark all read</button><button onClick={toggleMute} className="text-[10px] px-3 py-1.5 rounded-lg text-[var(--text-secondary)]" style={{background:muted?"rgba(239,68,68,.08)":"rgba(34,197,94,.08)",border:"1px solid var(--surface-hover)"}}>{muted?"Enable tone":"Mute tone"}</button></div></div>
    <div className="grid grid-cols-4 gap-1 p-1 rounded-xl" style={{background:"rgba(255,255,255,.035)"}}>{[["all","All"],["high","High"],["mod","Moderate"],["info","Info"]].map(([v,l])=><button key={v} onClick={()=>setFilter(v)} className="py-2 rounded-lg text-[10px] font-semibold" style={filter===v?{background:"rgba(34,211,238,.12)",border:"1px solid rgba(34,211,238,.18)",color:"#a5f3fc"}:{color:"#64748b"}}>{l}</button>)}</div>
    <div className="space-y-2.5">{filtered.map(a=><div key={a.id} className="p-4 rounded-xl transition-all hover:translate-x-1" style={{background:a.bg,border:`1px solid ${a.border}`,opacity:read[a.id]?.7:1}}><div className="flex items-start gap-3"><div className="p-2 rounded-xl" style={{background:"var(--surface-hover)"}}><span className={a.badgeC}>{a.icon}</span></div><div className="flex-1"><div className="flex items-center justify-between gap-2"><p className="text-xs font-bold text-[var(--text-primary)]">{a.title}</p><span className={`text-[9px] font-bold px-2 py-1 rounded-full ${a.badgeC}`} style={{background:"var(--surface-hover)"}}>{a.badge}</span></div><p className="text-[10px] text-[var(--text-muted)] mt-1.5 leading-relaxed">{a.desc}</p><div className="flex flex-wrap gap-3 mt-2"><span className="text-[9px] text-[var(--text-muted)] flex items-center gap-1"><MapPin size={9}/>{a.areas}</span><span className="text-[9px] text-[var(--text-muted)] flex items-center gap-1"><Clock size={9}/>{a.time}</span></div><div className="flex gap-2 mt-3"><button onClick={()=>setRead(v=>({...v,[a.id]:!v[a.id]}))} className="text-[9px] px-2.5 py-1.5 rounded-lg text-emerald-300" style={{background:"rgba(6,182,212,.08)",border:"1px solid rgba(6,182,212,.14)"}}>{read[a.id]?"Mark unread":"Mark read"}</button><button onClick={()=>window.alert(`${a.title}\n\n${a.desc}\n\nAreas: ${a.areas}`)} className="text-[9px] px-2.5 py-1.5 rounded-lg text-[var(--text-muted)]" style={{background:"var(--surface-hover)",border:"1px solid var(--surface-hover)"}}>Details</button></div></div></div></div>)}</div>
    <div className="rounded-xl p-3 flex items-center gap-3" style={{background:"var(--surface-secondary)",border:"1px solid var(--surface-hover)"}}><Radio size={14} className="text-green-400"/><p className="text-[9px] text-[var(--text-muted)]">Monitoring cycle: the production app should poll the backend every 4–6 hours. This UI also supports a notification tone when a new cycle is received.</p></div>
  </div>;
}

// ─── NCR Map Panel ────────────────────────────────────────
function NcrMapPanel() {
  const {stations:liveStations,live,loading}=useLiveStations();
  const [zoom,setZoom]=useState(10); const [layer,setLayer]=useState("dark"); const [selected,setSelected]=useState(null); const [showStations,setShowStations]=useState(true); const [pollutant,setPollutant]=useState("AQI"); const [showWind,setShowWind]=useState(true); const [showFires,setShowFires]=useState(true); const [showBoundary,setShowBoundary]=useState(true);
  const center={lat:28.62,lon:77.16};
  const tileSize=256;
  const worldPx=tileSize*Math.pow(2,zoom);
  const lonToX=lon=>(lon+180)/360*worldPx;
  const latToY=lat=>{const r=lat*Math.PI/180;return (1-Math.log(Math.tan(r)+1/Math.cos(r))/Math.PI)/2*worldPx;};
  const cx=lonToX(center.lon), cy=latToY(center.lat);
  const tiles=[]; const tileX=Math.floor(cx/tileSize),tileY=Math.floor(cy/tileSize); for(let dx=-2;dx<=2;dx++) for(let dy=-1;dy<=1;dy++){let x=tileX+dx,y=tileY+dy,n=Math.pow(2,zoom);if(x<0||x>=n||y<0||y>=n)continue;tiles.push({x,y,key:`${x}-${y}`,left:x*tileSize-cx+420,top:y*tileSize-cy+210});}
  const markerPos=s=>({left:420+(lonToX(s.lon)-cx),top:210+(latToY(s.lat)-cy)});

  // Derive marker colour directly from the numeric AQI value so every backend station
  // render with a visible marker even when some have no observation data.
  // Stations without AQI data fall back to a neutral slate colour.
  const aqiColour = aqi => {
    if (aqi == null || !Number.isFinite(aqi)) return "#64748b"; // slate — no data
    if (aqi <= 50)  return "#22c55e"; // green
    if (aqi <= 100) return "#eab308"; // yellow
    if (aqi <= 200) return "#f97316"; // orange
    if (aqi <= 300) return "#ef4444"; // red
    return "#a855f7";                 // purple
  };
  const pollutantKey = {AQI:"aqi", "PM2.5":"pm25", PM10:"pm10", O3:"o3", NO2:"no2"}[pollutant];
  const pollutantValue = station => station[pollutantKey];
  const pollutantColour = station => pollutant === "AQI" ? aqiColour(station.aqi) : aqiColour((pollutantValue(station) ?? 0) * (pollutant === "PM2.5" ? 1.8 : pollutant === "PM10" ? 0.8 : 1.5));

  return <div id="map-section" className="card-hover rounded-2xl p-5 flex flex-col gap-4" style={{background:"var(--surface)",border:"1px solid var(--surface-hover)",backdropFilter:"blur(16px)"}}>
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3"><div><p className="text-sm font-bold text-[var(--text-primary)]">Delhi-NCR Atmospheric Monitoring</p><p className="text-[10px] text-[var(--text-muted)] mt-0.5">{liveStations.length} backend stations · latest observations</p></div><div className="flex flex-wrap gap-2"><select value={pollutant} onChange={e=>setPollutant(e.target.value)} className="text-[10px] rounded-lg px-2 py-1.5 text-[var(--text-primary)]" style={{background:"var(--surface)",border:"1px solid var(--surface-hover)"}}>{["AQI","PM2.5","PM10","O3","NO2"].map(value=><option key={value}>{value}</option>)}</select><span className="flex items-center gap-1 text-[10px] text-green-400 px-2 py-1 rounded-full" style={{background:"rgba(34,197,94,.1)",border:"1px solid rgba(34,197,94,.2)"}}><span className="live-dot w-1.5 h-1.5 rounded-full bg-green-400"/>{loading?"Updating…":live?"Backend data":"Unavailable"}</span><button onClick={()=>setShowStations(v=>!v)} className="text-[10px] px-2.5 py-1 rounded-lg text-[var(--text-secondary)]" style={{background:"var(--surface-hover)",border:"1px solid var(--surface-hover)"}}>{showStations?"Hide stations":"Show stations"}</button></div></div>
    <div className="relative rounded-xl overflow-hidden h-[480px]" style={{background:"#08121d",border:"1px solid var(--surface-hover)"}}>
      <div className="absolute inset-0 overflow-hidden" style={{filter:layer==="dark"?"brightness(.62) invert(.88) hue-rotate(180deg) saturate(.78) contrast(1.18)":"none",transition:"filter .35s ease"}}>{tiles.map(t=><img key={t.key} alt="NCR map tile" src={`https://tile.openstreetmap.org/${zoom}/${t.x}/${t.y}.png`} className="absolute w-64 h-64" style={{left:t.left,top:t.top,maxWidth:"none"}} onError={e=>{e.currentTarget.style.opacity=.25}}/> )}</div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,transparent_0,rgba(2,8,23,.2)_70%)] pointer-events-none"/><div className="absolute inset-0 pointer-events-none" style={{background:"radial-gradient(circle at 24% 38%,rgba(34,197,94,.10),transparent 13%),radial-gradient(circle at 57% 47%,rgba(234,179,8,.08),transparent 14%),radial-gradient(circle at 72% 42%,rgba(239,68,68,.10),transparent 13%),radial-gradient(circle at 45% 66%,rgba(249,115,22,.08),transparent 12%)",mixBlendMode:layer==="dark"?"screen":"multiply",opacity:.9}}/><div className="absolute inset-0 pointer-events-none" style={{mixBlendMode:"screen",opacity:.28}}>{liveStations.map(station=>{const p=markerPos(station);const c=pollutantColour(station);return <span key={`heat-${station.station_id}`} className="absolute rounded-full blur-2xl" style={{left:p.left-34,top:p.top-34,width:68,height:68,background:`radial-gradient(circle,${c}aa,transparent 70%)`}}/>})}</div>
      {showBoundary && <div className="absolute inset-[10%] rounded-[42%] border border-cyan-300/30 pointer-events-none"/>}
      {showWind && <div className="absolute inset-0 pointer-events-none opacity-60">{[[18,28,30,34],[34,40,46,46],[52,52,64,58],[68,35,80,41],[28,68,40,74]].map(([x1,y1,x2,y2], index)=><span key={`wind-${index}`} className="absolute border-t border-dashed border-cyan-300/70" style={{left:`${x1}%`,top:`${y1}%`,width:`${x2-x1}%`,transform:`rotate(${index % 2 ? 12 : 7}deg)`}}/>)}</div>}
      {showFires && <div className="absolute left-[6%] top-[18%] flex gap-2 pointer-events-none"><Flame size={12} className="text-orange-400"/><Flame size={10} className="text-red-400"/><span className="text-[9px] text-orange-200">Fire Hotspots · Prototype / Simulated</span></div>}

      {/* Station markers — one per backend station, visible regardless of obs availability */}
      {showStations && liveStations.map(s => {
        const p = markerPos(s);
        const c = pollutantColour(s);
        const isSelected = selected?.station_id === s.station_id;
        const sz = isSelected ? 32 : 26;
        return (
          <button key={s.station_id} onClick={() => setSelected(s)}
            className="absolute -translate-x-1/2 -translate-y-1/2 group"
            style={{left:p.left, top:p.top}}>
            <span className="block rounded-full flex items-center justify-center"
              style={{width:sz, height:sz, background:`${c}33`, border:`1px solid ${c}88`, boxShadow:`0 0 14px ${c}66`}}>
              <span className="text-[9px] font-black text-[var(--text-primary)] leading-none">
                {s.aqi != null ? Math.round(s.aqi) : "—"}
              </span>
            </span>
            <span className="absolute left-1/2 -translate-x-1/2 top-full mt-1 hidden group-hover:block whitespace-nowrap text-[9px] font-semibold text-[var(--text-primary)] drop-shadow-lg">{s.name}</span>
          </button>
        );
      })}

      {/* Selected-station popup */}
      {selected && (() => {
        const c = aqiColour(selected.aqi);
        return (
          <div className="absolute left-3 top-3 rounded-xl p-3 w-52"
            style={{background:"rgba(2,12,7,.96)", border:`1px solid ${c}55`, backdropFilter:"blur(12px)"}}>
            <div className="flex items-center justify-between">
              <p className="text-[9px] text-[var(--text-muted)]">Selected station</p>
              <button onClick={() => setSelected(null)} className="text-[var(--text-muted)]"><X size={12}/></button>
            </div>
            <p className="text-sm font-bold text-[var(--text-primary)] mt-1">{selected.name}</p>
            <p className="text-2xl font-black mt-0.5" style={{color: c}}>
              {selected.aqi != null ? Math.round(selected.aqi) : "—"}
            </p>
            <p className="text-[10px] text-[var(--text-muted)]">
              AQI · {selected.aqi != null ? aqiLabel(selected.aqi) : "No data"}
            </p>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div>
                <p className="text-[9px] text-[var(--text-muted)]">PM2.5</p>
                <p className="text-[10px] text-[var(--text-primary)] font-semibold">
                  {selected.pm25 != null ? `${Math.round(selected.pm25)} µg/m³` : "No observation"}
                </p>
              </div>
              <div>
                <p className="text-[9px] text-[var(--text-muted)]">Agency</p>
                <p className="text-[10px] text-[var(--text-primary)] font-semibold">{selected.agency ?? "No observation"}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {[['Station ID', selected.station_id], ['City', selected.city], ['State', selected.state], ['PM10', selected.pm10], ['O3', selected.o3], ['NO2', selected.no2], ['Timestamp', selected.timestamp]].map(([label, value]) => <div key={label}><p className="text-[9px] text-[var(--text-muted)]">{label}</p><p className="text-[10px] text-[var(--text-primary)] font-semibold">{value == null ? "No observation" : label === "Timestamp" ? new Date(value).toLocaleString("en-IN") : ['Station ID', 'City', 'State'].includes(label) ? value : `${Math.round(value)} µg/m³`}</p></div>)}
            </div>
          </div>
        );
      })()}

      <div className="absolute top-3 right-3 flex flex-col gap-1"><button onClick={()=>setZoom(z=>Math.min(12,z+1))} className="w-8 h-8 rounded-lg text-[var(--text-primary)] flex items-center justify-center" style={{background:"var(--surface)",border:"1px solid var(--surface-hover)"}}><ZoomIn size={14}/></button><button onClick={()=>setZoom(z=>Math.max(9,z-1))} className="w-8 h-8 rounded-lg text-[var(--text-primary)] flex items-center justify-center" style={{background:"var(--surface)",border:"1px solid var(--surface-hover)"}}><ZoomOut size={14}/></button><button onClick={()=>setZoom(10)} className="w-8 h-8 rounded-lg text-[var(--text-primary)] flex items-center justify-center" style={{background:"var(--surface)",border:"1px solid var(--surface-hover)"}}><Crosshair size={14}/></button></div>
      <div className="absolute top-3 left-1/2 -translate-x-1/2 flex flex-wrap gap-1 p-1 rounded-lg" style={{background:"var(--surface)",border:"1px solid rgba(255,255,255,.1)"}}><button onClick={()=>setLayer("dark")} className={`px-2.5 py-1 rounded-md text-[9px] ${layer==="dark"?"text-emerald-300 bg-emerald-500/10":"text-[var(--text-muted)]"}`}>Dark</button><button onClick={()=>setLayer("light")} className={`px-2.5 py-1 rounded-md text-[9px] ${layer==="light"?"text-emerald-300 bg-emerald-500/10":"text-[var(--text-muted)]"}`}>Light</button><button onClick={()=>setShowWind(v=>!v)} className={`px-2.5 py-1 rounded-md text-[9px] ${showWind?"text-cyan-300 bg-cyan-500/10":"text-[var(--text-muted)]"}`}>Wind</button><button onClick={()=>setShowFires(v=>!v)} className={`px-2.5 py-1 rounded-md text-[9px] ${showFires?"text-orange-300 bg-orange-500/10":"text-[var(--text-muted)]"}`}>Fire Hotspots</button><button onClick={()=>setShowBoundary(v=>!v)} className={`px-2.5 py-1 rounded-md text-[9px] ${showBoundary?"text-emerald-300 bg-emerald-500/10":"text-[var(--text-muted)]"}`}>NCR Boundary</button></div>
      <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-2">
        <div className="rounded-lg px-3 py-2 text-[9px] text-[var(--text-secondary)]" style={{background:"rgba(2,12,7,.9)"}}>
          {pollutant} intensity · NCR coverage · {liveStations.length} monitoring points{live ? " · demo" : ""}
        </div>
        {[["#22c55e","Good ≤50"],["#eab308","Moderate ≤100"],["#f97316","Unhealthy ≤200"],["#ef4444","Poor ≤300"],["#a855f7","Severe >300"]].map(([c,l])=>(
          <span key={l} className="flex items-center gap-1 px-2 py-1 rounded text-[9px] text-[var(--text-secondary)]" style={{background:"rgba(2,12,7,.9)"}}>
            <i className="w-2 h-2 rounded-full flex-shrink-0" style={{background:c}}/>{l}
          </span>
        ))}
      </div>
    </div>

    {/* Bottom strip: show all stations, not just first 5 */}
    <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2">
      {liveStations.map(s => (
        <button key={s.station_id} onClick={() => setSelected(s)}
          className="rounded-xl p-2.5 text-left hover:bg-white/[.04] transition-colors"
          style={{background: selected?.station_id===s.station_id ? "rgba(34,197,94,.08)" : "var(--surface-secondary)", border:`1px solid ${selected?.station_id===s.station_id?"rgba(74,222,128,.2)":"var(--surface-hover)"}`}}>
          <p className="text-[10px] text-[var(--text-muted)] truncate">{s.name}</p>
          <p className="text-sm font-black" style={{color: aqiColour(s.aqi)}}>
            {s.aqi != null ? Math.round(s.aqi) : "—"}
          </p>
          <p className="text-[9px] text-[var(--text-muted)]">{s.pm25 != null ? `PM2.5 ${Math.round(s.pm25)}` : "no obs"}</p>
        </button>
      ))}
    </div>
  </div>;
}

// ─── Quick Actions ────────────────────────────────────────
function QuickActions({ onAction }) {
  const actions = [
    { icon:<BarChart3 size={18}/>, label:"AQI Forecast", sub:"72-Hour Prediction", path:"/forecast", color:"#8b5cf6", glow:"rgba(139,92,246,.2)" },
    { icon:<Map size={18}/>, label:"NCR Map", sub:"Spatial AQI Analysis", path:"/map", color:"#06b6d4", glow:"rgba(6,182,212,.2)" },
    { icon:<CloudSun size={18}/>, label:"Weather", sub:"Live Conditions", path:"/weather", color:"#f59e0b", glow:"rgba(245,158,11,.2)" },
    { icon:<Flame size={18}/>, label:"Plume Tracker", sub:"Transport Analysis", path:"/plume", color:"#f97316", glow:"rgba(249,115,22,.2)" },
    { icon:<Navigation size={18}/>, label:"Stations", sub:"NCR Monitoring", path:"/stations", color:"#22c55e", glow:"rgba(34,197,94,.2)" },
    { icon:<Bell size={18}/>, label:"Alerts", sub:"Risk Notifications", path:"/alerts", color:"#ef4444", glow:"rgba(239,68,68,.2)" },
    { icon:<Bot size={18}/>, label:"AI Insights", sub:"Explain the forecast", path:"/ai", color:"#06b6d4", glow:"rgba(6,182,212,.2)" },
    { icon:<FileText size={18}/>, label:"Reports", sub:"Analytics & Export", path:"/reports", color:"#3b82f6", glow:"rgba(59,130,246,.2)" },
    { icon:<Settings size={18}/>, label:"Settings", sub:"Profile & Preferences", path:"/settings", color:"#a855f7", glow:"rgba(168,85,247,.2)" },
  ];
  return <div id="quick-actions" className="grid grid-cols-2 sm:grid-cols-4 gap-3">{actions.map(a=><button key={a.path} onClick={()=>onAction(a.path)} className="card-hover p-4 rounded-xl flex flex-col items-center text-center gap-2.5" style={{background:"var(--surface)",border:"1px solid var(--surface-hover)",backdropFilter:"blur(12px)"}}><div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{background:a.glow,boxShadow:`0 0 16px ${a.glow}`}}><span style={{color:a.color}}>{a.icon}</span></div><div><p className="text-xs font-semibold text-[var(--text-primary)]">{a.label}</p><p className="text-[10px] text-[var(--text-muted)] mt-0.5">{a.sub}</p></div></button>)}</div>;
}

// ─── Footer ───────────────────────────────────────────────
function Footer() {
  return (
    <footer className="mt-8 py-5 px-1 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[var(--border)]">
      <span className="text-xs text-[var(--text-muted)]">Built by 4SKY ❤️</span>
    </footer>
  );
}

// ─── Utility / Feature sections ─────────────────────────────
function FeatureSection({ id, icon, title, subtitle, children }) {
  return (
    <section id={id} className="scroll-mt-20 rounded-2xl p-5"
      style={{background:"var(--surface)",border:"1px solid var(--surface-hover)",backdropFilter:"blur(16px)"}}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{background:"rgba(34,197,94,.1)",border:"1px solid rgba(74,222,128,.18)"}}>
          {icon}
        </div>
        <div>
          <p className="text-sm font-bold text-[var(--text-primary)]">{title}</p>
          <p className="text-[10px] text-[var(--text-muted)]">{subtitle}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

function ReportsSection() {
  const { stations, loading } = useLiveStations();
  const [type,setType]=useState("Executive AQI Report");
  const [range,setRange]=useState("72 hours");
  const [generated,setGenerated]=useState(false);
  const station = stations.find(s=>s.hasObs===true) || stations.find(s=>s.aqi!=null) || stations[0] || null;
  const [forecast,setForecast]=useState([]);

  useEffect(()=>{
    if(!station?.station_id){setForecast([]);return undefined;}
    let alive=true;
    apiGet(`/forecast/${encodeURIComponent(station.station_id)}?hours=72`)
      .then(data=>alive&&setForecast(Array.isArray(data?.hourly)?data.hourly:[]))
      .catch(()=>alive&&setForecast([]));
    return()=>{alive=false;};
  },[station?.station_id]);

  const num=v=>{const n=Number(v);return Number.isFinite(n)?n:null;};
  const currentAqi=num(station?.aqi);
  const currentPm25=num(station?.pm25);
  const forecastAqis=forecast.map(r=>num(r?.aqi_computed)).filter(v=>v!=null);
  const peak=forecastAqis.length?Math.max(...forecastAqis):null;
  const low=forecastAqis.length?Math.min(...forecastAqis):null;
  const downloadReport=()=>{
    const rows=[
      ["AeroAQI Report","Delhi-NCR"],["Report Type",type],["Range",range],
      ["Station",station?.name||"No station"],["Station ID",station?.station_id||""],
      ["Current AQI",currentAqi==null?"No observation":currentAqi],
      ["PM2.5",currentPm25==null?"No observation":`${currentPm25} µg/m³`],
      ["Peak Forecast AQI",peak==null?"No forecast":peak],
      ["Lowest Forecast AQI",low==null?"No forecast":low],
      ["Generated",new Date().toLocaleString("en-IN")]
    ];
    const csv=rows.map(r=>r.map(v=>`"${String(v).replaceAll('"','""')}"`).join(",")).join("\n");
    const blob=new Blob([csv],{type:"text/csv;charset=utf-8"}); const url=URL.createObjectURL(blob);
    const a=document.createElement("a");a.href=url;a.download="aeroaqi-delhi-ncr-report.csv";a.click();URL.revokeObjectURL(url);
  };
  const generate=()=>{setGenerated(false);window.setTimeout(()=>setGenerated(true),700)};
  const fmt=v=>v==null?"No observation":Number(v).toFixed(1);
  return <FeatureSection id="reports-section" icon={<FileText size={17} className="text-cyan-400"/>} title="Reports & Analytics" subtitle="Turn backend station and forecast intelligence into a judge-ready report">
    <div className="grid grid-cols-1 xl:grid-cols-[280px_1fr] gap-4">
      <div className="space-y-3">
        <div className="rounded-xl p-3" style={{background:"var(--surface-secondary)",border:"1px solid var(--surface-hover)"}}>
          <p className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] mb-2">Report type</p>
          <select value={type} onChange={e=>setType(e.target.value)} className="w-full rounded-lg px-3 py-2.5 text-xs text-[var(--text-primary)] outline-none" style={{background:"var(--surface)",border:"1px solid var(--surface-hover)"}}>
            <option>Executive AQI Report</option><option>72-Hour Forecast Report</option><option>Station Comparison Report</option><option>Pollution Source Report</option>
          </select>
        </div>
        <div className="rounded-xl p-3" style={{background:"var(--surface-secondary)",border:"1px solid var(--surface-hover)"}}>
          <p className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] mb-2">Analysis range</p>
          <div className="grid grid-cols-3 gap-1">{["24 hours","72 hours","7 days"].map(v=><button key={v} onClick={()=>setRange(v)} className={`py-2 rounded-lg text-[9px] font-semibold ${range===v?"text-emerald-200":"text-[var(--text-muted)]"}`} style={range===v?{background:"rgba(6,182,212,.13)",border:"1px solid rgba(6,182,212,.2)"}:{background:"rgba(255,255,255,.02)"}}>{v}</button>)}</div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={generate} className="btn-primary flex-1 px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2"><Sparkles size={13}/>{generated?"Report Ready":"Generate Report"}</button>
          <button onClick={downloadReport} className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[var(--text-secondary)] flex items-center gap-2" style={{background:"var(--surface-hover)",border:"1px solid var(--surface-hover)"}}><Download size={13}/>CSV</button>
          <button onClick={()=>window.print()} className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[var(--text-secondary)] flex items-center gap-2" style={{background:"var(--surface-hover)",border:"1px solid var(--surface-hover)"}}><FileText size={13}/>Print</button>
        </div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[["Current AQI",currentAqi==null?"—":Math.round(currentAqi),currentAqi==null?"No observation":aqiLabel(currentAqi),aqiColor(currentAqi??0)],["Peak Forecast",peak==null?"—":Math.round(peak),forecast.length?"72h backend forecast":"No forecast",aqiColor(peak??0)],["PM2.5",currentPm25==null?"—":`${fmt(currentPm25)} µg/m³`,currentPm25==null?"No observation":"Latest backend observation","#86efac"],["Stations",String(stations.length||0),loading?"Loading backend":"Backend station count","#22d3ee"]].map(([k,v,sub,c])=><div key={k} className="rounded-xl p-4" style={{background:"linear-gradient(145deg,rgba(8,37,26,.8),rgba(5,22,16,.85))",border:"1px solid rgba(74,222,128,.08)"}}><p className="text-[10px] text-[var(--text-muted)]">{k}</p><p className="text-2xl font-black mt-2" style={{color:c}}>{v}</p><p className="text-[9px] text-[var(--text-muted)] mt-1">{sub}</p></div>)}
        <div className="col-span-2 lg:col-span-4 rounded-xl p-4" style={{background:"var(--surface-secondary)",border:"1px solid var(--surface-hover)"}}>
          <div className="flex items-center justify-between mb-3"><div><p className="text-xs font-bold text-[var(--text-primary)]">Analytics snapshot</p><p className="text-[10px] text-[var(--text-muted)]">Selected backend station · forecast range · data freshness</p></div><span className="text-[9px] text-green-400 flex items-center gap-1"><ShieldCheck size={12}/>{station?"Backend data":"Waiting for backend"}</span></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">{[["Station",station?.name||"—"],["Station ID",station?.station_id||"—"],["Forecast rows",forecast.length||"—"],["Lowest AQI",low==null?"—":Math.round(low)]].map(([a,b])=><div key={a} className="p-3 rounded-lg" style={{background:"rgba(2,8,23,.35)"}}><p className="text-[9px] text-[var(--text-muted)]">{a}</p><p className="text-sm font-bold text-[var(--text-primary)] mt-1 truncate">{b}</p></div>)}</div>
        </div>
      </div>
    </div>
  </FeatureSection>;
}

function PipelineSection() {
  const stages=[
    ["Data Sources","AeroAQI backend observations and forecast endpoints","Live inputs"],
    ["Ingestion","Validation + timestamp sync","Normalizing"],
    ["Database","Unified master dataset","Stored"],
    ["Features","Weather + PBL + inversion + fire risk","Derived"],
    ["ML Forecast","72-hour AQI prediction","Predicting"],
    ["REST API","Forecast + stations + alerts","Serving"],
  ];
  const [selected,setSelected]=useState(0); const [running,setRunning]=useState(false); const [progress,setProgress]=useState(0);
  useEffect(()=>{if(!running)return; const id=setInterval(()=>setProgress(p=>{if(p>=100){clearInterval(id);setRunning(false);return 100}return p+4}),120);return()=>clearInterval(id)},[running]);
  return <FeatureSection id="pipeline-section" icon={<Activity size={17} className="text-cyan-400"/>} title="Data Pipeline" subtitle="See how AeroAQI turns observations into a 72-hour forecast">
    <div className="flex flex-wrap items-center justify-between gap-3 mb-4"><div className="text-[10px] text-[var(--text-muted)] flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-400 live-dot"/> End-to-end pipeline monitor</div><button onClick={()=>{setProgress(0);setRunning(true)}} disabled={running} className="btn-primary px-3 py-2 rounded-xl text-[10px] font-bold flex items-center gap-2 disabled:opacity-50"><RefreshCw size={12} className={running?"animate-spin":""}/>{running?`Running ${progress}%`:`Run pipeline check`}</button></div>
    <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
      {stages.map(([name,desc,status],i)=><button key={name} onClick={()=>setSelected(i)} className="p-3 rounded-xl text-left transition-all" style={{background:selected===i?"rgba(34,197,94,.12)":"rgba(34,197,94,.045)",border:`1px solid ${selected===i?"rgba(74,222,128,.28)":"rgba(34,197,94,.13)"}`}}><div className="flex items-center justify-between"><div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold" style={{background:selected===i?"rgba(34,197,94,.2)":"rgba(34,197,94,.1)",color:selected===i?"#86efac":"#86efac"}}>{i+1}</div>{i<5&&<ChevronRight size={12} className="text-slate-700"/>}</div><p className="text-[10px] font-bold text-[var(--text-primary)] mt-3">{name}</p><p className="text-[9px] text-[var(--text-muted)] mt-1 leading-relaxed">{desc}</p><p className="text-[9px] text-green-400 mt-2">{running && i<=Math.floor(progress/17)?"Processing…":"Ready"}</p></button>)}
    </div>
    <div className="mt-4 rounded-xl p-4 grid grid-cols-1 md:grid-cols-3 gap-3" style={{background:"var(--surface-secondary)",border:"1px solid var(--surface-hover)"}}><div><p className="text-[9px] text-[var(--text-muted)]">Selected stage</p><p className="text-sm font-bold text-[var(--text-primary)] mt-1">{stages[selected][0]}</p></div><div><p className="text-[9px] text-[var(--text-muted)]">Purpose</p><p className="text-xs text-[var(--text-secondary)] mt-1">{stages[selected][1]}</p></div><div><p className="text-[9px] text-[var(--text-muted)]">Current state</p><p className="text-xs text-green-300 mt-1">{stages[selected][2]} · verified</p></div></div>
    <div className="mt-4 h-2 rounded-full overflow-hidden" style={{background:"var(--surface-hover)"}}><div className="h-full rounded-full transition-all" style={{width:`${running?progress:100}%`,background:"linear-gradient(90deg,#06b6d4,#22c55e,#8b5cf6)"}}/></div>
  </FeatureSection>;
}

function SettingsSection({ user, onLogout, onProfileSaved }) {
  const [autoRefresh,setAutoRefresh]=useState(()=>localStorage.getItem("aeroaqi_auto_refresh")!=="false");
  const [notifications,setNotifications]=useState(()=>localStorage.getItem("aeroaqi_notifications")!=="false");
  const [name,setName]=useState(user?.name||"AeroAQI User"); const [phone,setPhone]=useState(user?.phone||"");
  const [photo,setPhoto]=useState(user?.photo||""); const [points,setPoints]=useState(()=>Number(localStorage.getItem("aeroaqi_points")||120)); const [saved,setSaved]=useState(false); const [reward,setReward]=useState(0);
  const updateToggle=(key,setter)=>setter(v=>{const next=!v;localStorage.setItem(key,String(next));return next});
  const saveProfile=()=>{const next={...user,name:name.trim()||"AeroAQI User",phone:phone.trim(),photo};localStorage.setItem("aeroaqi_user",JSON.stringify(next)); const acct=JSON.parse(localStorage.getItem("aeroaqi_account")||"null"); if(acct){localStorage.setItem("aeroaqi_account",JSON.stringify({...acct,name:next.name,phone:next.phone,photo:next.photo}))} onProfileSaved(next);setSaved(true);window.setTimeout(()=>setSaved(false),1800)};
  const addPoints=(n)=>{const next=points+n;setPoints(next);localStorage.setItem("aeroaqi_points",String(next));setReward(n);window.setTimeout(()=>setReward(0),1300)};
  const onPhoto=e=>{const file=e.target.files?.[0];if(!file)return; if(file.size>2_000_000){window.alert("Please choose a photo under 2 MB.");return;} const r=new FileReader();r.onload=()=>setPhoto(String(r.result));r.readAsDataURL(file)};
  return <FeatureSection id="settings-section" icon={<Settings size={17} className="text-cyan-400"/>} title="Profile & Settings" subtitle="Personalize your AeroAQI experience">
    <div className="grid grid-cols-1 xl:grid-cols-[300px_1fr] gap-4">
      <div className="rounded-2xl p-5 text-center" style={{background:"linear-gradient(145deg,rgba(8,37,26,.82),rgba(5,22,16,.85))",border:"1px solid rgba(74,222,128,.1)"}}>
        <div className="relative mx-auto w-24 h-24"><div className="w-24 h-24 rounded-full overflow-hidden flex items-center justify-center text-3xl font-black" style={{background:"linear-gradient(135deg,#16a34a,#22c55e)",border:"2px solid var(--surface-hover)"}}>{photo?<img src={photo} alt="Profile" className="w-full h-full object-cover"/>:(name||"A").charAt(0).toUpperCase()}</div><label className="absolute -right-1 -bottom-1 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer text-[var(--text-primary)]" style={{background:"#16a34a",border:"2px solid #061b12"}}><Upload size={13}/><input type="file" accept="image/*" onChange={onPhoto} className="hidden"/></label></div>
        <p className="text-lg font-black text-[var(--text-primary)] mt-3">{name||"AeroAQI User"}</p><p className="text-[10px] text-[var(--text-muted)]">{user?.email||"No email"}</p>
        <div className="mt-4 rounded-xl p-3" style={{background:"rgba(168,85,247,.08)",border:"1px solid rgba(168,85,247,.16)"}}><div className="flex items-center justify-center gap-2 text-purple-300"><Gift size={16}/><span className="text-xs font-bold">{points} Aero Points</span></div><p className="text-[9px] text-[var(--text-muted)] mt-1">Earn points for healthy-air actions</p>{reward>0&&<p className="text-[10px] text-green-300 mt-2 animate-bounce">+{reward} points 🎉</p>}</div>
      </div>
      <div className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3"><div className="p-3 rounded-xl" style={{background:"var(--surface-secondary)",border:"1px solid var(--surface-hover)"}}><label className="text-[10px] text-[var(--text-muted)]">Full name</label><input value={name} onChange={e=>setName(e.target.value)} className="mt-2 w-full rounded-lg px-3 py-2.5 text-xs text-[var(--text-primary)] outline-none" style={{background:"var(--surface)",border:"1px solid var(--surface-hover)"}}/></div><div className="p-3 rounded-xl" style={{background:"var(--surface-secondary)",border:"1px solid var(--surface-hover)"}}><label className="text-[10px] text-[var(--text-muted)] flex items-center gap-1"><Phone size={10}/> Mobile number</label><input value={phone} onChange={e=>setPhone(e.target.value.replace(/[^0-9+ -]/g,""))} placeholder="+91 98765 43210" className="mt-2 w-full rounded-lg px-3 py-2.5 text-xs text-[var(--text-primary)] outline-none" style={{background:"var(--surface)",border:"1px solid var(--surface-hover)"}}/></div></div>
        <div className="flex flex-wrap gap-2"><button onClick={saveProfile} className="btn-primary px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2">{saved?<CheckCircle2 size={14}/>:<Save size={14}/>} {saved?"Saved":"Save Profile"}</button><label className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[var(--text-secondary)] cursor-pointer flex items-center gap-2" style={{background:"var(--surface-hover)",border:"1px solid var(--surface-hover)"}}><ImageIcon size={13}/> Change photo<input type="file" accept="image/*" onChange={onPhoto} className="hidden"/></label></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">{[["Auto refresh","Refresh live-ready widgets",autoRefresh,"aeroaqi_auto_refresh",setAutoRefresh],["Notifications","AQI and weather alerts",notifications,"aeroaqi_notifications",setNotifications]].map(([label,sub,val,key,setter])=><button key={label} onClick={()=>updateToggle(key,setter)} className="w-full flex items-center justify-between p-3 rounded-xl text-left" style={{background:"var(--surface-secondary)",border:"1px solid var(--surface-hover)"}}><span><p className="text-xs font-semibold text-[var(--text-primary)]">{label}</p><p className="text-[10px] text-[var(--text-muted)]">{sub}</p></span><span className={`w-9 h-5 rounded-full p-0.5 ${val?"bg-emerald-500/50":"bg-slate-700"}`}><span className={`block w-4 h-4 rounded-full bg-white transition ${val?"translate-x-4":""}`}/></span></button>)}</div>
        <div className="rounded-xl p-4" style={{background:"rgba(168,85,247,.05)",border:"1px solid rgba(168,85,247,.12)"}}><div className="flex items-center justify-between"><div><p className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-2"><Gift size={14} className="text-purple-300"/> Earn Points & Gifts</p><p className="text-[10px] text-[var(--text-muted)] mt-1">Complete small AeroAQI actions to unlock rewards.</p></div><span className="text-sm font-black text-purple-300">{points} pts</span></div><div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-3"><button onClick={()=>addPoints(20)} className="p-3 rounded-lg text-left" style={{background:"var(--surface-secondary)"}}><Target size={14} className="text-emerald-300"/><p className="text-[10px] text-[var(--text-primary)] font-semibold mt-2">Check AQI</p><p className="text-[9px] text-green-300">+20 points</p></button><button onClick={()=>addPoints(30)} className="p-3 rounded-lg text-left" style={{background:"var(--surface-secondary)"}}><Heart size={14} className="text-pink-300"/><p className="text-[10px] text-[var(--text-primary)] font-semibold mt-2">Healthy-air tip</p><p className="text-[9px] text-green-300">+30 points</p></button><button onClick={()=>addPoints(50)} className="p-3 rounded-lg text-left" style={{background:"var(--surface-secondary)"}}><Award size={14} className="text-yellow-300"/><p className="text-[10px] text-[var(--text-primary)] font-semibold mt-2">Daily challenge</p><p className="text-[9px] text-green-300">+50 points</p></button></div><div className="mt-3 text-[9px] text-[var(--text-muted)]">Gift catalogue can later be connected to your real reward partner/backend.</div></div>
        <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 p-3 rounded-xl text-xs font-semibold text-red-300" style={{background:"rgba(239,68,68,.07)",border:"1px solid rgba(239,68,68,.18)"}}><LogOut size={14}/> Sign out</button>
      </div>
    </div>
  </FeatureSection>;
}



function MotionBackdrop(){
  const ref=useRef(null);
  useEffect(()=>{
    const el=ref.current;
    if(!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf=0, x=0, y=0, tx=0, ty=0;
    const onMove=(e)=>{ tx=(e.clientX/window.innerWidth-.5); ty=(e.clientY/window.innerHeight-.5); };
    const tick=()=>{
      x += (tx-x)*0.07; y += (ty-y)*0.07;
      el.style.setProperty('--mx', `${x*34}px`);
      el.style.setProperty('--my', `${y*26}px`);
      el.style.setProperty('--mx2', `${x*-18}px`);
      el.style.setProperty('--my2', `${y*-14}px`);
      el.style.setProperty('--glow-x', `${50+x*18}%`);
      el.style.setProperty('--glow-y', `${38+y*16}%`);
      raf=requestAnimationFrame(tick);
    };
    window.addEventListener('pointermove',onMove,{passive:true});
    raf=requestAnimationFrame(tick);
    return()=>{window.removeEventListener('pointermove',onMove);cancelAnimationFrame(raf);};
  },[]);
  return <div ref={ref} className="motion-backdrop" aria-hidden="true">
    <div className="motion-grid"/>
    <div className="motion-orb motion-orb-a"/>
    <div className="motion-orb motion-orb-b"/>
    <div className="motion-orb motion-orb-c"/>
    <div className="motion-cursor-glow"/>
    <div className="motion-stars">{Array.from({length:18},(_,i)=><i key={i} style={{'--i':i}}/> )}</div>
  </div>;
}

function AeroMotionStyles(){return <style>{`
/* AeroAQI readability overrides */
.aero-readable{color:#cbd5e1}.aero-readable .metric-value{color:#f1f5f9!important}.aero-readable .metric-label{color:#94a3b8!important}.aero-readable .section-title{color:#e2e8f0!important}.aero-readable table th{color:#94a3b8!important}.aero-readable table td{color:#cbd5e1!important}.aero-readable button{color:inherit}.aero-readable select{color:var(--text-primary)}.aero-readable button:hover{color:var(--text-primary)}
@keyframes aeroShimmer{0%{transform:translateX(-120%)}100%{transform:translateX(120%)}}
@keyframes aeroOrbit{from{transform:rotate(0deg) translateX(12px) rotate(0deg)}to{transform:rotate(360deg) translateX(12px) rotate(-360deg)}}
.science-card{background:linear-gradient(145deg,rgba(255,255,255,.035),rgba(255,255,255,.018));border:1px solid rgba(255,255,255,.055);transition:transform .25s ease,border-color .25s ease,box-shadow .25s ease;position:relative;overflow:hidden}.science-card:before{content:"";position:absolute;inset:0;background:linear-gradient(110deg,transparent,var(--surface-hover),transparent);transform:translateX(-120%);animation:aeroShimmer 5s ease-in-out infinite}.science-card:hover{transform:translateY(-3px);border-color:rgba(34,211,238,.2);box-shadow:0 16px 40px rgba(0,0,0,.2),0 0 24px rgba(34,211,238,.05)}
.source-pill{font-size:9px;color:#a5f3fc;padding:6px 9px;border-radius:999px;background:rgba(34,211,238,.07);border:1px solid rgba(34,211,238,.14)}
.notification-badge{display:inline-flex;align-items:center;justify-content:center;min-width:18px;height:18px;padding:0 5px;border-radius:999px;font-size:9px;background:rgba(239,68,68,.15);color:#fca5a5;border:1px solid rgba(239,68,68,.2)}
.science-ring{width:62px;height:62px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:radial-gradient(circle,rgba(34,211,238,.15),rgba(34,211,238,.03) 62%,transparent 63%);border:1px solid rgba(34,211,238,.2);box-shadow:0 0 35px rgba(34,211,238,.1);animation:aeroPulse 2.8s ease-in-out infinite}
@media (prefers-reduced-motion:reduce){.science-card:before{animation:none}.science-card{transition:none}.science-ring{animation:none}}
@keyframes aeroFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}
@keyframes aeroMarquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
@keyframes aeroFade{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
@keyframes aeroPulse{0%,100%{box-shadow:0 0 0 0 rgba(34,211,238,.12)}50%{box-shadow:0 0 0 9px rgba(34,211,238,0)}}
@keyframes aeroStar{0%,100%{opacity:.12;transform:translate3d(0,0,0) scale(.8)}50%{opacity:.55;transform:translate3d(0,-8px,0) scale(1)}}
.motion-backdrop{position:fixed;inset:0;overflow:hidden;pointer-events:none;z-index:0;--mx:0px;--my:0px;--mx2:0px;--my2:0px;--glow-x:50%;--glow-y:38%;}
.motion-backdrop:before{content:"";position:absolute;inset:0;background:radial-gradient(circle at var(--glow-x) var(--glow-y),rgba(34,211,238,.055),transparent 28%),radial-gradient(circle at 80% 80%,rgba(139,92,246,.045),transparent 28%);}
.motion-grid{position:absolute;inset:-5%;opacity:.18;transform:translate3d(var(--mx2),var(--my2),0);background-image:linear-gradient(rgba(148,163,184,.045) 1px,transparent 1px),linear-gradient(90deg,rgba(148,163,184,.045) 1px,transparent 1px);background-size:48px 48px;mask-image:radial-gradient(circle at center,#000 20%,transparent 78%);}
.motion-orb{position:absolute;border-radius:999px;filter:blur(1px);will-change:transform;transition:transform .12s linear;mix-blend-mode:screen;}
.motion-orb-a{width:360px;height:360px;left:-90px;top:10%;background:radial-gradient(circle,rgba(6,182,212,.13),transparent 68%);transform:translate3d(var(--mx),var(--my),0);}
.motion-orb-b{width:300px;height:300px;right:-60px;top:34%;background:radial-gradient(circle,rgba(139,92,246,.12),transparent 68%);transform:translate3d(var(--mx2),var(--my2),0);}
.motion-orb-c{width:260px;height:260px;left:38%;bottom:-100px;background:radial-gradient(circle,rgba(59,130,246,.09),transparent 68%);transform:translate3d(calc(var(--mx) * -.55),calc(var(--my) * -.55),0);}
.motion-cursor-glow{position:absolute;width:340px;height:340px;left:calc(var(--glow-x) - 170px);top:calc(var(--glow-y) - 170px);border-radius:50%;background:radial-gradient(circle,rgba(34,211,238,.045),transparent 67%);filter:blur(8px);}
.motion-stars{position:absolute;inset:0;transform:translate3d(var(--mx2),var(--my2),0);}
.motion-stars i{position:absolute;width:2px;height:2px;border-radius:50%;background:rgba(226,232,240,.75);left:calc((var(--i) * 17 + 9) * 1%);top:calc((var(--i) * 29 + 7) * 1%);animation:aeroStar calc(3s + (var(--i) * .18s)) ease-in-out infinite;animation-delay:calc(var(--i) * -.2s);}
.animate-float{animation:aeroFloat 4s ease-in-out infinite}.animate-marquee{animation:aeroMarquee 26s linear infinite}.animate-fade-in{animation:aeroFade .55s ease both}.live-dot{animation:aeroPulse 1.8s ease-out infinite}
@media (pointer:coarse){.motion-backdrop .motion-grid{transform:none}.motion-orb,.motion-stars{transform:none!important}.motion-cursor-glow{display:none}}
@media (prefers-reduced-motion:reduce){.motion-backdrop,.motion-backdrop *,.animate-float,.animate-marquee,.animate-fade-in,.live-dot{animation:none!important;transition:none!important}.motion-backdrop{display:none}}
.auth-motion{position:absolute;inset:0;overflow:hidden;pointer-events:none;--ax:0px;--ay:0px;--bx:0px;--by:0px;--gx:50vw;--gy:40vh}
.auth-motion:before{content:"";position:absolute;inset:0;background:radial-gradient(circle at var(--gx) var(--gy),rgba(34,211,238,.075),transparent 19%),radial-gradient(circle at 15% 80%,rgba(59,130,246,.07),transparent 25%),radial-gradient(circle at 88% 18%,rgba(139,92,246,.08),transparent 26%)}
.auth-grid{position:absolute;inset:-8%;opacity:.2;transform:translate3d(var(--bx),var(--by),0);background-image:linear-gradient(rgba(148,163,184,.045) 1px,transparent 1px),linear-gradient(90deg,rgba(148,163,184,.045) 1px,transparent 1px);background-size:52px 52px;mask-image:radial-gradient(circle at center,#000 15%,transparent 78%);transition:transform .15s linear}
.auth-orb{position:absolute;border-radius:999px;filter:blur(2px);will-change:transform;transition:transform .18s linear}
.auth-orb-a{width:420px;height:420px;left:-150px;top:12%;background:radial-gradient(circle,rgba(6,182,212,.12),transparent 67%);transform:translate3d(var(--ax),var(--ay),0)}
.auth-orb-b{width:360px;height:360px;right:-100px;top:35%;background:radial-gradient(circle,rgba(139,92,246,.11),transparent 67%);transform:translate3d(var(--bx),var(--by),0)}
.auth-orb-c{width:300px;height:300px;left:40%;bottom:-130px;background:radial-gradient(circle,rgba(59,130,246,.09),transparent 67%);transform:translate3d(calc(var(--ax) * -.55),calc(var(--ay) * -.55),0)}
.auth-cursor-glow{position:absolute;width:360px;height:360px;left:calc(var(--gx) - 180px);top:calc(var(--gy) - 180px);border-radius:50%;background:radial-gradient(circle,rgba(34,211,238,.045),transparent 68%);filter:blur(10px)}
.auth-stars{position:absolute;inset:0;transform:translate3d(var(--bx),var(--by),0)}
.auth-stars i{position:absolute;width:2px;height:2px;border-radius:50%;background:rgba(226,232,240,.55);left:calc((var(--i) * 17 + 7) * 1%);top:calc((var(--i) * 29 + 11) * 1%);animation:aeroStar calc(3s + (var(--i) * .16s)) ease-in-out infinite;animation-delay:calc(var(--i) * -.19s)}
.auth-feature-card,.auth-mini-card{transition:transform .25s ease,border-color .25s ease,background .25s ease,box-shadow .25s ease}
.auth-feature-card:hover{transform:translateY(-4px) rotateX(1deg);border-color:rgba(34,211,238,.2)!important;background:rgba(255,255,255,.075)!important;box-shadow:0 12px 35px rgba(0,0,0,.18)}
.auth-mini-card:hover{transform:translateY(-2px);background:var(--surface-hover)}
.auth-input{width:100%;border-radius:14px;padding:.82rem .85rem;background:rgba(2,8,23,.58);border:1px solid var(--surface-hover);color:white;outline:none;font-size:.82rem;transition:border-color .2s,box-shadow .2s,transform .2s}
.auth-input::placeholder{color:#475569}.auth-input:focus{border-color:rgba(34,211,238,.35);box-shadow:0 0 0 3px rgba(34,211,238,.06),0 0 25px rgba(34,211,238,.05);transform:translateY(-1px)}
.auth-otp{width:100%;letter-spacing:.65em;text-align:center;border-radius:16px;padding:1rem .8rem;background:rgba(2,8,23,.62);border:1px solid rgba(34,211,238,.2);color:white;outline:none;font-size:1.25rem;font-weight:800;transition:border-color .2s,box-shadow .2s}
.auth-otp:focus{border-color:rgba(34,211,238,.5);box-shadow:0 0 0 4px rgba(34,211,238,.06),0 0 35px rgba(34,211,238,.08)}
.auth-error{margin-top:.1rem;border-radius:12px;padding:.7rem .8rem;font-size:.7rem;color:#fecaca;background:rgba(239,68,68,.07);border:1px solid rgba(239,68,68,.16)}
.auth-info{margin-top:.1rem;border-radius:12px;padding:.7rem .8rem;font-size:.7rem;color:#a5f3fc;background:rgba(6,182,212,.07);border:1px solid rgba(34,211,238,.15);display:flex;align-items:center;gap:.45rem}
@media (pointer:coarse){.auth-motion .auth-grid,.auth-motion .auth-orb,.auth-motion .auth-stars{transform:none}.auth-cursor-glow{display:none}}
@media (prefers-reduced-motion:reduce){.auth-motion{display:none}.auth-feature-card,.auth-mini-card,.auth-input{transition:none}.auth-stars i{animation:none}}
/* Final visual cleanup: preserve the India Gate photograph instead of washing it out. */
.aero-hero-copy h2{color:#f8fafc!important;text-shadow:0 2px 18px rgba(0,0,0,.35)}
.aero-hero-copy p{color:#cbd5e1!important}
.aero-hero-copy .glass{background:rgba(2,8,23,.48)!important;border-color:rgba(148,163,184,.18)!important}
.aero-hero-copy .glass span{color:#e2e8f0!important}
.aero-hero-image{filter:brightness(.96) saturate(1.10) contrast(1.05)}
.auth-hero-image{filter:brightness(.72) saturate(1.08) contrast(1.06)}
/* Darker, easier-to-read typography: avoid pure white text across the dashboard. */
.text-white{color:#cbd5e1!important}
.aero-hero-copy h2{color:#e2e8f0!important}
.aero-hero-copy p{color:#b8c4d4!important}
.aero-hero-copy .glass span{color:#cbd5e1!important}
.source-pill{color:#7dd3fc!important}

.aero-bright-ui{font-size:1.04em}.aero-bright-ui h1{letter-spacing:-.02em}.aero-bright-ui h2{letter-spacing:-.015em}.aero-glow-card{box-shadow:0 10px 35px rgba(16,185,129,.08),0 0 28px rgba(34,211,238,.045)}.aero-shine{position:relative;overflow:hidden}.aero-shine:before{content:"";position:absolute;top:-20%;bottom:-20%;left:-35%;width:18%;pointer-events:none;background:linear-gradient(90deg,transparent,rgba(255,255,255,.22),transparent);transform:skewX(-18deg);animation:aeroShine 7s ease-in-out infinite}@keyframes aeroShine{0%,68%{left:-35%;opacity:0}74%{opacity:1}88%,100%{left:125%;opacity:0}}.aero-soft-bloom{filter:drop-shadow(0 0 12px rgba(16,185,129,.12))}
`}</style>}

// ─── ROOT APP ─────────────────────────────────────────────
async function hashPassword(password) {
  const data = new TextEncoder().encode(password);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2,"0")).join("");
}

function AeroBrand({ compact=false }) {
  return (
    <img
      src="/icon.png"
      alt="AeroAQI — Clean Air, Forecasted"
      className={compact ? "h-11 w-auto object-contain" : "h-16 sm:h-20 w-auto object-contain"}
    />
  );
}

function AuthMotionBackdrop() {
  const ref=useRef(null);
  useEffect(()=>{
    const root=ref.current;
    if(!root || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches || window.matchMedia?.('(pointer: coarse)').matches) return;
    let raf=0;
    const move=(e)=>{
      const x=(e.clientX/window.innerWidth-.5)*2;
      const y=(e.clientY/window.innerHeight-.5)*2;
      cancelAnimationFrame(raf);
      raf=requestAnimationFrame(()=>{
        root.style.setProperty('--ax',`${x*18}px`);
        root.style.setProperty('--ay',`${y*18}px`);
        root.style.setProperty('--bx',`${x*-10}px`);
        root.style.setProperty('--by',`${y*-10}px`);
        root.style.setProperty('--gx',`${e.clientX}px`);
        root.style.setProperty('--gy',`${e.clientY}px`);
      });
    };
    window.addEventListener('pointermove',move,{passive:true});
    return()=>{cancelAnimationFrame(raf);window.removeEventListener('pointermove',move);};
  },[]);
  const dots=Array.from({length:20},(_,i)=>i);
  return <div ref={ref} className="auth-motion" aria-hidden="true">
    <div className="auth-cursor-glow"/>
    <div className="auth-orb auth-orb-a"/><div className="auth-orb auth-orb-b"/><div className="auth-orb auth-orb-c"/>
    <div className="auth-grid"/>
    <div className="auth-stars">{dots.map(i=><i key={i} style={{'--i':i}}/>)}</div>
  </div>;
}

async function requestAeroOtp(channel, identifier) {
  const endpoint = import.meta?.env?.VITE_AUTH_OTP_ENDPOINT;
  if(!endpoint) throw new Error("OTP_SERVICE_NOT_CONFIGURED");
  const response = await fetch(endpoint,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({channel,identifier})});
  if(!response.ok) throw new Error("OTP_REQUEST_FAILED");
  return response.json().catch(()=>({}));
}

async function verifyAeroOtp(channel, identifier, otp) {
  const endpoint = import.meta?.env?.VITE_AUTH_OTP_VERIFY_ENDPOINT;
  if(!endpoint) throw new Error("OTP_SERVICE_NOT_CONFIGURED");
  const response = await fetch(endpoint,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({channel,identifier,otp})});
  if(!response.ok) throw new Error("OTP_VERIFY_FAILED");
  return response.json().catch(()=>({}));
}

function AuthScreen({ onAuthenticated }) {
  const [mode,setMode]=useState("login");
  const [method,setMethod]=useState("email");
  const [name,setName]=useState("");
  const [email,setEmail]=useState("");
  const [phone,setPhone]=useState("");
  const [password,setPassword]=useState("");
  const [confirm,setConfirm]=useState("");
  const [showPassword,setShowPassword]=useState(false);
  const [error,setError]=useState("");
  const [busy,setBusy]=useState(false);

  const identifier=method==="email"?email.trim().toLowerCase():phone.replace(/\D/g,"");
  const validIdentifier=method==="email"
    ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier)
    : identifier.length===10;

  const finishAuth=(profile)=>{
    localStorage.setItem("aeroaqi_user",JSON.stringify(profile));
    onAuthenticated(profile);
  };

  const submit=async(e)=>{
    e.preventDefault(); setError("");
    if(mode==="signup"&&!name.trim()) return setError("Please enter your name.");
    if(!validIdentifier) return setError(method==="email"?"Enter a valid email address.":"Enter a valid 10-digit mobile number.");
    if(password.length<6) return setError("Password must be at least 6 characters.");
    if(mode==="signup"&&password!==confirm) return setError("Passwords do not match.");

    setBusy(true);
    try{
      const accounts=JSON.parse(localStorage.getItem("aeroaqi_accounts")||"[]");
      const key=`${method}:${identifier}`;

      if(mode==="signup"){
        if(accounts.some(a=>a.key===key)) return setError("An account already exists. Please log in.");
        const passwordHash=await hashPassword(password);
        const account={
          key,method,name:name.trim(),
          email:method==="email"?identifier:"",
          phone:method==="phone"?identifier:"",
          passwordHash
        };
        accounts.push(account);
        localStorage.setItem("aeroaqi_accounts",JSON.stringify(accounts));
        localStorage.setItem("aeroaqi_account",JSON.stringify(account));
        finishAuth({name:account.name,email:account.email,phone:account.phone,photo:""});
      }else{
        const accountsMatch=accounts.find(a=>a.key===key);
        const legacy=JSON.parse(localStorage.getItem("aeroaqi_account")||"null");
        const passwordHash=await hashPassword(password);
        const matched=accountsMatch&&accountsMatch.passwordHash===passwordHash
          ? accountsMatch
          : legacy&&(
              (method==="email"&&legacy.email===identifier) ||
              (method==="phone"&&legacy.phone===identifier)
            )&&legacy.passwordHash===passwordHash ? legacy : null;

        if(!matched) return setError("Email/phone or password is incorrect.");
        finishAuth({
          name:matched.name||"AeroAQI User",
          email:matched.email||"",
          phone:matched.phone||"",
          photo:matched.photo||""
        });
      }
    }catch{
      setError("Something went wrong. Please try again.");
    }finally{setBusy(false);}
  };

  const demo=()=>finishAuth({
    name:"AeroAQI Demo User",email:"demo@aeroaqi.local",phone:"",photo:""
  });

  return <div className="relative min-h-screen flex items-center justify-center p-3 sm:p-5 text-[var(--text-primary)] overflow-hidden" style={{background:"var(--background)"}}>
    <AuthMotionBackdrop/>
    <div className="relative z-10 w-full max-w-6xl grid lg:grid-cols-[1.05fr_.95fr] rounded-[30px] overflow-hidden" style={{background:"var(--surface)",border:"1px solid var(--border)",boxShadow:"var(--shadow-float)",backdropFilter:"blur(24px)"}}>
      <section className="relative hidden lg:flex min-h-[720px] p-10 xl:p-12 flex-col justify-between overflow-hidden">
        <img src="/hero.png" alt="India Gate, Delhi" className="absolute inset-0 w-full h-full object-cover auth-hero-image" style={{opacity:.78}}/>
        <div className="absolute inset-0" style={{background:"linear-gradient(90deg,rgba(2,8,23,.72),rgba(2,8,23,.28) 58%,rgba(2,8,23,.12)),linear-gradient(180deg,rgba(2,8,23,.10),rgba(2,8,23,.52))"}}/>
        <div className="relative z-10">
          <AeroBrand/>
          <div className="mt-24 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4" style={{background:"rgba(34,197,94,.1)",border:"1px solid rgba(74,222,128,.2)"}}>
              <span className="w-2 h-2 rounded-full bg-emerald-300 live-dot"/>
              <span className="text-[10px] tracking-[.22em] text-emerald-200 font-bold">DELHI-NCR AIR INTELLIGENCE</span>
            </div>
            <h2 className="text-5xl xl:text-6xl font-black leading-[.94] tracking-tight">Forecast the Air.<br/><span className="text-emerald-300">Understand the Why.</span></h2>
            <p className="text-sm text-[var(--text-secondary)] mt-6 max-w-lg leading-relaxed">Air quality, weather, atmospheric conditions, source regions, forecasts and explainable AI — together in one SIH-ready dashboard.</p>
            <div className="grid grid-cols-2 gap-3 mt-8">
              {[[<Gauge size={16}/>,"72h","AQI Forecast"],[<Map size={16}/>,"NCR","Spatial Map"],[<Bot size={16}/>,"AI","Explainable Insights"],[<Radio size={16}/>,"Live","Monitoring"]].map(([icon,value,label])=>
                <div key={label} className="rounded-2xl p-4" style={{background:"rgba(255,255,255,.055)",border:"1px solid rgba(255,255,255,.1)"}}>
                  <div className="flex items-center gap-2 text-emerald-200">{icon}<span className="text-lg font-black text-[var(--text-primary)]">{value}</span></div>
                  <p className="text-[10px] text-[var(--text-muted)] mt-1">{label}</p>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="relative z-10 text-[11px] text-[var(--text-muted)]">Built by <span className="font-black text-emerald-300">4SKY</span></div>
      </section>

      <section className="p-6 sm:p-9 xl:p-12 flex flex-col justify-center">
        <div className="lg:hidden mb-7"><AeroBrand/></div>
        <div className="flex p-1 rounded-2xl mb-7" style={{background:"var(--surface-hover)",border:"1px solid var(--surface-hover)"}}>
          <button onClick={()=>{setMode("login");setError("");}} className={`flex-1 py-3 rounded-xl text-sm font-bold ${mode==="login"?"text-[var(--text-primary)]":"text-[var(--text-muted)]"}`} style={mode==="login"?{background:"rgba(34,197,94,.14)"}:{}}>Login</button>
          <button onClick={()=>{setMode("signup");setError("");}} className={`flex-1 py-3 rounded-xl text-sm font-bold ${mode==="signup"?"text-[var(--text-primary)]":"text-[var(--text-muted)]"}`} style={mode==="signup"?{background:"rgba(34,197,94,.14)"}:{}}>Sign up</button>
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-2 text-emerald-300 mb-2"><ShieldCheck size={17}/><span className="text-[10px] font-bold tracking-[.18em] uppercase">Secure local prototype access</span></div>
          <h3 className="text-3xl font-black tracking-tight">{mode==="login"?"Welcome back 👋":"Create your AeroAQI account"}</h3>
          <p className="text-sm text-[var(--text-muted)] mt-2">Use either your email or mobile number with a password.</p>
        </div>

        <form onSubmit={submit} className="space-y-3">
          {mode==="signup"&&<input value={name} onChange={e=>setName(e.target.value)} placeholder="Full name" className="auth-input"/>}
          <div className="grid grid-cols-2 gap-2 p-1 rounded-xl" style={{background:"rgba(255,255,255,.035)"}}>
            <button type="button" onClick={()=>{setMethod("email");setError("");}} className="py-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2" style={method==="email"?{background:"rgba(34,197,94,.14)",color:"white"}:{color:"#64748b"}}><Mail size={14}/> Email</button>
            <button type="button" onClick={()=>{setMethod("phone");setError("");}} className="py-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2" style={method==="phone"?{background:"rgba(34,197,94,.14)",color:"white"}:{color:"#64748b"}}><Phone size={14}/> Mobile</button>
          </div>

          {method==="email"
            ? <div className="relative"><Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400"/><input value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="Email address" className="auth-input pl-10" autoComplete="email"/></div>
            : <div className="relative"><Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400"/><input value={phone} onChange={e=>setPhone(e.target.value.replace(/\D/g,"").slice(0,10))} type="tel" inputMode="numeric" placeholder="10-digit mobile number" className="auth-input pl-10" autoComplete="tel"/></div>}

          <div className="relative">
            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"/>
            <input value={password} onChange={e=>setPassword(e.target.value)} type={showPassword?"text":"password"} placeholder="Password (minimum 6 characters)" className="auth-input pl-10 pr-16" autoComplete={mode==="login"?"current-password":"new-password"}/>
            <button type="button" onClick={()=>setShowPassword(v=>!v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-emerald-300">{showPassword?"Hide":"Show"}</button>
          </div>

          {mode==="signup"&&<input value={confirm} onChange={e=>setConfirm(e.target.value)} type={showPassword?"text":"password"} placeholder="Confirm password" className="auth-input" autoComplete="new-password"/>}
          {error&&<div className="auth-error">{error}</div>}
          <button disabled={busy} className="btn-primary w-full py-3.5 rounded-xl text-sm font-bold disabled:opacity-50">{busy?"Please wait…":mode==="login"?"Login to AeroAQI":"Create Account"}</button>
        </form>

        <div className="relative my-5"><div className="border-t border-white/[.06]"/><span className="absolute left-1/2 -translate-x-1/2 -top-2.5 px-3 text-[9px] text-[var(--text-muted)]" style={{background:"var(--background)"}}>OR</span></div>
        <button onClick={demo} className="w-full py-3 rounded-xl text-xs font-bold text-emerald-100" style={{background:"rgba(34,197,94,.06)",border:"1px solid rgba(74,222,128,.14)"}}><Eye size={14} className="inline mr-2"/>Explore Demo Dashboard</button>
      </section>
    </div>
  </div>;
}

// ─── App pages + lightweight client-side router ─────────────
const ROUTES = [
  { path:"/",        label:"Dashboard",              index:0 },
  { path:"/map",     label:"NCR Map",                index:1 },
  { path:"/forecast",label:"AQI Forecast",           index:2 },
  { path:"/wrf-chem",label:"WRF-Chem",              index:3 },
  { path:"/weather", label:"Weather & Atmosphere",   index:4 },
  { path:"/plume",   label:"Plume Tracker",          index:5 },
  { path:"/alerts",  label:"Alerts & Notifications", index:6 },
  { path:"/stations",label:"Stations",               index:7 },
  { path:"/reports", label:"Reports",                index:8 },
  { path:"/pipeline",label:"Data Pipeline",          index:9 },
  { path:"/ai",      label:"AI Insights",             index:10 },
  { path:"/settings",label:"Profile & Settings",     index:11 },
];

function routeForIndex(index) { return ROUTES.find(r => r.index === index)?.path || "/"; }
function indexForPath(path) { return ROUTES.find(r => r.path === path)?.index ?? 0; }

function PageHeader({ eyebrow="AeroAQI · Delhi", title, subtitle, action }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-5">
      <div>
        <p className="text-[10px] uppercase tracking-[.2em] text-emerald-400 font-bold mb-1.5">{eyebrow}</p>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[var(--text-primary)]">{title}</h2>
        <p className="text-sm text-[var(--text-muted)] mt-1 max-w-2xl">{subtitle}</p>
      </div>
      {action}
    </div>
  );
}

function DemoDataNotice() {
  return (
    <div className="rounded-xl px-4 py-3 mb-5 flex flex-col sm:flex-row sm:items-center gap-2"
      style={{background:"rgba(245,158,11,.06)",border:"1px solid rgba(245,158,11,.16)"}}>
      <Info size={15} className="text-amber-400 shrink-0"/>
      <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
        <span className="font-semibold text-amber-300">Frontend integration checkpoint:</span> live mode is enabled. Values are shown only when received from the backend or a clearly labelled live scientific source; unavailable values are not replaced with fake numbers.
      </p>
    </div>
  );
}

function ForecastPage() {
  // ── Station list from live backend (P1 hook) ──────────────────────────
  const { stations, loading: stationsLoading } = useLiveStations();

  // Selected station — default to first available; persisted as station_id
  const [selectedId, setSelectedId] = useState(null);

  // When the station list arrives, set a default if nothing is selected yet.
  // Prefer the first station that has real observation data (aqi != null / hasObs),
  // so ForecastPage opens on a station that is likely to have forecast rows.
  // Fall back to stations[0] if none have observations yet.
  useEffect(() => {
    if (!selectedId && stations.length > 0) {
      const preferred =
        stations.find(s => s.hasObs === true) ||
        stations.find(s => s.aqi != null) ||
        stations[0];
      setSelectedId(preferred.station_id);
    }
  }, [stations, selectedId]);

  // ── Pollutant/horizon selectors ──────────────────────────────────────
  const [pollutant, setPollutant] = useState("AQI");
  const [horizon, setHorizon] = useState(72);

  // ── Forecast data from backend ────────────────────────────────────────
  const [forecastState, setForecastState] = useState({
    loading: false, hourly: [], modelTrained: null, error: null, generatedAt: null,
  });

  useEffect(() => {
    if (!selectedId) return;

    let alive = true;
    setForecastState(s => ({ ...s, loading: true, error: null }));

    apiGet(`/forecast/${encodeURIComponent(selectedId)}?hours=72`)
      .then(data => {
        if (!alive) return;
        setForecastState({
          loading: false,
          hourly: data?.hourly ?? [],
          modelTrained: data?.model_trained ?? false,
          error: data?.model_trained === false ? (data?.message ?? "Model not trained yet.") : null,
          generatedAt: data?.generated_at ?? null,
        });
      })
      .catch(err => {
  if (!alive) return;

  setForecastState(prev => ({
    loading: false,
    hourly: prev.hourly?.length ? prev.hourly : [],
    modelTrained: prev.hourly?.length ? prev.modelTrained : false,
    error: prev.hourly?.length
      ? "Live refresh unavailable — showing last synced forecast."
      : `Forecast unavailable: ${err.message}`,
    generatedAt: prev.hourly?.length ? prev.generatedAt : null,
  }));
});

    return () => { alive = false; };
  }, [selectedId]);

  // ── Build chart data from backend hourly array ────────────────────────
  // Each hourly row: { forecast_hour, target_utc, pm25, pm10, o3, no2, aqi_computed, aqi_category }
  // Filter to selected horizon, then map to chart-friendly shape.
  const chartData = forecastState.hourly
    .filter(h => h.forecast_hour <= horizon)
    .map(h => ({
      t:    `+${h.forecast_hour}h`,
      aqi:  h.aqi_computed  != null ? Math.round(h.aqi_computed)  : null,
      pm25: h.pm25          != null ? Math.round(h.pm25)          : null,
      pm10: h.pm10          != null ? Math.round(h.pm10)          : null,
      no2:  h.no2           != null ? Math.round(h.no2)           : null,
      o3:   h.o3            != null ? Math.round(h.o3)            : null,
      cat:  h.aqi_category  ?? null,
    }));

  // Derive the data key the chart should draw for the active pollutant
  const dataKey = pollutant === "PM2.5" ? "pm25"
    : pollutant === "PM10"  ? "pm10"
    : pollutant === "NO2"   ? "no2"
    : pollutant === "O3"    ? "o3"
    : "aqi";

  // Stats cards: only compute from real values, never fill with fake data
  const vals = chartData.map(d => d[dataKey]).filter(v => v != null);
  const peak = vals.length ? Math.max(...vals) : null;
  const low  = vals.length ? Math.min(...vals) : null;

  // True when forecast data loaded but the selected pollutant column is entirely null.
  // This happens for PM10 when insufficient observations were available during training.
  

  // Human-readable label for the selected station
  const selectedStation = stations.find(s => s.station_id === selectedId);
  const stationLabel = selectedStation?.name ?? selectedId ?? "—";

  const isLoading  = (stationsLoading && stations.length === 0) || (!stationsLoading && !!selectedId && forecastState.loading);
  const hasData    = chartData.length > 0;
  const pollutantUnavailable = false;
  const hasError   = forecastState.error && !forecastState.loading;

  return <>
    <PageHeader
      title="AQI Forecast"
      subtitle="Interactive 72-hour prediction workspace with pollutant trends and station comparison."
      action={
        <div className="flex gap-2">
          {/* Station selector — populated from live /stations endpoint */}
          <select
            value={selectedId ?? ""}
            onChange={e => setSelectedId(e.target.value)}
            className="rounded-xl px-3 py-2 text-xs text-[var(--text-primary)] outline-none"
            style={{background:"var(--surface)", border:"1px solid var(--surface-hover)"}}
            disabled={stationsLoading || stations.length === 0}
          >
            {stationsLoading
              ? <option value="">Loading stations…</option>
              : stations.length === 0
                ? <option value="">Backend unavailable — no stations</option>
                : stations.map(s => (
                    <option key={s.station_id} value={s.station_id}>{s.name}</option>
                  ))
            }
          </select>
        </div>
      }
    />

    <FeatureSection
      icon={<BarChart3 size={18} className="text-purple-400"/>}
      title="72-Hour AQI Forecast"
      subtitle={`${stationLabel} · ${hasData ? "AeroAQI Backend" : "awaiting data"} · pollutant selector`}
    >
      {/* ── Controls ────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex gap-1 p-1 rounded-lg" style={{background:"var(--surface-hover)"}}>
          {['AQI','PM2.5','PM10','NO2','O3'].map(v => (
            <button key={v} onClick={() => setPollutant(v)}
              className={`px-3 py-1.5 rounded-md text-[10px] font-semibold ${pollutant===v?'text-[var(--text-primary)]':'text-[var(--text-muted)]'}`}
              style={pollutant===v?{background:"rgba(139,92,246,.15)",border:"1px solid rgba(139,92,246,.22)"}:{}}>
              {v}
            </button>
          ))}
        </div>
        <div className="flex gap-1 p-1 rounded-lg" style={{background:"var(--surface-hover)"}}>
          {[24,48,72].map(v => (
            <button key={v} onClick={() => setHorizon(v)}
              className={`px-3 py-1.5 rounded-md text-[10px] font-semibold ${horizon===v?'text-emerald-200':'text-[var(--text-muted)]'}`}
              style={horizon===v?{background:"rgba(6,182,212,.08)",border:"1px solid rgba(6,182,212,.2)"}:{}}>
              {v}h
            </button>
          ))}
        </div>
      </div>

      {/* ── Loading state ────────────────────────────────────────────── */}
      {isLoading && (
        <div className="h-[390px] flex items-center justify-center text-[var(--text-muted)] text-xs gap-2">
          <RefreshCw size={14} className="animate-spin text-emerald-400"/>
          {stationsLoading && stations.length === 0 ? "Loading stations…" : "Loading forecast from backend…"}
        </div>
      )}

      {/* ── No stations / backend unavailable ───────────────────────── */}
      {!isLoading && !selectedId && (
        <div className="h-[390px] flex flex-col items-center justify-center gap-3">
          <div className="rounded-xl px-5 py-4 text-center max-w-md"
            style={{background:"rgba(245,158,11,.06)",border:"1px solid rgba(245,158,11,.16)"}}>
            <p className="text-xs font-semibold text-amber-300 mb-1">No stations available</p>
            <p className="text-[11px] text-[var(--text-muted)]">The AeroAQI backend did not return any stations. Ensure the API server is running and the ingestion pipeline has been executed at least once.</p>
          </div>
        </div>
      )}

      {/* ── Error / no-model state ───────────────────────────────────── */}
      {hasError && !isLoading && (
        <div className="h-[390px] flex flex-col items-center justify-center gap-3">
          <div className="rounded-xl px-5 py-4 text-center max-w-md"
            style={{background:"rgba(245,158,11,.06)",border:"1px solid rgba(245,158,11,.16)"}}>
            <p className="text-xs font-semibold text-amber-300 mb-1">Forecast unavailable</p>
            <p className="text-[11px] text-[var(--text-muted)]">{forecastState.error}</p>
            <p className="text-[10px] text-[var(--text-muted)] mt-2">Run: <code className="text-emerald-300">python scripts/train_model.py</code></p>
          </div>
        </div>
      )}

      {/* ── Chart ───────────────────────────────────────────────────── */}
      {!isLoading && !hasError && (
        <div className="h-[390px]">
          {/* Pollutant-specific unavailability notice (e.g. PM10 with no model) */}
          {pollutantUnavailable ? (
            <div className="h-full flex flex-col items-center justify-center gap-3">
              <div className="rounded-xl px-5 py-4 text-center max-w-md"
                style={{background:"rgba(100,116,139,.06)",border:"1px solid rgba(100,116,139,.18)"}}>
                <p className="text-xs font-semibold text-[var(--text-secondary)] mb-1">
                  {pollutant} forecast unavailable
                </p>
                <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
                  Insufficient recent {pollutant} source data — no model was trained for this pollutant.
                  Other pollutants (AQI, PM2.5, O₃, NO₂) are unaffected.
                </p>
                <p className="text-[10px] text-[var(--text-muted)] mt-2">
                  Re-run ingestion after OpenAQ begins reporting {pollutant} readings, then retrain:
                  <br/><code className="text-emerald-300">python scripts/run_ingestion.py --mode realtime</code>
                </p>
              </div>
            </div>
          ) : hasData ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{top:10,right:10,left:-10,bottom:5}}>
                <defs>
                  <linearGradient id="forecast-page-aqi" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#22c55e" stopOpacity={.34}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={.02}/>
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--surface-hover)" vertical={false}/>
                <XAxis dataKey="t" tick={{fontSize:10,fill:"#64748b"}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fontSize:10,fill:"#64748b"}} axisLine={false} tickLine={false}/>
                <Tooltip content={<ForecastTooltip/>}/>
                <ReferenceLine y={200} stroke="rgba(239,68,68,.25)"    strokeDasharray="4 4"/>
                <ReferenceLine y={150} stroke="rgba(249,115,22,.20)"   strokeDasharray="4 4"/>
                <Area type="monotone" dataKey={dataKey}
                  stroke="#22c55e" strokeWidth={2.5}
                  fill="url(#forecast-page-aqi)" connectNulls dot={false}/>
                {/* Secondary line: PM2.5 always shown alongside AQI for context */}
                {pollutant === "AQI" && (
                  <Line type="monotone" dataKey="pm25" name="PM2.5"
                    stroke="#86efac" strokeWidth={1.5} dot={false} connectNulls/>
                )}
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-[var(--text-muted)] text-xs">
              No forecast data for this station yet.
            </div>
          )}
        </div>
      )}

      {/* ── Stats cards ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mt-4">
        {[
          ['Horizon',         `${horizon} hours`],
          ['Peak',            peak  != null ? String(peak)  : '—'],
          ['Lowest',          low   != null ? String(low)   : '—'],
          ['Generated',       forecastState.generatedAt
                                ? new Date(forecastState.generatedAt).toLocaleString('en-IN',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'})
                                : '—'],
          ['Source',          hasData ? 'AeroAQI Backend' : 'No data'],
        ].map(([k,v]) => (
          <div key={k} className="rounded-xl p-3" style={{background:"var(--surface-secondary)",border:"1px solid var(--surface-hover)"}}>
            <p className="text-[10px] text-[var(--text-muted)]">{k}</p>
            <p className="text-sm font-bold text-[var(--text-primary)] mt-1">{v}</p>
          </div>
        ))}
      </div>

      {/* ── Context cards ───────────────────────────────────────────── */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
        {[
          ['What changed?', hasData
            ? `${pollutant} forecast loaded from backend for ${stationLabel}.`
            : 'Run the ingestion pipeline and train the model to see forecast data.'],
          ['Why?', 'Wind, atmospheric mixing, PBL height and fire transport risk drive the AQI curve.'],
          ['What next?', 'Use AI Insights to see the SHAP explanation for the top forecast drivers.'],
        ].map(([a,b]) => (
          <div key={a} className="p-3 rounded-xl" style={{background:"var(--surface-secondary)",border:"1px solid var(--surface-hover)"}}>
            <p className="text-[10px] font-bold text-emerald-300">{a}</p>
            <p className="text-[10px] text-[var(--text-muted)] mt-1 leading-relaxed">{b}</p>
          </div>
        ))}
      </div>
    </FeatureSection>
  </>;
}

function ForecastTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div
      style={{
        background: "var(--surface)",
        border: "1px solid rgba(74, 222, 128, 0.25)",
        borderRadius: "12px",
        padding: "10px 12px",
        boxShadow: "var(--shadow-float)"
      }}
    >
      <p
        style={{
          color: "#94a3b8",
          fontSize: "10px",
          marginBottom: "5px"
        }}
      >
        {label}
      </p>

      {payload.map((item, index) => (
        <div
          key={`${item.dataKey || item.name}-${index}`}
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "18px",
            fontSize: "11px",
            fontWeight: 700
          }}
        >
          <span style={{ color: "#cbd5e1" }}>
            {item.name || item.dataKey}
          </span>

          <span style={{ color: "#86efac" }}>
            {typeof item.value === "number"
              ? Math.round(item.value)
              : item.value}
          </span>
        </div>
      ))}
    </div>
  );
}

function DashboardPage({ navigate }) {
    const { stations, live, loading } = useLiveStations();

  const liveStation =
    stations.find(s => s.hasObs === true) ||
    stations.find(s => s.aqi != null) ||
    null;

  const currentAqi = liveStation?.aqi;
  const currentPm25 = liveStation?.pm25;
    const [dashboardForecast, setDashboardForecast] = useState([]);

  useEffect(() => {
    if (!liveStation?.station_id) {
      setDashboardForecast([]);
      return;
    }

    let alive = true;

    apiGet(`/forecast/${encodeURIComponent(liveStation.station_id)}?hours=72`)
      .then(data => {
        if (!alive) return;

        const rows = Array.isArray(data?.hourly) ? data.hourly : [];

        setDashboardForecast(
          rows.map(h => ({
            t: `+${h.forecast_hour}h`,
            aqi: h.aqi_computed != null ? Math.round(h.aqi_computed) : null,
            pm25: h.pm25 != null ? Math.round(h.pm25) : null,
          }))
        );
      })
      .catch(() => {
        if (alive) setDashboardForecast([]);
      });

    return () => {
      alive = false;
    };
  }, [liveStation?.station_id]);
  const [slide,setSlide]=useState(0);
  const slides=[
    {ey:"DELHI-NCR AIR INTELLIGENCE",title:"Air Quality Forecasting",accent:"for a Better Tomorrow",sub:"Weather–Chemistry coupled 72-hour prediction with explainable AI.",cta:"Explore Forecast",path:"/forecast"},
    {ey:"SOURCE ATTRIBUTION",title:"Track Pollution",accent:"Before It Reaches Delhi",sub:"Visualize fire hotspots, wind direction and modeled plume transport risk.",cta:"Open Plume Tracker",path:"/plume"},
    {ey:"SMART DECISIONS",title:"Understand the Air",accent:"Not Just the AQI",sub:"See weather, atmospheric conditions, stations, alerts and AI explanations together.",cta:"Open AI Insights",path:"/ai"},
  ];
  useEffect(()=>{const id=setInterval(()=>setSlide(v=>(v+1)%slides.length),5500);return()=>clearInterval(id)},[]);
  const s=slides[slide];
  return <>
    <section className="relative overflow-hidden rounded-3xl min-h-[510px]" style={{background:"var(--surface)",border:"1px solid var(--border)",boxShadow:"var(--shadow-float)"}}>
      <img src="/hero.png" alt="India Gate, Delhi" className="absolute inset-0 w-full h-full object-cover transition-all duration-1000" style={{opacity:.9,filter:"brightness(1.05) saturate(1.2) contrast(1.06)"}}/>
      <div className="absolute inset-0" style={{background:"linear-gradient(90deg,rgba(248,250,252,.9) 0%,rgba(248,250,252,.68) 34%,rgba(248,250,252,.12) 72%,rgba(248,250,252,.38) 100%)"}}/>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_35%,rgba(34,197,94,.06),transparent_32%),linear-gradient(180deg,transparent,var(--surface-secondary))]"/>
      <div className="relative z-10 p-6 sm:p-9 lg:p-10 max-w-[720px] min-h-[510px] flex flex-col justify-center">
        <div className="flex items-center gap-2 mb-4"><span className="w-2 h-2 rounded-full bg-cyan-300 live-dot"/><span className="text-[10px] font-black tracking-[.25em] text-emerald-300">{s.ey}</span></div>
        <div key={slide} className="animate-fade-in"><h2 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[.95] tracking-tight text-[var(--text-primary)]">{s.title}<br/><span className="text-emerald-300">{s.accent}</span></h2><p className="mt-5 text-sm sm:text-base text-[var(--text-secondary)] max-w-xl leading-relaxed">{s.sub}</p><div className="flex flex-wrap gap-3 mt-7"><button onClick={()=>navigate(s.path)} className="btn-primary px-5 py-3 rounded-xl text-xs font-bold flex items-center gap-2">{s.cta}<ArrowUpRight size={14}/></button><button onClick={()=>navigate('/map')} className="px-5 py-3 rounded-xl text-xs font-bold text-[var(--text-primary)]" style={{background:"var(--surface)",border:"1px solid var(--surface-hover)",backdropFilter:"blur(10px)"}}>Explore NCR Map</button></div></div>
        <div className="flex items-center gap-2 mt-8">{slides.map((_,i)=><button key={i} onClick={()=>setSlide(i)} className="h-1.5 rounded-full transition-all" style={{width:i===slide?34:10,background:i===slide?"#22c55e":"rgba(255,255,255,.35)"}}/>)}<span className="text-[9px] text-[var(--text-muted)] ml-2">Auto carousel</span></div>
      </div>
      <div className="absolute right-5 top-5 hidden xl:flex gap-2 animate-float"><div className="rounded-xl px-3 py-2" style={{background:"rgba(255,255,255,.88)",border:"1px solid rgba(74,222,128,.25)",backdropFilter:"blur(14px)"}}><p className="text-[9px] text-[var(--text-muted)]">Current AQI</p><p className="text-xl font-black text-red-400">{currentAqi == null ? "—" : Math.round(currentAqi)}</p></div><div className="rounded-xl px-3 py-2" style={{background:"rgba(255,255,255,.88)",border:"1px solid rgba(74,222,128,.25)",backdropFilter:"blur(14px)"}}><p className="text-[9px] text-[var(--text-muted)]">72h peak</p><p className="text-xl font-black text-purple-600">{dashboardForecast.length ? Math.max(...dashboardForecast.map(row => row.aqi).filter(value => value != null)) : "—"}</p></div></div>
      <div className="absolute bottom-0 left-0 right-0 h-16 flex items-center gap-5 px-6 overflow-hidden" style={{background:"var(--surface-secondary)",backdropFilter:"blur(10px)",borderTop:"1px solid rgba(74,222,128,.08)"}}><div className="flex gap-8 whitespace-nowrap animate-marquee text-[10px] text-[var(--text-secondary)]"><span>🟢 Good 0–50</span><span>🟡 Moderate 51–100</span><span>🟠 Sensitive 101–150</span><span>🔴 Unhealthy 151–200</span><span>🟣 Very Unhealthy 201–300</span><span>🌬 Wind transports pollution</span><span>🔥 Biomass burning can affect PM2.5</span></div></div>
    </section>
    <KpiStrip/>

    {/* Keep the live station data AND the NCR map on the same Dashboard page.
        The map reads the same backend station/observation source and does not
        replace or hide the KPI/forecast data below. */}
    <div className="mt-5">
      <NcrMapPanel/>
    </div>

    <div className="grid grid-cols-1 xl:grid-cols-2 gap-5"><FeatureSection icon={<BarChart3 size={18} className="text-purple-400"/>} title="Forecast Preview" subtitle="Open the full 72-hour prediction page"><div className="h-[250px]"><ResponsiveContainer width="100%" height="100%"><AreaChart data={dashboardForecast} margin={{top:5,right:5,left:-25,bottom:0}}><defs><linearGradient id="dash-aqi" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#22c55e" stopOpacity={.32}/><stop offset="95%" stopColor="#22c55e" stopOpacity={.01}/></linearGradient></defs><XAxis dataKey="t" hide/><YAxis hide/><Tooltip content={<ForecastTooltip/>}/><Area type="monotone" dataKey="aqi" stroke="#22c55e" strokeWidth={2} fill="url(#dash-aqi)"/></AreaChart></ResponsiveContainer></div><button onClick={()=>navigate('/forecast')} className="btn-primary w-full py-2.5 rounded-xl text-xs font-bold">Open AQI Forecast →</button></FeatureSection><AlertsPanel/></div>
    <QuickActions onAction={navigate}/>
  </>;
}

function AIInsightsPage(){
  const [question,setQuestion]=useState(""); const [answer,setAnswer]=useState(""); const [busy,setBusy]=useState(false); const {stations}=useLiveStations();
  const ask=async()=>{setBusy(true);setAnswer("");try{const station=stations[0];if(!station)throw new Error("NO_STATION");let r;
      try {
        r = await apiPost("/gemini/chat", {
          question: question.trim() || "Explain the current AQI and the main factors affecting it.",
          station_id: station.station_id,
        });
      } catch (chatError) {
        // Keep compatibility with the original backend route if /gemini/chat is not deployed yet.
        r = await apiGet(`/gemini/explain/${encodeURIComponent(station.station_id)}`);
      }
      setAnswer(r?.answer || r?.explanation || r?.message || JSON.stringify(r));}catch{setAnswer("Gemini is unavailable right now. Check the AeroAQI backend and GEMINI_API_KEY.")}finally{setBusy(false)}};
  return <><PageHeader title="AI Insights" subtitle="Explainable air intelligence powered by the same backend forecast features." action={<button onClick={ask} disabled={busy} className="btn-primary px-3 py-2 rounded-xl text-[10px] font-bold flex items-center gap-2"><Sparkles size={13}/>{busy?"Reading model…":"Generate insight"}</button>}/><div className="grid grid-cols-1 xl:grid-cols-[1.25fr_.75fr] gap-5"><FeatureSection icon={<Bot size={18} className="text-emerald-300"/>} title="AeroAQI Explainable Forecast" subtitle="Real forecast explanation · feature contribution · confidence"><div className="rounded-2xl p-5" style={{background:"linear-gradient(145deg,var(--surface-secondary),var(--surface))",border:"1px solid rgba(74,222,128,.13)"}}><div className="science-ring"><Bot size={28} className="text-emerald-300"/></div><p className="text-xs font-bold text-[var(--text-primary)] mt-4">Backend reasoning</p><p className="text-sm text-[var(--text-secondary)] mt-2 leading-relaxed">{answer||"Ask AeroAQI AI to fetch the real model explanation from FastAPI."}</p></div></FeatureSection><FeatureSection icon={<MessageCircle size={18} className="text-emerald-300"/>} title="Ask AeroAQI AI" subtitle="Ask about the current forecast"><textarea value={question} onChange={e=>setQuestion(e.target.value)} placeholder="Why may AQI rise in the next 12 hours?" className="w-full min-h-[120px] rounded-xl p-3 text-xs text-[var(--text-primary)] outline-none resize-none" style={{background:"var(--surface)",border:"1px solid rgba(74,222,128,.12)"}}/><button onClick={ask} disabled={busy} className="btn-primary w-full mt-3 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2"><Send size={13}/> {busy?"Analyzing…":"Explain with backend AI"}</button></FeatureSection></div></>;
}

function MapInsightsPanel() {
  const {stations, loading} = useLiveStations();
  const station = stations[0];
  const [forecast, setForecast] = useState([]);
  useEffect(() => {
    if (!station?.station_id) return undefined;
    let alive = true;
    apiGet(`/forecast/${encodeURIComponent(station.station_id)}?hours=72`).then(data => alive && setForecast(data?.hourly ?? [])).catch(() => alive && setForecast([]));
    return () => { alive = false; };
  }, [station?.station_id]);
  const fmt = value => value == null ? "No observation" : Number(value).toFixed(1);
  const fireRows = (stations.slice(0, 4)).map((item, index) => ({time: new Date(Date.now() - index * 3600000).toLocaleTimeString("en-IN", {hour:"2-digit", minute:"2-digit"}), lat: item.lat, lon: item.lon, frp: 18 + index * 7, location: item.city || item.name}));
  return <div className="space-y-4">
    <div className="rounded-2xl p-4" style={{background:"linear-gradient(145deg,rgba(8,37,26,.92),rgba(5,22,16,.9))",border:"1px solid rgba(74,222,128,.14)"}}>
      <div className="flex items-center justify-between"><div><p className="text-sm font-bold text-[var(--text-primary)]">Plume Tracker</p><p className="text-[10px] text-[var(--text-muted)]">Predicted pollution movement</p></div><span className="source-pill">Prototype / Simulated</span></div>
      <div className="grid grid-cols-3 gap-1 mt-4 text-[9px] text-[var(--text-muted)]">{["Now","+12h","+24h","+36h","+48h","+72h"].map(label=><span key={label} className="rounded-md px-2 py-2 text-center" style={{background:"rgba(255,255,255,.04)"}}>{label}</span>)}</div>
      <div className="grid grid-cols-3 gap-2 mt-3">{[["Fire Count","12"],["PM2.5 contribution","18%"],["Dominant wind","WNW"]].map(([label,value])=><div key={label} className="rounded-lg p-2" style={{background:"rgba(255,255,255,.035)"}}><p className="text-[9px] text-[var(--text-muted)]">{label}</p><p className="text-xs font-bold text-[var(--text-primary)] mt-1">{value}</p></div>)}</div>
      <div className="mt-3 rounded-lg p-2 text-[9px] text-[var(--text-muted)]" style={{background:"rgba(249,115,22,.07)"}}>Plume impact: <b className="text-orange-300">Moderate</b> · Prototype / Simulated</div>
      <p className="text-[10px] font-bold text-[var(--text-primary)] mt-4 mb-2">Recent Fire Detections</p><div className="overflow-x-auto"><table className="w-full text-[9px]"><thead><tr className="text-left text-[var(--text-muted)]">{["Time","Latitude","Longitude","FRP","Location"].map(label=><th key={label} className="px-1 py-1">{label}</th>)}</tr></thead><tbody>{fireRows.map(row=><tr key={`${row.time}-${row.lat}`} className="border-t border-white/[.06] text-[var(--text-secondary)]"><td className="px-1 py-1">{row.time}</td><td className="px-1 py-1">{row.lat.toFixed(3)}</td><td className="px-1 py-1">{row.lon.toFixed(3)}</td><td className="px-1 py-1">{row.frp}</td><td className="px-1 py-1">{row.location}</td></tr>)}</tbody></table></div>
    </div>
    <div className="rounded-2xl p-4" style={{background:"var(--surface)",border:"1px solid var(--surface-hover)"}}><p className="text-xs font-bold text-[var(--text-primary)] mb-3">72-Hour Forecast · {station?.name || (loading ? "Loading" : "No station")}</p><div className="grid grid-cols-3 gap-2">{[["Current AQI",forecast[0]?.aqi_computed], ["Peak AQI",forecast.length?Math.max(...forecast.map(row=>Number(row.aqi_computed)).filter(Number.isFinite)):null], ["Forecast rows",forecast.length || null]].map(([label,value])=><div key={label} className="rounded-lg p-2" style={{background:"var(--surface-secondary)"}}><p className="text-[9px] text-[var(--text-muted)]">{label}</p><p className="text-sm font-black text-[var(--text-primary)] mt-1">{value == null ? "No observation" : typeof value === "number" ? fmt(value) : value}</p></div>)}</div></div>
  </div>;
}

function MapBottomInsights() {
  const {stations} = useLiveStations();
  const station = stations[0];
  return <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">{[
    ["Air Quality at a Glance", [["AQI",station?.aqi],["PM2.5",station?.pm25],["PM10",station?.pm10],["O3",station?.o3],["NO2",station?.no2],["Temperature",station?.temperature_c],["Humidity",station?.humidity],["Wind",station?.wind_speed_ms],["PBL Height",null],["Last updated",station?.timestamp ? new Date(station.timestamp).toLocaleString("en-IN", {timeZone:"Asia/Kolkata"}) : null]]],
    ["72-Hour Forecast", [["Station",station?.name],["Station ID",station?.station_id],["Source","AeroAQI backend"],["Horizon","72 hours"]]],
    ["Meteorological Conditions", [["Wind",station?.wind_speed_ms],["Temperature",station?.temperature_c],["PBL Height","Backend forecast"],["Relative Humidity",station?.humidity]]]
  ].map(([title,items])=><div key={title} className="rounded-2xl p-4" style={{background:"var(--surface)",border:"1px solid var(--surface-hover)"}}><p className="text-sm font-bold text-[var(--text-primary)] mb-3">{title}</p><div className="grid grid-cols-2 gap-2">{items.map(([label,value])=><div key={label}><p className="text-[9px] text-[var(--text-muted)]">{label}</p><p className="text-xs font-semibold text-[var(--text-primary)] mt-1">{value == null ? "No observation" : typeof value === "number" ? value.toFixed(1) : value}</p></div>)}</div></div>)}</div>;
}

function MapPage() {
  return <>  <PageHeader title="Delhi-NCR Atmospheric Monitoring" subtitle="Backend station AQI, pollutant intensity, plume movement and forecast intelligence."/><div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_360px] gap-4 items-start"><NcrMapPanel/><MapInsightsPanel/></div><div className="mt-4"><MapBottomInsights/></div></>;
}
function WeatherPage() {
  return <><PageHeader title="Weather & Atmosphere" subtitle="Meteorological and atmospheric factors that influence pollution dispersion."/><WeatherPanel/></>;
}
function PlumePage() {
  return <><PageHeader title="Plume Tracker" subtitle="Explore fire-source regions, transport direction and stubble-burning risk."/><PlumePanel/></>;
}
function AlertsPage() {
  return <><PageHeader title="Alerts & Notifications" subtitle="AQI risk events and actionable monitoring alerts."/><AlertsPanel/></>;
}
function StationsPage(){
  const {stations,live,loading}=useLiveStations();
  const [query,setQuery]=useState("");
  // Start null; set to a real station once the hook resolves.
  // Prefer a station with real observation data so the detail panel has values to show.
  const [selected,setSelected]=useState(null);

  useEffect(()=>{
    if(!stations.length) return;
    if(selected){
      // Keep selected in sync if the live data refreshes
      const fresh=stations.find(s=>s.station_id===selected.station_id||s.name===selected.name);
      if(fresh){ setSelected(fresh); return; }
    }
    // First load: prefer a station that has real observation data
    const preferred=
      stations.find(s=>s.hasObs===true)||
      stations.find(s=>s.aqi!=null)||
      stations[0];
    setSelected(preferred);
  },[stations]);

  const filtered=stations.filter(s=>s.name.toLowerCase().includes(query.toLowerCase()));
  // dot map includes "unknown" for stations without obs data
  const dot={good:"#22c55e",moderate:"#eab308",sensitive:"#f97316",unhealthy:"#ef4444",very:"#a855f7",unknown:"#64748b"};
  return <><PageHeader title="Monitoring Stations" subtitle="NCR monitoring network — inspect local AQI, pollutants, source and weather context." action={<span className="source-pill">{loading?"Updating…":live?"LIVE · AeroAQI Backend":"Unavailable"}</span>}/><div className="grid grid-cols-1 xl:grid-cols-[330px_1fr] gap-5">
    <FeatureSection icon={<Navigation size={18} className="text-emerald-300"/>} title="NCR Station Network" subtitle={`${filtered.length} of ${stations.length} monitoring points`}>
      <div className="relative mb-3"><Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search station or city" className="w-full rounded-xl pl-9 pr-3 py-2.5 text-xs text-[var(--text-primary)] outline-none" style={{background:"var(--surface)",border:"1px solid var(--surface-hover)"}}/></div>
      <div className="space-y-2 max-h-[570px] overflow-y-auto pr-1">{filtered.map(s=><button key={s.station_id||s.name} onClick={()=>setSelected(s)} className="w-full p-3 rounded-xl text-left transition-all hover:translate-x-1" style={{background:selected?.station_id===s.station_id?"rgba(34,211,238,.08)":"var(--surface-secondary)",border:`1px solid ${selected?.station_id===s.station_id?"rgba(34,211,238,.2)":"var(--surface-hover)"}`}}><div className="flex items-start justify-between gap-2"><div className="min-w-0"><p className="text-xs font-bold text-[var(--text-primary)] truncate">{s.name}</p><p className="text-[9px] text-[var(--text-muted)] truncate">{s.station_id} · {s.city||"No city"}, {s.state||"No state"}</p><p className="text-[9px] text-[var(--text-muted)]">{Number.isFinite(s.lat)?s.lat.toFixed(4):"No observation"}, {Number.isFinite(s.lon)?s.lon.toFixed(4):"No observation"}</p><p className="text-[9px] text-[var(--text-muted)] truncate">{s.agency||"No observation"} · {s.timestamp?new Date(s.timestamp).toLocaleString("en-IN"):"No observation"}</p><p className="text-[9px] text-[var(--text-secondary)] mt-1">PM2.5 {s.pm25!=null?Math.round(s.pm25):"No observation"} · PM10 {s.pm10!=null?Math.round(s.pm10):"No observation"} · O3 {s.o3!=null?Math.round(s.o3):"No observation"} · NO2 {s.no2!=null?Math.round(s.no2):"No observation"}</p></div><div className="text-right shrink-0"><p className="text-lg font-black" style={{color:dot[s.status]||"#64748b"}}>{s.aqi!=null?s.aqi:"No observation"}</p><p className="text-[8px] text-[var(--text-muted)]">AQI</p></div></div></button>)}</div>
    </FeatureSection>
    {selected&&<FeatureSection icon={<MapPinned size={18} className="text-emerald-300"/>} title={`${selected.name} Station`} subtitle="Selected monitoring point · pollutant snapshot · local trend">
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">{[["AQI",selected.aqi,null, dot[selected.status]||"#64748b"],["PM2.5",selected.pm25,null,"#38bdf8"],["PM10",selected.pm10,null,"#a78bfa"],["O3",selected.o3,null,"#34d399"],["NO₂",selected.no2,null,"#fb923c"]].map(([a,b,c,col])=><div key={a} className="science-card p-4 rounded-xl"><p className="text-[10px] text-[var(--text-muted)]">{a}</p><p className="text-xl font-black mt-1" style={{color:col}}>{b!=null?Math.round(b):"No observation"}</p><p className="text-[9px] text-[var(--text-muted)] mt-1">{c|| (a==="AQI" ? "No observation" : "µg/m³")}</p></div>)}</div>
      <div className="grid grid-cols-1 lg:grid-cols-[.65fr_1.35fr] gap-4 mt-4"><div className="rounded-xl p-4 flex items-center" style={{background:"var(--surface-secondary)",border:"1px solid var(--surface-hover)"}}><p className="text-[10px] text-[var(--text-muted)]">Historical trend is not included in the latest-observation response.</p></div><div className="rounded-xl p-4" style={{background:"linear-gradient(145deg,var(--surface-secondary),var(--surface))",border:"1px solid rgba(34,197,94,.12)"}}><p className="text-[10px] text-emerald-300 font-bold">Station details</p><div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-3 mt-4">{[["Station ID",selected.station_id],["Name",selected.name],["City",selected.city],["State",selected.state],["Latitude",selected.lat],["Longitude",selected.lon],["Agency",selected.agency],["Zone",selected.zone],["AQI",selected.aqi],["PM2.5",selected.pm25],["PM10",selected.pm10],["O3",selected.o3],["NO2",selected.no2],["Temperature",selected.temperature_c],["Humidity",selected.humidity],["Wind",selected.wind_speed_ms],["PBL",selected.pbl_height],["Last updated",selected.timestamp],["Source",selected.source]].map(([a,b])=><div key={a}><p className="text-[9px] text-[var(--text-muted)]">{a}</p><p className="text-xs font-semibold text-[var(--text-primary)] mt-1">{b==null?"No observation":a==="Last updated"?new Date(b).toLocaleString("en-IN"):b}</p></div>)}</div></div></div>
    </FeatureSection>}
  </div></>;
}

function ReportsPage() {
  return <><PageHeader title="Reports & Analytics" subtitle="Export a compact AeroAQI report or print the current analysis."/><ReportsSection/></>;
}
function PipelinePage() {
  return <><PageHeader title="Data Pipeline" subtitle="The AeroAQI flow from observations to features, ML forecast and REST API."/><PipelineSection/></>;
}
function SettingsPage({ user, onLogout, onProfileSaved }) {
  return <><PageHeader title="Profile & Settings" subtitle="Manage your local prototype profile, notifications and refresh preferences."/><SettingsSection user={user} onLogout={onLogout} onProfileSaved={onProfileSaved}/></>;
}

function NotFoundPage({ navigate }) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center rounded-2xl p-8 max-w-md" style={{background:"var(--surface)",border:"1px solid var(--surface-hover)"}}>
        <Activity size={30} className="text-cyan-400 mx-auto mb-3"/>
        <h2 className="text-xl font-bold text-[var(--text-primary)]">Page not found</h2>
        <p className="text-sm text-[var(--text-muted)] mt-2 mb-5">That AeroAQI route does not exist.</p>
        <button onClick={()=>navigate('/')} className="btn-primary px-5 py-2.5 rounded-xl text-xs font-bold">Back to Dashboard</button>
      </div>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("aeroaqi_user") || "null"); } catch { return null; }
  });
  const [path, setPath] = useState(() => window.location.pathname || "/");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(()=>{
    document.title = path === "/" ? "AeroAQI — Delhi-NCR Air Intelligence" : `AeroAQI — ${ROUTES.find(r=>r.path===path)?.label || "Air Intelligence"}`;
  },[path]);

  const navigate = (nextPath) => {
    const safePath = ROUTES.some(r => r.path === nextPath) ? nextPath : "/";
    if (window.location.pathname !== safePath) window.history.pushState({}, "", safePath);
    setPath(safePath);
    setMobileOpen(false);
    window.scrollTo({top:0, behavior:"auto"});
  };

  useEffect(() => {
    const onPop = () => setPath(window.location.pathname || "/");
    window.addEventListener("popstate", onPop);
    const onResize = () => { if (window.innerWidth >= 1024) setMobileOpen(false); };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("popstate", onPop);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("aeroaqi_user");
    setUser(null);
    navigate("/");
  };

  const handleProfileSaved = (next) => {
    setUser(next);
    localStorage.setItem("aeroaqi_user", JSON.stringify(next));
  };

  if (!user) return <><AeroMotionStyles/><AuthScreen onAuthenticated={(u)=>{setUser(u); navigate('/');}}/></>;

  const activeNav = indexForPath(path);
  const page = (() => {
    switch (path) {
      case "/": return <DashboardPage navigate={navigate}/>;
      case "/map": return <MapPage/>;
      case "/forecast": return <ForecastPage/>;
      case "/wrf-chem": return <WRFChemPage/>;
      case "/weather": return <WeatherPage/>;
      case "/plume": return <PlumePage/>;
      case "/alerts": return <AlertsPage/>;
      case "/stations": return <StationsPage/>;
      case "/reports": return <ReportsPage/>;
      case "/pipeline": return <PipelinePage/>;
      case "/ai": return <AIInsightsPage/>;
      case "/settings": return <SettingsPage user={user} onLogout={handleLogout} onProfileSaved={handleProfileSaved}/>;
      default: return <NotFoundPage navigate={navigate}/>;
    }
  })();

  return (
    <div className="min-h-screen text-[var(--text-primary)] aero-bright-ui" style={{background:"var(--background)"}}><AeroMotionStyles/><MotionBackdrop/>
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{zIndex:0}}>
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-30" style={{background:"radial-gradient(circle,rgba(34,197,94,.07) 0%,transparent 70%)"}}/>
        <div className="absolute top-1/4 right-0 w-[400px] h-[400px] rounded-full opacity-20" style={{background:"radial-gradient(circle,rgba(16,185,129,.05) 0%,transparent 70%)"}}/>
        <div className="absolute bottom-0 left-1/3 w-[500px] h-[400px] rounded-full opacity-20" style={{background:"radial-gradient(circle,rgba(74,222,128,.05) 0%,transparent 70%)"}}/>
      </div>

      <div className="hidden lg:block fixed left-0 top-0 h-screen z-20" style={{width:232,boxShadow:"var(--shadow-float)"}}>
        <Sidebar active={activeNav} setActive={(i)=>navigate(routeForIndex(i))} user={user}/>
      </div>

      {mobileOpen && <>
        <div className="mobile-nav-overlay" onClick={()=>setMobileOpen(false)}/>
        <div className="mobile-nav-panel"><Sidebar active={activeNav} setActive={(i)=>navigate(routeForIndex(i))} mobile onClose={()=>setMobileOpen(false)} user={user}/></div>
      </>}

      <div className="relative z-10 lg:ml-[232px] min-h-screen flex flex-col">
        <Header
          onMenu={()=>setMobileOpen(true)}
          onAlerts={()=>navigate('/alerts')}
          onProfile={()=>navigate('/settings')}
          onLocation={()=>navigate('/map')}
          user={user}
        />
        <main className="flex-1 px-4 pt-5 pb-4 lg:px-6 page-enter aero-page-shell aero-scrollbar">
          {page}
          <Footer/>
        </main>
      </div>
    </div>
  );
}

// ─── WRF-Chem Page ─────────────────────────────────────────────────────────
function WRFChemPage() {
  return <>
    <PageHeader
      title="WRF-Chem Model"
      subtitle="Coupled weather-chemistry simulation for Delhi-NCR air quality modeling."
    />
    <WRFChemSection />
  </>;
}

// ─── WRF-Chem Model Section ────────────────────────────────────────────────
function WRFChemSection() {
  const [stations, setStations] = useState([]);
  const [stationsLoading, setStationsLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [activeParam, setActiveParam] = useState("PM2.5");
  const [showAll, setShowAll] = useState(false);
  const [state, setState] = useState({ loading: false, data: null, error: null });
  const [network, setNetwork] = useState({ loading: false, rows: [], error: null });

  const normalizeWrfResponse = (payload, fallbackStationId) => {
    const raw = Array.isArray(payload)
      ? payload
      : Array.isArray(payload?.forecast)
        ? payload.forecast
        : Array.isArray(payload?.data?.forecast)
          ? payload.data.forecast
          : [];

    const forecast = raw.map((row, index) => ({
      ...row,
      station_id: row?.station_id ?? payload?.station_id ?? fallbackStationId,
      forecast_hour: row?.forecast_hour ?? index,
      timestamp_utc: row?.timestamp_utc ?? row?.target_utc ?? row?.timestamp ?? null,
      aqi: row?.aqi ?? row?.aqi_computed ?? null,
      pm25: row?.pm25 ?? row?.pm2_5 ?? row?.pm2_5_concentration ?? null,
      pm10: row?.pm10 ?? row?.pm10_concentration ?? null,
      o3: row?.o3 ?? row?.ozone ?? null,
      no2: row?.no2 ?? row?.nitrogen_dioxide ?? null,
      temperature_c: row?.temperature_c ?? row?.temperature ?? row?.temp_c ?? null,
      wind_speed_ms: row?.wind_speed_ms ?? row?.wind_speed ?? row?.wind_ms ?? null,
      boundary_layer_height_m: row?.boundary_layer_height_m ?? row?.boundary_layer_height ?? row?.pbl_height_m ?? null,
      inversion_flag: row?.inversion_flag ?? row?.inversion ?? false,
    }));

    return { ...(payload && !Array.isArray(payload) ? payload : {}), forecast };
  };

  useEffect(() => {
    let alive = true;
    setStationsLoading(true);

    apiGet("/stations")
      .then(payload => {
        const raw = Array.isArray(payload)
          ? payload
          : (Array.isArray(payload?.stations)
            ? payload.stations
            : (Array.isArray(payload?.data) ? payload.data : []));
        const normalized = raw
          .map((s, index) => ({
            ...s,
            station_id: s?.station_id,
            name: s?.name ?? s?.station_name ?? s?.station_id ?? `Station ${index + 1}`,
            city: s?.city ?? "NCR",
            latitude: Number(s?.latitude ?? s?.lat),
            longitude: Number(s?.longitude ?? s?.lon),
          }))
          .filter(s => s.station_id && Number.isFinite(s.latitude) && Number.isFinite(s.longitude));

        if (alive) {
          setStations(normalized);
          setStationsLoading(false);
        }
      })
      .catch(() => {
        if (alive) {
          setStations([]);
          setStationsLoading(false);
        }
      });

    return () => { alive = false; };
  }, []);

  useEffect(() => {
    if (!selectedId && stations.length) setSelectedId(stations[0].station_id);
  }, [stations, selectedId]);

  // Fetch every station from the backend in small batches. No AQI/pollutant
  // values are created in the frontend; every value below comes from WRF-Chem.
  useEffect(() => {
    if (!stations.length) {
      setNetwork({ loading: false, rows: [], error: stationsLoading ? null : "0 stations returned by backend" });
      return undefined;
    }

    let alive = true;
    const loadNetwork = async () => {
      setNetwork({ loading: true, rows: [], error: null });
      const collected = [];
      const failedIds = [];

      for (let i = 0; i < stations.length; i += 5) {
        const batch = stations.slice(i, i + 5);
        const results = await Promise.allSettled(batch.map(async station => {
          const payload = await apiGet(`/wrf-chem/${encodeURIComponent(station.station_id)}`);
          const data = normalizeWrfResponse(payload, station.station_id);
          const current = data.forecast[0] ?? null;
          if (!current) throw new Error("No forecast rows");
          return { station, data, current };
        }));

        if (!alive) return;
        results.forEach((result, idx) => {
          if (result.status === "fulfilled") collected.push(result.value);
          else failedIds.push(batch[idx]?.station_id);
        });

        setNetwork({
          loading: i + batch.length < stations.length,
          rows: [...collected],
          error: null,
        });
      }

      if (!alive) return;
      setNetwork({
        loading: false,
        rows: collected,
        error: collected.length === 0
          ? "WRF-Chem backend returned no rows"
          : failedIds.length
            ? `${collected.length}/${stations.length} stations loaded`
            : null,
      });
    };

    loadNetwork();
    return () => { alive = false; };
  }, [stations, stationsLoading]);

  useEffect(() => {
    if (!selectedId) return undefined;
    let alive = true;
    setState({ loading: true, data: null, error: null });

    apiGet(`/wrf-chem/${encodeURIComponent(selectedId)}`)
      .then(payload => {
        const data = normalizeWrfResponse(payload, selectedId);
        if (alive) {
          setState({
            loading: false,
            data,
            error: data.forecast.length ? null : "Backend returned 0 forecast rows",
          });
        }
      })
      .catch(error => {
        if (alive) setState({ loading: false, data: null, error: error?.message || "WRF-Chem request failed" });
      });

    return () => { alive = false; };
  }, [selectedId]);

  const fields = {
    AQI: ["aqi", ""],
    "PM2.5": ["pm25", "µg/m³"],
    PM10: ["pm10", "µg/m³"],
    O3: ["o3", "µg/m³"],
    NO2: ["no2", "µg/m³"],
    Wind: ["wind_speed_ms", "m/s"],
    "PBL Height": ["boundary_layer_height_m", "m"],
  };
  const [field, unit] = fields[activeParam];
  const rows = state.data?.forecast ?? [];
  const current = rows[0] ?? null;
  const selectedStation = stations.find(s => s.station_id === selectedId);

  const chartData = rows.map((row, index) => ({
    t: index % 6 === 0
      ? (row.timestamp_utc
        ? new Date(row.timestamp_utc).toLocaleString("en-IN", { day: "numeric", hour: "2-digit", minute: "2-digit" })
        : `H+${row.forecast_hour ?? index}`)
      : "",
    value: row[field] != null ? Number(row[field]) : null,
  }));

  const formatValue = (value, digits = 1) =>
    value == null || !Number.isFinite(Number(value)) ? "—" : Number(value).toFixed(digits);

  const aqiColour = value => {
    const v = Number(value);
    if (!Number.isFinite(v)) return "#64748b";
    if (v <= 50) return "#22c55e";
    if (v <= 100) return "#eab308";
    if (v <= 150) return "#f97316";
    if (v <= 200) return "#ef4444";
    if (v <= 300) return "#a855f7";
    return "#b91c1c";
  };

  // Geographic projection uses station coordinates from /stations.
  // The color at each point uses only the corresponding WRF-Chem AQI.
  const mapMinLat = 27.95, mapMaxLat = 29.25, mapMinLon = 76.55, mapMaxLon = 78.25;
  const mapPoint = station => ({
    left: `${Math.max(3, Math.min(97, ((Number(station.longitude ?? station.lon) - mapMinLon) / (mapMaxLon - mapMinLon)) * 100))}%`,
    top: `${Math.max(5, Math.min(95, (1 - (Number(station.latitude ?? station.lat) - mapMinLat) / (mapMaxLat - mapMinLat)) * 100))}%`,
  });

  return (
    <div className="aero-readable mt-10 mb-6">
      <div className="mb-5 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h3 className="text-2xl font-bold text-[var(--text-primary)]">WRF-Chem Model</h3>
          <p className="text-xs text-[var(--text-muted)] mt-1">Backend WRF-Chem forecast · all available NCR stations</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="source-pill">
            {stationsLoading ? "Loading stations…" : `${stations.length} stations`}
          </span>
          <span className="source-pill">
            {network.loading ? `${network.rows.length}/${stations.length} WRF loading…` : `${network.rows.length}/${stations.length} WRF loaded`}
          </span>
          <select
            value={selectedId ?? ""}
            onChange={e => setSelectedId(e.target.value)}
            disabled={stationsLoading || !stations.length}
            className="rounded-xl px-3 py-2 text-xs outline-none"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            {!stations.length && <option value="">{stationsLoading ? "Loading stations…" : "No stations"}</option>}
            {stations.map(station => (
              <option key={station.station_id} value={station.station_id}>
                {station.name || station.station_id} — {station.city || "NCR"}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* =========================================================
          WRF-CHEM DATA-DRIVEN MAP
          Coordinates = backend /stations
          Color/value = backend /wrf-chem/{station_id}
          ========================================================= */}
      <div
        className="rounded-2xl p-4 mb-6"
        style={{ background: "var(--surface-secondary)", border: "1px solid var(--border)" }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <p className="text-sm font-bold text-[var(--text-primary)]">WRF-Chem NCR AQI Map</p>
            <p className="text-[10px] text-[var(--text-muted)]">Station position from backend · color and AQI from WRF-Chem first forecast hour</p>
          </div>
          <span className="text-[10px] font-semibold text-emerald-300">
            {network.rows.length}/{stations.length} station data points
          </span>
        </div>

        <div
          className="relative h-[430px] rounded-xl overflow-hidden"
          style={{
            background: "linear-gradient(145deg,#071a2b,#0a2a26 52%,#111827)",
            border: "1px solid var(--border)",
          }}
        >
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: "linear-gradient(rgba(148,163,184,.25) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,.25) 1px, transparent 1px)",
              backgroundSize: "44px 44px",
            }}
          />

          <div className="absolute left-3 top-3 text-[9px] text-slate-400">
            Delhi-NCR · WRF-Chem backend
          </div>

          {network.rows.map(({ station, current: wrf }) => {
            const point = mapPoint(station);
            const colour = aqiColour(wrf?.aqi);
            const active = station.station_id === selectedId;

            return (
              <button
                key={`wrf-map-${station.station_id}`}
                onClick={() => setSelectedId(station.station_id)}
                title={`${station.name} · AQI ${formatValue(wrf?.aqi)}`}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-10 rounded-full group"
                style={{ left: point.left, top: point.top }}
              >
                <span
                  className="flex items-center justify-center rounded-full"
                  style={{
                    width: active ? 38 : 28,
                    height: active ? 38 : 28,
                    background: `${colour}33`,
                    border: `2px solid ${colour}`,
                    boxShadow: `0 0 18px ${colour}88`,
                  }}
                >
                  <span className="text-[8px] font-black text-slate-100">
                    {Number.isFinite(Number(wrf?.aqi)) ? Math.round(Number(wrf.aqi)) : "—"}
                  </span>
                </span>
                <span
                  className="absolute left-1/2 -translate-x-1/2 top-full mt-1 hidden group-hover:block whitespace-nowrap rounded px-2 py-1 text-[8px] font-semibold text-slate-100"
                  style={{ background: "rgba(2,6,23,.94)" }}
                >
                  {station.name}
                </span>
              </button>
            );
          })}

          {network.loading && (
            <div className="absolute right-3 top-3 rounded-lg px-2 py-1 text-[9px] text-slate-200" style={{ background: "rgba(2,6,23,.8)" }}>
              Loading {network.rows.length}/{stations.length}…
            </div>
          )}

          {!network.loading && !network.rows.length && (
            <div className="absolute inset-0 flex items-center justify-center text-xs text-slate-300">
              No WRF-Chem backend rows returned.
            </div>
          )}

          <div className="absolute bottom-3 left-3 flex flex-wrap gap-3 text-[9px] text-slate-200 rounded-lg px-2.5 py-2" style={{ background: "rgba(2,6,23,.88)" }}>
            {[['0–50', '#22c55e'], ['51–100', '#eab308'], ['101–150', '#f97316'], ['151–200', '#ef4444'], ['201–300', '#a855f7'], ['301+', '#b91c1c']].map(([label, colour]) => (
              <span key={label} className="flex items-center gap-1">
                <i className="w-2 h-2 rounded-full" style={{ background: colour }} />{label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* =========================================================
          ALL BACKEND STATIONS — CURRENT WRF-CHEM VALUES
          ========================================================= */}
      <div
        className="rounded-2xl p-4 mb-6 overflow-hidden"
        style={{ background: "var(--surface-secondary)", border: "1px solid var(--border)" }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm font-bold text-[var(--text-primary)]">All WRF-Chem Station Data</p>
            <p className="text-[10px] text-[var(--text-muted)]">Live response rows from the AeroAQI backend · no hardcoded date or pollutant values</p>
          </div>
          <span className="text-xs font-bold text-emerald-400">{network.rows.length}/{stations.length}</span>
        </div>

        {network.rows.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] text-[10px]">
              <thead>
                <tr className="text-left text-[var(--text-muted)] border-b border-[var(--border)]">
                  {['#', 'Station', 'Station ID', 'AQI', 'PM2.5', 'PM10', 'O₃', 'NO₂', 'Temp', 'Wind', 'PBL', 'Inversion'].map(label => (
                    <th key={label} className="px-2 py-3 font-semibold">{label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {network.rows.map(({ station, current: wrf }, index) => (
                  <tr
                    key={`wrf-row-${station.station_id}`}
                    onClick={() => setSelectedId(station.station_id)}
                    className="cursor-pointer border-b border-[var(--border)] hover:bg-white/[.025]"
                    style={{ background: station.station_id === selectedId ? "rgba(34,211,238,.06)" : "transparent" }}
                  >
                    <td className="px-2 py-3 text-[var(--text-muted)]">{index + 1}</td>
                    <td className="px-2 py-3 font-semibold text-[var(--text-primary)]">{station.name || station.station_id}</td>
                    <td className="px-2 py-3 text-[var(--text-muted)]">{station.station_id}</td>
                    <td className="px-2 py-3 font-black" style={{ color: aqiColour(wrf?.aqi) }}>{formatValue(wrf?.aqi)}</td>
                    <td className="px-2 py-3 text-[var(--text-secondary)]">{formatValue(wrf?.pm25)}</td>
                    <td className="px-2 py-3 text-[var(--text-secondary)]">{formatValue(wrf?.pm10)}</td>
                    <td className="px-2 py-3 text-[var(--text-secondary)]">{formatValue(wrf?.o3)}</td>
                    <td className="px-2 py-3 text-[var(--text-secondary)]">{formatValue(wrf?.no2)}</td>
                    <td className="px-2 py-3 text-[var(--text-secondary)]">{formatValue(wrf?.temperature_c)}°C</td>
                    <td className="px-2 py-3 text-[var(--text-secondary)]">{formatValue(wrf?.wind_speed_ms)} m/s</td>
                    <td className="px-2 py-3 text-[var(--text-secondary)]">{formatValue(wrf?.boundary_layer_height_m)} m</td>
                    <td className="px-2 py-3 text-[var(--text-secondary)]">{wrf?.inversion_flag ? "Yes" : "No"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!network.loading && !network.rows.length && (
          <div className="rounded-xl p-5 text-center text-xs text-amber-300" style={{ background: "rgba(245,158,11,.06)", border: "1px solid rgba(245,158,11,.16)" }}>
            WRF-Chem backend returned 0 station rows. Make sure FastAPI is running and the Vite proxy/API base is configured.
          </div>
        )}
      </div>

      {/* =========================================================
          SELECTED STATION 72-HOUR FORECAST
          ========================================================= */}
      <div className="flex flex-wrap gap-2 mb-6">
        {Object.keys(fields).map(parameter => (
          <button
            key={parameter}
            onClick={() => setActiveParam(parameter)}
            className="px-4 py-2 rounded-xl text-xs font-bold transition-all"
            style={{
              background: activeParam === parameter ? "var(--text-primary)" : "var(--surface)",
              color: activeParam === parameter ? "#ffffff" : "var(--text-secondary)",
              border: "1px solid var(--border)",
            }}
          >
            {parameter}
          </button>
        ))}
      </div>

      {state.loading && (
        <div className="h-[260px] flex items-center justify-center text-xs text-[var(--text-muted)]">
          <RefreshCw size={14} className="animate-spin mr-2 text-emerald-400" />
          Loading WRF-Chem forecast from backend…
        </div>
      )}

      {!state.loading && state.error && (
        <div className="rounded-xl p-4 text-xs text-amber-300" style={{ background: "rgba(245,158,11,.06)", border: "1px solid rgba(245,158,11,.16)" }}>
          WRF-Chem data unavailable: {state.error}
        </div>
      )}

      {!state.loading && !state.error && state.data && rows.length > 0 && (
        <>
          <div className="rounded-2xl p-5 mb-5" style={{ background: "var(--surface-secondary)", border: "1px solid var(--border)" }}>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <p className="text-lg font-black text-[var(--text-primary)]">{selectedStation?.name || selectedId}</p>
                <p className="text-xs text-[var(--text-muted)] mt-1">{selectedStation?.city || "Delhi-NCR"} · {selectedId}</p>
                <p className="text-[10px] text-[var(--text-secondary)] mt-2">{rows.length}-hour backend WRF-Chem forecast · timestamps from backend response</p>
              </div>
              {current && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[['AQI', current.aqi], ['PM2.5', current.pm25], ['PM10', current.pm10], ['PBL', current.boundary_layer_height_m]].map(([label, value]) => (
                    <div key={label} className="rounded-xl p-3" style={{ background: "rgba(15,23,42,.72)", border: "1px solid rgba(148,163,184,.16)" }}>
                      <p className="metric-label text-[9px]">{label}</p>
                      <p className="metric-value text-sm font-black mt-1">{formatValue(value)}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="rounded-3xl p-5" style={{ background: "var(--surface)", border: "1px solid var(--border)", boxShadow: "var(--shadow-md)" }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-bold text-[var(--text-primary)]">{activeParam} forecast</p>
                <p className="text-[10px] text-[var(--text-muted)]">{rows.length} hourly backend records</p>
              </div>
              <span className="text-xs text-emerald-300">{unit || "AQI"}</span>
            </div>

            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid stroke="var(--surface-hover)" vertical={false} />
                  <XAxis dataKey="t" tick={{ fontSize: 9, fill: "#64748b" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 9, fill: "#64748b" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<ForecastTooltip />} />
                  <Line type="monotone" dataKey="value" name={`${activeParam} (${unit})`} stroke="#22c55e" strokeWidth={2.5} dot={false} connectNulls />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-2xl p-4 mt-5 overflow-x-auto" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-bold text-[var(--text-primary)]">Forecast data</p>
                <p className="text-[10px] text-[var(--text-muted)]">{showAll ? rows.length : Math.min(12, rows.length)} of {rows.length} hourly records</p>
              </div>
              <button onClick={() => setShowAll(value => !value)} className="text-[10px] text-emerald-300">
                {showAll ? "Show first 12 hours" : `Show all ${rows.length} hours`}
              </button>
            </div>

            <table className="w-full min-w-[1000px] text-[10px]">
              <thead>
                <tr className="text-left text-[var(--text-muted)] border-b border-[var(--border)]">
                  {['Forecast hour', 'AQI', 'PM2.5', 'PM10', 'O3', 'NO2', 'Temp', 'Wind', 'BLH', 'Inversion'].map(label => <th key={label} className="px-2 py-2 font-semibold">{label}</th>)}
                </tr>
              </thead>
              <tbody>
                {(showAll ? rows : rows.slice(0, 12)).map((row, index) => (
                  <tr key={`${row.station_id}-${row.forecast_hour}-${index}`} className="border-b border-[var(--border)] text-[var(--text-secondary)]">
                    <td className="px-2 py-2">H+{Number.isFinite(Number(row.forecast_hour)) ? Number(row.forecast_hour) : index}</td>
                    <td className="px-2 py-2">{formatValue(row.aqi)}</td>
                    <td className="px-2 py-2">{formatValue(row.pm25)}</td>
                    <td className="px-2 py-2">{formatValue(row.pm10)}</td>
                    <td className="px-2 py-2">{formatValue(row.o3)}</td>
                    <td className="px-2 py-2">{formatValue(row.no2)}</td>
                    <td className="px-2 py-2">{formatValue(row.temperature_c)}°C</td>
                    <td className="px-2 py-2">{formatValue(row.wind_speed_ms)} m/s</td>
                    <td className="px-2 py-2">{formatValue(row.boundary_layer_height_m)} m</td>
                    <td className="px-2 py-2">{row.inversion_flag ? "Yes" : "No"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
