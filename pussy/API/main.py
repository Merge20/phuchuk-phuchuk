from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pickle
import pandas as pd
import numpy as np

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

with open("model.pkl", "rb") as f:
    model = pickle.load(f)

with open("mlb.pkl", "rb") as f:
    mlb = pickle.load(f)

description_df = pd.read_csv("symptom_Description.csv")
precaution_df = pd.read_csv("symptom_precaution.csv")

description_dict = dict(zip(description_df["Disease"], description_df["Description"]))

precaution_dict = {}
for i in range(len(precaution_df)):
    disease = precaution_df.iloc[i, 0]
    precautions = precaution_df.iloc[i, 1:5].tolist()

    clean_precautions = [
        str(p) for p in precautions if pd.notna(p)
    ]

    precaution_dict[disease] = clean_precautions

class SymptomInput(BaseModel):
    symptoms: list[str]

@app.get("/symptoms")
def get_symptoms():
    return {
        "symptoms": mlb.classes_.tolist()
    }

@app.post("/predict")
def predict_disease(data: SymptomInput):
    input_vector = mlb.transform([data.symptoms])
    probabilities = model.predict_proba(input_vector)[0]

    top_indices = np.argsort(probabilities)[-3:][::-1]

    results = []

    for index in top_indices:
        disease = model.classes_[index]
        confidence = float(probabilities[index])
        description = description_dict.get(disease, "No description available.")
        precautions = precaution_dict.get(disease, ["No precaution info available."])

        results.append({
            "disease": disease,
            "confidence": confidence,
            "description": description,
            "precautions": precautions
        })

    return {"predictions": results}