"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Gamepad2, Clock, Calculator, Play, Square, TimerReset, Monitor, Hash, Coins, Timer, Tv, AlertTriangle, BellRing } from "lucide-react";
import { cn } from "@/lib/utils";

type ConsoleId = "PS3" | "PS4" | "PS4Pro" | "PS5";

export type Session = {
  id: string;
  stationName: string;
  consoleId: ConsoleId;
  startTime: number;
  targetDurationMs: number;
  isNotified: boolean;
};

export type SessionHistory = {
  id: string;
  stationName: string;
  consoleName: string;
  startTime: number;
  endTime: number;
  totalPrice: number;
  durationStr: string;
};

const CONSOLES: Record<ConsoleId, { id: ConsoleId; name: string; price: number; color: string; border: string; borderL: string; glow: string; bgBadge: string }> = {
  "PS3": { id: "PS3", name: "PlayStation 3", price: 5000, color: "text-red-400", border: "border-red-500/30", borderL: "border-l-red-500", glow: "shadow-[0_0_20px_rgba(239,68,68,0.3)]", bgBadge: "bg-red-500/20 text-red-400" },
  "PS4": { id: "PS4", name: "PlayStation 4", price: 7000, color: "text-orange-400", border: "border-orange-500/30", borderL: "border-l-orange-500", glow: "shadow-[0_0_20px_rgba(249,115,22,0.3)]", bgBadge: "bg-orange-500/20 text-orange-400" },
  "PS4Pro": { id: "PS4Pro", name: "PS 4 Pro", price: 8000, color: "text-amber-400", border: "border-amber-500/30", borderL: "border-l-amber-500", glow: "shadow-[0_0_20px_rgba(245,158,11,0.3)]", bgBadge: "bg-amber-500/20 text-amber-400" },
  "PS5": { id: "PS5", name: "PlayStation 5", price: 10000, color: "text-yellow-400", border: "border-yellow-500/30", borderL: "border-l-yellow-500", glow: "shadow-[0_0_20px_rgba(234,179,8,0.3)]", bgBadge: "bg-yellow-500/20 text-yellow-400" },
};

