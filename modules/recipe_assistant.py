"""
Food Verse AI - Tab 4: Smart Kitchen Recipe Assistant (Epic 4)
Skill Wallet Capstone Project 3 (Platform ID: 6ac4ca021dcde6d7857c169a)
"""

import streamlit as st
from modules.ai_engine import FoodVerseAIEngine
from config import PALETTE

def render_recipe_assistant_tab(engine: FoodVerseAIEngine):
    st.markdown("### 🍳 Smart Kitchen Recipe Assistant & Zero-Waste Coach")
    st.caption("Epic 4 • Pantry-to-Plate Culinary Synthesis, Leftover Rescue, Nutritional Balancing & Smart Substitutions")

    col_input, col_tips = st.columns([2, 1], gap="medium")

    with col_input:
        st.markdown("#### 1. Available Pantry & Fridge Inventory")

        # Preset ingredient suggestions for convenience
        preset_bundle = st.selectbox(
            "Quick-Fill Inventory Preset:",
            [
                "Custom Ingredients",
                "High Protein Skillet (Chicken Breast, Spinach, Garlic, Olive Oil, Lemon)",
                "Vegetarian Crisper (Paneer, Cooked Rice, Bell Peppers, Onions, Turmeric)",
                "Zero-Waste Mediterranean (Eggs, Feta Cheese, Tomatoes, Crisper Greens, Milk)"
            ]
        )

        default_text = "Chicken breast, baby spinach, garlic cloves, extra virgin olive oil, lemon, salt, black pepper"
        if "Vegetarian" in preset_bundle:
            default_text = "Paneer cubes, day-old basmati rice, red bell pepper, red onion, ground turmeric, cumin, cilantro"
        elif "Mediterranean" in preset_bundle:
            default_text = "Pasture eggs, crumbled feta cheese, softened cherry tomatoes, crisper mixed greens, milk, olive oil"

        pantry_input = st.text_area(
            "Enter available ingredients (comma-separated):",
            value=default_text,
            height=90,
            help="List whatever items are in your fridge, crisper, or pantry. We prioritize expiring items."
        )

        col_opt1, col_opt2 = st.columns(2)
        with col_opt1:
            diet_pref = st.selectbox(
                "Dietary Goal / Target:",
                ["Balanced / High Protein", "Low Carb / Keto", "Lacto-Vegetarian", "Vegan / Plant-Based", "Heart Healthy"]
            )
        with col_opt2:
            max_time = st.slider("Max Desired Cooking Time:", min_value=10, max_value=60, value=25, step=5)

        generate_btn = st.button("✨ Synthesize Nutritious Recipe", type="primary", use_container_width=True)

    with col_tips:
        st.markdown("#### 💡 Zero-Waste Kitchen Philosophy")
        st.markdown(
            """
            - **Priority Cooking:** Use wilted leafy greens and opened proteins first.
            - **Dynamic Substitutions:** Missing an ingredient? The agent dynamically suggests pantry alternatives.
            - **Micro-Nutrient Conservation:** Quick searing and gentle braising preserves delicate heat-sensitive vitamins (C & B).
            """
        )
        st.info("🌱 Did you know? Using up leftover ingredients saves an average household over $1,500/year while cutting domestic greenhouse emissions.")

    if generate_btn and pantry_input.strip():
        with st.spinner("👨‍🍳 Master Chef AI engineering optimal flavor pairings, macros, and zero-waste substitutions..."):
            recipe = engine.generate_smart_recipe(
                pantry_items=pantry_input,
                dietary_preference=diet_pref,
                max_time_min=max_time
            )
            st.session_state["recipe_result"] = recipe

    if "recipe_result" in st.session_state:
        rec = st.session_state["recipe_result"]

        st.markdown("---")
        st.markdown(f"## 🍽️ {rec.recipe_title}")
        st.markdown(f"*{rec.description}*")

        # Metric summary
        col_m1, col_m2, col_m3, col_m4, col_m5 = st.columns(5)
        col_m1.metric("Total Time", f"{rec.total_time_min} mins")
        col_m2.metric("Difficulty", rec.difficulty)
        col_m3.metric("Servings", f"{rec.servings} portions")
        col_m4.metric("Calories / Serving", f"{rec.calories_per_serving} kcal")
        col_m5.metric("Protein / Serving", f"{rec.protein_per_serving} g")

        # Zero-waste utilized badge
        if rec.pantry_leftovers_used:
            st.markdown("##### ♻️ Rescued Pantry & Crisper Items")
            st.success("Prioritized for consumption: " + ", ".join([f"**{item}**" for item in rec.pantry_leftovers_used]))

        # Two columns: Ingredients & Smart Substitutions
        col_ing, col_subs = st.columns([1, 1], gap="medium")

        with col_ing:
            st.markdown("#### 🛒 Ingredients Breakdown")
            for ing in rec.ingredients_list:
                st.markdown(f"- {ing}")

        with col_subs:
            st.markdown("#### 🔄 Smart Ingredient Substitutions")
            if rec.smart_substitutions:
                for orig, sub in rec.smart_substitutions.items():
                    st.markdown(
                        f"""
                        <div style="background-color: rgba(30, 41, 59, 0.7); border-left: 3px solid #10B981; padding: 6px 12px; margin-bottom: 6px; border-radius: 4px;">
                            <strong style="color:#A7F3D0;">No {orig}?</strong> → <em>{sub}</em>
                        </div>
                        """,
                        unsafe_allow_html=True
                    )
            else:
                st.info("All specified ingredients fit the recipe directly.")

        # Step-by-Step Culinary Instructions
        st.markdown("#### 🔪 Step-by-Step Culinary Instructions")
        for idx, step in enumerate(rec.step_by_step_instructions, 1):
            st.markdown(f"**Step {idx}:** {step}")

        # Chef Safety & Storage
        st.markdown("#### 👨‍🍳 Chef's Food Safety & Reheating Notes")
        for note in rec.chef_safety_notes:
            st.warning(f"🛡️ {note}")

        # Export Recipe Markdown
        recipe_md = f"""# {rec.recipe_title}
{rec.description}

**Time:** {rec.total_time_min} mins | **Difficulty:** {rec.difficulty} | **Servings:** {rec.servings}
**Nutrition per serving:** {rec.calories_per_serving} kcal | Protein: {rec.protein_per_serving}g | Carbs: {rec.carbs_per_serving}g | Fats: {rec.fats_per_serving}g

## Ingredients
{chr(10).join([f'- {i}' for i in rec.ingredients_list])}

## Instructions
{chr(10).join([f'{idx+1}. {s}' for idx, s in enumerate(rec.step_by_step_instructions)])}

## Chef Safety Notes
{chr(10).join([f'- {n}' for n in rec.chef_safety_notes])}
"""
        st.download_button(
            "📥 Download Recipe Card (.md)",
            data=recipe_md,
            file_name=f"{rec.recipe_title.replace(' ', '_').lower()}.md",
            mime="text/markdown"
        )
