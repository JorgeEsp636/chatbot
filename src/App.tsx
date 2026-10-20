import React, { useState, useEffect } from 'react';
import { RootNavigator } from './navigation/RootNavigator';
import { Smartphone, Maximize2, Code2, Wifi, Moon, Sun } from 'lucide-react';
import { CodeExplorerModal } from './components/CodeExplorerModal';

export default function App() {
  const [isMobileFrame, setIsMobileFrame] = useState(false);
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState('09:41');
  const [modoOscuro, setModoOscuro] = useState(() => {
    return typeof window === 'undefined' || localStorage.getItem('cheems-theme') !== 'light';
  });

  useEffect(() => {
    localStorage.setItem('cheems-theme', modoOscuro ? 'dark' : 'light');
  }, [modoOscuro]);

  useEffect(() => {
    const cambiarTema = () => setModoOscuro(localStorage.getItem('cheems-theme') !== 'light');
    window.addEventListener('cheems-theme-toggle', cambiarTema);
    return () => window.removeEventListener('cheems-theme-toggle', cambiarTema);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth <= 640) {
      setIsMobileFrame(false);
    }

    const updateClock = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', hour12: false })
      );
    };

    updateClock();
    const interval = setInterval(updateClock, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`app-theme ${modoOscuro ? '' : 'theme-light'} min-h-screen bg-[#04070d] text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950 font-sans`}>
      <div className="bg-slate-950/90 border-b border-cyan-500/25 px-3 py-2 sm:px-4 flex items-center justify-between text-xs z-50 backdrop-blur-md">
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-black tracking-wider text-white uppercase text-[11px] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
            CHEEMS
          </span>
          <span className="hidden sm:inline-block text-[10px] px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-mono truncate">
            Sistema de Transporte Inteligente • Valle de Ubaté
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setModoOscuro((actual) => !actual)}
            aria-label={modoOscuro ? 'Activar modo claro' : 'Activar modo oscuro'}
            title={modoOscuro ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            className="flex items-center gap-1.5 rounded-xl border border-cyan-500/30 bg-slate-900 px-2.5 py-1.5 text-amber-300 transition hover:border-cyan-400 hover:text-amber-200 cursor-pointer"
          >
            {modoOscuro ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
            <span className="hidden text-[10px] font-bold sm:inline">{modoOscuro ? 'Claro' : 'Oscuro'}</span>
          </button>

          <button
            onClick={() => setIsMobileFrame(!isMobileFrame)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-500/30 hover:border-cyan-400 transition cursor-pointer font-bold text-[10px] sm:text-[11px] shadow-sm active:scale-95"
            title={isMobileFrame ? 'Expandir a pantalla completa' : 'Ver en marco de simulador móvil'}
          >
            {isMobileFrame ? (
              <>
                <Maximize2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Pantalla Completa</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Simulador Móvil</span>
              </>
            )}
          </button>

          <button
            onClick={() => setIsCodeModalOpen(true)}
            className="hidden md:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition cursor-pointer text-[11px]"
            title="Ver app.json, firestore.rules y arquitectura nativa"
          >
            <Code2 className="w-3.5 h-3.5 text-blue-400" />
            <span>Arquitectura Expo</span>
          </button>
        </div>
      </div>

      {isMobileFrame ? (
        <div className="flex-1 flex items-center justify-center p-2 sm:p-5 bg-[radial-gradient(circle_at_top,_rgba(6,182,212,0.18),_transparent_30%),_#04070d] min-h-0">
          <div className="mobile-frame w-full max-w-[390px] h-[min(92vh,860px)] bg-[#060a12] border-[8px] border-slate-900/95 rounded-[40px] shadow-[0_0_45px_rgba(6,182,212,0.18),0_20px_40px_rgba(0,0,0,0.7)] overflow-hidden flex flex-col relative ring-1 ring-cyan-500/20">
            <div className="h-9 bg-[#060a12] px-4 flex items-center justify-between shrink-0 z-50 text-[10px] font-semibold text-slate-300 select-none">
              <span className="font-mono tracking-tight text-white font-bold">{currentTime}</span>

              <div className="w-24 h-5 bg-black rounded-full border border-slate-800/80 flex items-center justify-center px-2 gap-1.5 shadow-inner">
                <span className="w-2 h-2 rounded-full bg-slate-950 border border-slate-800" />
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500/80 animate-pulse" />
              </div>

              <div className="flex items-center gap-1.5 text-slate-300">
                <span className="text-[9px] font-bold font-mono">5G</span>
                <Wifi className="w-3 h-3 text-cyan-300" />
                <div className="w-5 h-2.5 border border-slate-400 rounded-sm p-0.5 flex items-center">
                  <div className="h-full w-full bg-emerald-400 rounded-[1px]" />
                </div>
              </div>
            </div>

            <div className="flex-1 flex flex-col min-h-0 overflow-x-hidden overflow-y-auto bg-[#060a12] relative">
              <RootNavigator />
            </div>

            <div className="h-4 bg-[#060a12] flex items-center justify-center shrink-0 z-50">
              <div className="w-28 h-1 bg-slate-600/70 rounded-full" />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col min-h-0 bg-[#060a12]">
          <RootNavigator />
        </div>
      )}

      <CodeExplorerModal
        isOpen={isCodeModalOpen}
        onClose={() => setIsCodeModalOpen(false)}
      />
    </div>
  );
}
