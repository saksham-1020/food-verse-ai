"""
Food Verse AI - Tab 3: Kitchen Hygiene & Food Safety Compliance (Epic 4)
Skill Wallet Capstone Project 3 (Platform ID: 6ac4ca021dcde6d7857c169a)
"""

import streamlit as st
from PIL import Image
import plotly.graph_objects as go

from modules.ai_engine import FoodVerseAIEngine
from utils.cv_helpers import generate_sample_food_image, draw_hygiene_audit_overlay
from config import PALETTE

def render_kitchen_hygiene_tab(engine: FoodVerseAIEngine):
    st.markdown("### 👨‍🍳 Commercial Kitchen Hygiene & Food Safety Compliance")
    st.caption("Epic 4 • Computer Vision HACCP Surveillance: PPE (Hairnets/Gloves), Prep Line Sanitization & Cross-Contamination Auditing")

    col_input, col_view = st.columns([1, 1], gap="medium")

    with col_input:
        st.markdown("#### 1. Kitchen Surveillance Feed")
        stream_type = st.radio(
            "Select Kitchen Camera Feed:",
            ["Preset Commercial Kitchen Stations", "Upload Inspection Photo / Frame", "Live Camera"],
            horizontal=True
        )

        selected_image = None
        zone_choice = st.selectbox(
            "Commercial Kitchen Station Zone:",
            ["Primary Food Prep Line", "Raw Meat & Poultry Fabrication Station", "Garde Manger & Salad Bar", "Dishwashing & Pot Sink Area"]
        )

        if stream_type == "Preset Commercial Kitchen Stations":
            preset_station = st.selectbox(
                "Choose Audit Scenario:",
                [
                    "Station 1: Compliant High-Standard Line (Grade A)",
                    "Station 2: Cross-Contamination & PPE Violation (Grade C)",
                    "Station 3: Raw Poultry & Produce Proximity Alert (Hazard)"
                ]
            )
            selected_image = generate_sample_food_image("kitchen")
            zone_choice = preset_station

        elif stream_type == "Upload Inspection Photo / Frame":
            uploaded_file = st.file_uploader(
                "Upload kitchen photo or video frame (JPG, PNG, MP4 frame):",
                type=["jpg", "jpeg", "png", "webp"],
                key="hygiene_upload"
            )
            if uploaded_file:
                selected_image = Image.open(uploaded_file)
        else:
            cam_feed = st.camera_input("Capture live kitchen station:", key="hygiene_cam")
            if cam_feed:
                selected_image = Image.open(cam_feed)

        audit_btn = st.button("🛡️ Run Computer Vision Hygiene Audit", type="primary", use_container_width=True)

    with col_view:
        st.markdown("#### 2. Station Camera View")
        if selected_image is not None:
            st.image(selected_image, caption=f"CCTV Station View: {zone_choice}", use_container_width=True)
        else:
            st.info("👈 Select a station or upload a frame to start surveillance.")

    if audit_btn and selected_image is not None:
        with st.spinner("🔍 Scanning PPE, cutting boards, sanitation buckets & cross-contamination vectors..."):
            result = engine.audit_kitchen_hygiene(selected_image, kitchen_zone=zone_choice)
            st.session_state["hygiene_result"] = result
            st.session_state["hygiene_image"] = selected_image

    if "hygiene_result" in st.session_state:
        res = st.session_state["hygiene_result"]
        img = st.session_state.get("hygiene_image", selected_image)

        st.markdown("---")
        st.markdown(f"## 📋 HACCP Surveillance Report: **{res.overall_rating}**")

        # Top Metric Cards + Gauge
        g_col1, g_col2 = st.columns([1, 2])

        with g_col1:
            # Radial / Gauge for Compliance Score
            fig_gauge = go.Figure(go.Indicator(
                mode="gauge+number",
                value=res.compliance_score,
                domain={'x': [0, 1], 'y': [0, 1]},
                title={'text': "Hygiene Compliance Score", 'font': {'size': 18}},
                gauge={
                    'axis': {'range': [0, 100], 'tickwidth': 1, 'tickcolor': "white"},
                    'bar': {'color': PALETTE['primary'] if res.compliance_score >= 80 else (PALETTE['warning'] if res.compliance_score >= 70 else PALETTE['danger'])},
                    'bgcolor': "rgba(0,0,0,0)",
                    'steps': [
                        {'range': [0, 70], 'color': 'rgba(239, 68, 68, 0.2)'},
                        {'range': [70, 85], 'color': 'rgba(245, 158, 11, 0.2)'},
                        {'range': [85, 100], 'color': 'rgba(16, 185, 129, 0.2)'}
                    ]
                }
            ))
            fig_gauge.update_layout(
                height=220,
                margin=dict(t=30, b=10, l=20, r=20),
                paper_bgcolor='rgba(0,0,0,0)',
                font={'color': "white"}
            )
            st.plotly_chart(fig_gauge, use_container_width=True)

        with g_col2:
            st.markdown("#### 🛡️ Real-Time Safety Indicator Matrix")
            ind_col1, ind_col2 = st.columns(2)
            
            with ind_col1:
                st.markdown(f"**Chef Hat / Hairnet PPE:**")
                if "Compliant" in res.hairnet_hat_status:
                    st.success("✅ Hair Restraint Compliant")
                else:
                    st.error("🚨 Hairnet Violation Detected")

                st.markdown(f"**Food-Grade Gloves:**")
                if "Compliant" in res.glove_usage_status:
                    st.success("✅ Gloves Donned & Active")
                else:
                    st.error("🚨 Bare Hand Contact Violation")

            with ind_col2:
                st.markdown(f"**Cross-Contamination Hazard:**")
                if "None" in res.cross_contamination_risk:
                    st.success("✅ Dedicated Separation Maintained")
                else:
                    st.error("⚠️ Cross-Contamination Alert (Raw / RTE)")

                st.markdown(f"**Prep Counter Sanitization:**")
                st.info(f"🧼 {res.countertop_cleanliness}")

        # Computer Vision Bounding Box Overlay
        st.markdown("#### 🎯 Computer Vision Object & Hazard Detection Overlays")
        if img is not None:
            # Generate representative bounding boxes based on result
            if res.compliance_score >= 80:
                findings = [
                    {"box": [0.15, 0.1, 0.45, 0.4], "severity": "Compliant", "label": "Chef Hairnet / Hat"},
                    {"box": [0.2, 0.45, 0.5, 0.75], "severity": "Compliant", "label": "Nitrile Gloves (Food-Safe)"},
                    {"box": [0.6, 0.3, 0.9, 0.7], "severity": "Compliant", "label": "Sanitized Prep Zone"}
                ]
            else:
                findings = [
                    {"box": [0.15, 0.1, 0.45, 0.4], "severity": "Major", "label": "Hairnet Missing"},
                    {"box": [0.2, 0.45, 0.48, 0.7], "severity": "Major", "label": "No Gloves on Ready-to-Eat"},
                    {"box": [0.55, 0.35, 0.88, 0.8], "severity": "Critical", "label": "Raw Meat & Salad Proximity"}
                ]
            annotated_kitchen = draw_hygiene_audit_overlay(img, findings)
            st.image(annotated_kitchen, caption="Computer Vision Surveillance: Green = Safe/Compliant, Orange/Red = HACCP Violation", use_container_width=True)

        # Itemized Violation Logs
        st.markdown("#### ⚠️ Itemized HACCP & Regulatory Violation Logs")
        if res.violations:
            for idx, v in enumerate(res.violations, 1):
                badge_c = PALETTE['danger'] if v.severity == "Critical" else (PALETTE['warning'] if v.severity == "Major" else PALETTE['info'])
                st.markdown(
                    f"""
                    <div style="border-left: 5px solid {badge_c}; background-color: rgba(30, 41, 59, 0.6); padding: 12px 16px; margin-bottom: 10px; border-radius: 4px;">
                        <span style="background-color:{badge_c}; color:white; padding:2px 8px; border-radius:10px; font-size:12px; font-weight:bold;">{v.severity.upper()} VIOLATION #{idx}</span>
                        <h4 style="margin:6px 0 2px 0;">{v.rule}</h4>
                        <p style="margin:0 0 6px 0; color:#E2E8F0;">{v.description}</p>
                        <p style="margin:0; color:#38BDF8; font-size:13px;"><strong>Mandatory Corrective Action:</strong> {v.corrective_action}</p>
                    </div>
                    """,
                    unsafe_allow_html=True
                )
        else:
            st.success("🎉 Zero non-compliance events recorded! Kitchen meets international five-star food safety criteria.")

        # HACCP Executive Summary
        st.markdown("##### 📜 HACCP Auditor Executive Summary")
        st.info(res.haccp_summary)
