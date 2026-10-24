import React from 'react';
import { Sparkles, Settings, ShieldCheck, Activity } from 'lucide-react';

export default function Navbar({ activeProvider, onOpenSettings }) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#0F172A]/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Capstone ID */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <span className="text-2xl">🥗</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-white tracking-tight">Food Verse AI</h1>
              <span className="text-xs bg-emerald-950/80 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded-full font-mono font-medium">
                v2.4
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Skill Wallet Capstone 3 • Platform ID: <span className="font-mono text-emerald-400">6ac4ca021dcde6d7857c169a</span>
            </p>
          </div>
        </div>

        {/* Status Indicator & Settings Trigger */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-xs text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Mode: <strong>{activeProvider === "Demo Mode" ? "Standalone Demo" : activeProvider}</strong></span>
          </div>

          <button
            onClick={onOpenSettings}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md transition-all active:scale-95"
          >
            <Settings className="w-4 h-4" />
            <span>AI Config</span>
          </button>
        </div>

      </div>
    </header>
  );
}
