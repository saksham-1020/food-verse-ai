import React, { useState } from 'react';
import { generateRecipe } from '../services/aiService';
import { ChefHat, Clock, Flame, Utensils, Download, Recycle, Sparkles, AlertCircle } from 'lucide-react';

export default function TabRecipeAssistant() {
  const [pantryText, setPantryText] = useState("Chicken breast, baby spinach, garlic cloves, extra virgin olive oil, lemon, salt, black pepper");
  const [dietaryGoal, setDietaryGoal] = useState("Balanced / High Protein");
  const [maxTime, setMaxTime] = useState(25);
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState(null);

  const handleQuickPreset = (preset) => {
    if (preset === "protein") {
      setPantryText("Chicken breast, baby spinach, garlic cloves, extra virgin olive oil, lemon, salt, black pepper");
      setDietaryGoal("Balanced / High Protein");
    } else if (preset === "veg") {
      setPantryText("Fresh paneer cubes, day-old cooked basmati rice, bell peppers, red onion, turmeric, cumin, fresh cilantro");
      setDietaryGoal("Lacto-Vegetarian");
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await generateRecipe(pantryText, dietaryGoal, maxTime);
      setRecipe(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const downloadRecipe = () => {
    if (!recipe) return;
    const text = `# ${recipe.recipe_title}
${recipe.description}

**Time:** ${recipe.total_time_min} mins | **Difficulty:** ${recipe.difficulty} | **Servings:** ${recipe.servings}
**Nutrition / serving:** ${recipe.calories_per_serving} kcal | Protein: ${recipe.protein_per_serving}g | Carbs: ${recipe.carbs_per_serving}g | Fats: ${recipe.fats_per_serving}g

## Ingredients
${recipe.ingredients_list.map(i => `- ${i}`).join('\n')}

## Instructions
${recipe.step_by_step_instructions.map((s, idx) => `${idx + 1}. ${s}`).join('\n')}

## Chef Notes
${recipe.chef_safety_notes.map(n => `- ${n}`).join('\n')}
`;
    const blob = new Blob([text], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${recipe.recipe_title.toLowerCase().replace(/ /g, "_")}.md`;
    a.click();
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <ChefHat className="w-7 h-7 text-emerald-400" />
          Smart Kitchen Recipe Assistant & Zero-Waste Coach
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Epic 4 • Pantry-to-Plate Culinary Synthesis, Leftover Rescue, Nutritional Balancing & Smart Substitutions
        </p>
      </div>

      {/* Input Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        <div className="lg:col-span-8 glass-panel p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm text-emerald-400 uppercase tracking-wider">
              1. Available Pantry & Crisper Items
            </h3>
            <div className="flex gap-2">
              <button
                onClick={() => handleQuickPreset("protein")}
                className="text-xs px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 hover:text-white border border-slate-700"
              >
                Preset: Chicken & Greens
              </button>
              <button
                onClick={() => handleQuickPreset("veg")}
                className="text-xs px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 hover:text-white border border-slate-700"
              >
                Preset: Spiced Paneer & Rice
              </button>
            </div>
          </div>

          <textarea
            rows="3"
            value={pantryText}
            onChange={(e) => setPantryText(e.target.value)}
            placeholder="List ingredients in your fridge or pantry (comma separated)..."
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
          ></textarea>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-300 block mb-1">Target Nutritional Style</label>
              <select
                value={dietaryGoal}
                onChange={(e) => setDietaryGoal(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
              >
                <option value="Balanced / High Protein">Balanced / High Protein</option>
                <option value="Low Carb / Keto">Low Carb / Keto</option>
                <option value="Lacto-Vegetarian">Lacto-Vegetarian</option>
                <option value="Vegan / Plant-Based">Vegan / Plant-Based</option>
                <option value="Heart Healthy">Heart Healthy</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-300 block mb-1">
                Max Cooking Time: <strong className="text-emerald-400">{maxTime} mins</strong>
              </label>
              <input
                type="range"
                min="10"
                max="60"
                step="5"
                value={maxTime}
                onChange={(e) => setMaxTime(Number(e.target.value))}
                className="w-full accent-emerald-500"
              />
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 active:scale-98 transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                <span>Chef AI Formulating Zero-Waste Meal...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Synthesize Nutritious Recipe</span>
              </>
            )}
          </button>
        </div>

        {/* Philosophy Card: 4 cols */}
        <div className="lg:col-span-4 glass-panel p-6 rounded-2xl flex flex-col justify-between">
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <Recycle className="w-4 h-4" /> Zero-Waste Culinary Philosophy
            </h4>
            <ul className="text-xs text-slate-300 space-y-2 leading-relaxed">
              <li>• <strong>Rescue Perishables:</strong> Uses up wilting leafy greens and open dairy before spoilage occurs.</li>
              <li>• <strong>Dynamic Substitutions:</strong> Lacking an ingredient? The AI swaps it seamlessly with shelf-stable pantry items.</li>
              <li>• <strong>Micro-Nutrient Retention:</strong> High-heat flash sautéing preserves fragile water-soluble vitamins.</li>
            </ul>
          </div>

          <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800 text-[11px] text-emerald-300 mt-4">
            💡 Using leftover pantry staples saves an estimated $1,500/year per household while shrinking food waste landfills.
          </div>
        </div>

      </div>

      {/* Generated Recipe Card */}
      {recipe && (
        <div className="glass-panel p-6 rounded-2xl border-emerald-500/30 space-y-6 animate-slideUp">
          
          {/* Title Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-700">
            <div>
              <span className="text-xs text-emerald-400 uppercase font-mono font-semibold">Chef Formulation</span>
              <h3 className="text-2xl font-black text-white mt-0.5">{recipe.recipe_title}</h3>
              <p className="text-xs text-slate-300 mt-1">{recipe.description}</p>
            </div>

            <button
              onClick={downloadRecipe}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 text-xs font-semibold flex items-center gap-2 self-start md:self-center transition-all"
            >
              <Download className="w-4 h-4" />
              Download Recipe (.md)
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="glass-panel p-3 rounded-xl text-center">
              <div className="text-xs text-slate-400 flex items-center justify-center gap-1"><Clock className="w-3.5 h-3.5" /> Total Time</div>
              <div className="text-lg font-bold text-white mt-1">{recipe.total_time_min} mins</div>
            </div>

            <div className="glass-panel p-3 rounded-xl text-center">
              <div className="text-xs text-slate-400">Difficulty</div>
              <div className="text-lg font-bold text-emerald-400 mt-1">{recipe.difficulty}</div>
            </div>

            <div className="glass-panel p-3 rounded-xl text-center">
              <div className="text-xs text-slate-400">Servings</div>
              <div className="text-lg font-bold text-white mt-1">{recipe.servings} portions</div>
            </div>

            <div className="glass-panel p-3 rounded-xl text-center">
              <div className="text-xs text-slate-400">Calories / Serv</div>
              <div className="text-lg font-bold text-amber-400 mt-1">{recipe.calories_per_serving} kcal</div>
            </div>

            <div className="glass-panel p-3 rounded-xl text-center">
              <div className="text-xs text-slate-400">Protein / Serv</div>
              <div className="text-lg font-bold text-emerald-400 mt-1">{recipe.protein_per_serving}g</div>
            </div>
          </div>

          {/* Rescued Ingredients Alert */}
          {recipe.pantry_leftovers_used?.length > 0 && (
            <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800 text-xs flex items-center gap-2 text-emerald-300">
              <Recycle className="w-4 h-4 shrink-0" />
              <span>
                <strong>Rescued Pantry Items:</strong> {recipe.pantry_leftovers_used.join(", ")}
              </span>
            </div>
          )}

          {/* Two Columns: Ingredients & Smart Substitutions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Utensils className="w-4 h-4 text-emerald-400" />
                Required Ingredients
              </h4>
              <div className="space-y-1.5">
                {recipe.ingredients_list?.map((ing, i) => (
                  <div key={i} className="p-2.5 rounded-lg bg-slate-900/60 text-xs text-slate-200 border border-slate-800">
                    • {ing}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Smart Ingredient Substitutions
              </h4>
              <div className="space-y-2">
                {recipe.smart_substitutions && Object.entries(recipe.smart_substitutions).map(([orig, sub], i) => (
                  <div key={i} className="p-2.5 rounded-lg bg-slate-900/60 text-xs border border-slate-800">
                    <span className="text-red-400 font-semibold">Missing {orig}?</span>
                    <span className="text-slate-400"> → </span>
                    <span className="text-emerald-300 font-medium">Use {sub}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Step-by-Step Instructions */}
          <div className="space-y-2 pt-2">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Step-by-Step Culinary Instructions
            </h4>
            <div className="space-y-2">
              {recipe.step_by_step_instructions?.map((step, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-200 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                    {i + 1}
                  </span>
                  <p className="mt-0.5 leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Chef Safety Tips */}
          {recipe.chef_safety_notes?.length > 0 && (
            <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-800/80 text-xs text-amber-200 space-y-1">
              <div className="font-bold uppercase tracking-wider flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-400" /> Chef Food Safety & Storage Directives
              </div>
              {recipe.chef_safety_notes.map((note, i) => (
                <p key={i} className="text-slate-300">• {note}</p>
              ))}
            </div>
          )}

        </div>
      )}

    </div>
  );
}
