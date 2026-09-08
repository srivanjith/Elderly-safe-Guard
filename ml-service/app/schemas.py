from pydantic import BaseModel, Field
from typing import List

class RiskPredictionRequest(BaseModel):
    amount: float = Field(..., description="Transaction amount in INR")
    averageAmount: float = Field(default=2000.0, description="User historical average transaction amount")
    isNewRecipient: bool = Field(default=False, description="Is recipient brand new to user")
    transactionFrequency: int = Field(default=1, description="Number of transactions in last 1 hour")
    transactionHour: int = Field(default=12, description="Hour of the transaction (0-23)")
    deviceChanged: bool = Field(default=False, description="Is user sending from a new device")
    previousSuspiciousActivity: bool = Field(default=False, description="User has past flagged fraud attempts")

class RiskPredictionResponse(BaseModel):
    riskScore: int = Field(..., description="Risk score from 0 to 100")
    anomalyScore: float = Field(..., description="Machine learning anomaly score (-1 to 1)")
    riskLevel: str = Field(..., description="LOW, MEDIUM, or HIGH")
    reasons: List[str] = Field(..., description="List of risk factors detected")
