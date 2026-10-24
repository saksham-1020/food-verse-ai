"""
Food Verse AI - Automated Unit & Integration Test Suite
Verifies all 5 Epics, data contracts, CV helpers, and Standalone AI Engine.
Skill Wallet Capstone Project 3 (Platform ID: 6ac4ca021dcde6d7857c169a)
"""

import sys
import os

# Add root directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding='utf-8')

from modules.ai_engine import FoodVerseAIEngine
from utils.cv_helpers import generate_sample_food_image, draw_hygiene_audit_overlay, draw_freshness_heatmap_overlay
from utils.data_contracts import (
    NutritionAuditResult, FreshnessDiagnosticResult, KitchenHygieneResult,
    RecipeGenerationResult, MealPlanResult
)

def run_tests():
    print("=" * 60)
    print("RUNNING FOOD VERSE AI VERIFICATION SUITE")
    print("=" * 60)

    engine = FoodVerseAIEngine(provider="Demo Mode")
    print("✅ AI Engine initialized in Standalone Demonstration Mode")

    # 1. Test CV Sample Image Generation
    img_salmon = generate_sample_food_image("salmon")
    assert img_salmon.size == (640, 480), "Sample image dimensions mismatch"
    print("✅ Epic 1 / CV Helpers: Sample image generator passed")

    # 2. Test Tab 1: Nutrition Audit (Epic 2)
    nutr_res = engine.analyze_nutrition(img_salmon, user_notes="Wild Salmon Quinoa")
    assert isinstance(nutr_res, NutritionAuditResult), "Nutrition result type error"
    assert nutr_res.macros.calories > 0, "Calorie calculation error"
    assert len(nutr_res.ingredients) > 0, "Ingredients parsing error"
    assert 1 <= nutr_res.health_score <= 100, "Health score out of range"
    print(f"✅ Epic 2 (Nutrition Audit): {nutr_res.dish_name} | {nutr_res.macros.calories} kcal | Health Score: {nutr_res.health_score}/100")

    # 3. Test Tab 2: Freshness Diagnostic (Epic 3)
    img_fresh = generate_sample_food_image("fresh")
    fresh_res = engine.analyze_freshness(img_fresh, item_category="Fruits & Berries")
    assert isinstance(fresh_res, FreshnessDiagnosticResult), "Freshness result type error"
    assert fresh_res.freshness_stage in ["Fresh", "Moderately Fresh", "Spoiled"], "Invalid freshness stage"
    # Test heatmap overlay
    spots = [{"x": 0.5, "y": 0.5, "radius": 0.2, "tag": "Firmness", "is_spoiled": False}]
    overlay_img = draw_freshness_heatmap_overlay(img_fresh, spots)
    assert overlay_img.size == img_fresh.size, "Heatmap overlay size mismatch"
    print(f"✅ Epic 3 (Freshness Diagnostic): {fresh_res.item_name} | Stage: {fresh_res.freshness_stage} | Safety: {fresh_res.safety_status}")

    # 4. Test Tab 3: Kitchen Hygiene (Epic 4)
    img_kitchen = generate_sample_food_image("kitchen")
    hygiene_res = engine.audit_kitchen_hygiene(img_kitchen, kitchen_zone="Primary Food Prep Line")
    assert isinstance(hygiene_res, KitchenHygieneResult), "Hygiene result type error"
    assert 0 <= hygiene_res.compliance_score <= 100, "Hygiene compliance score invalid"
    # Test hygiene bounding box overlay
    findings = [{"box": [0.1, 0.1, 0.4, 0.4], "severity": "Compliant", "label": "Chef Hairnet"}]
    annotated_kitchen = draw_hygiene_audit_overlay(img_kitchen, findings)
    assert annotated_kitchen.size == img_kitchen.size, "Hygiene overlay size mismatch"
    print(f"✅ Epic 4 (Kitchen Hygiene): Compliance Score: {hygiene_res.compliance_score}% | Rating: {hygiene_res.overall_rating}")

    # 5. Test Tab 4: Recipe Assistant (Epic 4)
    recipe_res = engine.generate_smart_recipe(
        pantry_items="Chicken breast, spinach, garlic, olive oil",
        dietary_preference="Balanced / High Protein",
        max_time_min=25
    )
    assert isinstance(recipe_res, RecipeGenerationResult), "Recipe result type error"
    assert len(recipe_res.step_by_step_instructions) > 0, "Recipe instructions empty"
    print(f"✅ Epic 4 (Recipe Assistant): {recipe_res.recipe_title} | Time: {recipe_res.total_time_min}m | Protein: {recipe_res.protein_per_serving}g")

    # 6. Test Tab 5: Meal Planner & TDEE (Epic 5)
    plan_res = engine.generate_personalized_meal_plan(
        age=28,
        gender="Male",
        weight_kg=74.0,
        height_cm=176.0,
        activity_level="Moderately Active (moderate workout 3-5 days/week)",
        diet_type="Balanced Omnivore",
        goal="Moderate Fat Loss (-15%)"
    )
    assert isinstance(plan_res, MealPlanResult), "Meal plan result type error"
    assert plan_res.tdee > plan_res.bmr, "TDEE must exceed BMR"
    assert plan_res.target_calories > 1000, "Unrealistic target calories"
    assert len(plan_res.weekly_schedule) == 7, "Weekly schedule must span 7 days"
    assert len(plan_res.grocery_list) > 0, "Grocery list missing"
    print(f"✅ Epic 5 (TDEE Meal Planner): BMR: {plan_res.bmr} kcal | TDEE: {plan_res.tdee} kcal | Target: {plan_res.target_calories} kcal/day")

    print("=" * 60)
    print("ALL 6 KANBAN EPICS & INTEGRATION TESTS PASSED PERFECTLY (100%)")
    print("=" * 60)

if __name__ == "__main__":
    run_tests()
