import React, { useState } from 'react';
import { analyzeNutrition } from '../services/aiService';
import { Salad, Flame, ShieldAlert, Award, Sparkles, CheckCircle2 } from 'lucide-react';

export default function TabNutritionAudit() {
  const [selectedPreset, setSelectedPreset] = useState("salmon");
  const [userNotes, setUserNotes] = useState("Wild Mediterranean Salmon Quinoa Bowl");
  const [customImage, setCustomImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // Preset visuals
  const presetVisuals = {
    salmon: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=700&auto=format&fit=crop&q=80",
    paneer: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=700&auto=format&fit=crop&q=80",
    chicken: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=700&auto=format&fit=crop&q=80"
  };

  const handlePresetChange = (preset) => {
    setSelectedPreset(preset);
    setCustomImage(null);
    if (preset === "salmon") setUserNotes("Wild Mediterranean Salmon Quinoa Bowl");
    if (preset === "paneer") setUserNotes("Shahi Paneer with Multigrain Roti and Jeera Rice");
    if (preset === "chicken") setUserNotes("Grilled Herb Chicken Caesar Salad");
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const img = customImage || presetVisuals[selectedPreset];
      const res = await analyzeNutrition(img, userNotes);
      setResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const activeImage = customImage || presetVisuals[selectedPreset];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Salad className="w-7 h-7 text-emerald-400" />
          Food Recognition & Clinical Nutrition Audit
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Epic 2 • Multimodal Computer Vision Dish Identification, Portion Decomposition & Composite Health Scoring (1–100)
        </p>
      </div>

      {/* Input Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Form: 5 cols */}
        <div className="lg:col-span-5 glass-panel p-5 rounded-2xl space-y-5">
          <h3 className="font-semibold text-sm text-emerald-400 uppercase tracking-wider">
            1. Select or Upload Meal Plate
          </h3>

          <div className="space-y-3">
            <label className="text-xs text-slate-300 font-medium">Curated Meal Archetypes</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "salmon", label: "Salmon Bowl" },
                { id: "paneer", label: "Shahi Paneer" },
                { id: "chicken", label: "Chicken Salad" }
              ].map(p => (
                <button
                  key={p.id}
                  onClick={() => handlePresetChange(p.id)}
                  className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-all ${
                    selectedPreset === p.id && !customImage
                      ? "bg-emerald-600/30 border-emerald-500 text-emerald-300"
                      : "bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-300 font-medium block mb-1.5">Or Upload Custom Meal Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="w-full text-xs text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-emerald-400 hover:file:bg-slate-700"
            />
          </div>

          <div>
            <label className="text-xs text-slate-300 font-medium block mb-1.5">Dietary Context / Dining Notes</label>
            <input
              type="text"
              value={userNotes}
              onChange={(e) => setUserNotes(e.target.value)}
              placeholder="e.g. Homemade, light olive oil..."
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 active:scale-98 transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                <span>Auditing Nutrition & Ingredients...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Run Multimodal Nutrition Audit</span>
              </>
            )}
          </button>
        </div>

        {/* Right Preview: 7 cols */}
        <div className="lg:col-span-7 glass-panel p-5 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm text-slate-300">Visual Plate Inspection View</h3>
              <span className="text-xs text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800 font-mono">
                Multimodal Ready
              </span>
            </div>
            <div className="relative rounded-xl overflow-hidden aspect-video bg-black/40 border border-slate-700/60 shadow-inner flex items-center justify-center">
              <img
                src={activeImage}
                alt="Analyzed Meal"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-2 px-3 py-1 bg-black/70 backdrop-blur-md rounded-md text-xs text-slate-200">
                {customImage ? "User Uploaded Visual" : `Preset Sample: ${selectedPreset.toUpperCase()}`}
              </div>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-3">
            Tip: Click <strong>Run Multimodal Nutrition Audit</strong> to deconstruct calories, macronutrients, and allergy vectors.
          </p>
        </div>

      </div>

      {/* Analysis Results */}
      {result && (
        <div className="space-y-6 animate-slideUp">
          <div className="glass-panel p-6 rounded-2xl border-emerald-500/30">
            
            {/* Dish Title & Health Score */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-700">
              <div>
                <span className="text-xs text-emerald-400 font-semibold tracking-wider uppercase">Audit Verified</span>
                <h3 className="text-2xl font-extrabold text-white mt-1">{result.dish_name}</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Cuisine Archetype: <strong className="text-slate-200">{result.cuisine}</strong> • Portion: <strong className="text-slate-200">{result.estimated_portion_grams}g</strong> • Vision Confidence: <strong className="text-emerald-400">{Math.round(result.confidence * 100)}%</strong>
                </p>
              </div>

              {/* Health Score Pill */}
              <div className="flex items-center gap-4 bg-slate-900/90 px-5 py-3 rounded-xl border border-slate-700">
                <Award className="w-8 h-8 text-emerald-400" />
                <div>
                  <div className="text-xs text-slate-400 font-medium">Composite Health Score</div>
                  <div className="text-2xl font-black text-emerald-400">{result.health_score} <span className="text-sm font-normal text-slate-400">/ 100</span></div>
                </div>
              </div>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 py-4">
              {result.health_badges?.map((b, i) => (
                <span key={i} className="text-xs px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 font-semibold">
                  ★ {b}
                </span>
              ))}
              {result.dietary_tags?.map((d, i) => (
                <span key={i} className="text-xs px-2.5 py-1 rounded-full bg-blue-950 text-blue-300 border border-blue-800">
                  #{d}
                </span>
              ))}
            </div>

            {/* Macros Metric Row */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
              <div className="glass-panel p-3 rounded-xl text-center">
                <div className="text-xs text-slate-400 flex items-center justify-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-amber-400" /> Calories
                </div>
                <div className="text-xl font-bold text-white mt-1">{result.macros?.calories} <span className="text-xs font-normal text-slate-400">kcal</span></div>
              </div>

              <div className="glass-panel p-3 rounded-xl text-center">
                <div className="text-xs text-slate-400">Protein</div>
                <div className="text-xl font-bold text-emerald-400 mt-1">{result.macros?.protein}g</div>
              </div>

              <div className="glass-panel p-3 rounded-xl text-center">
                <div className="text-xs text-slate-400">Carbohydrates</div>
                <div className="text-xl font-bold text-blue-400 mt-1">{result.macros?.carbohydrates}g</div>
              </div>

              <div className="glass-panel p-3 rounded-xl text-center">
                <div className="text-xs text-slate-400">Fats</div>
                <div className="text-xl font-bold text-amber-400 mt-1">{result.macros?.fats}g</div>
              </div>

              <div className="glass-panel p-3 rounded-xl text-center">
                <div className="text-xs text-slate-400">Dietary Fiber</div>
                <div className="text-xl font-bold text-emerald-300 mt-1">{result.macros?.fiber}g</div>
              </div>
            </div>

            {/* Energy Distribution Bar */}
            <div className="mt-6 pt-4 border-t border-slate-700">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span>Calorie Macro Composition</span>
                <span>Protein (4 cal/g) • Carbs (4 cal/g) • Fat (9 cal/g)</span>
              </div>
              <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden flex">
                <div
                  style={{ width: `${Math.round(((result.macros?.protein * 4) / result.macros?.calories) * 100)}%` }}
                  className="bg-emerald-500 h-full"
                  title="Protein"
                ></div>
                <div
                  style={{ width: `${Math.round(((result.macros?.carbohydrates * 4) / result.macros?.calories) * 100)}%` }}
                  className="bg-blue-500 h-full"
                  title="Carbs"
                ></div>
                <div
                  style={{ width: `${Math.round(((result.macros?.fats * 9) / result.macros?.calories) * 100)}%` }}
                  className="bg-amber-500 h-full"
                  title="Fat"
                ></div>
              </div>
            </div>

            {/* Ingredients & Allergens Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              
              {/* Ingredients */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Identified Dish Components</h4>
                <div className="space-y-1.5">
                  {result.ingredients?.map((ing, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 text-xs border border-slate-800">
                      <span className="font-medium text-slate-200">{ing.name} <span className="text-slate-400">({ing.portion})</span></span>
                      <span className="text-emerald-400 font-mono">~{ing.estimated_calories} kcal</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Allergen Alerts */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  Allergen & Sensitivity Warnings
                </h4>
                <div className="space-y-2">
                  {result.allergen_alerts?.length > 0 ? (
                    result.allergen_alerts.map((al, i) => (
                      <div key={i} className="p-2.5 rounded-lg bg-red-950/40 border border-red-800/60 text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <strong className="text-red-300">{al.allergen}</strong>
                          <span className="px-1.5 py-0.5 rounded text-[10px] bg-red-900 text-red-200 uppercase font-bold">{al.severity} Risk</span>
                        </div>
                        <p className="text-slate-300 text-[11px]">{al.warning_text}</p>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-800 text-xs text-emerald-300 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      No standard high-risk food allergens identified.
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Nutritionist Assessment */}
            <div className="mt-6 p-4 rounded-xl bg-slate-900/80 border border-slate-700/80 text-xs">
              <span className="font-bold text-emerald-400 uppercase tracking-wider text-[11px] block mb-1">
                Clinical Nutritionist Assessment
              </span>
              <p className="text-slate-300 leading-relaxed">{result.nutritionist_assessment}</p>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
