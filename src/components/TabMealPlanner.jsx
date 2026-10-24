import React, { useState, useMemo } from 'react';
import { computeMetabolics, generateWeeklySchedule } from '../services/aiService';
import { Calendar, Download, CheckSquare, Square, Flame, Target, User, Activity } from 'lucide-react';

export default function TabMealPlanner() {
  const [age, setAge] = useState(28);
  const [gender, setGender] = useState("Male");
  const [weightKg, setWeightKg] = useState(74);
  const [heightCm, setHeightCm] = useState(176);
  const [activityMult, setActivityMult] = useState(1.55); // Moderate
  const [goalDelta, setGoalDelta] = useState(-0.15); // Moderate fat loss
  const [dietType, setDietType] = useState("Balanced Omnivore");
  const [activeDay, setActiveDay] = useState("Monday");
  const [checkedItems, setCheckedItems] = useState({});

  // Compute metabolic targets
  const metabolics = useMemo(() => {
    return computeMetabolics(age, gender, weightKg, heightCm, activityMult, goalDelta, dietType);
  }, [age, gender, weightKg, heightCm, activityMult, goalDelta, dietType]);

  // Generate 7-day schedule & groceries
  const weeklyPlan = useMemo(() => {
    return generateWeeklySchedule(dietType);
  }, [dietType]);

  const toggleCheck = (item) => {
    setCheckedItems(prev => ({ ...prev, [item]: !prev[item] }));
  };

  const downloadGroceryList = () => {
    let text = `=== FOOD VERSE AI CONSOLIDATED GROCERY REQUISITION ===\nTarget Protocol: ${dietType} (${metabolics.targetCalories} kcal/day)\n\n`;
    Object.entries(weeklyPlan.groceries).forEach(([cat, items]) => {
      text += `[${cat.toUpperCase()}]\n`;
      items.forEach(item => {
        text += `- ${item}\n`;
      });
      text += `\n`;
    });
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `foodverse_grocery_cart_${dietType.toLowerCase().replace(/ /g, "_")}.txt`;
    a.click();
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Calendar className="w-7 h-7 text-emerald-400" />
          Adaptive 7-Day Meal Planner & Metabolic Engine
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Epic 5 • Scientific Mifflin-St Jeor BMR/TDEE Equations, Goal-Specific Macro Distribution & Automated Grocery Cart
        </p>
      </div>

      {/* Biometrics Form & Macro Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Form Inputs: 7 cols */}
        <div className="lg:col-span-7 glass-panel p-6 rounded-2xl space-y-4">
          <h3 className="font-semibold text-sm text-emerald-400 uppercase tracking-wider flex items-center gap-2">
            <User className="w-4 h-4" /> 1. User Biometrics & Lifestyle Profile
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="text-xs text-slate-300 block mb-1">Age (yrs)</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="text-xs text-slate-300 block mb-1">Biological Sex</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-300 block mb-1">Weight (kg)</label>
              <input
                type="number"
                value={weightKg}
                onChange={(e) => setWeightKg(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="text-xs text-slate-300 block mb-1">Height (cm)</label>
              <input
                type="number"
                value={heightCm}
                onChange={(e) => setHeightCm(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div>
              <label className="text-xs text-slate-300 block mb-1">Activity Level</label>
              <select
                value={activityMult}
                onChange={(e) => setActivityMult(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white"
              >
                <option value={1.2}>Sedentary (Desk Job)</option>
                <option value={1.375}>Lightly Active (1-3 d/wk)</option>
                <option value={1.55}>Moderately Active (3-5 d/wk)</option>
                <option value={1.725}>Very Active (6-7 d/wk)</option>
                <option value={1.9}>Athlete / Physical Job</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-300 block mb-1">Dietary Constraint</label>
              <select
                value={dietType}
                onChange={(e) => setDietType(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white"
              >
                <option value="Balanced Omnivore">Balanced Omnivore</option>
                <option value="Lacto-Vegetarian">Lacto-Vegetarian</option>
                <option value="Vegan / Plant-Based">Vegan / Plant-Based</option>
                <option value="Ketogenic">Ketogenic (High Fat)</option>
                <option value="Diabetic-Friendly / Low-GI">Diabetic-Friendly</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-300 block mb-1">Fitness Goal</label>
              <select
                value={goalDelta}
                onChange={(e) => setGoalDelta(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white"
              >
                <option value={-0.25}>Aggressive Fat Loss (-25%)</option>
                <option value={-0.15}>Moderate Fat Loss (-15%)</option>
                <option value={0.0}>Maintenance (Recomp)</option>
                <option value={0.10}>Lean Muscle Gain (+10%)</option>
                <option value={0.20}>Muscle Bulk (+20%)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Metabolic Dashboard: 5 cols */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-sm text-emerald-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Target className="w-4 h-4" /> 2. Metabolic Prescription
            </h3>

            <div className="grid grid-cols-3 gap-2 text-center mb-4">
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase block">BMR Rate</span>
                <span className="text-base font-bold text-slate-200">{metabolics.bmr} <span className="text-[10px]">kcal</span></span>
              </div>

              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase block">Daily TDEE</span>
                <span className="text-base font-bold text-slate-200">{metabolics.tdee} <span className="text-[10px]">kcal</span></span>
              </div>

              <div className="p-3 bg-emerald-950/80 rounded-xl border border-emerald-800">
                <span className="text-[10px] text-emerald-400 uppercase block font-bold">Goal Target</span>
                <span className="text-base font-black text-emerald-400">{metabolics.targetCalories} <span className="text-[10px]">kcal</span></span>
              </div>
            </div>

            {/* Daily Macro Grams */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300">Target Protein ({metabolics.pPercent}%)</span>
                <strong className="text-emerald-400">{metabolics.proteinG}g / day</strong>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                <div style={{ width: `${metabolics.pPercent}%` }} className="bg-emerald-500 h-full"></div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-slate-300">Target Carbs ({metabolics.cPercent}%)</span>
                <strong className="text-blue-400">{metabolics.carbsG}g / day</strong>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                <div style={{ width: `${metabolics.cPercent}%` }} className="bg-blue-500 h-full"></div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-slate-300">Target Healthy Fats ({metabolics.fPercent}%)</span>
                <strong className="text-amber-400">{metabolics.fatG}g / day</strong>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                <div style={{ width: `${metabolics.fPercent}%` }} className="bg-amber-500 h-full"></div>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 mt-4">
            Equation: Mifflin-St Jeor formula calibrated for physical activity and thermic effect of food.
          </p>
        </div>

      </div>

      {/* 7-Day Meal Calendar */}
      <div className="glass-panel p-6 rounded-2xl space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-lg text-white">🗓️ Adaptive 7-Day Meal Calendar</h3>
          <span className="text-xs px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
            Protocol: {dietType}
          </span>
        </div>

        {/* Day Pills */}
        <div className="flex flex-wrap gap-2">
          {Object.keys(weeklyPlan.schedule).map(day => (
            <button
              key={day}
              onClick={() => setActiveDay(day)}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                activeDay === day
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30"
                  : "bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              {day}
            </button>
          ))}
        </div>

        {/* Selected Day Meals Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-1.5">
              🌅 Breakfast
            </span>
            <p className="text-xs text-slate-200 leading-relaxed">
              {weeklyPlan.schedule[activeDay]?.Breakfast}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block mb-1.5">
              ☀️ Lunch
            </span>
            <p className="text-xs text-slate-200 leading-relaxed">
              {weeklyPlan.schedule[activeDay]?.Lunch}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block mb-1.5">
              🌙 Dinner
            </span>
            <p className="text-xs text-slate-200 leading-relaxed">
              {weeklyPlan.schedule[activeDay]?.Dinner}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
            <span className="text-xs font-bold text-purple-400 uppercase tracking-wider block mb-1.5">
              🍎 Fuel Snack
            </span>
            <p className="text-xs text-slate-200 leading-relaxed">
              {weeklyPlan.schedule[activeDay]?.Snack}
            </p>
          </div>
        </div>

      </div>

      {/* Automated Consolidated Grocery Shopping List */}
      <div className="glass-panel p-6 rounded-2xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-700">
          <div>
            <h3 className="font-bold text-lg text-white">🛒 Consolidated Weekly Grocery Shopping Cart</h3>
            <p className="text-xs text-slate-400 mt-0.5">Automated pantry requisitions grouped by supermarket aisle.</p>
          </div>

          <button
            onClick={downloadGroceryList}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 text-xs font-semibold flex items-center gap-2 self-start sm:self-center transition-all"
          >
            <Download className="w-4 h-4" />
            Download Shopping List (.txt)
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(weeklyPlan.groceries).map(([category, items]) => (
            <div key={category} className="space-y-2">
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">
                📦 {category}
              </h4>
              <div className="space-y-1.5">
                {items.map((item, idx) => {
                  const isChecked = !!checkedItems[item];
                  return (
                    <button
                      key={idx}
                      onClick={() => toggleCheck(item)}
                      className={`w-full flex items-center gap-2 p-2 rounded-lg text-xs text-left transition-all ${
                        isChecked
                          ? "bg-emerald-950/40 text-slate-500 line-through border border-emerald-900/40"
                          : "bg-slate-900/60 text-slate-300 hover:bg-slate-900 border border-slate-800"
                      }`}
                    >
                      {isChecked ? (
                        <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-500 shrink-0" />
                      )}
                      <span>{item}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
}
