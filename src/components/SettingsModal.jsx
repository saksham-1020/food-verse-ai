import React, { useState } from 'react';
import { X, Key, Cpu, ShieldCheck } from 'lucide-react';
import { getStoredConfig, saveConfig } from '../services/aiService';

export default function SettingsModal({ isOpen, onClose, onSave }) {
  if (!isOpen) return null;

  const current = getStoredConfig();
  const [provider, setProvider] = useState(current.provider);
  const [geminiKey, setGeminiKey] = useState(current.geminiKey);
  const [groqKey, setGroqKey] = useState(current.groqKey);
  const [geminiModel, setGeminiModel] = useState(current.geminiModel);

  const handleSave = () => {
    saveConfig({ provider, geminiKey, groqKey, geminiModel });
    onSave(provider);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-[#1E293B] border border-white/10 rounded-2xl shadow-2xl p-6 text-slate-100">
        
        <div className="flex items-center justify-between pb-4 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-lg">AI Vision Provider Settings</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 py-4 text-sm">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              Operating Mode
            </label>
            <select
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="Demo Mode">Standalone Demonstration Mode (Zero Key Needed)</option>
              <option value="Google Gemini">Google Gemini 1.5 (Multimodal Vision)</option>
              <option value="Groq">Groq (LLaMA-3.2 Vision Preview)</option>
            </select>
            <p className="text-xs text-slate-400 mt-1">
              {provider === "Demo Mode" 
                ? "💡 Instant zero-latency simulations with rich food-science data, HACCP logs, and charts."
                : "⚡ Queries live vision models with real-time multimodal image decomposition."}
            </p>
          </div>

          {provider === "Google Gemini" && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase">
                  Gemini API Key
                </label>
                <input
                  type="password"
                  placeholder="AIzaSy..."
                  value={geminiKey}
                  onChange={(e) => setGeminiKey(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase">Model</label>
                <select
                  value={geminiModel}
                  onChange={(e) => setGeminiModel(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs"
                >
                  <option value="gemini-1.5-flash">gemini-1.5-flash (Fast & Multimodal)</option>
                  <option value="gemini-1.5-pro">gemini-1.5-pro (High Reasoning)</option>
                </select>
              </div>
            </div>
          )}

          {provider === "Groq" && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase">
                Groq API Key
              </label>
              <input
                type="password"
                placeholder="gsk_..."
                value={groqKey}
                onChange={(e) => setGroqKey(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-md active:scale-95"
          >
            Save Settings
          </button>
        </div>

      </div>
    </div>
  );
}
