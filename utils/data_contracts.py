"""
Food Verse AI - JSON Data Contracts & Schema Models
Standardized data contracts ensuring strict typing, validation, and serialization.
Skill Wallet Capstone Project 3 (Platform ID: 6ac4ca021dcde6d7857c169a)
"""

from dataclasses import dataclass, field, asdict
from typing import List, Dict, Any, Optional

@dataclass
class Macronutrients:
    calories: int
    protein: float
    carbohydrates: float
    fats: float
    fiber: float
    sodium_mg: float = 0.0
    sugar_g: float = 0.0

@dataclass
class IngredientItem:
    name: str
    portion: str
    estimated_calories: int

@dataclass
class AllergenAlert:
    allergen: str
    severity: str  # "Low", "Moderate", "High"
    warning_text: str

@dataclass
class NutritionAuditResult:
    dish_name: str
    cuisine: str
    confidence: float
    estimated_portion_grams: int
    macros: Macronutrients
    ingredients: List[IngredientItem]
    allergen_alerts: List[AllergenAlert]
    health_score: int  # 1 - 100
    health_badges: List[str]
    dietary_tags: List[str]
    nutritionist_assessment: str

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


@dataclass
class FreshnessDiagnosticResult:
    item_name: str
    category: str  # "Fruit", "Vegetable", "Meat & Poultry", "Dairy", "Bakery"
    freshness_stage: str  # "Fresh" | "Moderately Fresh" | "Spoiled"
    confidence: float
    surface_texture: str
    discoloration_level: str
    wrinkling_dehydration: str
    mold_fungal_growth: str
    safety_status: str  # "Safe to consume" | "Consume within 24h" | "Discard immediately"
    pathogen_risk_level: str  # "Negligible", "Low", "Elevated", "Severe"
    microbial_hazard_summary: str
    estimated_shelf_life: str
    storage_preservation_tips: List[str]

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


@dataclass
class HygieneViolation:
    rule: str
    severity: str  # "Critical", "Major", "Minor"
    description: str
    corrective_action: str

@dataclass
class KitchenHygieneResult:
    compliance_score: int  # 0 - 100
    overall_rating: str  # "Grade A (Exemplary)" | "Grade B (Minor Deficiencies)" | "Grade C (Violations Present)" | "Grade F (Immediate Hazard)"
    hairnet_hat_status: str  # "Compliant" | "Violation Detected"
    glove_usage_status: str  # "Compliant" | "Non-Compliant"
    countertop_cleanliness: str
    cross_contamination_risk: str  # "None Detected" | "Potential Risk" | "Severe Risk"
    violations: List[HygieneViolation]
    haccp_summary: str

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


@dataclass
class RecipeGenerationResult:
    recipe_title: str
    description: str
    prep_time_min: int
    cook_time_min: int
    total_time_min: int
    difficulty: str  # "Easy", "Medium", "Advanced"
    servings: int
    calories_per_serving: int
    protein_per_serving: float
    carbs_per_serving: float
    fats_per_serving: float
    ingredients_list: List[str]
    pantry_leftovers_used: List[str]
    smart_substitutions: Dict[str, str]
    step_by_step_instructions: List[str]
    chef_safety_notes: List[str]

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


@dataclass
class MealPlanResult:
    bmr: int
    tdee: int
    target_calories: int
    goal: str
    diet_type: str
    protein_target_g: int
    carbs_target_g: int
    fat_target_g: int
    weekly_schedule: Dict[str, Dict[str, str]]
    grocery_list: Dict[str, List[str]]

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)
