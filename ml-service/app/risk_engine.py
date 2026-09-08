from app.schemas import RiskPredictionRequest, RiskPredictionResponse
from app.model import ml_detector

def calculate_risk(req: RiskPredictionRequest) -> RiskPredictionResponse:
    risk_score = 0
    reasons = []

    # 1. Transaction Amount Analysis
    avg_amt = max(req.averageAmount, 100.0)
    ratio = req.amount / avg_amt
    
    if req.amount >= 50000:
        risk_score += 25
        reasons.append("High-value transaction amount (≥ ₹50,000)")
    elif ratio >= 3.0:
        risk_score += 30
        reasons.append(f"Amount is {ratio:.1f}x higher than your average transfer pattern")
    elif ratio >= 2.0:
        risk_score += 20
        reasons.append(f"Amount is significantly higher than your normal transfer of ₹{req.averageAmount:,.0f}")
    elif ratio >= 1.5:
        risk_score += 10
        reasons.append("Amount is slightly higher than average")

    # 2. Recipient Analysis
    if req.isNewRecipient:
        risk_score += 20
        reasons.append("Recipient is new and has no previous transfer history with you")

    # 3. Frequency Analysis
    if req.transactionFrequency >= 3:
        risk_score += 20
        reasons.append(f"High frequency: {req.transactionFrequency} transactions initiated in the last hour")
    elif req.transactionFrequency > 1:
        risk_score += 10
        reasons.append("Multiple transfer attempts in a short timeframe")

    # 4. Transaction Hour Analysis (11 PM - 5 AM)
    if req.transactionHour >= 23 or req.transactionHour <= 5:
        risk_score += 15
        reasons.append(f"Unusual late-night transaction time ({req.transactionHour:02d}:00 HRS)")

    # 5. Device Security Analysis
    if req.deviceChanged:
        risk_score += 10
        reasons.append("Transaction initiated from an unrecognized device or location")

    # 6. Historical Risk Factor
    if req.previousSuspiciousActivity:
        risk_score += 15
        reasons.append("Account has recent flagged scam or suspicious payment activity")

    # 7. ML Isolation Forest Anomaly Detection
    is_odd_hour = 1.0 if (req.transactionHour >= 23 or req.transactionHour <= 5) else 0.0
    feature_vector = [
        min(ratio, 10.0),
        float(req.transactionFrequency),
        1.0 if req.isNewRecipient else 0.0,
        is_odd_hour,
        1.0 if req.deviceChanged else 0.0,
        1.0 if req.previousSuspiciousActivity else 0.0
    ]
    
    anomaly_score = ml_detector.predict_anomaly(feature_vector)
    
    # ML model anomaly contribution
    if anomaly_score < -0.1:
        risk_score += 20
        reasons.append("AI Anomaly Engine: Unusual transaction pattern detected by Isolation Forest")
    elif anomaly_score < 0.0:
        risk_score += 10
        reasons.append("AI Anomaly Engine: Minor deviation from behavioral baseline")

    # Cap final risk score at 100
    risk_score = min(risk_score, 100)

    # Determine Risk Level
    if risk_score <= 30:
        risk_level = "LOW"
    elif risk_score <= 60:
        risk_level = "MEDIUM"
    else:
        risk_level = "HIGH"

    # Default reason if none detected
    if not reasons:
        reasons.append("Normal transaction pattern verified")

    return RiskPredictionResponse(
        riskScore=risk_score,
        anomalyScore=round(anomaly_score, 4),
        riskLevel=risk_level,
        reasons=reasons
    )
