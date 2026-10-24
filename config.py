"""
Food Verse AI - System Configuration & Theme Constants
Skill Wallet Capstone Project 3 (Platform ID: 6ac4ca021dcde6d7857c169a)
Category: Generative AI | Nutrition, Freshness & Kitchen Safety
"""

import os
from typing import Dict, Any

APP_NAME = "Food Verse AI"
APP_SUBTITLE = "Multimodal Food Intelligence & Kitchen Safety Agent"
CAPSTONE_TAG = "Skill Wallet Capstone Project 3 • Platform ID: 6ac4ca021dcde6d7857c169a"
APP_VERSION = "2.4.0-Production"

# LLM Providers & Models
DEFAULT_GEMINI_MODEL = "gemini-1.5-flash"
GEMINI_MODELS = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-2.0-flash-exp"]
DEFAULT_GROQ_MODEL = "llama-3.2-11b-vision-preview"
GROQ_MODELS = ["llama-3.2-11b-vision-preview", "llama-3.2-90b-vision-preview", "llama-3.3-70b-versatile"]

# Visual Themes & Branding
PALETTE = {
    "primary": "#10B981",       # Emerald Green
    "secondary": "#065F46",     # Deep Forest Green
    "accent": "#F59E0B",        # Amber Gold
    "danger": "#EF4444",        # Crimson Red
    "warning": "#F97316",       # Coral Orange
    "info": "#3B82F6",          # Royal Blue
    "background_dark": "#0F172A",
    "card_dark": "#1E293B",
    "text_light": "#F8FAFC",
    "text_muted": "#94A3B8",
}

# Nutritional reference guidelines (FDA / WHO standard daily values for 2000 kcal diet)
DAILY_REFERENCE_VALUES = {
    "calories": 2000,
    "protein": 50,       # grams
    "carbs": 275,        # grams
    "fat": 78,           # grams
    "fiber": 28,         # grams
    "sodium": 2300,      # mg
}

# Activity Level Multipliers for TDEE (Mifflin-St Jeor)
ACTIVITY_MULTIPLIERS: Dict[str, float] = {
    "Sedentary (desk job, minimal movement)": 1.2,
    "Lightly Active (light exercise 1-3 days/week)": 1.375,
    "Moderately Active (moderate workout 3-5 days/week)": 1.55,
    "Very Active (hard exercise 6-7 days/week)": 1.725,
    "Extra Active / Athlete (physical job or 2x training)": 1.9,
}

# Goal Adjustment Factors for Calories
GOAL_CALORIE_DELTAS: Dict[str, float] = {
    "Aggressive Fat Loss (-25%)": -0.25,
    "Moderate Fat Loss (-15%)": -0.15,
    "Maintenance (Recomposition)": 0.0,
    "Lean Muscle Gain (+10%)": 0.10,
    "Aggressive Muscle Bulk (+20%)": 0.20,
}
