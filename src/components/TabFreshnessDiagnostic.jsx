import React, { useState } from 'react';
import { analyzeFreshness } from '../services/aiService';
import { Microscope, AlertTriangle, ShieldCheck, ThermometerSnowflake, Info, CheckCircle2 } from 'lucide-react';

export default function TabFreshnessDiagnostic() {
  const [selectedPreset, setSelectedPreset] = useState("apple");
  const [category, setCategory] = useState("Fruits & Berries");
  const [customImage, setCustomImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const presetImages = {
    apple: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=700&auto=format&fit=crop&q=80",
    chicken: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=700&auto=format&fit=crop&q=80",
    strawberries: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=700&auto=format&fit=crop&q=80"
  };

  const handlePresetSelect = (id, cat) => {
    setSelectedPreset(id);
    setCategory(cat);
    setCustomImage(null);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setCustomImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleRunDiagnostic = async () => {
    setLoading(true);
    try {
      const img = customImage || presetImages[selectedPreset];
      const res = await analyzeFreshness(img, category);
      setResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const activeImage = customImage || presetImages[selectedPreset];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Microscope className="w-7 h-7 text-emerald-400" />
          Perishable Freshness & Spoilage Diagnostics
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Epic 3 • Computer Vision Epidermal Texture, Oxidation Browning, Mold Pathogen Detection & Shelf-Life Advisory
        </p>
      </div>

      {/* Input Selection Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        <div className="lg:col-span-5 glass-panel p-5 rounded-2xl space-y-5">
          <h3 className="font-semibold text-sm text-emerald-400 uppercase tracking-wider">
            1. Perishable Item Input
          </h3>

          <div className="space-y-3">
            <label className="text-xs text-slate-300 font-medium">Curated Freshness Scenarios</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handlePresetSelect("apple", "Fruits & Berries")}
                className={`p-2.5 text-xs font-semibold rounded-lg border text-center transition-all ${
                  selectedPreset === "apple" && !customImage
                    ? "bg-emerald-600/30 border-emerald-500 text-emerald-300"
                    : "bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white"
                }`}
              >
                Gala Apple <span className="block text-[10px] text-emerald-400 font-normal">Fresh</span>
              </button>

              <button
                onClick={() => handlePresetSelect("chicken", "Meat & Poultry")}
                className={`p-2.5 text-xs font-semibold rounded-lg border text-center transition-all ${
                  selectedPreset === "chicken" && !customImage
                    ? "bg-amber-600/30 border-amber-500 text-amber-300"
                    : "bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white"
                }`}
              >
                Raw Poultry <span className="block text-[10px] text-amber-400 font-normal">Mod. Fresh</span>
              </button>

              <button
                onClick={() => handlePresetSelect("strawberries", "Fruits & Berries")}
                className={`p-2.5 text-xs font-semibold rounded-lg border text-center transition-all ${
                  selectedPreset === "strawberries" && !customImage
                    ? "bg-red-600/30 border-red-500 text-red-300"
                    : "bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white"
                }`}
              >
                Strawberries <span className="block text-[10px] text-red-400 font-normal">Spoiled</span>
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-300 font-medium block mb-1.5">Category Designation</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
            >
              <option value="Fruits & Berries">Fruits & Berries</option>
              <option value="Vegetables & Greens">Vegetables & Greens</option>
              <option value="Meat & Poultry">Meat & Poultry</option>
              <option value="Dairy & Cheeses">Dairy & Cheeses</option>
              <option value="Bakery">Bakery & Grains</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-slate-300 font-medium block mb-1.5">Or Upload Perishable Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="w-full text-xs text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-emerald-400 hover:file:bg-slate-700"
            />
          </div>

          <button
            onClick={handleRunDiagnostic}
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 active:scale-98 transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                <span>Scanning Epidermal Texture & Spores...</span>
              </>
            ) : (
              <>
                <Microscope className="w-4 h-4" />
                <span>Run Spoilage & Pathogen Diagnostic</span>
              </>
            )}
          </button>
        </div>

        {/* Right Preview with Simulated CV Heatmap Overlay */}
        <div className="lg:col-span-7 glass-panel p-5 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm text-slate-300">Surface Defect & Texture Mapping</h3>
              <span className="text-xs text-slate-400">CV Texture Scan</span>
            </div>
            
            <div className="relative rounded-xl overflow-hidden aspect-video bg-black/40 border border-slate-700 shadow-inner flex items-center justify-center">
              <img
                src={activeImage}
                alt="Perishable Item"
                className="w-full h-full object-cover"
              />
              
              {/* Overlay Defect Circles if result is available */}
              {result?.defect_zones?.map((zone, i) => (
                <div
                  key={i}
                  style={{
                    left: `${zone.x}%`,
                    top: `${zone.y}%`,
                    width: `${zone.radius * 2}px`,
                    height: `${zone.radius * 2}px`,
                    transform: "translate(-50%, -50%)"
                  }}
                  className={`absolute rounded-full border-2 flex items-center justify-center animate-pulse pointer-events-none ${
                    zone.isWarning
                      ? "border-red-500 bg-red-500/20 text-red-200"
                      : "border-emerald-400 bg-emerald-500/20 text-emerald-200"
                  }`}
                >
                  <span className="text-[10px] font-bold bg-black/80 px-1.5 py-0.5 rounded shadow">
                    {zone.label}
                  </span>
                </div>
              ))}

              <div className="absolute bottom-2 left-2 px-3 py-1 bg-black/70 backdrop-blur-md rounded-md text-xs text-slate-200">
                {customImage ? "User Perishable Item" : `Curated Sample: ${selectedPreset.toUpperCase()}`}
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-400 mt-3">
            Green circles indicate intact cellular turgor; red highlights indicate fungal hyphae or oxidation necrosis.
          </p>
        </div>

      </div>

      {/* Results Section */}
      {result && (
        <div className="space-y-6 animate-slideUp">
          
          {/* Freshness Banner */}
          <div className={`p-6 rounded-2xl border ${
            result.freshness_stage === "Fresh"
              ? "bg-emerald-950/60 border-emerald-500/50"
              : result.freshness_stage === "Moderately Fresh"
              ? "bg-amber-950/60 border-amber-500/50"
              : "bg-red-950/70 border-red-500/60"
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs uppercase font-mono tracking-wider font-semibold opacity-80">
                  Perishable Diagnostic Result
                </span>
                <h3 className="text-2xl font-black text-white mt-0.5 flex items-center gap-2">
                  <span>{result.freshness_stage === "Fresh" ? "🟢" : result.freshness_stage === "Moderately Fresh" ? "🟡" : "🔴"}</span>
                  {result.freshness_stage.toUpperCase()} • {result.item_name}
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Category: <strong>{result.category}</strong> • Diagnostic Confidence: <strong>{Math.round(result.confidence * 100)}%</strong>
                </p>
              </div>

              <div className="bg-black/40 px-5 py-3 rounded-xl border border-white/10 text-right">
                <div className="text-[11px] text-slate-400 uppercase font-bold">Safety Directive</div>
                <div className="text-lg font-black text-white mt-0.5">{result.safety_status}</div>
              </div>
            </div>
          </div>

          {/* Key Metrics Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="glass-panel p-4 rounded-xl">
              <div className="text-xs text-slate-400 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                Pathogen Hazard Profile
              </div>
              <div className="text-lg font-bold text-white mt-1">{result.pathogen_risk_level}</div>
            </div>

            <div className="glass-panel p-4 rounded-xl">
              <div className="text-xs text-slate-400 flex items-center gap-1.5">
                <ThermometerSnowflake className="w-4 h-4 text-blue-400" />
                Estimated Shelf-Life
              </div>
              <div className="text-lg font-bold text-white mt-1">{result.estimated_shelf_life}</div>
            </div>

            <div className="glass-panel p-4 rounded-xl">
              <div className="text-xs text-slate-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Consumability Risk
              </div>
              <div className="text-lg font-bold text-white mt-1">{result.safety_status}</div>
            </div>
          </div>

          {/* Biophysical Indicators Grid */}
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Visual Biophysical Indicators
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                <span className="text-xs font-bold text-slate-300 block mb-1">Surface Texture</span>
                <p className="text-xs text-slate-400 leading-relaxed">{result.surface_texture}</p>
              </div>

              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                <span className="text-xs font-bold text-slate-300 block mb-1">Discoloration & Oxidation</span>
                <p className="text-xs text-slate-400 leading-relaxed">{result.discoloration_level}</p>
              </div>

              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                <span className="text-xs font-bold text-slate-300 block mb-1">Wrinkling & Turgor</span>
                <p className="text-xs text-slate-400 leading-relaxed">{result.wrinkling_dehydration}</p>
              </div>

              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                <span className="text-xs font-bold text-slate-300 block mb-1">Mold & Fungal Growth</span>
                <p className="text-xs text-slate-400 leading-relaxed">{result.mold_fungal_growth}</p>
              </div>
            </div>

            {/* Microbial Pathology */}
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-700 text-xs mt-4">
              <div className="font-bold text-amber-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Info className="w-4 h-4" /> Microbial Pathology & Toxicity Analysis
              </div>
              <p className="text-slate-300 leading-relaxed">{result.microbial_hazard_summary}</p>
            </div>

            {/* Preservation Tips */}
            <div className="pt-2">
              <h5 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">
                Preservation & Cold-Chain Storage Protocols
              </h5>
              <div className="space-y-1.5">
                {result.storage_preservation_tips?.map((tip, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
