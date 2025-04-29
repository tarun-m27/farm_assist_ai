from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
import numpy as np
from PIL import Image
from io import BytesIO
import logging
import os
import json
import re
import pickle  # Changed import
import google.generativeai as genai  # Correct Gemini import

app = FastAPI()

@app.get("/")
def sample():
    return "Hello from model"

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Model and class indices paths
MODEL_PATH = "plant_disease_prediction_model_mobilenet.pkl"  # Changed to .pkl
CLASS_INDICES_PATH = "class_indices.json"

# Setup Google Gemini
genai.configure(api_key="AIzaSyC5Ob5IoYZcLBxUSEJ6xAm80iVUn04veyI")  # <-- Change API Key here
gemini_model = genai.GenerativeModel("gemini-1.5-pro")  # or "gemini-2.0", if available

# Verify files exist
if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(f"Model file not found at {MODEL_PATH}")
if not os.path.exists(CLASS_INDICES_PATH):
    raise FileNotFoundError(f"Class indices file not found at {CLASS_INDICES_PATH}")

# Load model and class indices
try:
    with open(MODEL_PATH, 'rb') as model_file:
        model = pickle.load(model_file)
        
    with open(CLASS_INDICES_PATH) as f:
        class_indices = json.load(f)
    # Convert string keys to integers
    class_indices = {int(k): v for k, v in class_indices.items()}
    logger.info("Model and class indices loaded successfully")
except Exception as e:
    logger.error(f"Error loading files: {e}")
    raise

def is_plant_image(image: Image.Image) -> bool:
    """Check if image has dominant green color."""
    try:
        img_array = np.array(image)
        if len(img_array.shape) != 3 or img_array.shape[2] != 3:
            return False
            
        green_pixels = np.sum((img_array[:, :, 1] > img_array[:, :, 0]) & 
                              (img_array[:, :, 1] > img_array[:, :, 2]))
        total_pixels = img_array.shape[0] * img_array.shape[1]
        return (green_pixels / total_pixels) > 0.2
    except Exception as e:
        logger.error(f"Error checking plant image: {e}")
        return False

def load_and_preprocess_image(image: Image.Image) -> np.ndarray:
    """Preprocess image for model prediction."""
    try:
        image = image.convert('RGB').resize((224, 224))
        img_array = np.array(image).astype('float32') / 255.0
        return np.expand_dims(img_array, axis=0)
    except Exception as e:
        logger.error(f"Error preprocessing image: {e}")
        raise HTTPException(status_code=400, detail="Invalid image format")

def calculate_rot_percentage(image: Image.Image) -> float:
    """Estimate rot (dark area) percentage in the image."""
    try:
        img_array = np.array(image.convert('RGB'))
        brightness = np.mean(img_array, axis=2)
        dark_pixels = np.sum(brightness < 80)  # pixels considered "rotted"
        total_pixels = brightness.size
        rot_percentage = (dark_pixels / total_pixels) * 100
        return rot_percentage
    except Exception as e:
        logger.error(f"Error calculating rot percentage: {e}")
        return 0.0

@app.post("/predict1", response_class=JSONResponse)
async def predict(file: UploadFile = File(...)):
    try:
        # Validate file type
        if not file.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="Please upload an image file")

        # Read and validate image
        contents = await file.read()
        image = Image.open(BytesIO(contents))
        if not is_plant_image(image):
            raise HTTPException(status_code=200, detail="Image doesn't appear to be a plant")

        # Preprocess and Predict
        processed_image = load_and_preprocess_image(image)
        predictions = model.predict(processed_image)
        predicted_class_index = int(np.argmax(predictions))
        confidence = float(np.max(predictions))
        
        # Get class name
        class_name = class_indices.get(predicted_class_index, "Unknown")
        if isinstance(class_name, bytes):
            class_name = class_name.decode('utf-8')
        
        # Determine health status
        health_status = "healthy" if "healthy" in class_name.lower() else "diseased"

        # Calculate rot percentage
        rot_percentage = calculate_rot_percentage(image)

        # Generate care advice based on rot
        if rot_percentage > 50:
            care_advice = "Infectious to other plants. Please isolate it."
        else:
            care_advice = "Apply pesticides to treat the infection."

        # Generate treatment advice from Gemini if diseased
        if health_status != "healthy":
            prompt = f"""Provide a concise brief solution to treat {class_name} in plants. 
            Include organic and chemical options. Maximum 70 words. [Don't give introduction, just start telling solution]"""
            response = gemini_model.generate_content(prompt)
            clean_text = response.text.strip().replace("*", "").replace('"', '').replace("\n", " ")
            clean_text = re.sub(r"\s+", " ", clean_text)
            
        else:
            clean_text = "No Care Needed"

        return {
            "filename": file.filename,
            "prediction": health_status,
            "confidence": round(confidence, 4),
            "class_name": class_name,
            "class_index": predicted_class_index,
            "gemini": clean_text,
            "rot_percentage": round(rot_percentage, 2),
            "care_advice": care_advice
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Prediction error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Error processing image")

if __name__ == "_main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
