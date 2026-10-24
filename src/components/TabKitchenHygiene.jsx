import React, { useState } from 'react';
import { auditKitchenHygiene } from '../services/aiService';
import { ShieldCheck, Video, AlertCircle, CheckCircle, Flame, FileText } from 'lucide-react';

export default function TabKitchenHygiene() {
  const [scenario, setScenario] = useState("Compliant");
  const [customImage, setCustomImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const presetImages = {
    Compliant: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=700&auto=format&fit=crop&q=80",
    Violation: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=700&auto=format&fit=crop&q=80"
  };

  const handleScenarioChange = (s) => {
    setScenario(s);
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

  const handleRunAudit = async () => {
    setLoading(true);
    try {
      const img = customImage || presetImages[scenario];
      const res = await auditKitchenHygiene(img, scenario);
      setResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const activeImage = customImage || presetImages[scenario];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-7 h-7 text-emerald-400" />
          Commercial Kitchen Hygiene & Food Safety Compliance
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Epic 4 • Computer Vision HACCP Surveillance: PPE (Hairnets/Gloves), Prep Line Sanitization & Cross-Contamination Auditing
        </p>
      </div>

      {/* Input Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        <div className="lg:col-span-5 glass-panel p-5 rounded-2xl space-y-5">
          <h3 className="font-semibold text-sm text-emerald-400 uppercase tracking-wider">
            1. Kitchen Surveillance Feed
          </h3>

          <div className="space-y-3">
            <label className="text-xs text-slate-300 font-medium">Select Inspection Scenario</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleScenarioChange("Compliant")}
                className={`p-3 text-xs font-semibold rounded-lg border text-center transition-all ${
                  scenario === "Compliant" && !customImage
                    ? "bg-emerald-600/30 border-emerald-500 text-emerald-300"
                    : "bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white"
                }`}
              >
                Station 1: High Standard
                <span className="block text-[10px] text-emerald-400 mt-0.5">Grade A (Exemplary)</span>
              </button>

              <button
                onClick={() => handleScenarioChange("Violation")}
                className={`p-3 text-xs font-semibold rounded-lg border text-center transition-all ${
                  scenario === "Violation" && !customImage
                    ? "bg-red-600/30 border-red-500 text-red-300"
                    : "bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white"
                }`}
              >
                Station 2: Safety Breach
                <span className="block text-[10px] text-red-400 mt-0.5">Grade C (Violations)</span>
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-300 font-medium block mb-1.5">Or Upload Station Frame / Video Capture</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="w-full text-xs text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-emerald-400 hover:file:bg-slate-700"
            />
          </div>

          <button
            onClick={handleRunAudit}
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 active:scale-98 transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                <span>Auditing PPE, Cutting Boards & HACCP...</span>
              </>
            ) : (
              <>
                <Video className="w-4 h-4" />
                <span>Run Computer Vision Hygiene Audit</span>
              </>
            )}
          </button>
        </div>

        {/* Right Camera View with Bounding Boxes */}
        <div className="lg:col-span-7 glass-panel p-5 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm text-slate-300">CCTV Workstation Surveillance</h3>
              <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                ACTIVE FEED
              </span>
            </div>

            <div className="relative rounded-xl overflow-hidden aspect-video bg-black/40 border border-slate-700 shadow-inner flex items-center justify-center">
              <img
                src={activeImage}
                alt="Commercial Kitchen"
                className="w-full h-full object-cover"
              />

              {/* Bounding Boxes */}
              {result?.bounding_boxes?.map((box, i) => (
                <div
                  key={i}
                  style={{
                    left: `${box.x}%`,
                    top: `${box.y}%`,
                    width: `${box.w}%`,
                    height: `${box.h}%`
                  }}
                  className={`absolute border-2 pointer-events-none ${
                    box.severity === "Critical"
                      ? "border-red-500 bg-red-500/20"
                      : box.severity === "Major"
                      ? "border-amber-500 bg-amber-500/20"
                      : "border-emerald-400 bg-emerald-500/20"
                  }`}
                >
                  <span className={`absolute -top-5 left-0 px-1.5 py-0.5 text-[9px] font-bold text-white uppercase rounded ${
                    box.severity === "Critical" ? "bg-red-600" : box.severity === "Major" ? "bg-amber-600" : "bg-emerald-600"
                  }`}>
                    {box.label}
                  </span>
                </div>
              ))}

              <div className="absolute bottom-2 left-2 px-3 py-1 bg-black/70 backdrop-blur-md rounded-md text-xs text-slate-200">
                {customImage ? "Uploaded Station Frame" : `Scenario: ${scenario.toUpperCase()}`}
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-400 mt-3">
            Real-time object detection models flag PPE omissions, bare hand contact, and cross-contamination hazards.
          </p>
        </div>

      </div>

      {/* Audit Report Results */}
      {result && (
        <div className="space-y-6 animate-slideUp">
          
          {/* Header Score & Rating */}
          <div className="glass-panel p-6 rounded-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              
              <div className="flex items-center gap-5">
                <div className={`w-20 h-20 rounded-2xl flex flex-col items-center justify-center border-2 shadow-xl ${
                  result.compliance_score >= 80
                    ? "bg-emerald-950/80 border-emerald-500 text-emerald-400"
                    : "bg-red-950/80 border-red-500 text-red-400"
                }`}>
                  <span className="text-2xl font-black">{result.compliance_score}%</span>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Score</span>
                </div>

                <div>
                  <span className="text-xs text-emerald-400 font-semibold tracking-wider uppercase">
                    HACCP Regulatory Audit
                  </span>
                  <h3 className="text-2xl font-black text-white mt-0.5">{result.overall_rating}</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Compliance status across personnel PPE, cutting stations, and sanitation thresholds.
                  </p>
                </div>
              </div>

              {/* Status Pills */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Chef Hairnet PPE</span>
                  <span className={`font-bold ${result.hairnet_hat_status === "Compliant" ? "text-emerald-400" : "text-red-400"}`}>
                    {result.hairnet_hat_status}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Food-Grade Gloves</span>
                  <span className={`font-bold ${result.glove_usage_status === "Compliant" ? "text-emerald-400" : "text-red-400"}`}>
                    {result.glove_usage_status}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Cross-Contamination</span>
                  <span className={`font-bold ${result.cross_contamination_risk === "None Detected" ? "text-emerald-400" : "text-red-400"}`}>
                    {result.cross_contamination_risk}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Sanitizer Check</span>
                  <span className="text-slate-200 font-bold truncate block">{result.countertop_cleanliness.slice(0, 24)}...</span>
                </div>
              </div>

            </div>
          </div>

          {/* Itemized Violation Logs */}
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              Itemized HACCP & Regulatory Violation Logs
            </h4>

            {result.violations?.length > 0 ? (
              <div className="space-y-3">
                {result.violations.map((v, i) => (
                  <div
                    key={i}
                    className={`p-4 rounded-xl border text-xs space-y-2 ${
                      v.severity === "Critical"
                        ? "bg-red-950/40 border-red-800/80"
                        : v.severity === "Major"
                        ? "bg-amber-950/40 border-amber-800/80"
                        : "bg-blue-950/40 border-blue-800/80"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase text-white ${
                          v.severity === "Critical" ? "bg-red-600" : v.severity === "Major" ? "bg-amber-600" : "bg-blue-600"
                        }`}>
                          {v.severity} Violation #{i + 1}
                        </span>
                        <strong className="text-slate-200">{v.rule}</strong>
                      </div>
                    </div>

                    <p className="text-slate-300">{v.description}</p>
                    
                    <div className="p-2 bg-black/40 rounded-lg text-emerald-300 border border-emerald-900/40">
                      <strong>Mandatory Corrective Action:</strong> {v.corrective_action}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800 text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 shrink-0" />
                Zero critical non-compliance items detected. Workstation complies with international ServSafe guidelines.
              </div>
            )}

            {/* Auditor Summary */}
            <div className="mt-4 p-4 rounded-xl bg-slate-900/80 border border-slate-700 text-xs text-slate-300">
              <span className="font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                Auditor Executive Summary
              </span>
              <p className="leading-relaxed">{result.haccp_summary}</p>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
