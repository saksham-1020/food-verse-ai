import React, { useState } from 'react';
import Navbar from './components/Navbar';
import SettingsModal from './components/SettingsModal';
import TabNutritionAudit from './components/TabNutritionAudit';
import TabFreshnessDiagnostic from './components/TabFreshnessDiagnostic';
import TabKitchenHygiene from './components/TabKitchenHygiene';
import TabRecipeAssistant from './components/TabRecipeAssistant';
import TabMealPlanner from './components/TabMealPlanner';
import TabArchitecture from './components/TabArchitecture';
import { getStoredConfig } from './services/aiService';
import { Salad, Microscope, ShieldCheck, ChefHat, Calendar, Layers } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState("nutrition");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeProvider, setActiveProvider] = useState(() => getStoredConfig().provider);

  const tabs = [
    { id: "nutrition", label: "Nutrition Audit", epic: "Epic 2", icon: Salad },
    { id: "freshness", label: "Freshness Diagnostic", epic: "Epic 3", icon: Microscope },
    { id: "hygiene", label: "Kitchen Safety", epic: "Epic 4", icon: ShieldCheck },
    { id: "recipes", label: "Recipe Assistant", epic: "Epic 4", icon: ChefHat },
    { id: "planner", label: "Meal Planner", epic: "Epic 5", icon: Calendar },
    { id: "architecture", label: "System Architecture", epic: "Verification", icon: Layers },
  ];

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-white">
      
      {/* Navigation Header */}
      <Navbar
        activeProvider={activeProvider}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Hero Banner */}
        <div className="relative rounded-3xl overflow-hidden p-6 sm:p-8 border border-emerald-500/30 bg-gradient-to-br from-emerald-950 via-[#0F172A] to-slate-900 shadow-2xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 text-xs font-semibold">
                <span>Skill Wallet Capstone Project 3</span>
                <span>•</span>
                <span className="font-mono">Platform ID: 6ac4ca021dcde6d7857c169a</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Food Verse AI <span className="text-emerald-400 font-extrabold text-2xl sm:text-3xl">— Multimodal Food Intelligence Agent</span>
              </h1>
              <p className="text-sm text-slate-300 leading-relaxed">
                An integrated multimodal intelligence ecosystem analyzing food images, kitchen video frames, and dietary profiles 
                to audit dish nutrition, detect perishables spoilage, enforce commercial kitchen HACCP safety, synthesize zero-waste recipes, 
                and prescribe personalized metabolic meal plans.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-2 shrink-0">
              <div className="px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-xs flex items-center justify-between gap-4">
                <span className="text-slate-400">Target Host:</span>
                <span className="font-bold text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-white"></span>
                  Vercel Edge Ready
                </span>
              </div>

              <div className="px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-xs flex items-center justify-between gap-4">
                <span className="text-slate-400">Vision Mode:</span>
                <span className="font-bold text-emerald-400">{activeProvider}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation Pill Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-800">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap active:scale-95 ${
                  isActive
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 border border-emerald-500"
                    : "bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 border border-slate-800"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-emerald-400"}`} />
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                  isActive ? "bg-emerald-800 text-emerald-200" : "bg-slate-800 text-slate-500"
                }`}>
                  {tab.epic}
                </span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Display */}
        <div className="pb-12">
          {activeTab === "nutrition" && <TabNutritionAudit />}
          {activeTab === "freshness" && <TabFreshnessDiagnostic />}
          {activeTab === "hygiene" && <TabKitchenHygiene />}
          {activeTab === "recipes" && <TabRecipeAssistant />}
          {activeTab === "planner" && <TabMealPlanner />}
          {activeTab === "architecture" && <TabArchitecture />}
        </div>

      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-800/80 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <p>Food Verse AI • Skill Wallet Capstone Project 3 • Platform ID: <span className="text-slate-400 font-mono">6ac4ca021dcde6d7857c169a</span></p>
        <p className="mt-1">Deployable on Vercel with zero database dependencies.</p>
      </footer>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSave={(newProvider) => setActiveProvider(newProvider)}
      />

    </div>
  );
}
