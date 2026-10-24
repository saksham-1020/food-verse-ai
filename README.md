# 🥦 Food Verse AI – Multimodal Food Intelligence Agent

**Skill Wallet Capstone Project 3 • Platform ID: `6ac4ca021dcde6d7857c169a`**  
**Category:** Generative AI | Nutrition, Freshness & Commercial Kitchen Safety  
**GitHub Repository:** [`sharky-123/food-verse-ai`](https://github.com/sharky-123/food-verse-ai)  

[![Vercel Deployment](https://img.shields.io/badge/Deploy-Vercel-black?style=flat&logo=vercel&logoColor=white)](https://vercel.com/new)
[![React 18](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Tailwind-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Build-Vite%206-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev)
[![Python 3.9+](https://img.shields.io/badge/Python-3.9+-3776AB?style=flat&logo=python&logoColor=white)](https://python.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)

---

## 🌟 Executive Summary & Objective

**Food Verse AI** is an enterprise-grade multimodal food intelligence ecosystem that deconstructs meal photos, inspects raw perishables, monitors commercial kitchen hygiene compliance (HACCP), generates zero-waste recipes, and prescribes metabolic meal plans.

### 📋 Kanban Epics Traceability (100% Coverage)

| Epic | Scope Description | Implementation | Status |
| :--- | :--- | :--- | :--- |
| **Pre-requisites** | Modern React / Vite / Tailwind / CV Foundation | `src/`, `utils/cv_helpers.py` | ✅ Verified (100%) |
| **Epic 1** | Requirements & Secure Dual-Mode Env (Gemini, Groq, Demo) | `src/services/aiService.js`, `SettingsModal.jsx` | ✅ Verified (100%) |
| **Epic 2** | Food Recognition & Clinical Nutrition Audit | `src/components/TabNutritionAudit.jsx` | ✅ Verified (100%) |
| **Epic 3** | Perishable Freshness & Spoilage Diagnostics (Heatmaps) | `src/components/TabFreshnessDiagnostic.jsx` | ✅ Verified (100%) |
| **Epic 4** | Kitchen Hygiene Compliance (HACCP) & Recipe Assistant | `src/components/TabKitchenHygiene.jsx`, `TabRecipeAssistant.jsx` | ✅ Verified (100%) |
| **Epic 5** | Mifflin-St Jeor TDEE & 7-Day Meal Calendar | `src/components/TabMealPlanner.jsx` | ✅ Verified (100%) |
| **Epic 6** | Modern Interface, Edge Cases & Instant Vercel Deploy | `vercel.json`, `index.html`, `App.jsx` | ✅ Verified (100%) |

---

## 🚀 Instant Deployment on Vercel

### Option 1: Vercel Web Dashboard (1-Click)
1. Go to **[vercel.com/new](https://vercel.com/new)**.
2. Sign in with your GitHub account (**`sharky-123`**).
3. Import the repository **`food-verse-ai`**.
4. Vercel automatically detects **Vite** framework (`buildCommand: npm run build`, `outputDirectory: dist`).
5. Click **Deploy**! In ~30 seconds, your application is live on a global HTTPS URL!

---

## 💻 Local Development

### Run React Frontend (Vite)
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Run Streamlit Alternative
```bash
pip install -r requirements.txt
streamlit run app.py
```

---

## 🏗️ Architecture

```mermaid
flowchart TD
    subgraph UI ["Modern React 18 + Tailwind UI"]
        T1["Tab 1: Nutrition Audit"]
        T2["Tab 2: Freshness Diagnostic"]
        T3["Tab 3: Kitchen Safety"]
        T4["Tab 4: Recipe Assistant"]
        T5["Tab 5: Meal Planner"]
        T6["Tab 6: System Architecture"]
    end

    subgraph Core ["aiService.js Routing Engine"]
        Router{"AI Provider Selector"}
        Gemini["Google Gemini 1.5 Flash/Pro"]
        Groq["Groq LLaMA-3.2 Vision"]
        MockEngine["Standalone Food-Science Simulation Engine"]
    end

    subgraph Output ["Visual Overlays & Science Contracts"]
        Heatmap["Surface Defect Heatmaps"]
        BBox["PPE & Contamination Bounding Boxes"]
        TDEE["Mifflin-St Jeor Metabolic Engine"]
    end

    UI --> Router
    Router -->|API Key| Gemini
    Router -->|API Key| Groq
    Router -->|Demo Mode (Default)| MockEngine

    Gemini --> Output
    Groq --> Output
    MockEngine --> Output

    Output --> UI
```

---

## 🛡️ License & Platform Information
Developed for **Skill Wallet Capstone Project 3**  
**Platform ID:** `6ac4ca021dcde6d7857c169a`  
Licensed under the [MIT License](LICENSE).
