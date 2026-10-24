"""
Food Verse AI - Tab 1: Food Recognition & Nutrition Audit (Epic 2)
Skill Wallet Capstone Project 3 (Platform ID: 6ac4ca021dcde6d7857c169a)
"""

import streamlit as st
from PIL import Image
import plotly.graph_objects as go
import plotly.express as px

from modules.ai_engine import FoodVerseAIEngine
from utils.cv_helpers import generate_sample_food_image
from config import PALETTE, DAILY_REFERENCE_VALUES

def render_nutrition_audit_tab(engine: FoodVerseAIEngine):
    st.markdown("### 🥗 Food Recognition & Clinical Nutrition Audit")
    st.caption("Epic 2 • Multimodal Computer Vision Dish Identification, Macro/Micro Breakdown, Allergens & Health Scoring")

    col_input, col_view = st.columns([1, 1], gap="medium")

    with col_input:
        st.markdown("#### 1. Input Meal Visuals")
        input_source = st.radio(
            "Select Image Source:",
            ["Preset Demonstration Dishes", "Upload Photo", "Webcam Capture"],
            horizontal=True
        )

        selected_image = None
        user_notes = ""

        if input_source == "Preset Demonstration Dishes":
            preset_choice = st.selectbox(
                "Choose a Curated Dish Archetype:",
                [
                    "Mediterranean Wild Salmon Quinoa Bowl",
                    "Shahi Paneer with Multigrain Roti & Jeera Rice",
                    "Grilled Herb Chicken Caesar Salad"
                ]
            )
            if "Salmon" in preset_choice:
                selected_image = generate_sample_food_image("salmon")
            elif "Paneer" in preset_choice:
                selected_image = generate_sample_food_image("paneer")
            else:
                selected_image = generate_sample_food_image("chicken")
            user_notes = preset_choice

        elif input_source == "Upload Photo":
            uploaded_file = st.file_uploader(
                "Upload meal photo (JPG, PNG, WEBP):",
                type=["jpg", "jpeg", "png", "webp"],
                key="nutrition_upload"
            )
            if uploaded_file:
                selected_image = Image.open(uploaded_file)
            user_notes = st.text_input("Optional context / dining notes (e.g. 'Homemade low-oil prep'):", "")

        else:
            camera_img = st.camera_input("Take a photo of your plate:", key="nutrition_camera")
            if camera_img:
                selected_image = Image.open(camera_img)
            user_notes = st.text_input("Optional notes for camera meal:", "")

        analyze_btn = st.button("🔍 Run Multimodal Nutrition Audit", type="primary", use_container_width=True)

    with col_view:
        st.markdown("#### 2. Plate Inspection View")
        if selected_image is not None:
            st.image(selected_image, caption="Analyzed Meal Visual", use_container_width=True)
        else:
            st.info("👈 Please select a preset dish or upload a photo to start analysis.")

    # Execute Analysis
    if analyze_btn and selected_image is not None:
        with st.spinner("🤖 Vision Engine scanning culinary features, ingredients, and portion density..."):
            result = engine.analyze_nutrition(selected_image, user_notes=user_notes)
            st.session_state["nutrition_audit_result"] = result

    # Display Results if present
    if "nutrition_audit_result" in st.session_state:
        res = st.session_state["nutrition_audit_result"]

        st.markdown("---")
        st.markdown(f"## 🍽️ Audit Report: **{res.dish_name}**")
        
        # Badges and High-Level Metrics
        col_b1, col_b2, col_b3, col_b4 = st.columns(4)
        col_b1.metric("Cuisine Archetype", res.cuisine)
        col_b2.metric("Estimated Portion", f"{res.estimated_portion_grams} g")
        col_b3.metric("Vision Confidence", f"{int(res.confidence * 100)}%")
        
        # Health Score with dynamic color styling
        health_color = "normal" if res.health_score > 75 else "inverse"
        col_b4.metric("Health Score (1-100)", f"{res.health_score} / 100", delta="Cardiovascular Champion" if res.health_score >= 85 else "Nutrient Balanced")

        # Health Badges & Dietary Tags
        st.markdown("##### 🏷️ Dietary Tags & Nutritional Badges")
        tag_html = " ".join([f"<span style='background-color:#065F46; color:#A7F3D0; padding:4px 10px; border-radius:12px; margin-right:6px; font-size:13px; font-weight:600;'>{b}</span>" for b in res.health_badges])
        tag_html += " " + " ".join([f"<span style='background-color:#1E3A8A; color:#BFDBFE; padding:4px 10px; border-radius:12px; margin-right:6px; font-size:13px;'>#{d}</span>" for d in res.dietary_tags])
        st.markdown(tag_html, unsafe_allow_html=True)

        st.markdown("#### 📊 Macronutrient Distribution & Energy Breakdown")
        m_col1, m_col2, m_col3, m_col4, m_col5 = st.columns(5)
        m_col1.metric("Calories", f"{res.macros.calories} kcal")
        m_col2.metric("Protein", f"{res.macros.protein} g")
        m_col3.metric("Carbohydrates", f"{res.macros.carbohydrates} g")
        m_col4.metric("Fats", f"{res.macros.fats} g")
        m_col5.metric("Fiber", f"{res.macros.fiber} g")

        # Interactive Visual Charts (Donut + Bar vs Daily Standard)
        chart_col1, chart_col2 = st.columns(2)

        with chart_col1:
            st.markdown("##### Calorie Macro Distribution")
            # Calculate calorie contributions (4 cal/g for protein & carb, 9 cal/g for fat)
            p_cal = res.macros.protein * 4
            c_cal = res.macros.carbohydrates * 4
            f_cal = res.macros.fats * 9
            
            fig_donut = go.Figure(data=[go.Pie(
                labels=['Protein', 'Carbohydrates', 'Fats'],
                values=[p_cal, c_cal, f_cal],
                hole=.55,
                marker_colors=[PALETTE['primary'], PALETTE['info'], PALETTE['warning']]
            )])
            fig_donut.update_layout(
                margin=dict(t=10, b=10, l=10, r=10),
                height=260,
                legend=dict(orientation="h", yanchor="bottom", y=-0.2, xanchor="center", x=0.5),
                paper_bgcolor='rgba(0,0,0,0)',
                plot_bgcolor='rgba(0,0,0,0)'
            )
            st.plotly_chart(fig_donut, use_container_width=True)

        with chart_col2:
            st.markdown("##### Daily Reference Value (FDA % DV)")
            dv_protein = min(150, int((res.macros.protein / DAILY_REFERENCE_VALUES["protein"]) * 100))
            dv_carbs = min(150, int((res.macros.carbohydrates / DAILY_REFERENCE_VALUES["carbs"]) * 100))
            dv_fat = min(150, int((res.macros.fats / DAILY_REFERENCE_VALUES["fat"]) * 100))
            dv_fiber = min(150, int((res.macros.fiber / DAILY_REFERENCE_VALUES["fiber"]) * 100))

            fig_bar = go.Figure(go.Bar(
                x=[dv_protein, dv_carbs, dv_fat, dv_fiber],
                y=['Protein', 'Carbs', 'Fats', 'Dietary Fiber'],
                orientation='h',
                marker_color=[PALETTE['primary'], PALETTE['info'], PALETTE['warning'], '#10B981'],
                text=[f"{v}%" for v in [dv_protein, dv_carbs, dv_fat, dv_fiber]],
                textposition='auto'
            ))
            fig_bar.update_layout(
                margin=dict(t=10, b=10, l=10, r=10),
                height=260,
                xaxis=dict(title="% of 2000 kcal Daily Value", range=[0, 120]),
                paper_bgcolor='rgba(0,0,0,0)',
                plot_bgcolor='rgba(0,0,0,0)'
            )
            st.plotly_chart(fig_bar, use_container_width=True)

        # Ingredients breakdown & Allergen Alerts
        ing_col, all_col = st.columns([3, 2])

        with ing_col:
            st.markdown("##### 🥘 Identified Ingredients & Component Portions")
            for item in res.ingredients:
                st.markdown(f"- **{item.name}** (`{item.portion}`) ~ *{item.estimated_calories} kcal*")

        with all_col:
            st.markdown("##### ⚠️ Allergen & Sensitivity Warnings")
            if res.allergen_alerts:
                for alert in res.allergen_alerts:
                    border_color = PALETTE['danger'] if alert.severity == "High" else PALETTE['warning']
                    st.markdown(
                        f"""
                        <div style="border-left: 4px solid {border_color}; background-color: rgba(239, 68, 68, 0.08); padding: 8px 12px; margin-bottom: 8px; border-radius: 4px;">
                            <strong>{alert.allergen}</strong> <span style="font-size: 11px; color: {border_color};">[{alert.severity} Risk]</span><br>
                            <span style="font-size: 13px;">{alert.warning_text}</span>
                        </div>
                        """,
                        unsafe_allow_html=True
                    )
            else:
                st.success("✅ No common food allergens detected in this dish formulation.")

        # Clinical Nutritionist Assessment
        st.markdown("##### 🩺 Clinical Nutritionist Assessment")
        st.info(res.nutritionist_assessment)
