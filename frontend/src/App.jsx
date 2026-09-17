/**
 * AeroAQI — Premium Dashboard
 * Delhi-NCR Air Intelligence Platform
 * Interactive Delhi-NCR air intelligence dashboard
 */

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
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
  if (v <= 200) return "#f97316";
  if (v <= 300) return "#ef4444";
  if (v <= 400) return "#9333ea";
  return "#7f1d1d";
}
function aqiLabel(v) {
  if (v <= 50)  return "Good";
  if (v <= 100) return "Moderate";
  if (v <= 200) return "Unhealthy (Sensitive)";
  if (v <= 300) return "Unhealthy";
  if (v <= 400) return "Very Unhealthy";
  return "Hazardous";
}
function aqiBgClass(v) {
  if (v <= 50)  return "bg-aqi-good";
  if (v <= 100) return "bg-aqi-moderate";
  if (v <= 200) return "bg-aqi-sensitive";
  if (v <= 300) return "bg-aqi-unhealthy";
  if (v <= 400) return "bg-aqi-very";
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
          ? "nav-active text-emerald-700"
          : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)]"
        }`}
    >
      <span className={`${active ? "text-emerald-600" : "text-[var(--text-muted)] group-hover:text-emerald-600"} transition-colors`}>
        {icon}
      </span>
      <span className="truncate">{label}</span>
      {active && <ChevronRight size={14} className="ml-auto text-emerald-500/70" />}
    </button>
  );
}

// ─── Sidebar ──────────────────────────────────────────────
const NAV_PRIMARY = [
  { icon:<LayoutDashboard size={16}/>, label:"Dashboard" },
  { icon:<Map size={16}/>,            label:"NCR Map" },
  { icon:<BarChart3 size={16}/>,      label:"AQI Forecast" },
  { icon:<Layers3 size={16}/>,        label:"WRF-Chem" },
  { icon:<CloudSun size={16}/>,       label:"Weather & Atmosphere" },
  { icon:<Flame size={16}/>,          label:"Plume Tracker" },
  { icon:<Bell size={16}/>,           label:"Alerts & Notifications" },
  { icon:<Navigation size={16}/>,     label:"Stations" },
];

const NAV_SECONDARY = [
  { icon:<FileText size={16}/>,  label:"Forecast Validation" },
  { icon:<Activity size={16}/>,  label:"Data Pipeline" },
  { icon:<Bot size={16}/>,       label:"AI Insights" },
  { icon:<Heart size={16}/>,     label:"Decision Support" },
  { icon:<Settings size={16}/>,  label:"Profile & Settings" },
];

// Combined nav for index calculations — must match ROUTES order
const NAV = [
  ...NAV_PRIMARY,
  ...NAV_SECONDARY,
];

const AQI_SCALE = [
  { range:"0–50",    label:"Good",             dot:"#22c55e" },
  { range:"51–100",  label:"Moderate",         dot:"#eab308" },
  { range:"101–200", label:"Sensitive Groups", dot:"#f97316" },
  { range:"201–300", label:"Unhealthy",        dot:"#ef4444" },
  { range:"301–400", label:"Very Unhealthy",   dot:"#9333ea" },
  { range:"401–500", label:"Hazardous",        dot:"#7f1d1d" },
];

function Sidebar({ active, setActive, mobile, onClose, user }) {
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef(null);
  const initial = (user?.name || "A").trim().charAt(0).toUpperCase() || "A";

  // Close more-menu when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (moreRef.current && !moreRef.current.contains(e.target)) setMoreOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <aside className={`flex flex-col h-full w-[232px] bg-[var(--surface)] border-r border-[var(--border)] ${mobile ? "" : "fixed left-0 top-0"}`}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 pt-5 pb-4 border-b border-[var(--border)]">
        <img src="/icon.png" alt="AeroAQI" className="w-10 h-10 object-contain flex-shrink-0"/>
        <div className="min-w-0">
          <h1 className="text-sm font-bold text-[var(--text-primary)] tracking-tight">AeroAQI</h1>
          <p className="text-[10px] text-[var(--text-muted)] leading-tight truncate">Delhi-NCR Air Intelligence</p>
        </div>
        {mobile && (
          <button onClick={onClose} className="ml-auto text-[var(--text-muted)] hover:text-[var(--text-primary)] p-1 rounded-lg hover:bg-[var(--surface-hover)]">
            <X size={16}/>
          </button>
        )}
      </div>

      {/* Primary nav */}
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        <p className="px-3 pt-1 pb-2 text-[9px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Main</p>
        {NAV_PRIMARY.map((n) => {
          const i = NAV.findIndex(x => x.label === n.label);
          return (
            <NavItem key={n.label} icon={n.icon} label={n.label}
              active={active === i} onClick={() => { setActive(i); if (onClose) onClose(); }} />
          );
        })}

        {/* More / three-dot menu */}
        <div ref={moreRef} className="relative mt-1">
          <button
            onClick={() => setMoreOpen(v => !v)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left
              ${moreOpen
                ? "bg-[var(--surface-hover)] text-[var(--text-primary)]"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)]"
              }`}
          >
            <span className="text-[var(--text-muted)]">
              <SlidersHorizontal size={16}/>
            </span>
            <span className="truncate">More</span>
            <ChevronRight size={13} className={`ml-auto text-[var(--text-muted)] transition-transform ${moreOpen ? "rotate-90" : ""}`}/>
          </button>

          {moreOpen && (
            <div className="more-menu">
              {NAV_SECONDARY.map((n) => {
                const i = NAV.findIndex(x => x.label === n.label);
                return (
                  <button key={n.label}
                    onClick={() => { setActive(i); setMoreOpen(false); if (onClose) onClose(); }}
                    className="more-menu-item"
                    style={active === i ? {background:"var(--accent-green-light)", color:"var(--accent-green)"} : {}}
                  >
                    <span style={{color: active === i ? "var(--accent-green)" : "var(--text-muted)"}}>{n.icon}</span>
                    {n.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </nav>

      {/* AQI scale */}
      <div className="mx-3 mb-3 rounded-xl p-3 glass-dark">
        <p className="text-[9px] font-bold uppercase tracking-widest text-[var(--text-muted)] mb-2">AQI Scale</p>
        {[
          { range:"0–50",   label:"Good",          dot:"#16a34a" },
          { range:"51–100", label:"Moderate",       dot:"#d97706" },
          { range:"101–150",label:"Sensitive",      dot:"#ea580c" },
          { range:"151–200",label:"Unhealthy",      dot:"#dc2626" },
          { range:"201–300",label:"Very Unhealthy", dot:"#7e22ce" },
          { range:"301+",   label:"Hazardous",      dot:"#7f1d1d" },
        ].map(s => (
          <div key={s.range} className="flex items-center gap-2 py-0.5">
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{background:s.dot}}/>
            <span className="text-[9px] text-[var(--text-muted)] w-12 flex-shrink-0">{s.range}</span>
            <span className="text-[9px] text-[var(--text-secondary)]">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Profile */}
      <button onClick={() => { const i = NAV.findIndex(x => x.label === "Profile & Settings"); setActive(i); }}
        className="mx-3 mb-4 p-3 rounded-xl glass-subtle flex items-center gap-2.5 text-left hover:bg-[var(--surface-hover)] transition-colors">
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
          style={{background:"linear-gradient(135deg,#047857,#059669)"}}>{initial}</div>
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
  const { stations } = useLiveStations();

  const wc = weather?.data?.observations?.at(-1) || {};
  // Primary source: /weather endpoint; fallback: first station with observations
  const stFb = stations.find(s => s.hasObs) || stations[0] || null;
  const headerTemp = Number.isFinite(Number(wc.temperature))
    ? Math.round(Number(wc.temperature))
    : (Number.isFinite(Number(stFb?.temperature_c)) ? Math.round(Number(stFb.temperature_c)) : null);
  const headerWind = Number.isFinite(Number(wc.wind_speed))
    ? Number(wc.wind_speed).toFixed(1)
    : (Number.isFinite(Number(stFb?.wind_speed_ms)) ? Number(stFb.wind_speed_ms).toFixed(1) : null);
  const headerHumidity = Number.isFinite(Number(wc.relative_humidity))
    ? Math.round(Number(wc.relative_humidity))
    : (Number.isFinite(Number(stFb?.humidity)) ? Math.round(Number(stFb.humidity)) : null);
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
          <span className="text-[var(--text-muted)] text-xs">{headerTemp == null ? "Unavailable" : "Station obs"}</span>
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
        <img src="/hero.jpeg" alt="India Gate, Delhi"
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

  // Fall back to station observation fields when the /weather endpoint has no data.
  // /weather uses Open-Meteo (may be empty). /observations/latest always has demo data
  // with temperature_c / humidity / wind_speed_ms on each station row.
  const tempVal = Number.isFinite(Number(current.temperature))
    ? Number(current.temperature)
    : Number.isFinite(Number(station?.temperature_c)) ? Number(station.temperature_c) : null;
  const windVal = Number.isFinite(Number(current.wind_speed))
    ? Number(current.wind_speed)
    : Number.isFinite(Number(station?.wind_speed_ms)) ? Number(station.wind_speed_ms) : null;
  const humidVal = Number.isFinite(Number(current.relative_humidity))
    ? Number(current.relative_humidity)
    : Number.isFinite(Number(station?.humidity)) ? Number(station.humidity) : null;
  const pblRaw = Number.isFinite(Number(current.pbl_height)) && Number(current.pbl_height) > 0
    ? Number(current.pbl_height)
    : Number.isFinite(Number(station?.pbl_height)) && Number(station.pbl_height) > 0
      ? Number(station.pbl_height)
      : null;
  const pbl = pblRaw;

  const kpis = [
    { icon:<Radio size={16}/>, label:"Stations Online", val:stations.length ? String(stations.length) : "—", unit:"backend", color:"text-green-400", glow:"rgba(34,197,94,.15)" },
    { icon:<Thermometer size={16}/>, label:"Temperature", val:tempVal != null ? String(Math.round(tempVal)) : "—", unit:"°C", color:"text-red-400", glow:"rgba(249,115,22,.15)" },
    { icon:<Wind size={16}/>, label:"Wind Speed", val:windVal != null ? windVal.toFixed(1) : "—", unit:"m/s", color:"text-cyan-400", glow:"rgba(6,182,212,.15)" },
    { icon:<Droplets size={16}/>, label:"Humidity", val:humidVal != null ? String(Math.round(humidVal)) : "—", unit:"%", color:"text-yellow-400", glow:"rgba(59,130,246,.15)" },
    { icon:<Gauge size={16}/>, label:"PBL Height", val:pbl != null ? String(Math.round(pbl)) : "Unavail.", unit: pbl != null ? "m" : "", color:"text-purple-500", glow:"rgba(139,92,246,.12)" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-4">
      {kpis.map(k => (
        <div key={k.label} className="card-hover flex items-center gap-3 px-4 py-3 rounded-xl"
          style={{background:"var(--surface)",border:"1px solid var(--border)",boxShadow:"var(--shadow-sm)"}}>
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
// For local dev: empty string → Vite proxy routes to http://127.0.0.1:8000.
// For production: set VITE_API_BASE_URL to the deployed FastAPI URL.
// Never put secrets in VITE_* variables — they are bundled into the client.
const API_BASE =
  (typeof import.meta !== "undefined" &&
    import.meta.env &&
    import.meta.env.VITE_API_BASE_URL) ||
  "";
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
  const [state,setState]=useState({loading:true,data:null,error:"",stale:false});
  useEffect(()=>{
    let alive=true;
    const load=()=>apiGet("/weather?hours=168")
      .then(payload=>{
        const observations=Array.isArray(payload)
          ? payload
          : (payload?.observations ?? payload?.data ?? []);
        if (!alive) return;
        setState({loading:false,data:{observations},error:"",stale:false});
      })
      .catch(()=>{
        if(!alive) return;
        setState(prev=>{
          if(prev.data){
            // Keep existing data, mark stale
            return {...prev,loading:false,stale:true,error:""};
          }
          return {loading:false,data:null,error:"Backend weather unavailable",stale:false};
        });
      });
    load();
    const id=setInterval(load,300000);
    return()=>{alive=false;clearInterval(id)};
  },[]);
  return state;
}
function useLiveStations() {
  const [state, setState] = useState({ stations: [], live: false, loading: true, error: "", stale: false });

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
            stale: false,
            error: stations.length ? "" : "No valid station rows returned by backend.",
          });
        }
      } catch (err) {
        if (!alive) return;
        // Keep existing stations on failure; only clear on first-load with no data.
        setState(prev => {
          if (prev.stations.length > 0) {
            // Refresh failed but we have previous data — show stale banner, keep data.
            return {
              ...prev,
              loading: false,
              stale: true,
              error: "",
            };
          }
          // First load failed, no previous data — show backend-unavailable message.
          return {
            stations: [],
            live: false,
            loading: false,
            stale: false,
            error: "Station data unavailable. Ensure the AeroAQI backend is running on port 8000.",
          };
        });
      }
    };

    load();
    const id = setInterval(load, 300_000);
    return () => { alive = false; clearInterval(id); };
  }, []);

  return state;
}

// ─── Weather helpers ─────────────────────────────────────────────────────
// Aggregate an array of hourly observations into a single day summary.
function _wxDaySummary(rows) {
  const vals = key => rows.map(r => Number(r[key])).filter(v => Number.isFinite(v));
  const avg  = key => { const v = vals(key); return v.length ? v.reduce((a,b)=>a+b,0)/v.length : null; };
  const min  = key => { const v = vals(key); return v.length ? Math.min(...v) : null; };
  const max  = key => { const v = vals(key); return v.length ? Math.max(...v) : null; };
  const anyTrue = key => rows.some(r => r[key] === true || r[key] === 1);
  // Dominant wind direction: find most common 45° sector
  const dirs = vals("wind_direction");
  let domDir = null;
  if (dirs.length) {
    const sectors = {};
    dirs.forEach(d => { const s = Math.round(d/45)*45 % 360; sectors[s] = (sectors[s]||0) + 1; });
    domDir = Number(Object.entries(sectors).sort((a,b)=>b[1]-a[1])[0][0]);
  }
  return {
    tempMin:  min("temperature"),
    tempMax:  max("temperature"),
    tempAvg:  avg("temperature"),
    humidity: avg("relative_humidity"),
    windAvg:  avg("wind_speed"),
    windDir:  domDir,
    pressure: avg("surface_pressure"),
    pbl:      avg("pbl_height"),
    inversion: anyTrue("inversion_flag"),
    precip:   rows.reduce((s,r) => s + (Number(r.precipitation)||0), 0),
    count:    rows.length,
  };
}

// Cardinal wind direction label from degrees
function _windDir(deg) {
  if (deg == null) return "—";
  const dirs = ["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"];
  return dirs[Math.round(deg/22.5) % 16];
}

function WeatherPanel() {
  const {loading,data,error}=useLiveWeather();
  const {stations}=useLiveStations();
  const [view, setView] = useState("daily");   // "daily" | "hourly"
  const [chart, setChart] = useState("temp");  // "temp" | "humidity" | "wind" | "pressure" | "pbl"
  const [hourPage, setHourPage] = useState(0); // page for hourly table (24 rows/page)

  // ── All 168 observations, sorted oldest→newest ─────────────
  const observations = (data?.observations||[])
    .filter(row => row && row.timestamp_utc)
    .sort((a,b) => new Date(a.timestamp_utc) - new Date(b.timestamp_utc));

  // Most recent observation = current conditions
  const current = observations.length ? observations[observations.length - 1] : {};

  // ── Fallback to station obs when /weather is empty ─────────
  const stationFallback = stations.find(s => s.hasObs) || stations[0] || null;
  const fv = (wxField, stField) => {
    const wx = Number(current[wxField]);
    if (Number.isFinite(wx)) return wx;
    const st = Number(stationFallback?.[stField]);
    return Number.isFinite(st) ? st : null;
  };
  const tempVal  = fv("temperature",       "temperature_c");
  const humidVal = fv("relative_humidity", "humidity");
  const windVal  = fv("wind_speed",        "wind_speed_ms");
  const pressVal = Number(current.surface_pressure);
  const pblVal   = fv("pbl_height",        "pbl_height");
  const windDirVal = Number(current.wind_direction);
  const invStr   = Number(current.inversion_strength);
  const inv      = Number.isFinite(invStr)
    ? { strength:invStr, status: current.inversion_flag ? "Active" : "None" }
    : null;

  // ── Current-conditions metric cards ────────────────────────
  const metrics = [
    { label:"Temperature", val:tempVal,  fmt:v=>`${Math.round(v)}°C`,       icon:<Thermometer size={15}/>, color:"#22c55e" },
    { label:"Humidity",    val:humidVal, fmt:v=>`${Math.round(v)}%`,        icon:<Droplets size={15}/>,    color:"#34d399" },
    { label:"Wind",        val:windVal,  fmt:v=>`${v.toFixed(1)} m/s`,      icon:<Wind size={15}/>,        color:"#059669" },
    { label:"Wind Dir",    val:Number.isFinite(windDirVal)?windDirVal:null,
                           fmt:v=>`${_windDir(v)} (${Math.round(v)}°)`,     icon:<Navigation size={15}/>,  color:"#0891b2" },
    { label:"Pressure",    val:Number.isFinite(pressVal)?pressVal:null,
                           fmt:v=>`${Math.round(v)} hPa`,                   icon:<Gauge size={15}/>,       color:"#10b981" },
    { label:"PBL / Mixing",val:pblVal,   fmt:v=>`${Math.round(v)} m`,       icon:<Layers3 size={15}/>,     color:"#6ee7b7" },
    { label:"Inversion",   val:inv?.strength,
                           fmt:v=>inv?`${inv.status} · ${v>0?"+":""}${v.toFixed(1)}°C`:"—",
                                                                            icon:<Activity size={15}/>,    color:"#fbbf24" },
    { label:"Precipitation",val:Number(current.precipitation)>=0 ? Number(current.precipitation) : null,
                           fmt:v=>`${v.toFixed(1)} mm`,                     icon:<CloudRain size={15}/>,   color:"#38bdf8" },
  ];

  // ── Group hourly obs by IST calendar day ───────────────────
  // Returns an array of { dateKey, label, rows } for up to 8 days starting today
  const dayGroups = (() => {
    if (!observations.length) return [];
    const IST_OFFSET_MS = 5.5 * 3600 * 1000;
    const groups = {};
    for (const row of observations) {
      const istMs  = new Date(row.timestamp_utc).getTime() + IST_OFFSET_MS;
      const d      = new Date(istMs);
      const key    = `${d.getUTCFullYear()}-${String(d.getUTCMonth()+1).padStart(2,"0")}-${String(d.getUTCDate()).padStart(2,"0")}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(row);
    }
    const sortedKeys = Object.keys(groups).sort();
    return sortedKeys.slice(0, 8).map((key, i) => {
      const [yr, mo, dd] = key.split("-").map(Number);
      const dt = new Date(Date.UTC(yr, mo-1, dd));
      const todayIST = new Date(Date.now() + IST_OFFSET_MS);
      const todayKey = `${todayIST.getUTCFullYear()}-${String(todayIST.getUTCMonth()+1).padStart(2,"0")}-${String(todayIST.getUTCDate()).padStart(2,"0")}`;
      const isToday = key === todayKey;
      const label = isToday ? "Today"
        : i === 1 && sortedKeys[0] === todayKey ? "Tomorrow"
        : dt.toLocaleDateString("en-IN", { weekday:"short", day:"numeric", month:"short", timeZone:"Asia/Kolkata" });
      return { key, label, rows: groups[key], summary: _wxDaySummary(groups[key]) };
    });
  })();

  // ── Chart data ─────────────────────────────────────────────
  // For "daily" chart: one point per day (avg values)
  // For "hourly" chart: every 3rd hour so X-axis doesn't crowd
  const chartDataDaily = dayGroups.map(g => ({
    t:    g.label,
    temp: g.summary.tempAvg != null ? Math.round(g.summary.tempAvg*10)/10 : null,
    tempMin: g.summary.tempMin != null ? Math.round(g.summary.tempMin*10)/10 : null,
    tempMax: g.summary.tempMax != null ? Math.round(g.summary.tempMax*10)/10 : null,
    humidity: g.summary.humidity != null ? Math.round(g.summary.humidity) : null,
    wind: g.summary.windAvg != null ? Math.round(g.summary.windAvg*10)/10 : null,
    pressure: g.summary.pressure != null ? Math.round(g.summary.pressure) : null,
    pbl: g.summary.pbl != null ? Math.round(g.summary.pbl) : null,
  }));

  const chartDataHourly = observations
    .filter((_, i) => i % 3 === 0)
    .map(r => {
      const ist = new Date(new Date(r.timestamp_utc).getTime() + 5.5*3600*1000);
      return {
        t: ist.toLocaleString("en-IN",{day:"numeric",month:"short",hour:"2-digit",hour12:true,timeZone:"Asia/Kolkata"}),
        temp:     Number.isFinite(Number(r.temperature))        ? Math.round(Number(r.temperature)*10)/10 : null,
        humidity: Number.isFinite(Number(r.relative_humidity))  ? Math.round(Number(r.relative_humidity)) : null,
        wind:     Number.isFinite(Number(r.wind_speed))         ? Math.round(Number(r.wind_speed)*10)/10 : null,
        pressure: Number.isFinite(Number(r.surface_pressure))   ? Math.round(Number(r.surface_pressure)) : null,
        pbl:      Number.isFinite(Number(r.pbl_height))         ? Math.round(Number(r.pbl_height)) : null,
      };
    });

  const chartData    = view === "daily" ? chartDataDaily : chartDataHourly;
  const chartConfigs = {
    temp:     { key:"temp",     label:"Temperature (°C)",   color:"#f97316", refLines:[] },
    humidity: { key:"humidity", label:"Humidity (%)",       color:"#38bdf8", refLines:[] },
    wind:     { key:"wind",     label:"Wind Speed (m/s)",   color:"#059669", refLines:[] },
    pressure: { key:"pressure", label:"Pressure (hPa)",     color:"#a855f7", refLines:[{y:1013,label:"std"}] },
    pbl:      { key:"pbl",      label:"PBL Height (m)",     color:"#fbbf24", refLines:[{y:500,label:"500 m"}] },
  };
  const cc = chartConfigs[chart];

  // Hourly table pagination (24 rows/page)
  const ROWS_PER_PAGE = 24;
  const hourRows = observations.slice(hourPage*ROWS_PER_PAGE, (hourPage+1)*ROWS_PER_PAGE);
  const totalHourPages = Math.ceil(observations.length / ROWS_PER_PAGE);

  const fmt = (v, digits=1) => v != null && Number.isFinite(Number(v)) ? Number(v).toFixed(digits) : "—";

  return (
    <div id="weather-section" className="flex flex-col gap-5">

      {/* ── Status banners ───────────────────────────────── */}
      {error && !stationFallback && (
        <div className="rounded-xl px-4 py-3 text-xs text-amber-700 flex items-center gap-2"
          style={{background:"rgba(217,119,6,.06)",border:"1px solid rgba(217,119,6,.2)"}}>
          <Info size={13}/>Live weather endpoint unavailable. No fabricated values are shown.
        </div>
      )}
      {error && stationFallback && (
        <div className="rounded-xl px-4 py-3 text-xs text-blue-700 flex items-center gap-2"
          style={{background:"rgba(59,130,246,.06)",border:"1px solid rgba(59,130,246,.18)"}}>
          <Info size={12}/>Temperature, humidity and wind shown from station observations (fallback).
        </div>
      )}
      {data?.observations?.[0]?.data_source?.includes("demo") && (
        <div className="rounded-xl px-4 py-2.5 text-[11px] text-[var(--text-muted)] flex items-center gap-2"
          style={{background:"var(--surface-secondary)",border:"1px solid var(--border)"}}>
          <Info size={12} className="text-[var(--text-muted)] flex-shrink-0"/>
          AeroAQI Demo / Simulated Data — deterministic prototype weather for Delhi-NCR.
        </div>
      )}

      {/* ── Current conditions card ───────────────────────── */}
      <div className="rounded-2xl p-5" style={{background:"var(--surface)",border:"1px solid var(--border)",boxShadow:"var(--shadow-sm)"}}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <p className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
              <CloudSun size={17} className="text-emerald-600"/>Current Atmospheric Conditions
            </p>
            <p className="text-[10px] text-[var(--text-muted)] mt-0.5">
              {current.timestamp_utc
                ? new Date(current.timestamp_utc).toLocaleString("en-IN",{day:"numeric",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit",timeZone:"Asia/Kolkata"}) + " IST"
                : "Latest available observation"}
            </p>
          </div>
          <span className="source-pill">{loading?"Updating…":error?"Unavailable":"LIVE · AeroAQI Backend"}</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {metrics.map(m => (
            <div key={m.label} className="science-card p-3 rounded-xl">
              <span style={{color:m.color}}>{m.icon}</span>
              <p className="text-[9px] text-[var(--text-muted)] mt-2 leading-tight">{m.label}</p>
              <p className="text-sm font-bold text-[var(--text-primary)] mt-1">
                {m.val != null && Number.isFinite(Number(m.val)) ? m.fmt(Number(m.val)) : "—"}
              </p>
            </div>
          ))}
        </div>
        <p className="text-[9px] text-[var(--text-muted)] mt-3">
          PBL is a direct atmospheric model variable. Inversion is derived from pressure-level temperatures.
        </p>
      </div>

      {/* ── 8-Day forecast section ────────────────────────── */}
      <div className="rounded-2xl p-5" style={{background:"var(--surface)",border:"1px solid var(--border)",boxShadow:"var(--shadow-sm)"}}>
        {/* Header + Daily/Hourly toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <p className="text-sm font-bold text-[var(--text-primary)]">
              8-Day Weather &amp; Atmosphere Forecast
            </p>
            <p className="text-[10px] text-[var(--text-muted)] mt-0.5">
              {observations.length} hourly records · Delhi-NCR · AeroAQI backend
            </p>
          </div>
          <div className="flex gap-1 p-1 rounded-xl" style={{background:"var(--surface-secondary)",border:"1px solid var(--border)"}}>
            {[["daily","Daily"],["hourly","Hourly"]].map(([v,l]) => (
              <button key={v} onClick={() => { setView(v); setHourPage(0); }}
                className="px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                style={view===v
                  ? {background:"var(--accent-green)",color:"#fff"}
                  : {color:"var(--text-secondary)"}}>
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* ── DAILY VIEW ─── */}
        {view === "daily" && (
          <>
            {dayGroups.length === 0
              ? <div className="rounded-xl p-6 text-center text-xs text-[var(--text-muted)]"
                  style={{background:"var(--surface-secondary)",border:"1px solid var(--border)"}}>
                  Loading forecast data…
                </div>
              : (
                <div className="overflow-x-auto pb-2">
                  <div className="flex gap-2 min-w-max">
                    {dayGroups.map(g => {
                      const s = g.summary;
                      return (
                        <div key={g.key}
                          className="rounded-xl p-3 flex flex-col gap-1.5"
                          style={{
                            minWidth:130,
                            background:"var(--surface-secondary)",
                            border:"1px solid var(--border)",
                          }}>
                          {/* Day label */}
                          <p className="text-[11px] font-bold text-[var(--text-primary)] truncate">{g.label}</p>
                          <p className="text-[9px] text-[var(--text-muted)]">
                            {new Date(g.key).toLocaleDateString("en-IN",{day:"numeric",month:"short",timeZone:"Asia/Kolkata"})}
                          </p>

                          {/* Temp range */}
                          <div className="flex items-baseline gap-1 mt-1">
                            <Thermometer size={12} className="text-orange-500 flex-shrink-0"/>
                            <span className="text-sm font-black text-orange-500">
                              {s.tempMax != null ? Math.round(s.tempMax) : "—"}°
                            </span>
                            <span className="text-xs text-[var(--text-muted)]">
                              / {s.tempMin != null ? Math.round(s.tempMin) : "—"}°C
                            </span>
                          </div>

                          {/* Humidity */}
                          <div className="flex items-center gap-1">
                            <Droplets size={11} className="text-blue-400 flex-shrink-0"/>
                            <span className="text-[10px] text-[var(--text-secondary)]">
                              {s.humidity != null ? `${Math.round(s.humidity)}%` : "—"}
                            </span>
                          </div>

                          {/* Wind */}
                          <div className="flex items-center gap-1">
                            <Wind size={11} className="text-emerald-500 flex-shrink-0"/>
                            <span className="text-[10px] text-[var(--text-secondary)]">
                              {s.windAvg != null ? `${s.windAvg.toFixed(1)} m/s` : "—"}
                              {s.windDir != null ? ` ${_windDir(s.windDir)}` : ""}
                            </span>
                          </div>

                          {/* Pressure */}
                          <div className="flex items-center gap-1">
                            <Gauge size={11} className="text-purple-400 flex-shrink-0"/>
                            <span className="text-[10px] text-[var(--text-secondary)]">
                              {s.pressure != null ? `${Math.round(s.pressure)} hPa` : "—"}
                            </span>
                          </div>

                          {/* PBL */}
                          <div className="flex items-center gap-1">
                            <Layers3 size={11} className="text-yellow-500 flex-shrink-0"/>
                            <span className="text-[10px] text-[var(--text-secondary)]">
                              {s.pbl != null ? `${Math.round(s.pbl)} m` : "—"}
                            </span>
                          </div>

                          {/* Inversion badge */}
                          {s.inversion && (
                            <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full w-fit"
                              style={{background:"rgba(234,88,12,.1)",color:"#c2410c",border:"1px solid rgba(234,88,12,.2)"}}>
                              Inversion
                            </span>
                          )}

                          {/* Precipitation */}
                          {s.precip > 0 && (
                            <div className="flex items-center gap-1">
                              <CloudRain size={11} className="text-sky-400 flex-shrink-0"/>
                              <span className="text-[9px] text-sky-600">{s.precip.toFixed(1)} mm</span>
                            </div>
                          )}

                          <p className="text-[8px] text-[var(--text-muted)] mt-1">{s.count} hourly pts</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )
            }
          </>
        )}

        {/* ── HOURLY VIEW ─── */}
        {view === "hourly" && (
          <div>
            <div className="overflow-x-auto rounded-xl" style={{border:"1px solid var(--border)"}}>
              <table className="w-full text-[11px] min-w-[700px]">
                <thead style={{background:"var(--surface-secondary)"}}>
                  <tr className="text-left text-[var(--text-secondary)] border-b border-[var(--border)]">
                    {["Time (IST)","Temp °C","Humidity %","Wind m/s","Dir","Pressure hPa","PBL m","Inversion","Rain mm"].map(h => (
                      <th key={h} className="px-3 py-2.5 font-semibold text-[10px] uppercase tracking-wide whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {hourRows.map((r, i) => {
                    const ist = new Date(new Date(r.timestamp_utc).getTime() + 5.5*3600*1000);
                    const ts  = ist.toLocaleString("en-IN",{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit",hour12:true,timeZone:"Asia/Kolkata"});
                    const inv = r.inversion_flag === true || r.inversion_flag === 1;
                    return (
                      <tr key={r.timestamp_utc || i}
                        className="border-b border-[var(--border)] hover:bg-[var(--surface-hover)] transition-colors"
                        style={{background: i%2===0 ? "var(--surface)" : "var(--surface-secondary)"}}>
                        <td className="px-3 py-2 text-[var(--text-secondary)] whitespace-nowrap font-medium">{ts}</td>
                        <td className="px-3 py-2 text-[var(--text-primary)] font-semibold">{fmt(r.temperature,1)}</td>
                        <td className="px-3 py-2 text-[var(--text-primary)]">{fmt(r.relative_humidity,0)}</td>
                        <td className="px-3 py-2 text-[var(--text-primary)]">{fmt(r.wind_speed,1)}</td>
                        <td className="px-3 py-2 text-[var(--text-secondary)]">{_windDir(Number(r.wind_direction))}</td>
                        <td className="px-3 py-2 text-[var(--text-primary)]">{fmt(r.surface_pressure,0)}</td>
                        <td className="px-3 py-2 text-[var(--text-primary)]">{fmt(r.pbl_height,0)}</td>
                        <td className="px-3 py-2">
                          <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${inv?"text-orange-700":"text-[var(--text-muted)]"}`}
                            style={inv?{background:"rgba(234,88,12,.1)",border:"1px solid rgba(234,88,12,.2)"}:{background:"var(--surface-active)"}}>
                            {inv ? "Active" : "None"}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-[var(--text-secondary)]">{fmt(r.precipitation,1)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            <div className="flex items-center justify-between mt-3">
              <span className="text-[11px] text-[var(--text-muted)]">
                Showing {hourPage*ROWS_PER_PAGE+1}–{Math.min((hourPage+1)*ROWS_PER_PAGE, observations.length)} of {observations.length} hourly rows
              </span>
              <div className="flex gap-1">
                <button onClick={() => setHourPage(p => Math.max(0,p-1))}
                  disabled={hourPage===0}
                  className="px-3 py-1.5 rounded-lg text-[11px] font-semibold disabled:opacity-40 transition-colors hover:bg-[var(--surface-hover)]"
                  style={{background:"var(--surface-secondary)",border:"1px solid var(--border)",color:"var(--text-secondary)"}}>
                  ← Prev
                </button>
                <button onClick={() => setHourPage(p => Math.min(totalHourPages-1,p+1))}
                  disabled={hourPage>=totalHourPages-1}
                  className="px-3 py-1.5 rounded-lg text-[11px] font-semibold disabled:opacity-40 transition-colors hover:bg-[var(--surface-hover)]"
                  style={{background:"var(--surface-secondary)",border:"1px solid var(--border)",color:"var(--text-secondary)"}}>
                  Next →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Charts section ────────────────────────────────── */}
      <div className="rounded-2xl p-5" style={{background:"var(--surface)",border:"1px solid var(--border)",boxShadow:"var(--shadow-sm)"}}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <p className="text-sm font-bold text-[var(--text-primary)]">Atmospheric Trends</p>
            <p className="text-[10px] text-[var(--text-muted)] mt-0.5">
              {view === "daily" ? "Daily averages" : "Hourly values (every 3rd hour)"} · Delhi-NCR
            </p>
          </div>
          {/* Chart selector */}
          <div className="flex flex-wrap gap-1">
            {Object.entries(chartConfigs).map(([k,v]) => (
              <button key={k} onClick={() => setChart(k)}
                className="px-3 py-1.5 rounded-lg text-[10px] font-semibold transition-colors"
                style={chart===k
                  ? {background:v.color, color:"#fff", boxShadow:`0 2px 6px ${v.color}44`}
                  : {background:"var(--surface-secondary)",color:"var(--text-secondary)",border:"1px solid var(--border)"}}>
                {v.label.split(" ")[0]}
              </button>
            ))}
          </div>
        </div>

        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData} margin={{top:8,right:8,left:-10,bottom:4}}>
              <defs>
                <linearGradient id="wx-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={cc.color} stopOpacity={0.28}/>
                  <stop offset="95%" stopColor={cc.color} stopOpacity={0.02}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false}/>
              <XAxis dataKey="t" tick={{fontSize:9,fill:"var(--text-muted)"}} axisLine={false} tickLine={false}
                interval={view==="daily" ? 0 : "preserveStartEnd"}/>
              <YAxis tick={{fontSize:9,fill:"var(--text-muted)"}} axisLine={false} tickLine={false}
                label={{value:cc.label.split(" ").slice(-1)[0], angle:-90, position:"insideLeft",
                        style:{fontSize:9,fill:"var(--text-muted)"},offset:8}}/>
              <Tooltip
                contentStyle={{background:"var(--surface)",border:"1px solid var(--border)",
                               borderRadius:10,fontSize:11,boxShadow:"var(--shadow-md)"}}
                labelStyle={{color:"var(--text-secondary)",fontWeight:600}}
                itemStyle={{color:cc.color,fontWeight:700}}
                formatter={v => v != null ? [`${Number(v).toFixed(1)} ${cc.label.match(/\(([^)]+)\)/)?.[1]||""}`, cc.label.split(" (")[0]]:["—",cc.label]}/>
              {cc.refLines.map(rl => (
                <ReferenceLine key={rl.y} y={rl.y} stroke="rgba(100,116,139,.4)"
                  strokeDasharray="4 3"
                  label={{value:rl.label,fontSize:8,fill:"var(--text-muted)",position:"right"}}/>
              ))}
              <Area type="monotone" dataKey={cc.key}
                stroke={cc.color} strokeWidth={2}
                fill="url(#wx-grad)" dot={false} connectNulls
                activeDot={{r:4,fill:cc.color,stroke:"var(--surface)",strokeWidth:2}}/>
              {/* For temperature also draw min/max range if in daily view */}
              {chart==="temp" && view==="daily" && (
                <>
                  <Area type="monotone" dataKey="tempMax" stroke="#ef4444" strokeWidth={1.2}
                    fill="none" dot={false} connectNulls strokeDasharray="3 2"
                    activeDot={{r:3,fill:"#ef4444"}}/>
                  <Area type="monotone" dataKey="tempMin" stroke="#38bdf8" strokeWidth={1.2}
                    fill="none" dot={false} connectNulls strokeDasharray="3 2"
                    activeDot={{r:3,fill:"#38bdf8"}}/>
                </>
              )}
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[220px] flex items-center justify-center text-xs text-[var(--text-muted)]">
            {loading ? "Loading weather data…" : "No chart data available."}
          </div>
        )}

        {chart === "temp" && view === "daily" && (
          <div className="flex items-center gap-4 mt-2 text-[10px] text-[var(--text-muted)]">
            <span className="flex items-center gap-1.5"><i className="w-5 h-0.5 rounded inline-block" style={{background:cc.color}}/> Avg</span>
            <span className="flex items-center gap-1.5"><i className="w-5 h-0.5 rounded inline-block border-dashed" style={{background:"#ef4444"}}/> Max</span>
            <span className="flex items-center gap-1.5"><i className="w-5 h-0.5 rounded inline-block border-dashed" style={{background:"#38bdf8"}}/> Min</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Plume Tracker Panel ──────────────────────────────────
function PlumePanel() {
  const [tab, setTab] = useState(0);
  const [timeIdx, setTimeIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const { stations } = useLiveStations();
  const tabs = ["Plume Map", "Source Regions", "Transport Timeline"];
  const times = ["Now", "+12h", "+24h", "+36h", "+48h", "+72h"];

  // Deterministic prototype values derived from first available station
  const refStation = stations.find(s => s.hasObs) || stations[0] || null;
  const domWindDir = "WNW";  // dominant stubble-season wind direction
  const windSpd = refStation?.wind_speed_ms != null ? Number(refStation.wind_speed_ms).toFixed(1) : "—";
  const plumeIntensity = ["Low","Low","Moderate","Moderate","High","Very High"][timeIdx];
  const intensityColor = ["#22c55e","#22c55e","#f97316","#f97316","#ef4444","#a855f7"][timeIdx];

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => setTimeIdx(v => {
      if (v >= times.length - 1) { setPlaying(false); return 0; }
      return v + 1;
    }), 900);
    return () => clearInterval(id);
  }, [playing]);

  // Prototype source regions
  const sourceRegions = [
    { name:"Punjab",   dist:"450–600 km NW", risk:"High",   color:"#ef4444" },
    { name:"Haryana",  dist:"150–350 km W",  risk:"High",   color:"#f97316" },
    { name:"UP West",  dist:"80–200 km E",   risk:"Moderate",color:"#eab308"},
    { name:"Rajasthan",dist:"400–600 km SW", risk:"Low",    color:"#22c55e" },
  ];

  return (
    <div id="plume-section" className="rounded-2xl overflow-hidden"
      style={{background:"var(--surface)",border:"1px solid var(--border)",boxShadow:"var(--shadow-sm)"}}>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 pt-4 pb-3 border-b border-[var(--border)]">
        <div>
          <p className="text-sm font-bold text-[var(--text-primary)]">Plume Tracker</p>
          <p className="text-[10px] text-[var(--text-muted)]">Stubble-burning source attribution · transport toward Delhi-NCR</p>
        </div>
        <span className="flex items-center gap-1.5 text-[10px] font-semibold text-amber-700 px-2.5 py-1.5 rounded-full"
          style={{background:"rgba(217,119,6,.08)",border:"1px solid rgba(217,119,6,.22)"}}>
          <Info size={11}/>Prototype / Simulated — fire backend not connected
        </span>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 p-1 mx-5 mt-3 rounded-xl" style={{background:"var(--surface-secondary)",border:"1px solid var(--border)"}}>
        {tabs.map((t, i) => (
          <button key={t} onClick={() => setTab(i)}
            className="flex-1 py-2 rounded-lg text-[11px] font-semibold transition-colors"
            style={tab === i
              ? {background:"var(--accent-green)", color:"#ffffff"}
              : {color:"var(--text-secondary)"}}>
            {t}
          </button>
        ))}
      </div>

      <div className="p-5">
        {/* ── Tab 0: Plume Map ── */}
        {tab === 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4">
            {/* Map visualization */}
            <div className="relative rounded-xl overflow-hidden" style={{minHeight:380,background:"#0d1b2a",border:"1px solid var(--border)"}}>
              {/* Satellite-style base */}
              <div className="absolute inset-0" style={{
                background:"linear-gradient(160deg,#0d2a1a 0%,#112211 35%,#0a1e2e 65%,#0d1a2e 100%)",
                opacity:.95
              }}/>
              {/* Grid lines */}
              <div className="absolute inset-0" style={{
                backgroundImage:"linear-gradient(rgba(148,163,184,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(148,163,184,.06) 1px,transparent 1px)",
                backgroundSize:"48px 48px"
              }}/>

              {/* Animated plume cone from NW toward Delhi */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 600 380" preserveAspectRatio="xMidYMid slice">
                <defs>
                  <radialGradient id="plume-g" cx="30%" cy="20%" r="70%">
                    <stop offset="0%"  stopColor="#f97316" stopOpacity={0.65 * (timeIdx / 4 + 0.3)}/>
                    <stop offset="40%" stopColor="#f97316" stopOpacity={0.3  * (timeIdx / 4 + 0.3)}/>
                    <stop offset="100%" stopColor="#f97316" stopOpacity="0"/>
                  </radialGradient>
                  <radialGradient id="ncr-g" cx="50%" cy="50%" r="50%">
                    <stop offset="0%"  stopColor="#a855f7" stopOpacity="0.3"/>
                    <stop offset="100%" stopColor="#a855f7" stopOpacity="0"/>
                  </radialGradient>
                </defs>
                {/* Source glow NW */}
                <ellipse cx="100" cy="80" rx="130" ry="90"  fill="url(#plume-g)"/>
                {/* Transport corridor */}
                <path d={`M 130 100 Q 200 160 280 200 Q 340 230 ${280 + timeIdx*20} ${200 + timeIdx*15}`}
                  stroke="#f97316" strokeWidth="12" strokeOpacity={0.18 + timeIdx*0.04}
                  fill="none" strokeLinecap="round"/>
                {/* Delhi-NCR concentration */}
                <ellipse cx="300" cy="210" rx="80" ry="55" fill="url(#ncr-g)"/>
                {/* Wind arrows */}
                {[[80,150,130,180],[150,120,200,150],[210,90,265,125]].map(([x1,y1,x2,y2],i) => (
                  <g key={i}>
                    <defs><marker id={`pa-${i}`} markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                      <polygon points="0 0,6 3,0 6" fill="rgba(186,230,253,.7)"/>
                    </marker></defs>
                    <line x1={x1} y1={y1} x2={x2} y2={y2}
                      stroke="rgba(186,230,253,.45)" strokeWidth="1.5" markerEnd={`url(#pa-${i})`}/>
                  </g>
                ))}
                {/* City dots */}
                {[["Delhi",300,210],["Gurugram",250,260],["Noida",350,220],["Ghaziabad",370,190]].map(([nm,cx,cy]) => (
                  <g key={nm}>
                    <circle cx={cx} cy={cy} r="5" fill="rgba(255,255,255,.85)" stroke="rgba(15,23,42,.5)" strokeWidth="1"/>
                    <text x={cx+8} y={cy+4} fontSize="9" fill="#f1f5f9" fontWeight="700"
                      style={{textShadow:"0 1px 4px rgba(0,0,0,.8)"}}>{nm}</text>
                  </g>
                ))}
                {/* Source label */}
                <text x="25" y="35" fontSize="10" fill="#fca5a5" fontWeight="800">Punjab · Haryana</text>
                <text x="25" y="50" fontSize="8" fill="#94a3b8">Stubble-burning source region</text>
              </svg>

              {/* Time indicator */}
              <div className="absolute top-3 right-3 flex items-center gap-2 px-3 py-1.5 rounded-lg"
                style={{background:"rgba(15,23,42,.88)",border:"1px solid rgba(255,255,255,.1)"}}>
                <span className="text-[10px] font-bold text-slate-200">Forecast: {times[timeIdx]}</span>
                <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full" style={{background:intensityColor+"33",color:intensityColor,border:`1px solid ${intensityColor}55`}}>
                  {plumeIntensity}
                </span>
              </div>

              {/* Legend */}
              <div className="absolute bottom-3 left-3 rounded-lg px-3 py-2"
                style={{background:"rgba(15,23,42,.88)",border:"1px solid rgba(255,255,255,.1)"}}>
                <p className="text-[9px] font-bold text-slate-400 mb-1.5">Plume Legend</p>
                {[["#f97316","Source region"],["#a855f7","NCR concentration"],["rgba(186,230,253,.6)","Wind flow"]].map(([c,l]) => (
                  <span key={l} className="flex items-center gap-1.5 text-[9px] text-slate-300 mb-0.5">
                    <i className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{background:c}}/>{l}
                  </span>
                ))}
              </div>
            </div>

            {/* Right side panel */}
            <div className="space-y-3">
              {/* Timeline controls */}
              <div className="rounded-xl p-3" style={{background:"var(--surface-secondary)",border:"1px solid var(--border)"}}>
                <p className="text-[10px] font-bold text-[var(--text-primary)] uppercase tracking-wide mb-2">Transport Timeline</p>
                <div className="grid grid-cols-3 gap-1 mb-2">
                  {times.map((t,i) => (
                    <button key={t} onClick={() => setTimeIdx(i)}
                      className="py-1.5 rounded-lg text-[10px] font-semibold transition-colors"
                      style={timeIdx === i
                        ? {background:"var(--accent-green)", color:"#fff"}
                        : {background:"var(--surface)", color:"var(--text-secondary)", border:"1px solid var(--border)"}}>
                      {t}
                    </button>
                  ))}
                </div>
                <button onClick={() => setPlaying(v => !v)}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-colors"
                  style={{background: playing ? "rgba(220,38,38,.08)" : "var(--accent-green-muted)", color: playing ? "#b91c1c" : "var(--accent-green)", border:`1px solid ${playing?"rgba(220,38,38,.2)":"rgba(5,150,105,.2)"}`}}>
                  {playing ? <><Pause size={13}/>Stop</>: <><Play size={13}/>Animate</>}
                </button>
              </div>
              {/* Current metrics */}
              <div className="rounded-xl p-3" style={{background:"var(--surface-secondary)",border:"1px solid var(--border)"}}>
                <p className="text-[10px] font-bold text-[var(--text-primary)] uppercase tracking-wide mb-2">Conditions</p>
                {[
                  ["Dominant Wind", `${domWindDir} · ${windSpd} m/s`],
                  ["Plume Intensity", plumeIntensity],
                  ["Transport Risk", timeIdx >= 4 ? "High" : timeIdx >= 2 ? "Moderate" : "Low"],
                  ["Source Region", "Punjab/Haryana"],
                  ["Data", "Prototype / Simulated"],
                ].map(([l,v]) => (
                  <div key={l} className="flex justify-between py-1.5 border-b border-[var(--border)] last:border-0">
                    <span className="text-[10px] text-[var(--text-muted)]">{l}</span>
                    <span className="text-[10px] font-semibold text-[var(--text-primary)]">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Tab 1: Source Regions ── */}
        {tab === 1 && (
          <div className="space-y-3">
            <div className="rounded-xl p-3 text-xs text-amber-700 flex items-start gap-2"
              style={{background:"rgba(217,119,6,.06)",border:"1px solid rgba(217,119,6,.2)"}}>
              <Info size={13} className="flex-shrink-0 mt-0.5"/>
              <span>Source-region data is prototype/simulated. Connect a FIRMS fire API to show real satellite fire detections.</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {sourceRegions.map(r => (
                <div key={r.name} className="rounded-xl p-4" style={{background:"var(--surface-secondary)",border:"1px solid var(--border)"}}>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-bold text-[var(--text-primary)]">{r.name}</p>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full text-white" style={{background:r.color}}>{r.risk}</span>
                  </div>
                  <p className="text-[10px] text-[var(--text-muted)]">{r.dist}</p>
                </div>
              ))}
            </div>
            <div className="rounded-xl p-3" style={{background:"var(--surface-secondary)",border:"1px solid var(--border)"}}>
              <p className="text-[10px] font-bold text-[var(--text-primary)] mb-2">Wind Transport Index (Prototype)</p>
              <div className="flex items-center gap-3">
                <Wind size={16} className="text-cyan-600"/>
                <div className="flex-1">
                  <div className="h-2 rounded-full overflow-hidden" style={{background:"var(--surface-active)"}}>
                    <div className="h-full rounded-full" style={{width:"68%",background:"linear-gradient(90deg,#22c55e,#f97316,#ef4444)"}}/>
                  </div>
                </div>
                <span className="text-xs font-bold text-[var(--text-primary)]">68%</span>
              </div>
              <p className="text-[9px] text-[var(--text-muted)] mt-1.5">NW alignment index — higher = greater transport risk toward NCR</p>
            </div>
          </div>
        )}

        {/* ── Tab 2: Transport Timeline ── */}
        {tab === 2 && (
          <div className="space-y-3">
            <p className="text-xs text-[var(--text-muted)]">Prototype 72-hour transport forecast. Connect fire/wind backend for real data.</p>
            <div className="space-y-2">
              {times.map((t, i) => {
                const intensity = ["Low","Low","Moderate","Moderate","High","Very High"][i];
                const col = ["#22c55e","#22c55e","#f97316","#f97316","#ef4444","#a855f7"][i];
                const pct = [15,20,40,55,72,88][i];
                return (
                  <div key={t} className="rounded-xl p-3 flex items-center gap-3"
                    style={{background: timeIdx===i ? "var(--accent-green-muted)" : "var(--surface-secondary)",
                           border:`1px solid ${timeIdx===i?"rgba(5,150,105,.25)":"var(--border)"}`}}>
                    <button onClick={() => setTimeIdx(i)}
                      className="w-12 text-center text-[10px] font-bold flex-shrink-0"
                      style={{color: timeIdx===i ? "var(--accent-green)" : "var(--text-secondary)"}}>{t}</button>
                    <div className="flex-1 h-2 rounded-full overflow-hidden" style={{background:"var(--surface-active)"}}>
                      <div className="h-full rounded-full transition-all" style={{width:`${pct}%`,background:col}}/>
                    </div>
                    <span className="text-[10px] font-semibold w-20 text-right" style={{color:col}}>{intensity}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
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
    <div className="grid grid-cols-4 gap-1 p-1 rounded-xl" style={{background:"var(--surface-secondary)",border:"1px solid var(--border)"}}>{[["all","All"],["high","High"],["mod","Moderate"],["info","Info"]].map(([v,l])=><button key={v} onClick={()=>setFilter(v)} className="py-2 rounded-lg text-[10px] font-semibold transition-colors" style={filter===v?{background:"var(--accent-green)",color:"#ffffff"}:{color:"var(--text-secondary)"}}>{l}</button>)}</div>
    <div className="space-y-2.5">{filtered.map(a=><div key={a.id} className="p-4 rounded-xl transition-all" style={{background:a.bg,border:`1px solid ${a.border}`,opacity:read[a.id]?0.65:1}}><div className="flex items-start gap-3"><div className="p-2 rounded-xl" style={{background:"var(--surface-hover)"}}><span className={a.badgeC}>{a.icon}</span></div><div className="flex-1"><div className="flex items-center justify-between gap-2"><p className="text-xs font-bold text-[var(--text-primary)]">{a.title}</p><span className={`text-[9px] font-bold px-2 py-1 rounded-full ${a.badgeC}`} style={{background:"var(--surface-hover)"}}>{a.badge}</span></div><p className="text-[10px] text-[var(--text-muted)] mt-1.5 leading-relaxed">{a.desc}</p><div className="flex flex-wrap gap-3 mt-2"><span className="text-[9px] text-[var(--text-muted)] flex items-center gap-1"><MapPin size={9}/>{a.areas}</span><span className="text-[9px] text-[var(--text-muted)] flex items-center gap-1"><Clock size={9}/>{a.time}</span></div><div className="flex gap-2 mt-3"><button onClick={()=>setRead(v=>({...v,[a.id]:!v[a.id]}))} className="text-[9px] px-2.5 py-1.5 rounded-lg text-emerald-300" style={{background:"rgba(6,182,212,.08)",border:"1px solid rgba(6,182,212,.14)"}}>{read[a.id]?"Mark unread":"Mark read"}</button><button onClick={()=>window.alert(`${a.title}\n\n${a.desc}\n\nAreas: ${a.areas}`)} className="text-[9px] px-2.5 py-1.5 rounded-lg text-[var(--text-muted)]" style={{background:"var(--surface-hover)",border:"1px solid var(--surface-hover)"}}>Details</button></div></div></div></div>)}</div>
    <div className="rounded-xl p-3 flex items-center gap-3" style={{background:"var(--surface-secondary)",border:"1px solid var(--surface-hover)"}}><Radio size={14} className="text-green-400"/><p className="text-[9px] text-[var(--text-muted)]">Monitoring cycle: the production app should poll the backend every 4–6 hours. This UI also supports a notification tone when a new cycle is received.</p></div>
  </div>;
}

// ─── NCR Map Panel ────────────────────────────────────────
// Standard 6-band AQI colour scale per spec
function aqiMapColor(v) {
  if (v == null || !Number.isFinite(v)) return "#64748b";
  if (v <= 50)  return "#22c55e";  // green — Good
  if (v <= 100) return "#eab308";  // yellow — Moderate
  if (v <= 200) return "#f97316";  // orange — Sensitive Groups
  if (v <= 300) return "#ef4444";  // red — Unhealthy
  if (v <= 400) return "#9333ea";  // purple — Very Unhealthy
  return "#7f1d1d";                // dark maroon — Hazardous
}
function aqiMapLabel(v) {
  if (v == null || !Number.isFinite(v)) return "No data";
  if (v <= 50)  return "Good";
  if (v <= 100) return "Moderate";
  if (v <= 200) return "Sensitive Groups";
  if (v <= 300) return "Unhealthy";
  if (v <= 400) return "Very Unhealthy";
  return "Hazardous";
}

// Bilinear-style inverse-distance weighted heatmap using Canvas 2D
function drawHeatmap(canvas, stations, pollutantKey, width, height, lonToX, latToY, cx, cy) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  canvas.width  = width;
  canvas.height = height;
  ctx.clearRect(0, 0, width, height);

  const points = stations
    .map(s => {
      const v = s[pollutantKey];
      const px = width  / 2 + (lonToX(s.lon) - cx);
      const py = height / 2 + (latToY(s.lat) - cy);
      return { px, py, v };
    })
    .filter(p => p.v != null && Number.isFinite(p.v)
              && p.px > -100 && p.px < width  + 100
              && p.py > -100 && p.py < height + 100);

  if (!points.length) return;

  // Render as blurred radial blobs per station for a smooth interpolated look
  for (const pt of points) {
    const color = aqiMapColor(pt.v);
    const r = 120; // influence radius
    const grad = ctx.createRadialGradient(pt.px, pt.py, 0, pt.px, pt.py, r);
    // parse hex → rgba
    const hex = color.replace("#","");
    const ri = parseInt(hex.slice(0,2),16);
    const gi = parseInt(hex.slice(2,4),16);
    const bi = parseInt(hex.slice(4,6),16);
    grad.addColorStop(0,   `rgba(${ri},${gi},${bi},0.55)`);
    grad.addColorStop(0.4, `rgba(${ri},${gi},${bi},0.28)`);
    grad.addColorStop(1,   `rgba(${ri},${gi},${bi},0)`);
    ctx.beginPath();
    ctx.fillStyle = grad;
    ctx.arc(pt.px, pt.py, r, 0, Math.PI * 2);
    ctx.fill();
  }
}

// City label definitions relative to NCR center
const NCR_CITIES = [
  { name:"Delhi",      lat:28.6139, lon:77.2090, anchor:"center" },
  { name:"Gurugram",   lat:28.4595, lon:77.0266, anchor:"left" },
  { name:"Noida",      lat:28.5355, lon:77.3910, anchor:"right" },
  { name:"Ghaziabad",  lat:28.6692, lon:77.4538, anchor:"right" },
  { name:"Faridabad",  lat:28.4089, lon:77.3178, anchor:"left" },
  { name:"Sonipat",    lat:28.9931, lon:77.0151, anchor:"left" },
  { name:"Rohtak",     lat:28.8955, lon:76.6066, anchor:"left" },
  { name:"Meerut",     lat:28.9845, lon:77.7064, anchor:"right" },
  { name:"Panipat",    lat:29.3909, lon:76.9635, anchor:"left" },
];

function NcrMapPanel() {
  const {stations:liveStations,live,loading,stale:mapStale}=useLiveStations();
  const [zoom,setZoom]=useState(10);
  const [layer,setLayer]=useState("satellite");
  const [selected,setSelected]=useState(null);
  const [showStations,setShowStations]=useState(true);
  const [pollutant,setPollutant]=useState("AQI");
  const [showWind,setShowWind]=useState(true);
  const [showBoundary,setShowBoundary]=useState(true);
  const [showCities,setShowCities]=useState(true);
  const [showHeatmap,setShowHeatmap]=useState(true);
  const canvasRef = useRef(null);
  // Responsive canvas width — measured via ResizeObserver on the map container.
  // MAP_H is fixed; mapW tracks the actual container clientWidth so the canvas,
  // SVG overlays, tile grid and all coordinate transforms always fill the viewport.
  const MAP_H = 480;
  const [mapW, setMapW] = useState(840);
  const mapContainerRef = useRef(null);
  useEffect(() => {
    const el = mapContainerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(entries => {
      for (const e of entries) {
        const w = Math.floor(e.contentRect.width);
        if (w > 0) setMapW(w);
      }
    });
    ro.observe(el);
    const w = Math.floor(el.clientWidth);
    if (w > 0) setMapW(w);
    return () => ro.disconnect();
  }, []);

  const center={lat:28.62,lon:77.20};
  const tileSize=256;
  const worldPx=tileSize*Math.pow(2,zoom);
  const lonToX=lon=>(lon+180)/360*worldPx;
  const latToY=lat=>{const r=lat*Math.PI/180;return (1-Math.log(Math.tan(r)+1/Math.cos(r))/Math.PI)/2*worldPx;};
  const cx=lonToX(center.lon), cy=latToY(center.lat);

  const tiles=[]; const tileX=Math.floor(cx/tileSize),tileY=Math.floor(cy/tileSize);
  for(let dx=-3;dx<=3;dx++) for(let dy=-2;dy<=2;dy++){
    let x=tileX+dx,y=tileY+dy,n=Math.pow(2,zoom);
    if(x<0||x>=n||y<0||y>=n)continue;
    tiles.push({x,y,key:`${x}-${y}`,left:x*tileSize-cx+mapW/2,top:y*tileSize-cy+MAP_H/2});
  }

  const markerPos = s => ({
    left: mapW/2 + (lonToX(s.lon)-cx),
    top:  MAP_H/2 + (latToY(s.lat)-cy),
  });
  const cityPos = c => ({
    left: mapW/2 + (lonToX(c.lon)-cx),
    top:  MAP_H/2 + (latToY(c.lat)-cy),
  });

  const pollutantKey = {AQI:"aqi","PM2.5":"pm25",PM10:"pm10",O3:"o3",NO2:"no2"}[pollutant];

  // Determine heatmap value for colouring (PM2.5→AQI scale, others scaled)
  const stationHeatVal = s => {
    const raw = s[pollutantKey];
    if (raw == null) return null;
    if (pollutant === "AQI") return raw;
    if (pollutant === "PM2.5") return raw * 1.8;
    if (pollutant === "PM10")  return raw * 0.8;
    return raw * 1.4;
  };

  const markerColor = s => aqiMapColor(pollutant==="AQI" ? s.aqi : stationHeatVal(s));

  // Redraw canvas heatmap when data or pollutant changes
  useEffect(() => {
    if (!canvasRef.current || !showHeatmap || !liveStations.length) return;
    // Build synthetic pollutant-value stations for heatmap
    const pts = liveStations.map(s => ({...s, _v: stationHeatVal(s)}));
    drawHeatmap(canvasRef.current, pts.map(s=>({...s, [pollutantKey]:s._v})),
      pollutantKey, mapW, MAP_H, lonToX, latToY, cx, cy);
  }, [liveStations, pollutant, showHeatmap, zoom, mapW]);

  const tileFilter = layer === "satellite"
    ? "brightness(.55) saturate(1.3) contrast(1.1)"
    : "brightness(.62) invert(.88) hue-rotate(180deg) saturate(.78) contrast(1.18)";

  return (
    <div id="map-section" className="card-hover rounded-2xl overflow-hidden"
      style={{background:"var(--surface)",border:"1px solid var(--border)",boxShadow:"var(--shadow-sm)"}}>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 pt-4 pb-3 border-b border-[var(--border)]">
        <div>
          <p className="text-sm font-bold text-[var(--text-primary)]">Delhi-NCR Atmospheric Monitoring</p>
          <p className="text-[10px] text-[var(--text-muted)] mt-0.5">{liveStations.length} backend stations · latest observations</p>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          {/* Pollutant selector */}
          <select value={pollutant} onChange={e=>setPollutant(e.target.value)}
            className="text-xs rounded-lg px-2.5 py-1.5 font-medium text-[var(--text-primary)] outline-none"
            style={{background:"var(--surface-secondary)",border:"1px solid var(--border)"}}>
            {["AQI","PM2.5","PM10","O3","NO2"].map(v=><option key={v}>{v}</option>)}
          </select>
          <span className="flex items-center gap-1.5 text-[10px] font-semibold text-emerald-700 px-2.5 py-1.5 rounded-full"
            style={{background:"rgba(5,150,105,.08)",border:"1px solid rgba(5,150,105,.2)"}}>
            <span className="live-dot w-1.5 h-1.5 rounded-full bg-emerald-500"/>
            {loading?"Updating…":live?"LIVE":"Unavailable"}
          </span>
        </div>
      </div>

      {mapStale && (
        <div className="px-5 py-2 text-[11px] text-amber-700 flex items-center gap-2"
          style={{background:"rgba(217,119,6,.06)",borderBottom:"1px solid rgba(217,119,6,.18)"}}>
          <Info size={12}/>Live refresh unavailable — showing last synced data.
        </div>
      )}

      {/* Map viewport — ref attached for ResizeObserver */}
      <div ref={mapContainerRef} className="relative overflow-hidden" style={{height:MAP_H, background:"#0d1b2a"}}>

        {/* OSM tiles */}
        <div className="absolute inset-0 overflow-hidden" style={{filter:tileFilter,transition:"filter .3s ease"}}>
          {tiles.map(t=>(
            <img key={t.key} alt="" src={`https://tile.openstreetmap.org/${zoom}/${t.x}/${t.y}.png`}
              className="absolute w-64 h-64" style={{left:t.left,top:t.top,maxWidth:"none"}}
              onError={e=>{e.currentTarget.style.opacity=".2"}}/>
          ))}
        </div>

        {/* Canvas heatmap */}
        {showHeatmap && (
          <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none"
            style={{width:"100%",height:"100%",mixBlendMode:"screen",opacity:.85}}
            width={mapW} height={MAP_H}/>
        )}

        {/* Dark vignette */}
        <div className="absolute inset-0 pointer-events-none"
          style={{background:"radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(0,0,0,.35) 100%)"}}/>

        {/* NCR boundary ring */}
        {showBoundary && (
          <div className="absolute pointer-events-none rounded-[40%]"
            style={{
              left:"12%",right:"10%",top:"8%",bottom:"8%",
              border:"1.5px dashed rgba(255,255,255,.28)",
            }}/>
        )}

        {/* Wind flow arrows (decorative SVG) */}
        {showWind && (
          <svg className="absolute inset-0 pointer-events-none" width={mapW} height={MAP_H} style={{opacity:.55}}>
            {[
              [160,80,220,110],[240,100,310,95],[350,90,420,105],
              [90,190,150,200],[220,180,290,170],[380,170,450,165],
              [130,300,200,310],[290,290,360,280],[430,290,500,305],
              [160,390,230,380],[320,380,390,390],[490,370,560,360],
            ].map(([x1,y1,x2,y2],i) => (
              <g key={i}>
                <defs>
                  <marker id={`arr-${i}`} markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
                    <polygon points="0 0, 5 2.5, 0 5" fill="rgba(186,230,253,.7)"/>
                  </marker>
                </defs>
                <line x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke="rgba(186,230,253,.5)" strokeWidth="1.2"
                  markerEnd={`url(#arr-${i})`}/>
              </g>
            ))}
          </svg>
        )}

        {/* City labels */}
        {showCities && NCR_CITIES.map(city => {
          const p = cityPos(city);
          const inView = p.left > 0 && p.left < mapW && p.top > 0 && p.top < MAP_H;
          if (!inView) return null;
          return (
            <div key={city.name} className="absolute pointer-events-none select-none"
              style={{
                left: p.left, top: p.top,
                transform: city.anchor === "right" ? "translate(-100%,-50%)" : city.anchor === "center" ? "translate(-50%,-50%)" : "translate(8px,-50%)",
              }}>
              <span className="text-[11px] font-black tracking-wide drop-shadow-lg"
                style={{
                  color:"#ffffff",
                  textShadow:"0 1px 6px rgba(0,0,0,.9), 0 0 14px rgba(0,0,0,.7)",
                }}>
                {city.name}
              </span>
            </div>
          );
        })}

        {/* Station markers — dark circle + colored ring + AQI number */}
        {showStations && liveStations.map(s => {
          const p = markerPos(s);
          const c = markerColor(s);
          const isSelected = selected?.station_id === s.station_id;
          const sz = isSelected ? 36 : 26;
          const inView = p.left > -20 && p.left < mapW+20 && p.top > -20 && p.top < MAP_H+20;
          if (!inView) return null;
          return (
            <button key={s.station_id}
              onClick={() => setSelected(s)}
              className="absolute -translate-x-1/2 -translate-y-1/2 group z-10"
              style={{left:p.left, top:p.top}}>
              {/* Outer glow ring */}
              <span className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                  boxShadow:`0 0 ${isSelected?20:10}px ${c}88`,
                  borderRadius:"50%",
                }}/>
              {/* Dark navy circle with colored border */}
              <span className="flex items-center justify-center rounded-full font-black leading-none"
                style={{
                  width:sz, height:sz,
                  background:"rgba(10,18,36,.88)",
                  border:`2px solid ${c}`,
                  boxShadow:`inset 0 0 0 1px rgba(255,255,255,.08)`,
                  fontSize: isSelected ? 10 : 8,
                  color: c,
                }}>
                {s.aqi != null ? Math.round(s.aqi) : "—"}
              </span>
              {/* Hover tooltip */}
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:flex whitespace-nowrap items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-semibold pointer-events-none"
                style={{background:"rgba(10,18,36,.95)",color:"#f1f5f9",border:`1px solid ${c}55`,boxShadow:"0 4px 12px rgba(0,0,0,.4)"}}>
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{background:c}}/>
                {s.name}
              </span>
            </button>
          );
        })}

        {/* Selected station popup */}
        {selected && (() => {
          const c = aqiMapColor(selected.aqi);
          return (
            <div className="absolute left-3 top-3 rounded-xl w-56 z-20"
              style={{background:"rgba(10,18,36,.96)",border:`1px solid ${c}44`,backdropFilter:"blur(16px)",boxShadow:"0 8px 24px rgba(0,0,0,.5)"}}>
              <div className="flex items-center justify-between px-3 pt-3 pb-1">
                <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Station detail</p>
                <button onClick={()=>setSelected(null)} className="text-slate-400 hover:text-white p-0.5 rounded"><X size={12}/></button>
              </div>
              <div className="px-3 pb-3">
                <p className="text-sm font-bold text-white leading-tight">{selected.name}</p>
                <p className="text-[10px] text-slate-400 mt-0.5 mb-2">{selected.city ?? selected.station_id}</p>
                <div className="flex items-end gap-2 mb-3">
                  <p className="text-3xl font-black" style={{color:c}}>{selected.aqi != null ? Math.round(selected.aqi) : "—"}</p>
                  <div>
                    <p className="text-[10px] text-slate-400 leading-none">AQI</p>
                    <p className="text-[10px] font-semibold leading-none mt-0.5" style={{color:c}}>{aqiMapLabel(selected.aqi)}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    ["PM2.5", selected.pm25, "µg/m³"],
                    ["PM10",  selected.pm10,  "µg/m³"],
                    ["O3",    selected.o3,    "µg/m³"],
                    ["NO2",   selected.no2,   "µg/m³"],
                    ["Temp",  selected.temperature_c, "°C"],
                    ["Wind",  selected.wind_speed_ms, "m/s"],
                    ["Humidity", selected.humidity, "%"],
                    ["Agency", null, selected.agency ?? "—"],
                  ].map(([label, num, unit]) => (
                    <div key={label}>
                      <p className="text-[8px] text-slate-400 uppercase">{label}</p>
                      <p className="text-[10px] font-semibold text-slate-200">
                        {num != null ? `${Math.round(num*10)/10} ${unit}` : (unit && !unit.includes("µ") && !unit.includes("°") && !unit.includes("m/s") && !unit.includes("%") ? unit : "—")}
                      </p>
                    </div>
                  ))}
                </div>
                {selected.timestamp && (
                  <p className="text-[8px] text-slate-500 mt-2 border-t border-white/10 pt-1.5">
                    {new Date(selected.timestamp).toLocaleString("en-IN",{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"})}
                  </p>
                )}
              </div>
            </div>
          );
        })()}

        {/* Zoom controls */}
        <div className="absolute top-3 right-3 flex flex-col gap-1">
          {[
            {icon:<ZoomIn size={13}/>, fn:()=>setZoom(z=>Math.min(13,z+1))},
            {icon:<ZoomOut size={13}/>, fn:()=>setZoom(z=>Math.max(9,z-1))},
            {icon:<Crosshair size={13}/>, fn:()=>setZoom(10)},
          ].map(({icon,fn},i)=>(
            <button key={i} onClick={fn}
              className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[var(--surface-hover)] transition-colors"
              style={{background:"rgba(255,255,255,.92)",border:"1px solid rgba(15,23,42,.12)",color:"var(--text-secondary)",boxShadow:"0 2px 6px rgba(0,0,0,.2)"}}>
              {icon}
            </button>
          ))}
        </div>

        {/* Layer/toggle controls */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 flex flex-wrap gap-1 px-2 py-1.5 rounded-xl"
          style={{background:"rgba(255,255,255,.92)",border:"1px solid rgba(15,23,42,.1)",boxShadow:"0 2px 8px rgba(0,0,0,.18)"}}>
          {[
            {label:"Satellite", fn:()=>setLayer("satellite"), active:layer==="satellite"},
            {label:"Map",       fn:()=>setLayer("dark"),      active:layer==="dark"},
            {label:"Heatmap",   fn:()=>setShowHeatmap(v=>!v), active:showHeatmap},
            {label:"Wind",      fn:()=>setShowWind(v=>!v),    active:showWind},
            {label:"Cities",    fn:()=>setShowCities(v=>!v),  active:showCities},
            {label:"Boundary",  fn:()=>setShowBoundary(v=>!v),active:showBoundary},
          ].map(({label,fn,active})=>(
            <button key={label} onClick={fn}
              className="px-2.5 py-1 rounded-md text-[10px] font-semibold transition-colors"
              style={active
                ? {background:"var(--accent-green)",color:"#fff"}
                : {color:"var(--text-secondary)","hover:background":"var(--surface-hover)"}}>
              {label}
            </button>
          ))}
        </div>

        {/* Scale label */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2 py-1 rounded-lg"
          style={{background:"rgba(10,18,36,.88)",border:"1px solid rgba(255,255,255,.1)"}}>
          <div style={{width:40,height:3,background:"rgba(255,255,255,.5)",borderRadius:99}}/>
          <span className="text-[9px] font-semibold text-slate-300">~20 km</span>
        </div>

        {/* Legend */}
        <div className="absolute bottom-3 right-3 rounded-xl px-3 py-2 max-w-[280px]"
          style={{background:"rgba(10,18,36,.90)",border:"1px solid rgba(255,255,255,.1)"}}>
          <p className="text-[9px] font-bold text-slate-400 mb-1.5">{pollutant} · AQI Scale</p>
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            {[
              ["#22c55e","≤50 Good"],
              ["#eab308","51–100"],
              ["#f97316","101–150"],
              ["#ef4444","151–200"],
              ["#a855f7","201–300"],
              ["#6d28d9","301–400"],
              ["#7f1d1d",">400"],
            ].map(([col,lbl])=>(
              <span key={lbl} className="flex items-center gap-1 text-[9px] text-slate-300">
                <i className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{background:col}}/>
                {lbl}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Station grid below map */}
      <div className="px-4 pt-3 pb-4">
        <p className="text-[10px] font-semibold text-[var(--text-muted)] mb-2 uppercase tracking-wide">All {liveStations.length} monitoring stations</p>
        <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-8 gap-1.5">
          {liveStations.map(s => {
            const c = markerColor(s);
            return (
              <button key={s.station_id} onClick={()=>setSelected(s)}
                className="rounded-lg p-2 text-left transition-colors hover:bg-[var(--surface-hover)]"
                style={{
                  background: selected?.station_id===s.station_id ? "var(--accent-green-muted)" : "var(--surface-secondary)",
                  border:`1px solid ${selected?.station_id===s.station_id?"rgba(5,150,105,.3)":"var(--border)"}`,
                }}>
                <p className="text-[9px] text-[var(--text-muted)] truncate leading-tight">{s.name}</p>
                <p className="text-sm font-black mt-0.5 leading-none" style={{color:c}}>
                  {s.aqi != null ? Math.round(s.aqi) : "—"}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Quick Actions ────────────────────────────────────────
function QuickActions({ onAction }) {
  const actions = [
    { icon:<BarChart3 size={18}/>, label:"AQI Forecast",   sub:"72-Hour Prediction",   path:"/forecast",    color:"#7c3aed", glow:"rgba(124,58,237,.12)" },
    { icon:<Map size={18}/>,       label:"NCR Map",         sub:"Spatial AQI Analysis", path:"/map",         color:"#0891b2", glow:"rgba(8,145,178,.12)" },
    { icon:<Navigation size={18}/>,label:"Stations",        sub:"79 NCR Stations",      path:"/stations",    color:"#059669", glow:"rgba(5,150,105,.12)" },
    { icon:<Layers3 size={18}/>,   label:"WRF-Chem",        sub:"Coupled Forecast",     path:"/wrf-chem",    color:"#1d4ed8", glow:"rgba(29,78,216,.12)" },
    { icon:<CloudSun size={18}/>,  label:"Weather",         sub:"Live Conditions",      path:"/weather",     color:"#d97706", glow:"rgba(217,119,6,.12)" },
    { icon:<Heart size={18}/>,     label:"Decision Support",    sub:"Health & action guidance", path:"/suggestions", color:"#be185d", glow:"rgba(190,24,93,.12)" },
    { icon:<Bell size={18}/>,      label:"Alerts",          sub:"Risk Notifications",   path:"/alerts",      color:"#dc2626", glow:"rgba(220,38,38,.12)" },
    { icon:<Bot size={18}/>,       label:"AI Insights",     sub:"Explain the forecast", path:"/ai",          color:"#0891b2", glow:"rgba(8,145,178,.12)" },
    { icon:<FileText size={18}/>,  label:"Forecast Validation", sub:"Analytics & Export",   path:"/reports",     color:"#2563eb", glow:"rgba(37,99,235,.12)" },
    { icon:<Settings size={18}/>,  label:"Settings",        sub:"Profile",              path:"/settings",    color:"#7c3aed", glow:"rgba(124,58,237,.12)" },
  ];
  return (
    <div id="quick-actions" className="grid grid-cols-2 sm:grid-cols-5 gap-3">
      {actions.map(a=>(
        <button key={a.path} onClick={()=>onAction(a.path)}
          className="card-hover p-4 rounded-xl flex flex-col items-center text-center gap-2.5"
          style={{background:"var(--surface)",border:"1px solid var(--border)",boxShadow:"var(--shadow-sm)"}}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{background:a.glow}}>
            <span style={{color:a.color}}>{a.icon}</span>
          </div>
          <div>
            <p className="text-xs font-semibold text-[var(--text-primary)]">{a.label}</p>
            <p className="text-[10px] text-[var(--text-muted)] mt-0.5">{a.sub}</p>
          </div>
        </button>
      ))}
    </div>
  );
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
  return <FeatureSection id="reports-section" icon={<FileText size={17} className="text-cyan-400"/>} title="Forecast Validation" subtitle="Validate backend station data, forecast skill and export analysis reports">
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
/* ── Motion backdrop ───────────────────────────── */
@keyframes aeroOrbit{from{transform:rotate(0deg) translateX(12px) rotate(0deg)}to{transform:rotate(360deg) translateX(12px) rotate(-360deg)}}
@keyframes aeroFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}
@keyframes aeroMarquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
@keyframes aeroFade{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
@keyframes aeroPulse{0%,100%{box-shadow:0 0 0 0 rgba(5,150,105,.1)}50%{box-shadow:0 0 0 9px rgba(5,150,105,0)}}
@keyframes aeroStar{0%,100%{opacity:.1;transform:translate3d(0,0,0) scale(.8)}50%{opacity:.4;transform:translate3d(0,-8px,0) scale(1)}}
.motion-backdrop{position:fixed;inset:0;overflow:hidden;pointer-events:none;z-index:0;--mx:0px;--my:0px;--mx2:0px;--my2:0px;--glow-x:50%;--glow-y:38%;}
.motion-backdrop:before{content:"";position:absolute;inset:0;background:radial-gradient(circle at var(--glow-x) var(--glow-y),rgba(5,150,105,.04),transparent 28%),radial-gradient(circle at 80% 80%,rgba(139,92,246,.03),transparent 28%);}
.motion-grid{position:absolute;inset:-5%;opacity:.12;transform:translate3d(var(--mx2),var(--my2),0);background-image:linear-gradient(rgba(148,163,184,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(148,163,184,.06) 1px,transparent 1px);background-size:48px 48px;mask-image:radial-gradient(circle at center,#000 20%,transparent 78%);}
.motion-orb{position:absolute;border-radius:999px;filter:blur(1px);will-change:transform;transition:transform .12s linear;mix-blend-mode:multiply;}
.motion-orb-a{width:360px;height:360px;left:-90px;top:10%;background:radial-gradient(circle,rgba(5,150,105,.06),transparent 68%);transform:translate3d(var(--mx),var(--my),0);}
.motion-orb-b{width:300px;height:300px;right:-60px;top:34%;background:radial-gradient(circle,rgba(139,92,246,.05),transparent 68%);transform:translate3d(var(--mx2),var(--my2),0);}
.motion-orb-c{width:260px;height:260px;left:38%;bottom:-100px;background:radial-gradient(circle,rgba(59,130,246,.04),transparent 68%);transform:translate3d(calc(var(--mx) * -.55),calc(var(--my) * -.55),0);}
.motion-cursor-glow{position:absolute;width:340px;height:340px;left:calc(var(--glow-x) - 170px);top:calc(var(--glow-y) - 170px);border-radius:50%;background:radial-gradient(circle,rgba(5,150,105,.03),transparent 67%);filter:blur(8px);}
.motion-stars{position:absolute;inset:0;transform:translate3d(var(--mx2),var(--my2),0);}
.motion-stars i{position:absolute;width:2px;height:2px;border-radius:50%;background:rgba(148,163,184,.5);left:calc((var(--i) * 17 + 9) * 1%);top:calc((var(--i) * 29 + 7) * 1%);animation:aeroStar calc(3s + (var(--i) * .18s)) ease-in-out infinite;animation-delay:calc(var(--i) * -.2s);}
.animate-float{animation:aeroFloat 4s ease-in-out infinite}.animate-marquee{animation:aeroMarquee 26s linear infinite}.animate-fade-in{animation:aeroFade .55s ease both}.live-dot{animation:aeroPulse 1.8s ease-out infinite}
@media (pointer:coarse){.motion-backdrop .motion-grid{transform:none}.motion-orb,.motion-stars{transform:none!important}.motion-cursor-glow{display:none}}
@media (prefers-reduced-motion:reduce){.motion-backdrop,.motion-backdrop *,.animate-float,.animate-marquee,.animate-fade-in,.live-dot{animation:none!important;transition:none!important}.motion-backdrop{display:none}}
/* ── Auth motion (dark bg — auth screen only) ──── */
.auth-motion{position:absolute;inset:0;overflow:hidden;pointer-events:none;--ax:0px;--ay:0px;--bx:0px;--by:0px;--gx:50vw;--gy:40vh}
.auth-motion:before{content:"";position:absolute;inset:0;background:radial-gradient(circle at var(--gx) var(--gy),rgba(34,211,238,.065),transparent 19%),radial-gradient(circle at 15% 80%,rgba(59,130,246,.06),transparent 25%),radial-gradient(circle at 88% 18%,rgba(139,92,246,.07),transparent 26%)}
.auth-grid{position:absolute;inset:-8%;opacity:.18;transform:translate3d(var(--bx),var(--by),0);background-image:linear-gradient(rgba(148,163,184,.045) 1px,transparent 1px),linear-gradient(90deg,rgba(148,163,184,.045) 1px,transparent 1px);background-size:52px 52px;mask-image:radial-gradient(circle at center,#000 15%,transparent 78%);transition:transform .15s linear}
.auth-orb{position:absolute;border-radius:999px;filter:blur(2px);will-change:transform;transition:transform .18s linear}
.auth-orb-a{width:420px;height:420px;left:-150px;top:12%;background:radial-gradient(circle,rgba(6,182,212,.12),transparent 67%);transform:translate3d(var(--ax),var(--ay),0)}
.auth-orb-b{width:360px;height:360px;right:-100px;top:35%;background:radial-gradient(circle,rgba(139,92,246,.11),transparent 67%);transform:translate3d(var(--bx),var(--by),0)}
.auth-orb-c{width:300px;height:300px;left:40%;bottom:-130px;background:radial-gradient(circle,rgba(59,130,246,.09),transparent 67%);transform:translate3d(calc(var(--ax) * -.55),calc(var(--ay) * -.55),0)}
.auth-cursor-glow{position:absolute;width:360px;height:360px;left:calc(var(--gx) - 180px);top:calc(var(--gy) - 180px);border-radius:50%;background:radial-gradient(circle,rgba(34,211,238,.04),transparent 68%);filter:blur(10px)}
.auth-stars{position:absolute;inset:0;transform:translate3d(var(--bx),var(--by),0)}
.auth-stars i{position:absolute;width:2px;height:2px;border-radius:50%;background:rgba(226,232,240,.45);left:calc((var(--i) * 17 + 7) * 1%);top:calc((var(--i) * 29 + 11) * 1%);animation:aeroStar calc(3s + (var(--i) * .16s)) ease-in-out infinite;animation-delay:calc(var(--i) * -.19s)}
.auth-feature-card,.auth-mini-card{transition:transform .25s ease,border-color .25s ease,background .25s ease,box-shadow .25s ease}
.auth-feature-card:hover{transform:translateY(-4px);border-color:rgba(34,211,238,.2)!important;background:rgba(255,255,255,.08)!important;box-shadow:0 12px 35px rgba(0,0,0,.15)}
.auth-mini-card:hover{transform:translateY(-2px);background:var(--surface-hover)}
@media (pointer:coarse){.auth-motion .auth-grid,.auth-motion .auth-orb,.auth-motion .auth-stars{transform:none}.auth-cursor-glow{display:none}}
@media (prefers-reduced-motion:reduce){.auth-motion{display:none}.auth-feature-card,.auth-mini-card{transition:none}.auth-stars i{animation:none}}
/* ── Hero image ─────────────────────────────────── */
.aero-hero-image{filter:brightness(.96) saturate(1.10) contrast(1.05)}
.auth-hero-image{filter:brightness(.72) saturate(1.08) contrast(1.06)}
/* ── Typography scale ───────────────────────────── */
.aero-bright-ui{font-size:1.04em}.aero-bright-ui h1{letter-spacing:-.02em}.aero-bright-ui h2{letter-spacing:-.015em}
/* ── Hero copy (over dark image overlay) ────────── */
.aero-hero-copy h2{color:#1e293b!important;text-shadow:none}
.aero-hero-copy p{color:#334155!important}
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
        <img src="/hero.jpeg" alt="India Gate, Delhi" className="absolute inset-0 w-full h-full object-cover auth-hero-image" style={{opacity:.78}}/>
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
  { path:"/",           label:"Dashboard",              index:0 },
  { path:"/map",        label:"NCR Map",                index:1 },
  { path:"/forecast",   label:"72-Hour Forecast",       index:2 },
  { path:"/wrf-chem",   label:"WRF-Chem",               index:3 },
  { path:"/weather",    label:"Weather & Atmosphere",   index:4 },
  { path:"/plume",      label:"Plume Tracker",          index:5 },
  { path:"/alerts",     label:"Alerts & Notifications", index:6 },
  { path:"/stations",   label:"Stations",               index:7 },
  { path:"/reports",    label:"Forecast Validation",    index:8 },
  { path:"/pipeline",   label:"Data Pipeline",          index:9 },
  { path:"/ai",         label:"AI Insights",            index:10 },
  { path:"/suggestions",label:"Decision Support",       index:11 },
  { path:"/settings",   label:"Profile & Settings",     index:12 },
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
    source: null, // "ml" | "wrf" | null
  });

  useEffect(() => {
    if (!selectedId) return;

    let alive = true;
    setForecastState(s => ({ ...s, loading: true, error: null }));

    // Normalise a /wrf-chem response into the same hourly shape the chart expects
    const normaliseWrf = (payload) => {
      const raw = Array.isArray(payload) ? payload
        : Array.isArray(payload?.forecast) ? payload.forecast : [];
      return raw.map((r, i) => ({
        forecast_hour: r.forecast_hour ?? i,
        target_utc: r.timestamp_utc ?? r.target_utc ?? null,
        aqi_computed: r.aqi ?? r.aqi_computed ?? null,
        pm25: r.pm25 ?? null,
        pm10: r.pm10 ?? null,
        o3:   r.o3  ?? null,
        no2:  r.no2 ?? null,
        aqi_category: r.aqi_category ?? null,
      }));
    };

    const tryWrf = (prevHourly) => {
      apiGet(`/wrf-chem/${encodeURIComponent(selectedId)}`)
        .then(payload => {
          if (!alive) return;
          const hourly = normaliseWrf(payload);
          if (hourly.length) {
            setForecastState({
              loading: false, hourly, modelTrained: true,
              error: null, generatedAt: null, source: "wrf",
            });
          } else {
            setForecastState(prev => ({
              loading: false,
              hourly: prevHourly ?? prev.hourly ?? [],
              modelTrained: false,
              error: "No forecast data available. Run ingestion + training to populate the ML model.",
              generatedAt: null,
              source: prev.source,
            }));
          }
        })
        .catch(() => {
          if (!alive) return;
          setForecastState(prev => ({
            loading: false,
            hourly: prevHourly ?? prev.hourly ?? [],
            modelTrained: false,
            error: "Forecast unavailable — ML model not trained and WRF-Chem endpoint returned no data.",
            generatedAt: null,
            source: prev.source,
          }));
        });
    };

    apiGet(`/forecast/${encodeURIComponent(selectedId)}?hours=72`)
      .then(data => {
        if (!alive) return;
        const rows = Array.isArray(data?.hourly) ? data.hourly : [];
        if (rows.length && data?.model_trained !== false) {
          setForecastState({
            loading: false, hourly: rows, modelTrained: true,
            error: null, generatedAt: data?.generated_at ?? null, source: "ml",
          });
        } else {
          // ML endpoint returned no rows or model_trained=false — try WRF-Chem
          tryWrf([]);
        }
      })
      .catch(err => {
        if (!alive) return;
        setForecastState(prev => {
          if (prev.hourly?.length) {
            return { ...prev, loading: false, error: "Live refresh unavailable — showing last synced forecast." };
          }
          // No cached data either — fall back to WRF-Chem
          tryWrf([]);
          return { ...prev, loading: true }; // keep spinner while WRF loads
        });
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
  // True when forecast rows exist but the selected pollutant column is entirely null
  // (e.g. PM10 when no PM10 model was trained due to insufficient source data).
  const pollutantUnavailable = hasData && vals.length === 0 && !forecastState.loading;
  const hasError   = forecastState.error && !forecastState.loading;

  return <>
    <PageHeader
      title="72-Hour Delhi-NCR Air Quality Forecast"
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
      icon={<BarChart3 size={18} className="text-purple-500"/>}
      title="72-Hour AQI Forecast"
      subtitle={`${stationLabel} · ${forecastState.source === "wrf" ? "WRF-Chem 72-hour model forecast" : forecastState.source === "ml" ? "AeroAQI ML Backend" : "awaiting data"} · pollutant selector`}
    >
      {/* ── Controls ────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex gap-1 p-1 rounded-lg" style={{background:"var(--surface-secondary)",border:"1px solid var(--border)"}}>
          {['AQI','PM2.5','PM10','NO2','O3'].map(v => (
            <button key={v} onClick={() => setPollutant(v)}
              className="px-3 py-1.5 rounded-md text-[11px] font-semibold transition-colors"
              style={pollutant===v
                ? {background:"var(--accent-green)", color:"#ffffff"}
                : {color:"var(--text-secondary)"}
              }>
              {v}
            </button>
          ))}
        </div>
        <div className="flex gap-1 p-1 rounded-lg" style={{background:"var(--surface-secondary)",border:"1px solid var(--border)"}}>
          {[24,48,72].map(v => (
            <button key={v} onClick={() => setHorizon(v)}
              className="px-3 py-1.5 rounded-md text-[11px] font-semibold transition-colors"
              style={horizon===v
                ? {background:"var(--text-primary)", color:"#ffffff"}
                : {color:"var(--text-secondary)"}
              }>
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

      {/* ── Error / no-model state — only shown when there is genuinely NO data ── */}
      {hasError && !isLoading && !hasData && (
        <div className="h-[390px] flex flex-col items-center justify-center gap-3">
          <div className="rounded-xl px-5 py-4 text-center max-w-md"
            style={{background:"rgba(245,158,11,.06)",border:"1px solid rgba(245,158,11,.18)"}}>
            <p className="text-sm font-semibold text-amber-700 mb-2">Forecast unavailable</p>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{forecastState.error}</p>
            <p className="text-[10px] text-[var(--text-muted)] mt-3">
              Run: <code className="text-emerald-600 font-mono">python scripts/train_model.py</code>
            </p>
          </div>
        </div>
      )}
      {/* Stale-data warning (show above chart, not instead of it) */}
      {hasError && !isLoading && hasData && (
        <div className="mb-3 px-3 py-2 rounded-xl text-xs text-amber-700 flex items-center gap-2"
          style={{background:"rgba(217,119,6,.06)",border:"1px solid rgba(217,119,6,.18)"}}>
          <Info size={13}/>{forecastState.error}
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
          ['Source', forecastState.source === "wrf" ? "WRF-Chem Model" : forecastState.source === "ml" ? "AeroAQI ML" : "No data"],
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
  const [dashboardForecastSource, setDashboardForecastSource] = useState(""); // "ml" | "wrf"

  useEffect(() => {
    if (!liveStation?.station_id) {
      setDashboardForecast([]);
      setDashboardForecastSource("");
      return;
    }

    let alive = true;

    const mapMlRows = rows => rows.map(h => ({
      t: `+${h.forecast_hour}h`,
      aqi: h.aqi_computed != null ? Math.round(h.aqi_computed) : null,
      pm25: h.pm25 != null ? Math.round(h.pm25) : null,
    }));

    const tryWrf = () => {
      apiGet(`/wrf-chem/${encodeURIComponent(liveStation.station_id)}`)
        .then(payload => {
          if (!alive) return;
          const raw = Array.isArray(payload) ? payload
            : Array.isArray(payload?.forecast) ? payload.forecast : [];
          const rows = raw.map((r, i) => ({
            t: `+${r.forecast_hour ?? i}h`,
            aqi: (r.aqi ?? r.aqi_computed) != null ? Math.round(r.aqi ?? r.aqi_computed) : null,
            pm25: r.pm25 != null ? Math.round(r.pm25) : null,
          }));
          if (alive) {
            setDashboardForecast(rows);
            setDashboardForecastSource(rows.length ? "wrf" : "");
          }
        })
        .catch(() => alive && setDashboardForecast([]));
    };

    apiGet(`/forecast/${encodeURIComponent(liveStation.station_id)}?hours=72`)
      .then(data => {
        if (!alive) return;
        const rows = Array.isArray(data?.hourly) ? data.hourly : [];
        if (rows.length) {
          setDashboardForecast(mapMlRows(rows));
          setDashboardForecastSource("ml");
        } else {
          // ML model not trained yet — fall back to WRF-Chem
          tryWrf();
        }
      })
      .catch(() => { if (alive) tryWrf(); });

    return () => { alive = false; };
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
      <img src="/hero.jpeg" alt="India Gate, Delhi" className="absolute inset-0 w-full h-full object-cover transition-all duration-1000" style={{opacity:.9,filter:"brightness(1.05) saturate(1.2) contrast(1.06)"}}/>
      <div className="absolute inset-0" style={{background:"linear-gradient(90deg,rgba(248,250,252,.9) 0%,rgba(248,250,252,.68) 34%,rgba(248,250,252,.12) 72%,rgba(248,250,252,.38) 100%)"}}/>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_35%,rgba(34,197,94,.06),transparent_32%),linear-gradient(180deg,transparent,var(--surface-secondary))]"/>
      <div className="relative z-10 p-6 sm:p-9 lg:p-10 max-w-[720px] min-h-[510px] flex flex-col justify-center">
        <div className="flex items-center gap-2 mb-4"><span className="w-2 h-2 rounded-full bg-cyan-300 live-dot"/><span className="text-[10px] font-black tracking-[.25em] text-emerald-300">{s.ey}</span></div>
        <div key={slide} className="animate-fade-in"><h2 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[.95] tracking-tight text-[var(--text-primary)]">{s.title}<br/><span className="text-emerald-300">{s.accent}</span></h2><p className="mt-5 text-sm sm:text-base text-[var(--text-secondary)] max-w-xl leading-relaxed">{s.sub}</p><div className="flex flex-wrap gap-3 mt-7"><button onClick={()=>navigate(s.path)} className="btn-primary px-5 py-3 rounded-xl text-xs font-bold flex items-center gap-2">{s.cta}<ArrowUpRight size={14}/></button><button onClick={()=>navigate('/map')} className="px-5 py-3 rounded-xl text-xs font-bold text-[var(--text-primary)]" style={{background:"var(--surface)",border:"1px solid var(--surface-hover)",backdropFilter:"blur(10px)"}}>Explore NCR Map</button></div></div>
        <div className="flex items-center gap-2 mt-8">{slides.map((_,i)=><button key={i} onClick={()=>setSlide(i)} className="h-1.5 rounded-full transition-all" style={{width:i===slide?34:10,background:i===slide?"#22c55e":"rgba(255,255,255,.35)"}}/>)}<span className="text-[9px] text-[var(--text-muted)] ml-2">Auto carousel</span></div>
      </div>
      <div className="absolute right-5 top-5 hidden xl:flex gap-2 animate-float">
        <div className="rounded-xl px-3 py-2" style={{background:"rgba(255,255,255,.92)",border:"1px solid rgba(5,150,105,.22)",backdropFilter:"blur(14px)"}}>
          <p className="text-[9px] text-[var(--text-muted)]">Current AQI</p>
          <p className="text-xl font-black" style={{color: currentAqi != null ? aqiMapColor(currentAqi) : "#64748b"}}>{currentAqi == null ? "—" : Math.round(currentAqi)}</p>
        </div>
        <div className="rounded-xl px-3 py-2" style={{background:"rgba(255,255,255,.92)",border:"1px solid rgba(5,150,105,.22)",backdropFilter:"blur(14px)"}}>
          <p className="text-[9px] text-[var(--text-muted)]">72h Peak{dashboardForecastSource==="wrf"?" (WRF)":""}</p>
          {(() => {
            const aqiVals = dashboardForecast.map(r => r.aqi).filter(v => v != null);
            const peak = aqiVals.length ? Math.max(...aqiVals) : null;
            return <p className="text-xl font-black" style={{color: peak != null ? aqiMapColor(peak) : "#64748b"}}>{peak ?? "—"}</p>;
          })()}
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-12 flex items-center gap-5 px-6 overflow-hidden" style={{background:"var(--surface-secondary)",backdropFilter:"blur(10px)",borderTop:"1px solid var(--border)"}}><div className="flex gap-6 whitespace-nowrap animate-marquee text-[10px] text-[var(--text-secondary)]"><span className="text-emerald-700 font-semibold">Good 0–50</span><span>·</span><span className="text-amber-700 font-semibold">Moderate 51–100</span><span>·</span><span className="text-orange-700 font-semibold">Sensitive 101–150</span><span>·</span><span className="text-red-700 font-semibold">Unhealthy 151–200</span><span>·</span><span className="text-purple-700 font-semibold">Very Unhealthy 201–300</span><span>·</span><span className="text-[#7f1d1d] font-semibold">Hazardous 301+</span><span>·</span><span>Wind direction affects pollutant transport</span><span>·</span><span>Biomass burning raises PM2.5</span><span>·</span><span>AeroAQI monitors 79 Delhi-NCR stations</span></div></div>
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

    {/* AQI Suggestions preview on Dashboard */}
    {(() => {
      const advice = aqiActionAdvice(currentAqi);
      return (
        <div className="aqi-action-card mt-1"
          style={{borderLeftColor:advice.color, background:advice.bg, border:`1px solid ${advice.border}`, borderLeft:`4px solid ${advice.color}`}}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{color:advice.color}}>What should I do now?</p>
              <h4 className="text-base font-black text-[var(--text-primary)]">{advice.title}</h4>
              <p className="text-xs text-[var(--text-secondary)] mt-1 max-w-xl">{advice.desc}</p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                {advice.actions.slice(0,2).map((a,i)=>(
                  <span key={i} className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
                    <Check size={12} style={{color:advice.color}}/>{a}
                  </span>
                ))}
              </div>
            </div>
            <button onClick={()=>navigate('/suggestions')}
              className="btn-primary px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-2 flex-shrink-0">
              Full guidance <ArrowUpRight size={13}/>
            </button>
          </div>
        </div>
      );
    })()}
  </>;
}

function AIInsightsPage() {
  const { stations } = useLiveStations();
  const [question,  setQuestion]  = useState("");
  const [answer,    setAnswer]    = useState("");
  const [busy,      setBusy]      = useState(false);
  const [error,     setError]     = useState("");
  const [speaking,  setSpeaking]  = useState(false);
  const [listening, setListening] = useState(false);
  const [voiceLang, setVoiceLang] = useState("en-IN"); // en-IN | hi-IN
  const utterRef   = useRef(null);
  const recogRef   = useRef(null);

  // ── Language detection ───────────────────────────────────
  // Hinglish heuristic: contains Devanagari OR common romanised Hindi words
  const detectLang = (text) => {
    if (!text) return "en";
    const hindi = /[\u0900-\u097F]/.test(text);
    if (hindi) return "hi";
    const hinglishWords = /\b(kya|hai|ka|ki|ke|kaise|kyu|kyun|nahi|aur|aaj|kal|bahut|kuch|mein|se|ko|par|agar|toh|hoga|hain|tha|thi|mere|teri|uska|karo|bata|samjhao|batao|kahan|kitna|kitni)\b/i;
    if (hinglishWords.test(text)) return "hinglish";
    return "en";
  };

  // ── Local fallback when Gemini is unavailable ────────────
  const localFallback = (q, lang) => {
    const st  = stations.find(s => s.hasObs) || stations[0];
    if (!st) return lang === "hi" || lang === "hinglish"
      ? "Backend se koi station data available nahi hai. Kripya backend check karein."
      : "No station data is available. Please ensure the backend is running.";

    const aqi  = st.aqi  != null ? Math.round(st.aqi)  : "N/A";
    const pm25 = st.pm25 != null ? Math.round(st.pm25) : "N/A";
    const pm10 = st.pm10 != null ? Math.round(st.pm10) : "N/A";
    const o3   = st.o3   != null ? Math.round(st.o3)   : "N/A";
    const no2  = st.no2  != null ? Math.round(st.no2)  : "N/A";
    const temp = st.temperature_c  != null ? `${Math.round(st.temperature_c)}°C`  : "N/A";
    const wind = st.wind_speed_ms  != null ? `${Number(st.wind_speed_ms).toFixed(1)} m/s` : "N/A";
    const hum  = st.humidity != null ? `${Math.round(st.humidity)}%` : "N/A";

    if (lang === "hi" || lang === "hinglish") {
      return `${st.name} station ki current reading:\n` +
        `• AQI: ${aqi}\n• PM2.5: ${pm25} µg/m³\n• PM10: ${pm10} µg/m³\n` +
        `• O3: ${o3} µg/m³\n• NO2: ${no2} µg/m³\n` +
        `• Temperature: ${temp}\n• Wind: ${wind}\n• Humidity: ${hum}\n\n` +
        `(Gemini AI abhi unavailable hai — yeh local backend data hai.)`;
    }
    return `${st.name} station current readings:\n` +
      `• AQI: ${aqi}\n• PM2.5: ${pm25} µg/m³\n• PM10: ${pm10} µg/m³\n` +
      `• O3: ${o3} µg/m³\n• NO2: ${no2} µg/m³\n` +
      `• Temperature: ${temp}\n• Wind: ${wind}\n• Humidity: ${hum}\n\n` +
      `(Gemini AI is currently unavailable — this is live local backend data.)`;
  };

  // ── Ask Gemini ───────────────────────────────────────────
  const ask = async () => {
    const q = question.trim() || "Explain the current AQI and the main factors affecting it.";
    setBusy(true); setAnswer(""); setError("");
    const lang = detectLang(q);
    try {
      const station = stations[0];
      if (!station) throw new Error("NO_STATION");
      let r;
      try {
        r = await apiPost("/gemini/chat", { question: q, station_id: station.station_id });
      } catch {
        r = await apiGet(`/gemini/explain/${encodeURIComponent(station.station_id)}`);
      }
      setAnswer(r?.answer || r?.explanation || r?.message || JSON.stringify(r));
    } catch {
      // Gemini unavailable — show useful local-data response instead of blank page
      setAnswer(localFallback(q, lang));
      setError("Gemini AI is unavailable. Showing local backend data instead.");
    } finally {
      setBusy(false);
    }
  };

  // ── Text-to-speech ───────────────────────────────────────
  const speak = () => {
    if (!answer) return;
    if (!window.speechSynthesis) {
      setError("Text-to-speech is not supported in this browser.");
      return;
    }
    window.speechSynthesis.cancel();
    const lang  = detectLang(answer);
    const voice = window.speechSynthesis.getVoices()
      .find(v => v.lang === (lang === "hi" || lang === "hinglish" ? "hi-IN" : "en-IN"))
      || window.speechSynthesis.getVoices()[0];
    const utt = new SpeechSynthesisUtterance(answer);
    if (voice) utt.voice = voice;
    utt.lang = lang === "hi" || lang === "hinglish" ? "hi-IN" : "en-IN";
    utt.rate = 0.92;
    utt.onstart  = () => setSpeaking(true);
    utt.onend    = () => setSpeaking(false);
    utt.onerror  = () => setSpeaking(false);
    utterRef.current = utt;
    window.speechSynthesis.speak(utt);
  };

  const stopSpeaking = () => {
    window.speechSynthesis?.cancel();
    setSpeaking(false);
  };

  // ── Voice input ──────────────────────────────────────────
  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError("Speech recognition is not supported in this browser (try Chrome).");
      return;
    }
    if (recogRef.current) { recogRef.current.stop(); }
    const recog = new SpeechRecognition();
    recog.lang = voiceLang;
    recog.interimResults = false;
    recog.maxAlternatives = 1;
    recog.onstart  = () => { setListening(true); setError(""); };
    recog.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setQuestion(prev => prev ? `${prev} ${transcript}` : transcript);
    };
    recog.onerror  = (e) => {
      setListening(false);
      if (e.error !== "aborted") setError(`Microphone error: ${e.error}`);
    };
    recog.onend    = () => setListening(false);
    recogRef.current = recog;
    recog.start();
  };

  const stopListening = () => {
    recogRef.current?.stop();
    setListening(false);
  };

  // Cleanup on unmount
  useEffect(() => () => {
    window.speechSynthesis?.cancel();
    recogRef.current?.stop();
  }, []);

  // ── Quick prompts (English + Hinglish) ──────────────────
  const quickPrompts = [
    "What is the current Delhi AQI?",
    "Delhi ka AQI kya hai?",
    "Why is PM2.5 high today?",
    "PM2.5 kyu zyada hai?",
    "Which NCR station has the highest AQI?",
    "Kal AQI badhega kya?",
    "WRF-Chem kya predict kar raha hai?",
    "Is it safe to exercise outdoors?",
  ];

  return (
    <>
      <PageHeader
        title="AI Insights"
        subtitle="Ask AeroAQI AI in English, Hindi, or Hinglish — uses local backend data + optional AI explanation."
        action={
          <button onClick={ask} disabled={busy}
            className="btn-primary px-3 py-2 rounded-xl text-[10px] font-bold flex items-center gap-2">
            <Sparkles size={13}/>
            {busy ? "Analyzing…" : "Ask AI"}
          </button>
        }
      />

      <div className="grid grid-cols-1 xl:grid-cols-[1.3fr_.7fr] gap-5">

        {/* ── Answer panel ── */}
        <FeatureSection
          icon={<Bot size={18} className="text-emerald-600"/>}
          title="AeroAQI AI Response"
          subtitle="English · Hindi · Hinglish — answers use current backend data">

          <div className="rounded-2xl p-5 min-h-[220px] relative"
            style={{background:"linear-gradient(145deg,var(--surface-secondary),var(--surface))",
                    border:"1px solid var(--border)"}}>

            {/* Loading spinner */}
            {busy && (
              <div className="flex items-center gap-3 text-[var(--text-secondary)]">
                <RefreshCw size={16} className="animate-spin text-emerald-600"/>
                <span className="text-sm">Analyzing your question…</span>
              </div>
            )}

            {/* Answer text */}
            {!busy && answer && (
              <>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap">{answer}</p>
                {/* TTS controls */}
                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-[var(--border)]">
                  {!speaking
                    ? <button onClick={speak}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors hover:bg-[var(--surface-hover)]"
                        style={{background:"var(--surface-secondary)",border:"1px solid var(--border)",color:"var(--text-secondary)"}}>
                        <Play size={12} className="text-emerald-600"/>Read aloud
                      </button>
                    : <button onClick={stopSpeaking}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                        style={{background:"rgba(220,38,38,.08)",border:"1px solid rgba(220,38,38,.2)",color:"#b91c1c"}}>
                        <Pause size={12}/>Stop
                      </button>
                  }
                  <span className="text-[10px] text-[var(--text-muted)]">
                    Detected language: {(() => { const l=detectLang(answer); return l==="hi"?"Hindi":l==="hinglish"?"Hinglish":"English"; })()}
                  </span>
                </div>
              </>
            )}

            {/* Idle state */}
            {!busy && !answer && (
              <div className="flex flex-col items-center justify-center gap-3 py-8 text-center">
                <div className="science-ring"><Bot size={26} className="text-emerald-600"/></div>
                <p className="text-sm font-semibold text-[var(--text-primary)] mt-2">Ask anything about Delhi-NCR air quality</p>
                <p className="text-xs text-[var(--text-muted)] max-w-xs">English, Hindi, or Hinglish — I'll reply in the same language</p>
              </div>
            )}
          </div>

          {/* Error banner */}
          {error && (
            <div className="mt-3 px-4 py-2.5 rounded-xl text-xs text-amber-700 flex items-center gap-2"
              style={{background:"rgba(217,119,6,.06)",border:"1px solid rgba(217,119,6,.2)"}}>
              <Info size={13}/>{error}
            </div>
          )}
        </FeatureSection>

        {/* ── Chat input panel ── */}
        <FeatureSection
          icon={<MessageCircle size={18} className="text-emerald-600"/>}
          title="Ask AeroAQI AI"
          subtitle="Type or speak your question">

          {/* Voice language selector */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[10px] text-[var(--text-muted)] font-semibold uppercase tracking-wide">Voice lang:</span>
            {[["en-IN","English"],["hi-IN","Hindi"]].map(([code,label]) => (
              <button key={code} onClick={() => setVoiceLang(code)}
                className="px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-colors"
                style={voiceLang===code
                  ? {background:"var(--accent-green)",color:"#fff"}
                  : {background:"var(--surface-secondary)",color:"var(--text-secondary)",border:"1px solid var(--border)"}}>
                {label}
              </button>
            ))}
          </div>

          {/* Textarea + mic */}
          <div className="relative">
            <textarea
              value={question}
              onChange={e => setQuestion(e.target.value)}
              onKeyDown={e => { if (e.key==="Enter" && (e.ctrlKey||e.metaKey)) ask(); }}
              placeholder={"Type or speak your question…\n\nExamples:\n• What is the Delhi AQI?\n• Delhi ka AQI kya hai?\n• PM2.5 kyu zyada hai?"}
              className="w-full rounded-xl p-3 pr-12 text-xs text-[var(--text-primary)] outline-none resize-none"
              style={{
                minHeight:140,
                background:"var(--surface)",
                border:"1px solid var(--border)",
                lineHeight:1.6,
              }}
            />
            {/* Mic button */}
            <button
              onClick={listening ? stopListening : startListening}
              title={listening ? "Stop listening" : "Start voice input"}
              className="absolute bottom-3 right-3 w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
              style={listening
                ? {background:"rgba(220,38,38,.1)",border:"1px solid rgba(220,38,38,.3)",color:"#b91c1c",animation:"pulse-live 1s ease-in-out infinite"}
                : {background:"var(--surface-secondary)",border:"1px solid var(--border)",color:"var(--text-secondary)"}}>
              {listening ? <Radio size={15}/> : <Radio size={15}/>}
            </button>
          </div>

          {listening && (
            <p className="text-[10px] text-emerald-600 font-semibold mt-1.5 flex items-center gap-1.5">
              <span className="live-dot w-1.5 h-1.5 rounded-full bg-emerald-500"/>
              Listening… speak now ({voiceLang === "hi-IN" ? "Hindi" : "English"})
            </p>
          )}

          <button onClick={ask} disabled={busy}
            className="btn-primary w-full mt-3 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2">
            <Send size={13}/>
            {busy ? "Analyzing…" : "Ask AI (Ctrl+Enter)"}
          </button>

          {/* Quick prompts */}
          <div className="mt-4">
            <p className="text-[10px] text-[var(--text-muted)] uppercase font-semibold tracking-wide mb-2">Quick prompts</p>
            <div className="flex flex-wrap gap-1.5">
              {quickPrompts.map(p => (
                <button key={p}
                  onClick={() => { setQuestion(p); }}
                  className="px-2.5 py-1.5 rounded-lg text-[10px] font-medium transition-colors hover:bg-[var(--surface-hover)]"
                  style={{background:"var(--surface-secondary)",border:"1px solid var(--border)",color:"var(--text-secondary)"}}>
                  {p}
                </button>
              ))}
            </div>
          </div>
        </FeatureSection>
      </div>
    </>
  );
}

function MapInsightsPanel() {
  const {stations, loading} = useLiveStations();
  const station = stations.find(s => s.hasObs) || stations[0] || null;
  const [forecast, setForecast] = useState([]);

  useEffect(() => {
    if (!station?.station_id) return undefined;
    let alive = true;
    // Try ML forecast first, fall back to WRF-Chem
    apiGet(`/forecast/${encodeURIComponent(station.station_id)}?hours=72`)
      .then(data => {
        if (!alive) return;
        const rows = data?.hourly ?? [];
        if (rows.length) { setForecast(rows); return; }
        return apiGet(`/wrf-chem/${encodeURIComponent(station.station_id)}`);
      })
      .then(payload => {
        if (!alive || !payload) return;
        const raw = Array.isArray(payload) ? payload : (payload?.forecast ?? []);
        setForecast(raw);
      })
      .catch(() => alive && setForecast([]));
    return () => { alive = false; };
  }, [station?.station_id]);

  const fmtNum = v => (v == null || !Number.isFinite(Number(v))) ? "—" : Number(v).toFixed(1);
  const aqiVals = forecast.map(r => Number(r.aqi_computed ?? r.aqi)).filter(Number.isFinite);
  const peakAqi = aqiVals.length ? Math.max(...aqiVals) : null;

  return (
    <div className="space-y-4">
      {/* Current conditions card */}
      <div className="rounded-2xl p-4" style={{background:"var(--surface)",border:"1px solid var(--border)",boxShadow:"var(--shadow-sm)"}}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm font-bold text-[var(--text-primary)]">Current Atmospheric Conditions</p>
            <p className="text-[10px] text-[var(--text-muted)] truncate max-w-[180px]">{station?.name ?? (loading ? "Loading…" : "No station")}</p>
          </div>
          <span className="source-pill">Prototype / Simulated</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[
            ["AQI",       station?.aqi != null ? Math.round(station.aqi) : "—", station?.aqi != null ? aqiMapColor(station.aqi) : "#64748b"],
            ["PM2.5",     station?.pm25 != null ? Math.round(station.pm25) : "—", "#0891b2"],
            ["Wind",      station?.wind_speed_ms != null ? `${Number(station.wind_speed_ms).toFixed(1)}` : "—", "#059669"],
          ].map(([lbl, val, col]) => (
            <div key={lbl} className="rounded-xl p-2.5 text-center" style={{background:"var(--surface-secondary)",border:"1px solid var(--border)"}}>
              <p className="text-[9px] text-[var(--text-muted)]">{lbl}</p>
              <p className="text-base font-black mt-1" style={{color:col}}>{val}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Plume transport prototype */}
      <div className="rounded-2xl p-4" style={{background:"var(--surface)",border:"1px solid var(--border)",boxShadow:"var(--shadow-sm)"}}>
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-bold text-[var(--text-primary)]">Plume Transport</p>
          <span className="source-pill flex items-center gap-1"><Info size={9}/> Prototype</span>
        </div>
        <div className="grid grid-cols-3 gap-2 mb-3">
          {[["Dom. Wind","WNW"],["Transport","High"],["Source","Punjab/HR"]].map(([l,v]) => (
            <div key={l} className="rounded-lg p-2" style={{background:"var(--surface-secondary)",border:"1px solid var(--border)"}}>
              <p className="text-[9px] text-[var(--text-muted)]">{l}</p>
              <p className="text-xs font-bold text-[var(--text-primary)] mt-0.5">{v}</p>
            </div>
          ))}
        </div>
        <div className="rounded-lg p-2.5 text-[10px] text-orange-700 flex items-center gap-2"
          style={{background:"rgba(234,88,12,.06)",border:"1px solid rgba(234,88,12,.18)"}}>
          <Flame size={11} className="text-orange-500 flex-shrink-0"/>
          Biomass transport risk: <b className="ml-0.5">Moderate</b> · Prototype / Simulated
        </div>
      </div>

      {/* 72-hour forecast mini-card */}
      <div className="rounded-2xl p-4" style={{background:"var(--surface)",border:"1px solid var(--border)",boxShadow:"var(--shadow-sm)"}}>
        <p className="text-xs font-bold text-[var(--text-primary)] mb-3">72-Hour Forecast</p>
        <div className="grid grid-cols-3 gap-2">
          {[
            ["Current AQI", forecast.length ? fmtNum(forecast[0]?.aqi_computed ?? forecast[0]?.aqi) : "—"],
            ["Peak AQI",    peakAqi != null ? String(Math.round(peakAqi)) : "—"],
            ["Rows",        forecast.length || "—"],
          ].map(([lbl, val]) => (
            <div key={lbl} className="rounded-lg p-2" style={{background:"var(--surface-secondary)",border:"1px solid var(--border)"}}>
              <p className="text-[9px] text-[var(--text-muted)]">{lbl}</p>
              <p className="text-sm font-black text-[var(--text-primary)] mt-1">{val}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
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
  const {stations,live,loading,stale,error}=useLiveStations();
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
  return <><PageHeader title="Monitoring Stations" subtitle="NCR monitoring network — inspect local AQI, pollutants, source and weather context." action={<span className="source-pill">{loading?"Updating…":live?"LIVE · AeroAQI Backend":"Unavailable"}</span>}/>
  {stale&&<div className="mb-3 px-4 py-2.5 rounded-xl text-[11px] text-amber-700 flex items-center gap-2" style={{background:"rgba(245,158,11,.07)",border:"1px solid rgba(245,158,11,.2)"}}><Info size={13}/>Live refresh unavailable — showing last synced data.</div>}
  {error&&!stale&&<div className="mb-3 px-4 py-2.5 rounded-xl text-[11px] text-red-600 flex items-center gap-2" style={{background:"rgba(239,68,68,.06)",border:"1px solid rgba(239,68,68,.18)"}}><AlertTriangle size={13}/>{error}</div>}
  <div className="grid grid-cols-1 xl:grid-cols-[330px_1fr] gap-5">
    <FeatureSection icon={<Navigation size={18} className="text-emerald-300"/>} title="NCR Station Network" subtitle={`${filtered.length} of ${stations.length} monitoring points`}>
      <div className="relative mb-3"><Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search station or city" className="w-full rounded-xl pl-9 pr-3 py-2.5 text-xs text-[var(--text-primary)] outline-none" style={{background:"var(--surface)",border:"1px solid var(--surface-hover)"}}/></div>
      <div className="space-y-2 max-h-[570px] overflow-y-auto pr-1">{filtered.map(s=><button key={s.station_id||s.name} onClick={()=>setSelected(s)} className="w-full p-3 rounded-xl text-left transition-all hover:translate-x-1" style={{background:selected?.station_id===s.station_id?"rgba(34,211,238,.08)":"var(--surface-secondary)",border:`1px solid ${selected?.station_id===s.station_id?"rgba(34,211,238,.2)":"var(--surface-hover)"}`}}><div className="flex items-start justify-between gap-2"><div className="min-w-0"><p className="text-xs font-bold text-[var(--text-primary)] truncate">{s.name}</p><p className="text-[9px] text-[var(--text-muted)] truncate">{s.station_id} · {s.city||"No city"}, {s.state||"No state"}</p><p className="text-[9px] text-[var(--text-muted)]">{Number.isFinite(s.lat)?s.lat.toFixed(4):"No observation"}, {Number.isFinite(s.lon)?s.lon.toFixed(4):"No observation"}</p><p className="text-[9px] text-[var(--text-muted)] truncate">{s.agency||"No observation"} · {s.timestamp?new Date(s.timestamp).toLocaleString("en-IN"):"No observation"}</p><p className="text-[9px] text-[var(--text-secondary)] mt-1">PM2.5 {s.pm25!=null?Math.round(s.pm25):"No observation"} · PM10 {s.pm10!=null?Math.round(s.pm10):"No observation"} · O3 {s.o3!=null?Math.round(s.o3):"No observation"} · NO2 {s.no2!=null?Math.round(s.no2):"No observation"}</p></div><div className="text-right shrink-0"><p className="text-lg font-black" style={{color:dot[s.status]||"#64748b"}}>{s.aqi!=null?Math.round(s.aqi):"—"}</p><p className="text-[8px] text-[var(--text-muted)]">AQI</p></div></div></button>)}</div>
    </FeatureSection>
    {selected&&<FeatureSection icon={<MapPinned size={18} className="text-emerald-300"/>} title={`${selected.name} Station`} subtitle="Selected monitoring point · pollutant snapshot · local trend">
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">{[["AQI",selected.aqi,null, dot[selected.status]||"#64748b"],["PM2.5",selected.pm25,null,"#38bdf8"],["PM10",selected.pm10,null,"#a78bfa"],["O3",selected.o3,null,"#34d399"],["NO₂",selected.no2,null,"#fb923c"]].map(([a,b,c,col])=><div key={a} className="science-card p-4 rounded-xl"><p className="text-[10px] text-[var(--text-muted)]">{a}</p><p className="text-xl font-black mt-1" style={{color:col}}>{b!=null?Math.round(b):"No observation"}</p><p className="text-[9px] text-[var(--text-muted)] mt-1">{c|| (a==="AQI" ? "No observation" : "µg/m³")}</p></div>)}</div>
      <div className="grid grid-cols-1 lg:grid-cols-[.65fr_1.35fr] gap-4 mt-4"><div className="rounded-xl p-4 flex items-center" style={{background:"var(--surface-secondary)",border:"1px solid var(--surface-hover)"}}><p className="text-[10px] text-[var(--text-muted)]">Historical trend is not included in the latest-observation response.</p></div><div className="rounded-xl p-4" style={{background:"linear-gradient(145deg,var(--surface-secondary),var(--surface))",border:"1px solid rgba(34,197,94,.12)"}}><p className="text-[10px] text-emerald-300 font-bold">Station details</p><div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-3 mt-4">{[["Station ID",selected.station_id],["Name",selected.name],["City",selected.city],["State",selected.state],["Latitude",selected.lat],["Longitude",selected.lon],["Agency",selected.agency],["Zone",selected.zone],["AQI",selected.aqi],["PM2.5",selected.pm25],["PM10",selected.pm10],["O3",selected.o3],["NO2",selected.no2],["Temperature",selected.temperature_c],["Humidity",selected.humidity],["Wind",selected.wind_speed_ms],["PBL",selected.pbl_height],["Last updated",selected.timestamp],["Source",selected.source]].map(([a,b])=><div key={a}><p className="text-[9px] text-[var(--text-muted)]">{a}</p><p className="text-xs font-semibold text-[var(--text-primary)] mt-1">{b==null?"No observation":a==="Last updated"?new Date(b).toLocaleString("en-IN"):b}</p></div>)}</div></div></div>
    </FeatureSection>}
  </div></>;
}

function ReportsPage() {
  return <><PageHeader title="Forecast Validation" subtitle="Validate backend station data and export a compact analysis report."/><ReportsSection/></>;
}

// ─── Suggestions Page ──────────────────────────────────────
function aqiActionAdvice(aqi) {
  if (aqi == null) return {
    title: "Monitor conditions",
    desc: "AQI data is not currently available. Stay updated and check back soon.",
    color: "#64748b", bg: "rgba(100,116,139,.08)", border: "rgba(100,116,139,.18)",
    actions: ["Check your local monitoring station", "Stay informed via AeroAQI"],
  };
  if (aqi <= 50)  return {
    title: "Air quality is Good",
    desc: "Great conditions for outdoor activities. Enjoy the clean air.",
    color: "#15803d", bg: "rgba(22,163,74,.06)", border: "rgba(22,163,74,.22)",
    actions: ["Normal outdoor activities are fine", "Ideal for exercise and sports", "Keep windows open for fresh air", "Continue monitoring trends"],
  };
  if (aqi <= 100) return {
    title: "Air quality is Moderate",
    desc: "Acceptable for most people. A small number of sensitive individuals may experience mild discomfort.",
    color: "#b45309", bg: "rgba(217,119,6,.06)", border: "rgba(217,119,6,.22)",
    actions: ["Most outdoor activities are fine", "Sensitive individuals: monitor symptoms", "Reduce prolonged exposure if uncomfortable", "Keep track of AQI trends"],
  };
  if (aqi <= 150) return {
    title: "Unhealthy for Sensitive Groups",
    desc: "People with respiratory or heart conditions, children, and older adults should take precautions.",
    color: "#c2410c", bg: "rgba(234,88,12,.06)", border: "rgba(234,88,12,.22)",
    actions: ["Reduce prolonged outdoor exertion", "Keep prescribed medication accessible", "Choose indoor activities where possible", "Monitor AQI regularly throughout the day"],
  };
  if (aqi <= 200) return {
    title: "Air quality is Unhealthy",
    desc: "Everyone may begin to experience health effects. Sensitive groups face more serious effects.",
    color: "#b91c1c", bg: "rgba(220,38,38,.06)", border: "rgba(220,38,38,.22)",
    actions: ["Reduce prolonged or heavy outdoor activity", "Spend more time indoors", "Keep windows closed when outdoor AQ is poor", "Sensitive groups: avoid outdoor exposure"],
  };
  if (aqi <= 300) return {
    title: "Very Unhealthy — Take Precautions",
    desc: "Health alert: everyone may experience more serious health effects. Limit outdoor time.",
    color: "#7e22ce", bg: "rgba(126,34,206,.06)", border: "rgba(126,34,206,.22)",
    actions: ["Avoid unnecessary outdoor exposure", "Sensitive groups: stay indoors", "Use air purifiers indoors if available", "Follow local health guidance and advisories"],
  };
  return {
    title: "Hazardous — Stay Indoors",
    desc: "Health warning of emergency conditions. The entire population is more likely to be affected.",
    color: "#7f1d1d", bg: "rgba(127,29,29,.07)", border: "rgba(127,29,29,.25)",
    actions: ["Avoid all outdoor exposure", "Stay indoors in cleaner-air environments", "Follow official public-health advisories", "Seek medical help if you experience serious symptoms"],
  };
}

const SENSITIVE_GROUPS = [
  { icon: <Wind size={15}/>,       label: "Asthma / Respiratory",   note: "Follow your clinician's plan; keep rescue medication accessible." },
  { icon: <Users size={15}/>,      label: "Children",               note: "Reduce prolonged outdoor play during high-AQI periods." },
  { icon: <User size={15}/>,       label: "Older Adults",           note: "Monitor symptoms and avoid strenuous outdoor activity." },
  { icon: <Heart size={15}/>,      label: "Heart Conditions",       note: "Consult your doctor about activity levels when AQI is high." },
  { icon: <Activity size={15}/>,   label: "Lung Conditions",        note: "High AQI can worsen symptoms. Stay informed and take precautions." },
  { icon: <ShieldCheck size={15}/>,label: "Pregnant People",        note: "Reduce prolonged exposure; discuss concerns with your clinician." },
];

const GENERAL_TIPS = [
  { icon: <Eye size={15}/>,        tip: "Check AQI before outdoor activities, especially early morning or evening." },
  { icon: <Wind size={15}/>,       tip: "Ventilate your home when outdoor AQI is below 100; keep windows closed when above 150." },
  { icon: <Thermometer size={15}/>,tip: "Higher temperatures can accelerate ozone formation — monitor O3 levels on hot days." },
  { icon: <Flame size={15}/>,      tip: "Avoid burning waste. Indoor cooking fires and diesel vehicles are major pollution contributors." },
  { icon: <CloudSun size={15}/>,   tip: "Wind and rain help clear pollution. Wind direction affects which areas are worst affected." },
  { icon: <Activity size={15}/>,   tip: "High-intensity exercise increases pollutant intake — move workouts indoors on high-AQI days." },
];

function SuggestionsPage() {
  const { stations } = useLiveStations();
  const liveStation = stations.find(s => s.hasObs) || stations[0] || null;
  const currentAqi = liveStation?.aqi != null ? Math.round(liveStation.aqi) : null;
  const advice = aqiActionAdvice(currentAqi);

  return <>
    <PageHeader
      title="Decision Support — Air Quality Guidance"
      subtitle="Practical guidance based on current atmospheric conditions. Not a substitute for professional medical advice."
    />

    {/* AQI Action Card */}
    <div className="aqi-action-card mb-5" style={{borderLeftColor: advice.color, background: advice.bg, border: `1px solid ${advice.border}`, borderLeft: `4px solid ${advice.color}`}}>
      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-black uppercase tracking-widest" style={{color: advice.color}}>
              Current Recommendation
            </span>
            {currentAqi != null && (
              <span className="text-xs font-black px-2 py-0.5 rounded-full text-white" style={{background: advice.color}}>
                AQI {currentAqi}
              </span>
            )}
          </div>
          <h3 className="text-lg font-black text-[var(--text-primary)] mb-1">{advice.title}</h3>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4">{advice.desc}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {advice.actions.map((a, i) => (
              <div key={i} className="flex items-start gap-2">
                <Check size={14} className="mt-0.5 flex-shrink-0" style={{color: advice.color}}/>
                <p className="text-sm text-[var(--text-secondary)]">{a}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="sm:text-right shrink-0">
          <p className="text-[10px] text-[var(--text-muted)]">Based on</p>
          <p className="text-xs font-semibold text-[var(--text-secondary)] mt-0.5">{liveStation?.name ?? "No station"}</p>
          <p className="text-[10px] text-[var(--text-muted)] mt-0.5">{liveStation ? "Live backend data" : "Backend unavailable"}</p>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 mb-5">
      {/* Sensitive Groups */}
      <FeatureSection icon={<ShieldCheck size={17} className="text-emerald-600"/>} title="Sensitive Groups" subtitle="Extra precautions for people with underlying health conditions">
        <div className="space-y-3">
          {SENSITIVE_GROUPS.map(g => (
            <div key={g.label} className="flex items-start gap-3 p-3 rounded-xl" style={{background:"var(--surface-secondary)",border:"1px solid var(--border)"}}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-emerald-600" style={{background:"var(--accent-green-muted)"}}>
                {g.icon}
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--text-primary)]">{g.label}</p>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5 leading-relaxed">{g.note}</p>
              </div>
            </div>
          ))}
          <div className="rounded-xl p-3 text-xs text-[var(--text-secondary)] leading-relaxed" style={{background:"rgba(5,150,105,.04)",border:"1px solid rgba(5,150,105,.14)"}}>
            <ShieldCheck size={12} className="inline mr-1.5 text-emerald-600"/>
            This guidance is general. If you have a medical condition, always follow your clinician's advice. Seek medical help if you experience serious or worsening symptoms.
          </div>
        </div>
      </FeatureSection>

      {/* General tips */}
      <FeatureSection icon={<Info size={17} className="text-blue-500"/>} title="General Air Quality Tips" subtitle="Everyday actions to reduce exposure and protect health">
        <div className="space-y-2.5">
          {GENERAL_TIPS.map((t, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-xl transition-colors hover:bg-[var(--surface-hover)]" style={{background:"var(--surface-secondary)",border:"1px solid var(--border)"}}>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-blue-500" style={{background:"rgba(59,130,246,.08)"}}>
                {t.icon}
              </div>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{t.tip}</p>
            </div>
          ))}
        </div>
      </FeatureSection>
    </div>

    {/* AQI scale reference */}
    <FeatureSection icon={<Gauge size={17} className="text-purple-600"/>} title="AQI Reference Scale" subtitle="Understanding what the numbers mean">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          {range:"0–50",   label:"Good",             advice:"No restrictions",                   color:"#15803d", bg:"rgba(22,163,74,.06)",  border:"rgba(22,163,74,.2)"},
          {range:"51–100", label:"Moderate",          advice:"Sensitive: monitor symptoms",       color:"#b45309", bg:"rgba(217,119,6,.06)",  border:"rgba(217,119,6,.2)"},
          {range:"101–150",label:"Sensitive Groups",  advice:"Reduce prolonged outdoor exertion", color:"#c2410c", bg:"rgba(234,88,12,.06)",  border:"rgba(234,88,12,.2)"},
          {range:"151–200",label:"Unhealthy",         advice:"Reduce outdoor activity",           color:"#b91c1c", bg:"rgba(220,38,38,.06)",  border:"rgba(220,38,38,.2)"},
          {range:"201–300",label:"Very Unhealthy",    advice:"Avoid outdoor exposure",            color:"#7e22ce", bg:"rgba(126,34,206,.06)", border:"rgba(126,34,206,.2)"},
          {range:"301+",   label:"Hazardous",         advice:"Stay indoors",                      color:"#7f1d1d", bg:"rgba(127,29,29,.07)",  border:"rgba(127,29,29,.2)"},
        ].map(s => (
          <div key={s.range} className="rounded-xl p-3 text-center" style={{background:s.bg, border:`1px solid ${s.border}`}}>
            <p className="text-base font-black" style={{color:s.color}}>{s.range}</p>
            <p className="text-xs font-bold text-[var(--text-primary)] mt-1">{s.label}</p>
            <p className="text-[10px] text-[var(--text-secondary)] mt-1 leading-snug">{s.advice}</p>
          </div>
        ))}
      </div>
    </FeatureSection>
  </>;
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

  // Auto-provide a guest session so the scientific dashboard is always accessible
  // without requiring login. Users can still update their name in Profile & Settings.
  if (!user) {
    const guest = { name: "AeroAQI User", photo: "" };
    localStorage.setItem("aeroaqi_user", JSON.stringify(guest));
    setUser(guest);
    return null; // brief flicker avoided — React will re-render immediately
  }

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
      case "/suggestions": return <SuggestionsPage/>;
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
  const [wrfZoom, setWrfZoom] = useState(10);
  const wrfCanvasRef = useRef(null);

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
    if (v <= 50)  return "#22c55e";  // Good
    if (v <= 100) return "#eab308";  // Moderate
    if (v <= 200) return "#f97316";  // Sensitive Groups
    if (v <= 300) return "#ef4444";  // Unhealthy
    if (v <= 400) return "#9333ea";  // Very Unhealthy
    return "#7f1d1d";                // Hazardous
  };

  // ─── WRF Meteorological Forecast Map (reference-style) ────────────────
  // Container dimensions measured via ResizeObserver — NO hardcoded width.
  // MF_H is fixed; MF_W is set from the actual container clientWidth so the
  // canvas always fills the full container width on every screen size.
  const MF_H = 380;
  const [mfW, setMfW] = useState(520); // updated by ResizeObserver on mount
  const mfContainerRef = useRef(null);

  // Observe the map container so that canvas/SVG always match its width
  useEffect(() => {
    const el = mfContainerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(entries => {
      for (const entry of entries) {
        const w = Math.floor(entry.contentRect.width);
        if (w > 0) setMfW(w);
      }
    });
    ro.observe(el);
    // Set initial width immediately
    const w = Math.floor(el.clientWidth);
    if (w > 0) setMfW(w);
    return () => ro.disconnect();
  }, []);

  // Geographic bounding box for the forecast domain
  const MF_LAT_MIN = 27.6, MF_LAT_MAX = 29.5;
  const MF_LON_MIN = 76.3, MF_LON_MAX = 78.4;

  // Convert lat/lon → pixel.
  // IMPORTANT: mfW (not a constant) is used here so every coordinate
  // calculation is always in sync with the container's actual width.
  const mfLonPx = useCallback(
    (lon) => ((lon - MF_LON_MIN) / (MF_LON_MAX - MF_LON_MIN)) * mfW,
    [mfW]
  );
  const mfLatPx = useCallback(
    (lat) => (1 - (lat - MF_LAT_MIN) / (MF_LAT_MAX - MF_LAT_MIN)) * MF_H,
    []
  );

  // Active forecast parameter tab
  const [mfParam, setMfParam] = useState("Wind (10m)");
  const mfTabs = ["Wind (10m)", "Temperature", "PM2.5", "PM10", "O3", "NO2", "PBL Height", "Rel. Humidity"];

  // Per-parameter config: field key, legend label, colour stops, value range
  const MF_CONFIG = {
    "Wind (10m)":   { key:"wind_speed_ms", conv: v => v * 3.6, label:"Wind Speed (km/h)", unit:"km/h",
                      range:[0,30], stops:["#0000ff","#00aaff","#00ffcc","#00ff00","#aaff00","#ffff00","#ffaa00","#ff5500","#ff0000"] },
    "Temperature":  { key:"temperature_c",  conv: v => v,        label:"Temperature (°C)",  unit:"°C",
                      range:[18,42], stops:["#313695","#4575b4","#74add1","#abd9e9","#ffffbf","#fdae61","#f46d43","#d73027","#a50026"] },
    "PM2.5":        { key:"pm25",           conv: v => v,        label:"PM2.5 (µg/m³)",     unit:"µg/m³",
                      range:[0,300], stops:["#0000cc","#0066ff","#00ccff","#00ff66","#ccff00","#ffcc00","#ff6600","#cc0000","#660000"] },
    "PM10":         { key:"pm10",           conv: v => v,        label:"PM10 (µg/m³)",      unit:"µg/m³",
                      range:[0,400], stops:["#0000cc","#0066ff","#00ccff","#00ff66","#ccff00","#ffcc00","#ff6600","#cc0000","#660000"] },
    "O3":           { key:"o3",             conv: v => v,        label:"O₃ (µg/m³)",        unit:"µg/m³",
                      range:[0,150], stops:["#313695","#4575b4","#74add1","#e0f3f8","#fee090","#fdae61","#f46d43","#d73027","#a50026"] },
    "NO2":          { key:"no2",            conv: v => v,        label:"NO₂ (µg/m³)",       unit:"µg/m³",
                      range:[0,120], stops:["#f7fcf5","#ccebc5","#7bccc4","#2b8cbe","#0868ac","#084081","#081d58","#03071e","#000000"] },
    "PBL Height":   { key:"boundary_layer_height_m", conv:v=>v,  label:"PBL Height (m)",    unit:"m",
                      range:[0,2500], stops:["#1a0533","#4b0082","#7b2fbe","#c084fc","#fbbf24","#f97316","#ef4444","#991b1b","#450a0a"] },
    "Rel. Humidity":{ key:"humidity",       conv: v => v,        label:"Rel. Humidity (%)", unit:"%",
                      range:[10,100], stops:["#7f4f00","#cc7722","#e6b85c","#ffffcc","#a8ddb5","#43a2ca","#0868ac","#084081","#041029"] },
  };

  // ── Canvas draw ref ──────────────────────────────────────
  const mfCanvasRef = useRef(null);
  const mfStreamRef = useRef(null);

  // ── IDW colour interpolation onto canvas ─────────────────
  // Accepts live W/H so it always fills the container exactly.
  const drawMfCanvas = useCallback((canvasEl, rows, param, W, H) => {
    if (!canvasEl || !rows.length || W <= 0 || H <= 0) return;
    const cfg = MF_CONFIG[param];
    if (!cfg) return;
    const ctx = canvasEl.getContext("2d");
    if (!ctx) return;

    // Set canvas backing-store to exact container size
    canvasEl.width  = W;
    canvasEl.height = H;

    // Build coordinate helpers scoped to this W/H
    const lonPx = (lon) => ((lon - MF_LON_MIN) / (MF_LON_MAX - MF_LON_MIN)) * W;
    const latPx = (lat) => (1 - (lat - MF_LAT_MIN) / (MF_LAT_MAX - MF_LAT_MIN)) * H;

    // Collect station data points in pixel space
    const pts = rows.map(({ station, current: wrf }) => {
      const raw = wrf?.[cfg.key];
      const val = raw != null ? cfg.conv(Number(raw)) : null;
      return {
        px: lonPx(Number(station.longitude ?? station.lon)),
        py: latPx(Number(station.latitude  ?? station.lat)),
        v: val,
      };
    }).filter(p => p.v != null && Number.isFinite(p.v));

    if (!pts.length) return;

    // Colour ramp helpers
    const lerp = (a, b, t) => a + (b - a) * t;
    const hexToRgb = hex => {
      const h = hex.replace("#","");
      return [parseInt(h.slice(0,2),16), parseInt(h.slice(2,4),16), parseInt(h.slice(4,6),16)];
    };
    const stops = cfg.stops.map(hexToRgb);
    const getColour = (v) => {
      const [lo, hi] = cfg.range;
      const t = Math.max(0, Math.min(1, (v - lo) / (hi - lo)));
      const idx = t * (stops.length - 1);
      const i = Math.min(Math.floor(idx), stops.length - 2);
      const frac = idx - i;
      const [r1,g1,b1] = stops[i];
      const [r2,g2,b2] = stops[i+1];
      return [lerp(r1,r2,frac)|0, lerp(g1,g2,frac)|0, lerp(b1,b2,frac)|0];
    };

    // Render at 1/4 resolution then scale up for smoothness
    const SCALE = 4;
    const offW = Math.ceil(W / SCALE);
    const offH = Math.ceil(H / SCALE);
    const offscreen = document.createElement("canvas");
    offscreen.width = offW; offscreen.height = offH;
    const oct = offscreen.getContext("2d");
    const img = oct.createImageData(offW, offH);
    const { data } = img;

    for (let py = 0; py < offH; py++) {
      for (let px = 0; px < offW; px++) {
        const cx = px * SCALE + SCALE/2;
        const cy = py * SCALE + SCALE/2;
        let wSum = 0, vSum = 0;
        for (const p of pts) {
          const dx = cx - p.px, dy = cy - p.py;
          const dist2 = dx*dx + dy*dy;
          const w = 1 / (dist2 + 400);
          wSum += w;
          vSum += w * p.v;
        }
        const v = wSum > 0 ? vSum / wSum : cfg.range[0];
        const [r, g, b] = getColour(v);
        const i4 = (py * offW + px) * 4;
        data[i4]   = r;
        data[i4+1] = g;
        data[i4+2] = b;
        data[i4+3] = 220;
      }
    }
    oct.putImageData(img, 0, 0);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(offscreen, 0, 0, W, H);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Streamlines — depend on live W/H ─────────────────────
  const buildStreamlines = useCallback((rows, W, H) => {
    if (!rows.length || W <= 0 || H <= 0) return [];
    const lonPx = (lon) => ((lon - MF_LON_MIN) / (MF_LON_MAX - MF_LON_MIN)) * W;
    const latPx = (lat) => (1 - (lat - MF_LAT_MIN) / (MF_LAT_MAX - MF_LAT_MIN)) * H;

    const pts = rows.map(({ station, current: wrf }) => ({
      px: lonPx(Number(station.longitude ?? station.lon)),
      py: latPx(Number(station.latitude  ?? station.lat)),
      spd: wrf?.wind_speed_ms != null ? Math.min(Number(wrf.wind_speed_ms) * 3.6, 30) : 8,
      dir: wrf?.wind_direction_deg != null
        ? (Number(wrf.wind_direction_deg) * Math.PI / 180)
        : (292 * Math.PI / 180),
    }));

    const interpolateWind = (x, y) => {
      let ux = 0, uy = 0, wSum = 0;
      for (const p of pts) {
        const dx = x - p.px, dy = y - p.py;
        const d2 = dx*dx + dy*dy;
        const w = 1 / (d2 + 900);
        wSum += w;
        ux += w * p.spd * Math.sin(p.dir);
        uy += w * p.spd * (-Math.cos(p.dir));
      }
      if (wSum < 1e-9) return [0, 0];
      return [ux/wSum, uy/wSum];
    };

    const STEP = 7;
    const MAX_STEPS = 28;
    const lines = [];

    for (let gy = 0.08; gy < 0.92; gy += 0.13) {
      for (let gx = 0.06; gx < 0.94; gx += 0.11) {
        let x = gx * W;
        let y = gy * H;
        const path = [[x, y]];
        for (let s = 0; s < MAX_STEPS; s++) {
          const [u1, v1] = interpolateWind(x, y);
          const mag1 = Math.sqrt(u1*u1+v1*v1);
          if (mag1 < 0.05) break;
          const dx1 = (u1/mag1)*STEP, dy1 = (v1/mag1)*STEP;
          const x2 = x + dx1*0.5, y2 = y + dy1*0.5;
          const [u2, v2] = interpolateWind(x2, y2);
          const mag2 = Math.sqrt(u2*u2+v2*v2)||1;
          x += (u2/mag2)*STEP;
          y += (v2/mag2)*STEP;
          if (x < -20 || x > W+20 || y < -20 || y > H+20) break;
          path.push([x, y]);
        }
        if (path.length >= 4) lines.push(path);
      }
    }
    return lines;
  }, []);

  // Redraw when data, tab, OR container width changes
  useEffect(() => {
    if (!mfCanvasRef.current || !network.rows.length || mfW <= 0) return;
    drawMfCanvas(mfCanvasRef.current, network.rows, mfParam, mfW, MF_H);
  }, [network.rows, mfParam, drawMfCanvas, mfW]);

  const mfStreamlines = useMemo(() => {
    if (!network.rows.length || mfW <= 0) return [];
    return buildStreamlines(network.rows, mfW, MF_H);
  }, [network.rows, buildStreamlines, mfW]);

  // Dynamic timestamp from the first forecast row
  const mfTimestamp = useMemo(() => {
    // Try to get timestamp from the selected station's state.data, or from any network row
    const ts = state.data?.forecast?.[0]?.timestamp_utc
      ?? network.rows[0]?.current?.timestamp_utc
      ?? null;
    if (!ts) return null;
    try {
      const d = new Date(ts);
      if (isNaN(d.getTime())) return null;
      // Format as "DD MMM YYYY, hh:mm AM/PM (IST)"
      const ist = new Date(d.getTime() + 5.5 * 3600000);
      return ist.toLocaleString("en-IN", {
        day: "numeric", month: "short", year: "numeric",
        hour: "2-digit", minute: "2-digit", hour12: true,
        timeZone: "Asia/Kolkata",
      }) + " (IST)";
    } catch { return null; }
  }, [state.data, network.rows]);

  const cfg = MF_CONFIG[mfParam];
  const showStreamlines = mfParam === "Wind (10m)";

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
          WRF-CHEM METEOROLOGICAL FORECAST MAP
          Styled after professional atmospheric-science reference.
          Canvas IDW raster + SVG streamlines + vertical legend.
          ========================================================= */}
      <div className="rounded-2xl p-5 mb-6" style={{background:"var(--surface)", border:"1px solid var(--border)", boxShadow:"var(--shadow-md)"}}>

        {/* Card header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-[var(--text-primary)]">Meteorological Forecast</h3>
            <p className="text-[10px] text-[var(--text-muted)] mt-0.5">{network.rows.length}/{stations.length} stations · WRF-Chem backend</p>
          </div>
          <span className="text-[10px] font-semibold text-emerald-600 px-2.5 py-1.5 rounded-full"
            style={{background:"rgba(5,150,105,.08)",border:"1px solid rgba(5,150,105,.2)"}}>
            {network.loading ? `Loading ${network.rows.length}/${stations.length}…` : "WRF-Chem Model"}
          </span>
        </div>

        {/* Parameter tabs */}
        <div className="flex flex-wrap gap-1 mb-4">
          {mfTabs.map(t => (
            <button key={t} onClick={() => setMfParam(t)}
              className="px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-colors whitespace-nowrap"
              style={mfParam === t
                ? {background:"#16a34a", color:"#ffffff", boxShadow:"0 2px 6px rgba(22,163,74,.3)"}
                : {background:"var(--surface-secondary)", color:"var(--text-secondary)", border:"1px solid var(--border)"}}>
              {t}
            </button>
          ))}
        </div>

        {/* Map + vertical legend row */}
        <div className="flex gap-3 items-start">

          {/* ── Map canvas area — ref attached for ResizeObserver ── */}
          <div ref={mfContainerRef}
            className="relative rounded-xl overflow-hidden flex-1"
            style={{height: MF_H, background:"#1a2744", minWidth:0}}>

            {/* Raster field canvas — sized to mfW×MF_H, always full-width */}
            <canvas ref={mfCanvasRef}
              className="absolute inset-0"
              style={{
                width: "100%", height: "100%",
                opacity: network.rows.length ? 1 : 0, transition:"opacity .4s"
              }}
              width={mfW} height={MF_H}/>

            {/* Dark base when no data */}
            {!network.rows.length && (
              <div className="absolute inset-0 flex items-center justify-center">
                {network.loading
                  ? <div className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{background:"rgba(255,255,255,.9)"}}>
                      <RefreshCw size={13} className="animate-spin text-emerald-600"/>
                      <span className="text-xs font-semibold text-[var(--text-secondary)]">Loading WRF-Chem data…</span>
                    </div>
                  : <div className="text-center px-5">
                      <p className="text-sm font-semibold text-slate-300">No WRF-Chem data</p>
                      <p className="text-[10px] text-slate-400 mt-1">Ensure the backend is running</p>
                    </div>
                }
              </div>
            )}

            {/* ── SVG streamlines (wind only) ── */}
            {showStreamlines && mfStreamlines.length > 0 && (
              <svg ref={mfStreamRef}
                className="absolute inset-0 pointer-events-none"
                width={mfW} height={MF_H}
                style={{overflow:"hidden"}}>
                <defs>
                  {/* Arrow head */}
                  <marker id="mf-arr" markerWidth="4" markerHeight="4" refX="3" refY="2" orient="auto">
                    <polygon points="0 0,4 2,0 4" fill="rgba(220,240,255,.85)"/>
                  </marker>
                  {/* Fade mask so streamlines soften at edges */}
                  <radialGradient id="mf-fade" cx="50%" cy="50%" r="50%">
                    <stop offset="40%"  stopColor="white" stopOpacity="1"/>
                    <stop offset="100%" stopColor="white" stopOpacity="0"/>
                  </radialGradient>
                  <mask id="mf-mask">
                    <rect width={mfW} height={MF_H} fill="url(#mf-fade)"/>
                  </mask>
                </defs>
                <g mask="url(#mf-mask)">
                  {mfStreamlines.map((path, li) => {
                    if (path.length < 2) return null;
                    // Build smooth cubic bezier path
                    let d = `M ${path[0][0].toFixed(1)} ${path[0][1].toFixed(1)}`;
                    for (let i = 1; i < path.length; i++) {
                      const [x, y] = path[i];
                      d += ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
                    }
                    // Place arrow at 60% along the path
                    const midIdx = Math.floor(path.length * 0.6);
                    const [ax, ay] = path[midIdx] ?? path[path.length - 1];
                    const [bx, by] = path[Math.min(midIdx + 1, path.length - 1)];
                    const angle = Math.atan2(by - ay, bx - ax) * 180 / Math.PI;
                    return (
                      <g key={`sl-${li}`}>
                        <path d={d} fill="none"
                          stroke="rgba(200,235,255,.6)" strokeWidth="1.1"
                          strokeLinecap="round"/>
                        {/* Arrow head marker */}
                        <polygon
                          points={`${ax},${ay} ${ax-6},${ay-3} ${ax-6},${ay+3}`}
                          fill="rgba(220,240,255,.75)"
                          transform={`rotate(${angle},${ax},${ay})`}/>
                      </g>
                    );
                  })}
                </g>
              </svg>
            )}

            {/* ── NCR boundary (hand-tuned polygon approximation) ── */}
            <svg className="absolute inset-0 pointer-events-none" width={mfW} height={MF_H}
              style={{overflow:"hidden", opacity:.7}}>
              {(() => {
                // Approximate NCR boundary as a closed polygon through key boundary points
                const bPts = [
                  [77.05,29.30],[77.30,29.28],[77.55,29.22],[77.70,29.08],
                  [77.75,28.90],[77.72,28.65],[77.68,28.38],[77.55,28.22],
                  [77.30,28.05],[77.05,27.92],[76.80,28.00],[76.65,28.18],
                  [76.60,28.40],[76.65,28.65],[76.75,28.95],[76.85,29.15],
                ];
                const pts = bPts.map(([ln, lt]) =>
                  `${mfLonPx(ln).toFixed(1)},${mfLatPx(lt).toFixed(1)}`).join(" ");
                return (
                  <polygon points={pts}
                    fill="none"
                    stroke="rgba(255,255,255,.55)"
                    strokeWidth="1.4"
                    strokeDasharray="6 4"/>
                );
              })()}
            </svg>

            {/* ── City labels ── */}
            {[
              {name:"Delhi",      lat:28.6139, lon:77.2090, dx:0,  dy:-8},
              {name:"Gurugram",   lat:28.4595, lon:77.0266, dx:-6, dy:0},
              {name:"Faridabad",  lat:28.4089, lon:77.3178, dx:0,  dy:10},
              {name:"Noida",      lat:28.5355, lon:77.3910, dx:6,  dy:0},
              {name:"Ghaziabad",  lat:28.6692, lon:77.4538, dx:6,  dy:0},
              {name:"Sonipat",    lat:28.9931, lon:77.0151, dx:-6, dy:0},
              {name:"Panipat",    lat:29.3909, lon:76.9635, dx:0,  dy:-8},
              {name:"Meerut",     lat:28.9845, lon:77.7064, dx:6,  dy:0},
              {name:"Rohtak",     lat:28.8955, lon:76.6066, dx:-6, dy:0},
            ].map(c => {
              const cx = mfLonPx(c.lon);
              const cy = mfLatPx(c.lat);
              if (cx < 0 || cx > mfW || cy < 0 || cy > MF_H) return null;
              return (
                <div key={c.name}
                  className="absolute pointer-events-none select-none"
                  style={{
                    left: cx + c.dx,
                    top:  cy + c.dy,
                    transform: "translate(-50%,-50%)",
                  }}>
                  <span style={{
                    fontSize:11, fontWeight:700,
                    color:"#ffffff",
                    textShadow:"0 0 6px rgba(0,0,0,.95), 1px 1px 0 rgba(0,0,0,.8), -1px -1px 0 rgba(0,0,0,.8)",
                    letterSpacing:".01em",
                  }}>{c.name}</span>
                </div>
              );
            })}

            {/* ── Station dots (subtle, no labels) ── */}
            {network.rows.map(({ station }) => {
              const px = mfLonPx(Number(station.longitude ?? station.lon));
              const py = mfLatPx(Number(station.latitude  ?? station.lat));
              if (px < 0 || px > mfW || py < 0 || py > MF_H) return null;
              const isActive = station.station_id === selectedId;
              return (
                <button
                  key={`mf-dot-${station.station_id}`}
                  onClick={() => setSelectedId(station.station_id)}
                  className="absolute group"
                  style={{left: px, top: py, transform:"translate(-50%,-50%)", zIndex:10}}>
                  <span style={{
                    display:"block",
                    width: isActive ? 10 : 6,
                    height: isActive ? 10 : 6,
                    borderRadius:"50%",
                    background: isActive ? "#ffffff" : "rgba(255,255,255,.7)",
                    border: isActive ? "2px solid rgba(0,0,0,.5)" : "1px solid rgba(0,0,0,.3)",
                    boxShadow: isActive ? "0 0 8px rgba(255,255,255,.8)" : "none",
                    transition:"all .15s",
                  }}/>
                  {/* Hover tooltip — station name only, never permanent label */}
                  <span className="absolute left-1/2 bottom-full mb-2 -translate-x-1/2 hidden group-hover:flex whitespace-nowrap pointer-events-none"
                    style={{
                      background:"rgba(15,23,42,.92)",
                      color:"#f1f5f9",
                      fontSize:10, fontWeight:600,
                      padding:"3px 8px",
                      borderRadius:6,
                      boxShadow:"0 2px 8px rgba(0,0,0,.5)",
                      zIndex:50,
                    }}>
                    {station.name}
                  </span>
                </button>
              );
            })}

            {/* ── Scale bar ── */}
            <div className="absolute bottom-9 left-3 flex items-center gap-1 pointer-events-none"
              style={{zIndex:20}}>
              <div style={{
                width:60, height:4,
                background:"linear-gradient(90deg,#fff 0%,#fff 50%,transparent 50%,transparent 100%)",
                backgroundSize:"10px 4px",
                border:"1px solid rgba(255,255,255,.6)",
                borderRadius:2,
              }}/>
              <span style={{fontSize:10, fontWeight:700, color:"#fff",
                textShadow:"0 1px 4px rgba(0,0,0,.9)"}}>20 km</span>
            </div>

            {/* ── Valid timestamp overlay ── */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 pointer-events-none"
              style={{zIndex:20}}>
              <span style={{
                background:"rgba(10,18,40,.82)",
                color:"#f0f4f8",
                fontSize:11, fontWeight:600,
                padding:"4px 14px",
                borderRadius:8,
                border:"1px solid rgba(255,255,255,.15)",
                backdropFilter:"blur(4px)",
                letterSpacing:".01em",
                whiteSpace:"nowrap",
              }}>
                {mfTimestamp
                  ? `Valid: ${mfTimestamp}`
                  : "Valid: timestamp from backend"}
              </span>
            </div>
          </div>

          {/* ── Vertical colour legend ── */}
          <div className="flex-shrink-0 flex flex-col items-start gap-1 pl-1" style={{width:80}}>
            <p className="text-[10px] font-semibold text-[var(--text-secondary)] mb-1 leading-tight">
              {cfg?.label?.replace(/ *\(.*\)/, "") ?? ""}
              <br/>
              <span className="font-normal text-[var(--text-muted)]">({cfg?.unit})</span>
            </p>
            {/* Gradient bar */}
            <div style={{
              width:18, height:180,
              borderRadius:4, border:"1px solid rgba(0,0,0,.12)",
              background: `linear-gradient(to bottom, ${[...(cfg?.stops ?? [])].reverse().join(",")})`,
              flexShrink:0,
            }}/>
            {/* Tick labels */}
            <div className="relative" style={{height:180, width:18}}>
              {[0,.2,.4,.6,.8,1].map((t,i) => {
                const [lo,hi] = cfg?.range ?? [0,1];
                const v = hi - t*(hi-lo);
                return (
                  <span key={i}
                    className="absolute text-[10px] font-semibold text-[var(--text-secondary)]"
                    style={{
                      top: `${t * 100}%`,
                      left: 24,
                      transform:"translateY(-50%)",
                      whiteSpace:"nowrap",
                    }}>
                    {Number.isFinite(v) ? Math.round(v) : ""}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-center gap-5 mt-3 pt-3 border-t border-[var(--border)]">
          <span className="text-[11px] font-semibold text-[var(--text-muted)]">Simulated/Prototype Data</span>
          <span className="text-[var(--border)]">|</span>
          <span className="text-[11px] text-[var(--text-muted)]">WRF-Chem Backend</span>
          <span className="text-[var(--border)]">|</span>
          <span className="text-[11px] text-[var(--text-muted)]">{network.rows.length}/{stations.length} Stations</span>
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
            <div className="overflow-x-auto max-h-[440px] overflow-y-auto">
            <table className="wrf-table">
              <thead>
                <tr>
                  {['#', 'Station', 'Station ID', 'AQI', 'PM2.5', 'PM10', 'O₃', 'NO₂', 'Temp', 'Wind', 'PBL', 'Inversion'].map(label => (
                    <th key={label}>{label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {network.rows.map(({ station, current: wrf }, index) => {
                  const aqiVal = wrf?.aqi;
                  const aqiC = aqiColour(aqiVal);
                  return (
                    <tr
                      key={`wrf-row-${station.station_id}`}
                      onClick={() => setSelectedId(station.station_id)}
                      className={`cursor-pointer ${station.station_id === selectedId ? "selected" : ""}`}
                    >
                      <td className="text-[var(--text-muted)]">{index + 1}</td>
                      <td className="font-semibold text-[var(--text-primary)]">{station.name || station.station_id}</td>
                      <td className="text-[var(--text-secondary)] font-mono text-[10px]">{station.station_id}</td>
                      <td>
                        <span className="aqi-badge text-white" style={{background: aqiC, minWidth:48}}>
                          {Number.isFinite(Number(aqiVal)) ? Math.round(Number(aqiVal)) : "—"}
                        </span>
                      </td>
                      <td className="text-[var(--text-primary)] font-medium">{formatValue(wrf?.pm25)}</td>
                      <td className="text-[var(--text-primary)] font-medium">{formatValue(wrf?.pm10)}</td>
                      <td className="text-[var(--text-primary)] font-medium">{formatValue(wrf?.o3)}</td>
                      <td className="text-[var(--text-primary)] font-medium">{formatValue(wrf?.no2)}</td>
                      <td className="text-[var(--text-primary)]">{formatValue(wrf?.temperature_c)}°C</td>
                      <td className="text-[var(--text-primary)]">{formatValue(wrf?.wind_speed_ms)} m/s</td>
                      <td className="text-[var(--text-primary)]">{formatValue(wrf?.boundary_layer_height_m)} m</td>
                      <td>
                        <span className={`aqi-badge ${wrf?.inversion_flag ? "text-orange-700" : "text-[var(--text-muted)]"}`}
                          style={wrf?.inversion_flag ? {background:"rgba(234,88,12,.1)",border:"1px solid rgba(234,88,12,.2)"} : {background:"var(--surface-secondary)",border:"1px solid var(--border)"}}>
                          {wrf?.inversion_flag ? "Active" : "None"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            </div>
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

            <table className="wrf-table">
              <thead>
                <tr>
                  {['Hour', 'AQI', 'PM2.5', 'PM10', 'O3', 'NO2', 'Temp', 'Wind', 'PBL', 'Inversion'].map(label => <th key={label}>{label}</th>)}
                </tr>
              </thead>
              <tbody>
                {(showAll ? rows : rows.slice(0, 12)).map((row, index) => {
                  const aqiV = row.aqi;
                  const aqiC = aqiColour(aqiV);
                  return (
                    <tr key={`${row.station_id}-${row.forecast_hour}-${index}`}>
                      <td className="font-mono text-[var(--text-secondary)]">H+{Number.isFinite(Number(row.forecast_hour)) ? Number(row.forecast_hour) : index}</td>
                      <td>
                        <span className="aqi-badge text-white" style={{background:aqiC,minWidth:44}}>
                          {Number.isFinite(Number(aqiV)) ? Math.round(Number(aqiV)) : "—"}
                        </span>
                      </td>
                      <td className="text-[var(--text-primary)] font-medium">{formatValue(row.pm25)}</td>
                      <td className="text-[var(--text-primary)] font-medium">{formatValue(row.pm10)}</td>
                      <td className="text-[var(--text-primary)] font-medium">{formatValue(row.o3)}</td>
                      <td className="text-[var(--text-primary)] font-medium">{formatValue(row.no2)}</td>
                      <td className="text-[var(--text-primary)]">{formatValue(row.temperature_c)}°C</td>
                      <td className="text-[var(--text-primary)]">{formatValue(row.wind_speed_ms)} m/s</td>
                      <td className="text-[var(--text-primary)]">{formatValue(row.boundary_layer_height_m)} m</td>
                      <td className="text-[var(--text-secondary)]">{row.inversion_flag ? "Active" : "None"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