function formatRupiah(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// ----------------------------------------------------------------------
// COMPONENT: Manual Calculator
// ----------------------------------------------------------------------
function ManualCalculator({ onStartSession }: { onStartSession: () => void }) {
  const [selectedConsole, setSelectedConsole] = useState<ConsoleId>("PS4");
  const [hours, setHours] = useState<number>(1);
  const [minutes, setMinutes] = useState<number>(0);

  const calculateTotal = () => {
    const rate = CONSOLES[selectedConsole].price;
    const total = (hours * rate) + (minutes * (rate / 60));
    // Bulatkan ke ratusan terdekat
    return Math.round(total / 100) * 100;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="show"
      exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
      variants={containerVariants}
      className="max-w-2xl mx-auto space-y-8 relative z-10"
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {(Object.keys(CONSOLES) as ConsoleId[]).map((key) => {
          const item = CONSOLES[key];
          const isSelected = selectedConsole === key;
          
          return (
            <motion.button
              variants={itemVariants}
              key={key}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedConsole(key)}
              className={`relative flex flex-col items-center justify-center p-6 rounded-2xl border-y border-r border-white/5 transition-all duration-300 overflow-hidden ${
                isSelected 
                  ? `bg-neutral-900/80 backdrop-blur-md border-l-4 ${item.borderL} ${item.glow}` 
                  : "bg-[#0a0a0a] backdrop-blur-sm border-l-4 border-l-transparent hover:bg-neutral-900/50"
              }`}
            >
              {isSelected && (
                <motion.div
                  layoutId="activeTab"
                  className={`absolute inset-0 border-t border-r border-b rounded-2xl ${item.border}`}
                  initial={false}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              {isSelected && (
                 <motion.div 
                   className="absolute inset-0 bg-gradient-to-t from-white/5 to-transparent pointer-events-none"
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                 />
              )}
              <Gamepad2 className={`w-10 h-10 mb-4 transition-colors relative z-10 ${isSelected ? item.color : "text-neutral-600"}`} />
              <span className={`text-xs uppercase tracking-widest font-bold relative z-10 ${isSelected ? "text-neutral-100 drop-shadow-md" : "text-neutral-500"}`}>{item.name}</span>
              <span className={`text-[10px] font-mono mt-2 px-2 py-1 rounded relative z-10 transition-colors ${isSelected ? item.bgBadge : "bg-neutral-950 border border-white/5 text-neutral-500"}`}>{formatRupiah(item.price)}/jam</span>
            </motion.button>
          );
        })}
      </div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6 p-8 rounded-3xl bg-[#0a0a0a]/80 border border-white/5 backdrop-blur-xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 via-amber-500 to-red-500 opacity-50" />
          <div className="flex items-center space-x-3 mb-8 border-b border-white/5 pb-4">
            <Clock className="w-5 h-5 text-orange-400" />
            <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-400">Set Duration</span>
          </div>
          
          <div>
            <label className="text-[10px] uppercase tracking-wider text-neutral-500 mb-2 block">Hours</label>
            <div className="flex items-center space-x-4">
              <input 
                type="range" min="0" max="12" step="1" 
                value={hours} 
                onChange={(e) => setHours(parseInt(e.target.value))}
                className="w-full accent-orange-500 bg-neutral-900 border border-white/5 appearance-none h-2 rounded-full outline-none cursor-pointer relative z-10"
              />
              <span className="w-16 text-center font-mono text-xl text-orange-400 bg-neutral-900 border border-white/5 py-2 rounded">{hours}</span>
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-wider text-neutral-500 mb-2 block mt-6">Minutes</label>
            <div className="flex items-center space-x-4">
              <input 
                type="range" min="0" max="59" step="5" 
                value={minutes} 
                onChange={(e) => setMinutes(parseInt(e.target.value))}
                className="w-full accent-orange-500 bg-neutral-900 border border-white/5 appearance-none h-2 rounded-full outline-none cursor-pointer relative z-10"
              />
              <span className="w-16 text-center font-mono text-xl text-orange-400 bg-neutral-900 border border-white/5 py-2 rounded">{minutes}</span>
            </div>
          </div>
        </div>

        <div className={`relative overflow-hidden p-8 gap-4 rounded-3xl flex flex-col justify-center items-center text-center bg-[#0a0a0a]/80 border border-white/5 backdrop-blur-xl shadow-2xl ${CONSOLES[selectedConsole].glow} transition-all duration-700`}>
          <div className="absolute -top-10 -right-10 opacity-5">
            <Coins className="w-48 h-48" />
          </div>
          
          <motion.div 
             key={selectedConsole}
             initial={{ opacity: 0, scale: 0.8 }}
             animate={{ opacity: 1, scale: 1 }}
             className={`w-16 h-16 rounded-full flex items-center justify-center mb-2 ${CONSOLES[selectedConsole].bgBadge}`}
          >
             <Gamepad2 className="w-8 h-8" />
          </motion.div>

          <span className={`text-xs font-bold uppercase tracking-widest text-neutral-400`}>Total Bill Estimation</span>
          <motion.div
            key={calculateTotal()}
            initial={{ scale: 0.5, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={`text-5xl font-mono font-black py-4 bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-500 ${CONSOLES[selectedConsole].glow.replace('shadow-', 'drop-shadow-')}`}
          >
            {formatRupiah(calculateTotal())}
          </motion.div>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onStartSession} 
            className={`w-full relative overflow-hidden group bg-neutral-900 border ${CONSOLES[selectedConsole].border} text-white font-bold py-4 mt-6 rounded-xl uppercase tracking-widest text-xs transition-all`}
          >
             <span className="relative z-10 flex items-center justify-center gap-2">Open Live Monitor <Timer className="w-4 h-4" /></span>
             <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]`} />
             <div className={`absolute inset-0 transition-opacity opacity-0 group-hover:opacity-100 ${CONSOLES[selectedConsole].bgBadge} -z-0`} />
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ----------------------------------------------------------------------
// COMPONENT: Live Timer Tracker
// ----------------------------------------------------------------------

function LiveTracker({
  sessions, setSessions,
  history, setHistory
}: {
  sessions: Session[];
  setSessions: React.Dispatch<React.SetStateAction<Session[]>>;
  history: SessionHistory[];
  setHistory: React.Dispatch<React.SetStateAction<SessionHistory[]>>;
}) {
  const [availableStations] = useState(["TV 1", "TV 2", "TV 3", "TV 4", "TV 5", "TV 6", "TV 7", "TV 8"]);
  const [now, setNow] = useState(() => Date.now());
  const [isCreating, setIsCreating] = useState(false);
  const [newSessionData, setNewSessionData] = useState<{station: string, console: ConsoleId, durationMinutes: number}>({ station: "TV 1", console: "PS4", durationMinutes: 0 });
  const [activeAlarms, setActiveAlarms] = useState<{ id: string, stationName: string }[]>([]);

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let hasChanges = false;
    const updatedSessions = sessions.map(session => {
      if (session.targetDurationMs > 0 && !session.isNotified) {
        if (now - session.startTime >= session.targetDurationMs) {
          const msgText = `Permisi. Waktu bermain untuk ${session.stationName} telah habis. Silakan lakukan pembayaran di kasir, atau tambah sesi bermain.`;
          try {
            const msg = new SpeechSynthesisUtterance(msgText);
            msg.lang = 'id-ID';
            window.speechSynthesis.speak(msg);
          } catch(e) {}
          setActiveAlarms(prev => [...prev, { id: session.id, stationName: session.stationName }]);
          hasChanges = true;
          return { ...session, isNotified: true };
        }
      }
      return session;
    });

    if (hasChanges) {
      setSessions(updatedSessions);
    }
  }, [now, sessions, setSessions]);

  const dismissAlarm = (id: string) => {
    setActiveAlarms(prev => prev.filter(al => al.id !== id));
  };

  const addSession = () => {
    if (sessions.some(s => s.stationName === newSessionData.station)) {
      alert("Station sudah digunakan!");
      return;
    }
    setSessions([...sessions, {
      id: Math.random().toString(36).substr(2, 9),
      stationName: newSessionData.station,
      consoleId: newSessionData.console,
      startTime: Date.now(),
      targetDurationMs: newSessionData.durationMinutes * 60 * 1000,
      isNotified: false
    }]);
    setIsCreating(false);
  };

  const removeSession = (id: string, total: number, timeStr: string) => {
    const session = sessions.find(s => s.id === id);
    if (!session) return;
    
    setSessions(sessions.filter(s => s.id !== id));
    setHistory(prev => [{
      id: session.id,
      stationName: session.stationName,
      consoleName: CONSOLES[session.consoleId].name,
      startTime: session.startTime,
      endTime: Date.now(),
      totalPrice: total,
      durationStr: timeStr
    }, ...prev]);
  };

  return (
    <>
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-4">
        <AnimatePresence>
          {activeAlarms.map(alarm => (
            <motion.div
              key={alarm.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className="bg-red-500/20 backdrop-blur-xl border border-red-500/50 p-4 rounded-2xl shadow-[0_0_30px_rgba(239,68,68,0.3)] min-w-[300px] flex gap-4 items-start"
            >
              <div className="bg-red-500/20 p-2 rounded-full mt-1">
                <BellRing className="w-5 h-5 text-red-500 animate-[bounce_1s_infinite]" />
              </div>
              <div className="flex-1">
                <h4 className="text-red-500 font-bold uppercase tracking-widest text-xs mb-1">Time Up!</h4>
                <p className="text-neutral-300 text-sm mb-4">Waktu bermain untuk <span className="font-bold text-white">{alarm.stationName}</span> telah habis. Harap konfirmasi pembayaran di kasir atau tambah durasi sesi.</p>
                <div className="flex justify-end">
                  <button 
                    onClick={() => dismissAlarm(alarm.id)}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold uppercase tracking-widest text-[10px] px-4 py-2 rounded transition-colors"
                  >
                    Tutup Peringatan
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="max-w-4xl mx-auto"
      >
      <div className="flex justify-between items-center mb-8">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-widest text-neutral-500 mb-1">Live Tracker</span>
          <h2 className="text-xl font-bold uppercase tracking-widest text-neutral-200 flex items-center">
            Active Stations
          </h2>
        </div>
        
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsCreating(!isCreating)}
          className="bg-orange-600 hover:bg-orange-500 text-white px-5 py-2.5 rounded shadow-[0_0_15px_rgba(249,115,22,0.4)] text-[10px] uppercase tracking-widest font-bold transition-colors flex items-center"
        >
          {isCreating ? "Cancel" : "+ Start New User"}
        </motion.button>
      </div>

      <AnimatePresence>
        {isCreating && (
          <motion.div 
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: 'auto', marginBottom: 32 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-[#111111]/80 border border-white/5 p-6 rounded-xl backdrop-blur-md flex flex-wrap gap-4 items-end shadow-2xl">
              <div className="flex-1 min-w-[200px]">
                <label className="text-[10px] uppercase tracking-widest text-neutral-500 mb-2 block">Pilih Monitor (TV)</label>
                <select 
                  value={newSessionData.station}
                  onChange={(e) => setNewSessionData({...newSessionData, station: e.target.value})}
                  className="w-full bg-neutral-900 border border-white/5 rounded p-3 text-sm font-mono text-neutral-200 outline-none focus:border-orange-500 transition-colors"
                >
                  {availableStations.map(st => (
                    <option key={st} value={st} disabled={sessions.some(s => s.stationName === st)}>{st} {sessions.some(s => s.stationName === st) ? "(Sedang Dipakai)" : ""}</option>
                  ))}
                </select>
              </div>
              <div className="flex-1 min-w-[200px]">
                <label className="text-[10px] uppercase tracking-widest text-neutral-500 mb-2 block">Pilih Console</label>
                <select 
                  value={newSessionData.console}
                  onChange={(e) => setNewSessionData({...newSessionData, console: e.target.value as ConsoleId})}
                  className="w-full bg-neutral-900 border border-white/5 rounded p-3 text-sm font-mono text-neutral-200 outline-none focus:border-orange-500 transition-colors"
                >
                  {Object.keys(CONSOLES).map(c => (
                    <option key={c} value={c}>{CONSOLES[c as ConsoleId].name} - {formatRupiah(CONSOLES[c as ConsoleId].price)}/jam</option>
                  ))}
                </select>
              </div>
              <div className="flex-1 min-w-[200px]">
                <label className="text-[10px] uppercase tracking-widest text-neutral-500 mb-2 block">Durasi (Menit, kelipatan 5, 0 = Open Bill)</label>
                <input 
                  type="number" 
                  min="0" 
                  step="5" 
                  value={newSessionData.durationMinutes}
                  onChange={(e) => {
                    let val = parseInt(e.target.value);
                    if (isNaN(val)) val = 0;
                    setNewSessionData({...newSessionData, durationMinutes: val});
                  }}
                  className="w-full bg-neutral-900 border border-white/5 rounded p-3 text-sm font-mono text-neutral-200 outline-none focus:border-orange-500 transition-colors"
                />
              </div>
              <button 
                onClick={addSession}
                className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-8 py-3 rounded text-[10px] uppercase tracking-widest font-bold transition-colors"
              >
                Mulai
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {sessions.length === 0 && !isCreating && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="col-span-full py-20 text-center border border-white/5 rounded-xl bg-[#0a0a0a]/50 backdrop-blur-sm"
            >
              <Monitor className="w-16 h-16 text-neutral-800 mx-auto mb-4" />
              <p className="text-neutral-500 uppercase tracking-widest text-[10px] font-bold">Belum ada station yang aktif</p>
              <p className="text-neutral-600 text-xs mt-2">Mulai sesi baru untuk melacak billing real-time.</p>
            </motion.div>
          )}
          
          {sessions.map(session => {
            const consoleInfo = CONSOLES[session.consoleId];
            const isTimed = session.targetDurationMs > 0;
            const elapsedMs = now - session.startTime;
            const isFinished = isTimed && elapsedMs >= session.targetDurationMs;

            const billMs = isTimed && !isFinished ? session.targetDurationMs : elapsedMs;
            const billHours = billMs / (1000 * 60 * 60);
            const total = Math.round((billHours * consoleInfo.price) / 100) * 100;
            
            let displayMs = 0;
            if (isTimed) {
              displayMs = isFinished ? elapsedMs - session.targetDurationMs : session.targetDurationMs - elapsedMs;
            } else {
              displayMs = elapsedMs;
            }

            const totalSeconds = Math.floor(displayMs / 1000);
            const h = Math.floor(totalSeconds / 3600);
            const m = Math.floor((totalSeconds % 3600) / 60);
            const s = totalSeconds % 60;
            const timeStr = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;

            return (
              <motion.div
                key={session.id}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0, transition: { duration: 0.2 } }}
                className={cn(
                  "relative p-4 rounded-xl bg-[#0a0a0a]/80 border-y border-r border-white/5 backdrop-blur-md overflow-hidden border-l-4 shadow-xl",
                  consoleInfo.borderL,
                  isFinished ? "shadow-[0_0_20px_rgba(239,68,68,0.3)] border-red-500 border-l-red-500" : consoleInfo.glow
                )}
              >
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <span className={cn("text-[10px] px-2 py-1 rounded font-bold uppercase tracking-tighter", isFinished ? "bg-red-500/20 text-red-500" : consoleInfo.bgBadge)}>
                    {session.stationName} • {consoleInfo.name}
                  </span>
                  <span className={cn("text-xs flex items-center gap-1 font-mono", isFinished ? "text-red-500" : "text-green-400")}>
                    {isFinished ? "● Time Up" : "● Active"}
                  </span>
                </div>

                <div className="space-y-1 relative z-10">
                  <div className={cn("text-3xl font-black font-mono tracking-tighter tabular-nums", isFinished ? "text-red-500 animate-pulse" : "text-neutral-100")}>
                    {isTimed && isFinished ? "-" : ""}{timeStr}
                  </div>
                  <div className="text-[10px] text-neutral-500 uppercase tracking-widest">
                    Status: {isTimed ? (isFinished ? "Overtime (Extra Charge)" : "Prepaid Timer") : "Open Bill"}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center relative z-10">
                  <div className="text-xs text-neutral-500">Bill: <span className={cn("font-bold font-mono text-sm", isFinished ? "text-red-500" : consoleInfo.color)}>{formatRupiah(total)}</span></div>
                  <button 
                    onClick={() => removeSession(session.id, total, timeStr)}
                    className="text-[10px] bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500/20 px-4 py-1.5 rounded uppercase font-bold transition-colors"
                  >
                    Checkout
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <div className="mt-16 relative z-10">
        <div className="flex justify-between items-end mb-6 border-b border-white/5 pb-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            Riwayat Sesi Terakhir
          </h3>
        </div>
        <motion.div layout className="space-y-4">
          <AnimatePresence>
            {history.length === 0 && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                 animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="text-center py-10 border border-white/5 rounded-2xl bg-[#050505]/60 backdrop-blur-md"
              >
                <div className="w-12 h-12 rounded-full bg-neutral-900 flex items-center justify-center mx-auto mb-3 border border-white/5">
                  <Clock className="w-5 h-5 text-neutral-600" />
                </div>
                <p className="text-neutral-500 uppercase tracking-widest text-[10px] font-bold">Belum ada riwayat</p>
              </motion.div>
            )}
            {history.map((item, i) => (
              <motion.div 
                key={item.id} 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05, type: "spring" }}
                className="flex flex-col md:flex-row justify-between items-center bg-[#0a0a0a]/80 border border-white/5 p-5 rounded-2xl backdrop-blur-md shadow-lg group hover:bg-[#111111] transition-colors"
              >
                <div className="flex flex-col gap-2 w-full md:w-auto">
                  <div className="flex items-center gap-3">
                    <span className="text-orange-400 font-black text-sm uppercase tracking-wider">{item.stationName}</span>
                    <span className="text-neutral-400 text-[10px] uppercase tracking-widest bg-neutral-950 px-2 py-1 rounded shadow-inner border border-white/5">{item.consoleName}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="text-xs text-neutral-500 font-mono flex items-center gap-1">
                      <Clock className="w-3 h-3 opacity-50" />
                      {item.durationStr}
                    </p>
                  </div>
                </div>
                <div className="text-right w-full md:w-auto mt-4 md:mt-0 flex flex-row md:flex-col justify-between items-center md:items-end border-t md:border-t-0 border-white/5 pt-4 md:pt-0">
                  <span className="text-[10px] uppercase tracking-widest text-neutral-500 group-hover:text-orange-400 transition-colors">Pendapatan</span>
                  <p className="font-mono font-black text-orange-400 text-xl">{formatRupiah(item.totalPrice)}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
    </>
  );
}

// ----------------------------------------------------------------------
// MAIN PAGE
// ----------------------------------------------------------------------
export default function Home() {
  const [activeTab, setActiveTab] = useState<"manual" | "live">("manual");
  const [sessions, setSessions] = useState<Session[]>([]);
  const [history, setHistory] = useState<SessionHistory[]>([]);
  
  const totalRevenue = history.reduce((sum, item) => sum + item.totalPrice, 0);

  return (
    <div className="min-h-screen relative overflow-x-hidden bg-black font-sans text-neutral-300">
      
      {/* Animated Background Orbs - Optimized for performance */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-[radial-gradient(circle_at_center,_rgba(249,115,22,0.15)_0%,_transparent_70%)] opacity-50" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] rounded-full bg-[radial-gradient(circle_at_center,_rgba(245,158,11,0.15)_0%,_transparent_70%)] opacity-50" />
      </div>

      {/* Navbar/Header */}
      <header className="relative z-10 border-b border-white/5 bg-black/50 backdrop-blur-2xl shadow-xl">
        <div className="max-w-6xl mx-auto px-8 py-6 flex flex-col md:flex-row items-center md:items-end justify-between gap-6">
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-3">
               <Gamepad2 className="w-12 h-12 text-white" />
               <div className="flex flex-col">
                 <h1 className="text-4xl font-black tracking-tighter text-white uppercase leading-none flex items-center">
                   ULT<span className="text-orange-500 text-5xl -mt-2">I</span>MATE
                 </h1>
                 <h2 className="text-base font-bold tracking-[0.4em] text-white uppercase leading-none mt-1">
                   PLAYSTATION
                 </h2>
               </div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex flex-col text-orange-400 md:border-r border-white/10 md:pr-6 text-center md:text-right relative">
              <span className="text-[10px] uppercase tracking-widest opacity-70">Total Pendapatan Harian</span>
              <motion.span 
                key={totalRevenue}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-mono font-black leading-none bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-amber-300 drop-shadow-[0_0_10px_rgba(249,115,22,0.3)]"
              >
                {formatRupiah(totalRevenue)}
              </motion.span>
            </div>

            <div className="flex bg-neutral-900 border border-white/5 p-1 rounded">
              <button
                onClick={() => setActiveTab("manual")}
                className={`flex items-center gap-2 px-6 py-2 rounded text-[10px] uppercase tracking-widest font-bold transition-all ${
                  activeTab === "manual" ? "bg-white/10 text-white" : "text-neutral-500 hover:text-neutral-300 hover:bg-white/5"
                }`}
              >
                <Calculator className="w-4 h-4" /> Quick Calc
              </button>
              <button
                onClick={() => setActiveTab("live")}
                className={`flex items-center gap-2 px-6 py-2 rounded text-[10px] uppercase tracking-widest font-bold transition-all ${
                  activeTab === "live" ? "bg-white/10 text-white" : "text-neutral-500 hover:text-neutral-300 hover:bg-white/5"
                }`}
              >
                <Timer className="w-4 h-4" /> Live Monitor
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-6xl mx-auto px-8 py-12">
        <div className="mb-20">
          <AnimatePresence mode="wait">
            {activeTab === "manual" ? (
              <ManualCalculator key="manual" onStartSession={() => setActiveTab("live")} />
            ) : (
              <LiveTracker 
                key="live" 
                sessions={sessions} 
                setSessions={setSessions}
                history={history}
                setHistory={setHistory}
              />
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
