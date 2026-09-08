import axios from 'axios';
import Transaction from '../models/Transaction';
import User from '../models/User';

export interface IFraudCheckInput {
  senderId: string;
  amount: number;
  recipientId: string;
  deviceChanged?: boolean;
}

export interface IFraudCheckResult {
  riskScore: number;
  anomalyScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  reasons: string[];
}

export class FraudEngineService {
  public static async analyzeTransaction(input: IFraudCheckInput): Promise<IFraudCheckResult> {
    const { senderId, amount, recipientId, deviceChanged = false } = input;

    // Fetch historical data for sender
    const user = await User.findById(senderId);
    const userBalance = user?.walletBalance || 150000;

    // Calculate historical transaction stats
    const pastTransactions = await Transaction.find({ senderId, status: { $in: ['COMPLETED', 'APPROVED'] } });
    const totalCount = pastTransactions.length;
    const avgAmount = totalCount > 0 
      ? pastTransactions.reduce((acc, t) => acc + t.amount, 0) / totalCount 
      : 2500;

    // Recipient check
    const recipientTransactions = await Transaction.find({ senderId, recipientId });
    const isNewRecipient = recipientTransactions.length === 0;

    // Frequency in last 1 hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentTxCount = await Transaction.countDocuments({
      senderId,
      createdAt: { $gte: oneHourAgo }
    });

    // Check for previous suspicious activity (transactions flagged as HIGH risk or BLOCKED)
    const blockedCount = await Transaction.countDocuments({
      senderId,
      $or: [{ riskLevel: 'HIGH' }, { status: 'BLOCKED' }]
    });
    const previousSuspiciousActivity = blockedCount > 0;

    const currentHour = new Date().getHours();

    const payload = {
      amount,
      averageAmount: avgAmount,
      isNewRecipient,
      transactionFrequency: recentTxCount + 1,
      transactionHour: currentHour,
      deviceChanged,
      previousSuspiciousActivity
    };

    const mlServiceUrl = process.env.ML_SERVICE_URL || 'http://localhost:8000';

    try {
      const response = await axios.post(`${mlServiceUrl}/predict-risk`, payload, { timeout: 3000 });
      if (response.data && typeof response.data.riskScore === 'number') {
        return {
          riskScore: response.data.riskScore,
          anomalyScore: response.data.anomalyScore || 0,
          riskLevel: response.data.riskLevel || (response.data.riskScore > 60 ? 'HIGH' : response.data.riskScore > 30 ? 'MEDIUM' : 'LOW'),
          reasons: response.data.reasons || []
        };
      }
    } catch (err) {
      console.warn('[FraudEngine] ML Service unreachable, defaulting to internal rule-based engine.');
    }

    // Fallback Rule-Based Risk Calculation Engine
    let riskScore = 0;
    const reasons: string[] = [];

    const ratio = amount / Math.max(avgAmount, 100);
    if (amount >= 50000) {
      riskScore += 25;
      reasons.push("High-value transaction amount (≥ ₹50,000)");
    } else if (ratio >= 3.0) {
      riskScore += 30;
      reasons.push(`Amount is ${ratio.toFixed(1)}x higher than typical transfer pattern`);
    } else if (ratio >= 2.0) {
      riskScore += 20;
      reasons.push(`Amount significantly exceeds your average transfer of ₹${Math.round(avgAmount).toLocaleString()}`);
    }

    if (isNewRecipient) {
      riskScore += 20;
      reasons.push("Recipient is new with no prior transfer history");
    }

    if (recentTxCount >= 2) {
      riskScore += 20;
      reasons.push(`Multiple payment requests (${recentTxCount + 1}) within the last 60 minutes`);
    }

    if (currentHour >= 23 || currentHour <= 5) {
      riskScore += 15;
      reasons.push(`Unusual payment timing (${currentHour}:00 HRS)`);
    }

    if (previousSuspiciousActivity) {
      riskScore += 15;
      reasons.push("Account has prior flagged suspicious transactions");
    }

    riskScore = Math.min(riskScore, 100);
    const riskLevel = riskScore > 60 ? 'HIGH' : riskScore > 30 ? 'MEDIUM' : 'LOW';

    if (reasons.length === 0) {
      reasons.push("Standard transaction pattern verified");
    }

    return {
      riskScore,
      anomalyScore: 0,
      riskLevel,
      reasons
    };
  }
}
