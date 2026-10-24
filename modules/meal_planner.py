"""
Food Verse AI - Tab 5: Personalized Meal Planner & Metabolic Engine (Epic 5)
Skill Wallet Capstone Project 3 (Platform ID: 6ac4ca021dcde6d7857c169a)
"""

import streamlit as st
import plotly.graph_objects as go
from modules.ai_engine import FoodVerseAIEngine
from config import PALETTE

def render_meal_planner_tab(engine: FoodVerseAIEngine):
    st.markdown("### 📅 Adaptive 7-Day Meal Planner & Metabolic Engine")
    st.caption("Epic 5 • Scientific BMR/TDEE Caloric Equations, Goal-Specific Macro Distribution & Automated Grocery Cart")

    with st.expander("👤 Step 1: User Biometrics & Lifestyle Profile", expanded=True):
        col_b1, col_b2, col_b3, col_b4 = st.columns(4)
        with col_b1:
            age = st.number_input("Age (years):", min_value=16, max_value=95, value=28, step=1)
            gender = st.selectbox("Biological Sex:", ["Male", "Female"])
        with col_b2:
            weight_kg = st.number_input("Weight (kg):", min_value=35.0, max_value=220.0, value=74.0, step=0.5)
            height_cm = st.number_input("Height (cm):", min_value=120.0, max_value=230.0, value=176.0, step=1.0)
        with col_b3:
            activity = st.selectbox(
                "Physical Activity Level:",
                [
                    "Sedentary (desk job, minimal movement)",
                    "Lightly Active (light exercise 1-3 days/week)",
                    "Moderately Active (moderate workout 3-5 days/week)",
                    "Very Active (hard exercise 6-7 days/week)",
                    "Extra Active / Athlete (physical job or 2x training)"
                ],
                index=2
            )
            diet_type = st.selectbox(
                "Dietary Constraints:",
                [
                    "Balanced Omnivore",
                    "Lacto-Vegetarian",
                    "Vegan / Plant-Based",
                    "Ketogenic",
                    "Diabetic-Friendly / Low-GI",
                    "Mediterranean"
                ]
            )
        with col_b4:
            goal = st.selectbox(
                "Primary Fitness Goal:",
                [
                    "Moderate Fat Loss (-15%)",
                    "Aggressive Fat Loss (-25%)",
                    "Maintenance / Recomposition",
                    "Lean Muscle Gain (+10%)",
                    "Aggressive Bulk (+20%)"
                ],
                index=0
            )

        calc_btn = st.button("🚀 Compute TDEE & Generate 7-Day Meal Schedule", type="primary", use_container_width=True)

    # Compute immediate metabolic targets on button or state change
    if calc_btn or "meal_plan_result" not in st.session_state:
        with st.spinner("⚡ Calculating Mifflin-St Jeor metabolic expenditure and generating personalized weekly meal schedule..."):
            plan = engine.generate_personalized_meal_plan(
                age=age,
                gender=gender,
                weight_kg=weight_kg,
                height_cm=height_cm,
                activity_level=activity,
                diet_type=diet_type,
                goal=goal
            )
            st.session_state["meal_plan_result"] = plan

    plan = st.session_state.get("meal_plan_result")

    if plan:
        st.markdown("---")
        st.markdown(f"## 🎯 Metabolic Prescription: **{plan.target_calories} kcal / day**")

        # Top Metabolic Dashboard
        m_col1, m_col2, m_col3, m_col4 = st.columns(4)
        m_col1.metric("Basal Metabolic Rate (BMR)", f"{plan.bmr} kcal", help="Energy burned at complete rest to maintain vital organ functions.")
        m_col2.metric("Total Daily Energy (TDEE)", f"{plan.tdee} kcal", help="Total expenditure accounting for your physical activity multiplier.")
        m_col3.metric("Goal Energy Target", f"{plan.target_calories} kcal", delta=f"{plan.target_calories - plan.tdee} kcal delta")
        m_col4.metric("Dietary Protocol", plan.diet_type)

        # Macro Targets Cards & Donut Chart
        macro_col, chart_col = st.columns([3, 2], gap="medium")

        with macro_col:
            st.markdown("#### ⚖️ Daily Targeted Macronutrient Allocation")
            t_col1, t_col2, t_col3 = st.columns(3)
            
            p_cal = plan.protein_target_g * 4
            c_cal = plan.carbs_target_g * 4
            f_cal = plan.fat_target_g * 9
            tot_cal = max(1, p_cal + c_cal + f_cal)

            t_col1.metric("Daily Protein", f"{plan.protein_target_g} g", f"{int((p_cal/tot_cal)*100)}% calories")
            t_col2.metric("Daily Carbs", f"{plan.carbs_target_g} g", f"{int((c_cal/tot_cal)*100)}% calories")
            t_col3.metric("Daily Healthy Fats", f"{plan.fat_target_g} g", f"{int((f_cal/tot_cal)*100)}% calories")

            st.markdown(
                f"""
                <div style="background-color: rgba(30, 41, 59, 0.6); border-radius: 8px; padding: 12px 16px; margin-top: 10px;">
                    <span style="font-size: 14px; color: #CBD5E1;">
                    📌 <strong>Nutritional Strategy:</strong> Calibrated for <em>{plan.goal}</em> under a <em>{plan.diet_type}</em> blueprint. 
                    Maintains high satiety, spares lean muscle mass, and maintains steady blood glucose levels throughout training windows.
                    </span>
                </div>
                """,
                unsafe_allow_html=True
            )

        with chart_col:
            st.markdown("#### 🍩 Target Macro Ratio")
            fig_macro = go.Figure(data=[go.Pie(
                labels=['Protein', 'Carbohydrates', 'Fats'],
                values=[p_cal, c_cal, f_cal],
                hole=.6,
                marker_colors=[PALETTE['primary'], PALETTE['info'], PALETTE['warning']]
            )])
            fig_macro.update_layout(
                margin=dict(t=5, b=5, l=10, r=10),
                height=180,
                legend=dict(orientation="h", yanchor="bottom", y=-0.25, xanchor="center", x=0.5),
                paper_bgcolor='rgba(0,0,0,0)',
                plot_bgcolor='rgba(0,0,0,0)'
            )
            st.plotly_chart(fig_macro, use_container_width=True)

        st.markdown("---")

        # 7-Day Meal Schedule
        st.markdown("### 🗓️ Adaptive 7-Day Meal Calendar")
        day_tabs = st.tabs(list(plan.weekly_schedule.keys()))

        for idx, (day_name, meals) in enumerate(plan.weekly_schedule.items()):
            with day_tabs[idx]:
                st.markdown(f"#### {day_name} Nutrition Blueprint")
                c_bk, c_ln, c_dn, c_sn = st.columns(4)

                with c_bk:
                    st.markdown("##### 🌅 Breakfast")
                    st.info(meals.get("Breakfast", "Balanced Morning Meal"))

                with c_ln:
                    st.markdown("##### ☀️ Lunch")
                    st.success(meals.get("Lunch", "High-Energy Midday Meal"))

                with c_dn:
                    st.markdown("##### 🌙 Dinner")
                    st.warning(meals.get("Dinner", "Nutrient-Dense Evening Meal"))

                with c_sn:
                    st.markdown("##### 🍎 Snack")
                    st.info(meals.get("Snack", "Metabolic Snack"))

        st.markdown("---")

        # Consolidated Grocery Shopping List
        st.markdown("### 🛒 Automated Consolidated Grocery Shopping List")
        st.caption("Consolidated weekly pantry requisitions organized by grocery department.")

        g_cols = st.columns(len(plan.grocery_list))
        shopping_text_export = f"=== FOODVERSE AI GROCERY REQUISITION ===\nTarget Plan: {plan.diet_type} ({plan.goal})\n\n"

        for idx, (category, items) in enumerate(plan.grocery_list.items()):
            with g_cols[idx]:
                st.markdown(f"##### 📦 {category}")
                shopping_text_export += f"[{category.upper()}]\n"
                for item in items:
                    st.checkbox(item, key=f"shop_{category}_{item}_{idx}")
                    shopping_text_export += f"- {item}\n"
                shopping_text_export += "\n"

        # Download / Export Shopping List
        st.download_button(
            "📥 Download Shopping List (.txt)",
            data=shopping_text_export,
            file_name=f"foodverse_grocery_list_{plan.diet_type.lower().replace(' ', '_')}.txt",
            mime="text/plain"
        )
