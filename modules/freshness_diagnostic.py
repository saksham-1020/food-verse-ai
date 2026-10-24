"""
Food Verse AI - Tab 2: Food Freshness & Spoilage Diagnostic (Epic 3)
Skill Wallet Capstone Project 3 (Platform ID: 6ac4ca021dcde6d7857c169a)
"""

import streamlit as st
from PIL import Image

from modules.ai_engine import FoodVerseAIEngine
from utils.cv_helpers import generate_sample_food_image, draw_freshness_heatmap_overlay
from config import PALETTE

def render_freshness_diagnostic_tab(engine: FoodVerseAIEngine):
    st.markdown("### 🔬 Perishable Freshness & Spoilage Diagnostics")
    st.caption("Epic 3 • Computer Vision Epidermal Texture, Oxidation Browning, Mold Pathogen Detection & Shelf-Life Advisory")

    col_input, col_view = st.columns([1, 1], gap="medium")

    with col_input:
        st.markdown("#### 1. Perishable Item Visuals")
        input_type = st.radio(
            "Select Inspection Mode:",
            ["Preset Demonstration Samples", "Upload Perishable Image", "Live Camera"],
            horizontal=True
        )

        selected_image = None
        category_choice = st.selectbox(
            "Food Category:",
            ["Fruits & Berries", "Vegetables & Greens", "Meat & Poultry", "Dairy & Cheeses", "Bakery"]
        )

        if input_type == "Preset Demonstration Samples":
            preset_sample = st.selectbox(
                "Choose a Curated Freshness State:",
                [
                    "Crisp Gala Apple (Fresh)",
                    "Raw Farm Chicken Breast (Moderately Fresh)",
                    "Garden Strawberries with Mold (Spoiled)",
                    "Artisanal Soft Dairy Curd (Fresh)"
                ]
            )
            if "Apple" in preset_sample:
                selected_image = generate_sample_food_image("fresh")
                category_choice = "Fruits & Berries"
            elif "Chicken" in preset_sample:
                selected_image = generate_sample_food_image("chicken")
                category_choice = "Meat & Poultry"
            elif "Strawberries" in preset_sample:
                selected_image = generate_sample_food_image("spoil")
                category_choice = "Fruits & Berries"
            else:
                selected_image = generate_sample_food_image("paneer")
                category_choice = "Dairy & Cheeses"

        elif input_type == "Upload Perishable Image":
            uploaded_file = st.file_uploader(
                "Upload photo of raw produce/meat/dairy:",
                type=["jpg", "jpeg", "png", "webp"],
                key="freshness_upload"
            )
            if uploaded_file:
                selected_image = Image.open(uploaded_file)
        else:
            cam_pic = st.camera_input("Take photo of food item:", key="freshness_camera")
            if cam_pic:
                selected_image = Image.open(cam_pic)

        diag_btn = st.button("🧪 Run Spoilage & Microbial Diagnostic", type="primary", use_container_width=True)

    with col_view:
        st.markdown("#### 2. Visual Quality Inspection")
        if selected_image is not None:
            st.image(selected_image, caption="Inspected Perishable Visual", use_container_width=True)
        else:
            st.info("👈 Select a sample or upload a photo to initiate diagnostic.")

    if diag_btn and selected_image is not None:
        with st.spinner("🔬 Analyzing surface texture, color shifts, cellular turgor & fungal mycelium..."):
            result = engine.analyze_freshness(selected_image, item_category=category_choice)
            st.session_state["freshness_result"] = result
            st.session_state["freshness_image"] = selected_image

    if "freshness_result" in st.session_state:
        res = st.session_state["freshness_result"]
        img = st.session_state.get("freshness_image", selected_image)

        st.markdown("---")

        # Dynamic Status Banner
        stage = res.freshness_stage
        if stage == "Fresh":
            badge_bg = "#065F46"
            badge_border = "#10B981"
            status_icon = "🟢"
            status_text = "FRESH - OPTIMAL NUTRITIONAL VALUE"
        elif stage == "Moderately Fresh":
            badge_bg = "#78350F"
            badge_border = "#F59E0B"
            status_icon = "🟡"
            status_text = "MODERATELY FRESH - CONSUME PROMPTLY"
        else:
            badge_bg = "#7F1D1D"
            badge_border = "#EF4444"
            status_icon = "🔴"
            status_text = "SPOILED - HAZARDOUS BIOLOGICAL DECAY"

        st.markdown(
            f"""
            <div style="background-color: {badge_bg}; border: 2px solid {badge_border}; border-radius: 8px; padding: 14px 20px; margin-bottom: 20px;">
                <h3 style="margin:0; color:#FFFFFF;">{status_icon} Classification: {res.freshness_stage.upper()}</h3>
                <p style="margin:4px 0 0 0; color:#E2E8F0; font-size: 15px;">Item: <strong>{res.item_name}</strong> | Category: <strong>{res.category}</strong> | Confidence: <strong>{int(res.confidence * 100)}%</strong></p>
            </div>
            """,
            unsafe_allow_html=True
        )

        # Actionable Safety Directive Cards
        col_act1, col_act2, col_act3 = st.columns(3)
        col_act1.metric("Food Safety Directive", res.safety_status)
        col_act2.metric("Pathogen Hazard Profile", res.pathogen_risk_level)
        col_act3.metric("Estimated Shelf-Life", res.estimated_shelf_life)

        # Inspection Details & Visual Heatmap
        st.markdown("#### 🔍 Visual Biophysical Indicators")
        i_col1, i_col2, i_col3, i_col4 = st.columns(4)
        
        with i_col1:
            st.markdown("**Surface Texture**")
            st.caption(res.surface_texture)
        with i_col2:
            st.markdown("**Discoloration / Oxidation**")
            st.caption(res.discoloration_level)
        with i_col3:
            st.markdown("**Wrinkling & Turgor**")
            st.caption(res.wrinkling_dehydration)
        with i_col4:
            st.markdown("**Fungal / Mold Spores**")
            st.caption(res.mold_fungal_growth)

        # Computer Vision Surface Heatmap Overlay
        st.markdown("#### 🎯 Surface Heatmap & Defect Region Overlay")
        is_spoil = (res.freshness_stage == "Spoiled")
        spots = [
            {"x": 0.45, "y": 0.45, "radius": 0.18, "tag": "Mycelium Spores" if is_spoil else "Epidermal Firmness", "is_spoiled": is_spoil},
            {"x": 0.65, "y": 0.35, "radius": 0.12, "tag": "Oxidation Zone" if is_spoil else "Optimal Hydration", "is_spoiled": is_spoil}
        ]
        if img is not None:
            annotated_freshness = draw_freshness_heatmap_overlay(img, spots)
            st.image(annotated_freshness, caption="Computer Vision Defect Mapping (Green = Intact, Red = Pathogen / Necrosis Zone)", use_container_width=True)

        # Pathogen Risk & Microbial Hazard
        st.markdown("#### 🦠 Microbial Pathology Analysis")
        st.warning(f"**Hazard Summary:** {res.microbial_hazard_summary}")

        # Preservation Tips
        st.markdown("#### ❄️ Proper Preservation & Storage Guidelines")
        for tip in res.storage_preservation_tips:
            st.markdown(f"- 💡 {tip}")
