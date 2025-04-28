from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
import numpy as np
from PIL import Image
from io import BytesIO
import logging
import os
import json
import re
import pickle
import cv2
from google import genai

app = FastAPI()

@app.get("/")
def sample():
    return "hello from model"

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Model and class indices paths
MODEL_PATH = "plant_disease_prediction_model_mobilenet.pkl"
CLASS_INDICES_PATH = "class_indices.json"

# Set up Gemini client exactly as in your first code
client = genai.Client(api_key="AIzaSyBM7APqzGCCfFxMPtERUVzxDp-vnbXi_Y4")

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
    class_indices = {int(k): v for k, v in class_indices.items()}
    logger.info("Model and class indices loaded successfully")
except Exception as e:
    logger.error(f"Error loading files: {e}")
    raise

def is_leaf_image(image: Image.Image) -> bool:
    """Quick check if uploaded image looks like a leaf/plant."""
    try:
        image = image.convert('RGB').resize((224, 224))
        img_array = np.array(image)
        hsv = cv2.cvtColor(img_array, cv2.COLOR_RGB2HSV)
        green  = cv2.inRange(hsv, (25,  40,  40), (85, 255, 255))
        yellow = cv2.inRange(hsv, (15,  50,  50), (35, 255, 255))
        brown  = cv2.inRange(hsv, (10, 100,  20), (20, 255, 200))
        leaf_mask = cv2.bitwise_or(green, cv2.bitwise_or(yellow, brown))
        leaf_ratio = np.count_nonzero(leaf_mask) / (224 * 224)
        return leaf_ratio > 0.10
    except Exception as e:
        logger.error(f"Error checking leaf image: {e}")
        return False

def load_and_preprocess_image(image: Image.Image) -> np.ndarray:
    """Preprocess image for model prediction."""
    try:
        image = image.convert('RGB').resize((224, 224))
        arr = np.array(image).astype('float32') / 255.0
        return np.expand_dims(arr, axis=0)
    except Exception as e:
        logger.error(f"Error preprocessing image: {e}")
        raise HTTPException(status_code=400, detail="Invalid image format")

@app.post("/predict1", response_class=JSONResponse)
async def predict(file: UploadFile = File(...)):
    try:
        if not file.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="Please upload an image file")

        contents = await file.read()
        image = Image.open(BytesIO(contents))

        # Leaf check
        if not is_leaf_image(image):
            raise HTTPException(status_code=400, detail="Invalid image. Please upload a clear leaf image.")

        # Predict
        processed = load_and_preprocess_image(image)
        predictions = model.predict(processed)
        idx = int(np.argmax(predictions))
        confidence = float(np.max(predictions))

        # Class name
        class_name = class_indices.get(idx, "Unknown")
        if isinstance(class_name, bytes):
            class_name = class_name.decode('utf-8')

        # Health status
        health_status = "healthy" if "healthy" in class_name.lower() else "diseased"

        # Gemini advice if diseased
        if health_status != "healthy":
            prompt = (
                f"Provide a concise brief solution to treat {class_name} in plants. "
                "Include organic and chemical options. Maximum 70 words. "
                "[Don't give introduction, just start telling solution]"
            )
            response = client.models.generate_content(
                model="gemini-2.0-flash",
                contents=prompt
            )
            clean_text = response.text.strip().replace("*", "").replace('"', '').replace("\n", " ")
            clean_text = re.sub(r"\s+", " ", clean_text)
        else:
            clean_text = "No Care Needed"

        return {
            "filename": file.filename,
            "prediction": health_status,
            "confidence": round(confidence, 4),
            "class_name": class_name,
            "class_index": idx,
            "genimi": clean_text
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Prediction error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Error processing image")

if __name__ == "__name__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)