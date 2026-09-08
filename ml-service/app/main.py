import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.schemas import RiskPredictionRequest, RiskPredictionResponse
from app.risk_engine import calculate_risk

app = FastAPI(
    title="SafePay Guardian - ML Risk Engine API",
    version="1.0.0",
    description="AI-powered fraud risk assessment microservice using Hybrid Heuristics & Isolation Forest."
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {
        "status": "online",
        "service": "SafePay Guardian ML Risk Engine",
        "version": "1.0.0"
    }

@app.post("/predict-risk", response_model=RiskPredictionResponse)
def predict_risk(request: RiskPredictionRequest):
    try:
        result = calculate_risk(request)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Risk engine evaluation error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
