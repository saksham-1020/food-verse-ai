"""
Food Verse AI - Computer Vision & Image Processing Helpers
Provides image encoding, resizing, inspection overlays, and sample image generators.
Skill Wallet Capstone Project 3 (Platform ID: 6ac4ca021dcde6d7857c169a)
"""

import io
import base64
from typing import Tuple, List, Optional, Dict, Any
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import numpy as np

def encode_image_to_base64(image: Image.Image, format: str = "JPEG") -> str:
    """Encodes a PIL Image into base64 string for LLM/VLM APIs."""
    buffered = io.BytesIO()
    # Convert RGBA to RGB if saving as JPEG
    if image.mode in ("RGBA", "P") and format.upper() == "JPEG":
        image = image.convert("RGB")
    image.save(buffered, format=format, quality=85)
    return base64.b64encode(buffered.getvalue()).decode("utf-8")

def resize_for_vlm(image: Image.Image, max_dim: int = 1024) -> Image.Image:
    """Resizes image keeping aspect ratio to optimize API payload and token cost."""
    w, h = image.size
    if max(w, h) > max_dim:
        scale = max_dim / float(max(w, h))
        new_size = (int(w * scale), int(h * scale))
        return image.resize(new_size, Image.Resampling.LANCZOS)
    return image

def draw_hygiene_audit_overlay(
    image: Image.Image,
    findings: List[Dict[str, Any]]
) -> Image.Image:
    """
    Overlays computer vision detection bounding boxes, badges, and warning tags
    on commercial kitchen inspection frames.
    """
    annotated = image.copy().convert("RGBA")
    overlay = Image.new("RGBA", annotated.size, (255, 255, 255, 0))
    draw = ImageDraw.Draw(overlay)
    width, height = annotated.size

    for item in findings:
        # Bounding box coordinates normalized (0.0 to 1.0) or default placement
        box = item.get("box", [0.1, 0.1, 0.4, 0.4])
        x1 = int(box[0] * width)
        y1 = int(box[1] * height)
        x2 = int(box[2] * width)
        y2 = int(box[3] * height)

        severity = item.get("severity", "Minor")
        label = item.get("label", "Detection")

        # Color mapping based on compliance vs violation
        if severity == "Critical":
            color = (239, 68, 68, 220)       # Red
            fill_box = (239, 68, 68, 40)
        elif severity == "Major":
            color = (249, 115, 22, 220)      # Orange
            fill_box = (249, 115, 22, 40)
        elif severity == "Compliant":
            color = (16, 185, 129, 220)      # Green
            fill_box = (16, 185, 129, 40)
        else:
            color = (59, 130, 246, 220)      # Blue
            fill_box = (59, 130, 246, 40)

        # Draw semi-transparent bounding box
        draw.rectangle([x1, y1, x2, y2], outline=color, width=3, fill=fill_box)

        # Draw header banner for label
        banner_h = 24
        draw.rectangle([x1, max(0, y1 - banner_h), x2, y1], fill=color)
        draw.text((x1 + 6, max(0, y1 - banner_h) + 4), f"{label} [{severity}]", fill=(255, 255, 255, 255))

    combined = Image.alpha_composite(annotated, overlay)
    return combined.convert("RGB")


def draw_freshness_heatmap_overlay(
    image: Image.Image,
    spoilage_spots: List[Dict[str, Any]]
) -> Image.Image:
    """
    Overlays freshness inspection zones indicating discoloration, mold, or firmness integrity.
    """
    annotated = image.copy().convert("RGBA")
    overlay = Image.new("RGBA", annotated.size, (255, 255, 255, 0))
    draw = ImageDraw.Draw(overlay)
    w, h = annotated.size

    for spot in spoilage_spots:
        cx = int(spot.get("x", 0.5) * w)
        cy = int(spot.get("y", 0.5) * h)
        radius = int(spot.get("radius", 0.15) * min(w, h))
        label = spot.get("tag", "Surface Inspection")
        is_spoilage = spot.get("is_spoiled", False)

        color = (239, 68, 68, 230) if is_spoilage else (16, 185, 129, 230)
        fill_c = (239, 68, 68, 60) if is_spoilage else (16, 185, 129, 60)

        draw.ellipse([cx - radius, cy - radius, cx + radius, cy + radius], outline=color, width=3, fill=fill_c)
        draw.text((cx - radius, cy - radius - 18), label, fill=color)

    combined = Image.alpha_composite(annotated, overlay)
    return combined.convert("RGB")


def generate_sample_food_image(dish_type: str = "salad") -> Image.Image:
    """
    Generates a stylized realistic placeholder image for demonstration testing
    when no camera or live image is provided.
    """
    width, height = 640, 480
    if "salmon" in dish_type.lower() or "bowl" in dish_type.lower():
        bg_color = (245, 230, 211)
        plate_color = (255, 255, 255)
        item_color = (235, 115, 85)     # Salmon pink
        garnish_color = (76, 175, 80)   # Greens
        title = "Mediterranean Salmon Quinoa Bowl"
    elif "paneer" in dish_type.lower() or "curry" in dish_type.lower():
        bg_color = (250, 235, 215)
        plate_color = (255, 248, 220)
        item_color = (220, 100, 30)     # Curry orange
        garnish_color = (255, 255, 240) # Paneer cubes
        title = "Paneer Butter Masala with Rice"
    elif "fresh" in dish_type.lower() or "apple" in dish_type.lower():
        bg_color = (240, 248, 255)
        plate_color = (255, 255, 255)
        item_color = (220, 40, 40)      # Crisp Red Apple
        garnish_color = (34, 139, 34)   # Green leaf
        title = "Crisp Gala Apple (Optimal Freshness)"
    elif "spoil" in dish_type.lower() or "mold" in dish_type.lower() or "banana" in dish_type.lower():
        bg_color = (230, 230, 230)
        plate_color = (245, 245, 245)
        item_color = (139, 90, 43)      # Dark brown spots
        garnish_color = (80, 110, 90)   # Mold spores
        title = "Dehydrated & Mold Spot Strawberries"
    elif "kitchen" in dish_type.lower() or "prep" in dish_type.lower():
        bg_color = (210, 220, 230)      # Stainless steel counter
        plate_color = (240, 240, 245)
        item_color = (180, 50, 50)      # Raw poultry board
        garnish_color = (40, 160, 60)   # Salad prep bowl
        title = "Commercial Kitchen Prep Station - Multi-Zone"
    else:
        bg_color = (240, 253, 244)
        plate_color = (255, 255, 255)
        item_color = (34, 197, 94)      # Vibrant green salad
        garnish_color = (249, 115, 22)  # Carrot / Tomato
        title = "Nutrient-Dense Garden Harvest Salad"

    img = Image.new("RGB", (width, height), bg_color)
    draw = ImageDraw.Draw(img)

    # Draw tabletop texture / vignette
    draw.ellipse([80, 40, width - 80, height - 40], fill=plate_color, outline=(200, 200, 200), width=4)
    # Draw food base
    draw.ellipse([140, 90, width - 140, height - 90], fill=item_color)
    # Draw decorative garnishes / detail elements
    for offset in range(-60, 80, 30):
        draw.ellipse([width//2 + offset, height//2 + offset//2, width//2 + offset + 40, height//2 + offset//2 + 35], fill=garnish_color)

    # Watermark text
    draw.rectangle([0, height - 48, width, height], fill=(15, 23, 42, 220))
    draw.text((20, height - 34), f"FoodVerse AI Sample Vision: {title}", fill=(248, 250, 252))

    return img
