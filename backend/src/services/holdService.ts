import { getHoldStore } from '../config/redis';
import Transaction from '../models/Transaction';
import { getSocketManager } from '../sockets/socketManager';

export interface IHeldTransaction {
  transactionId: string;
  senderId: string;
  guardianId: string;
  amount: number;
  recipientName: string;
  riskScore: number;
  riskReasons: string[];
  expiresAt: number;
}

const HOLD_PREFIX = 'transaction:hold:';
const DEFAULT_TTL_SECONDS = 600; // 10 minutes

export class HoldService {
  public static async holdTransaction(
    transactionId: string,
    senderId: string,
    guardianId: string,
    amount: number,
    recipientName: string,
    riskScore: number,
    riskReasons: string[]
  ): Promise<IHeldTransaction> {
    const expiresAt = Date.now() + DEFAULT_TTL_SECONDS * 1000;
    const data: IHeldTransaction = {
      transactionId,
      senderId,
      guardianId,
      amount,
      recipientName,
      riskScore,
      riskReasons,
      expiresAt
    };

    const store = getHoldStore();
    await store.set(
      `${HOLD_PREFIX}${transactionId}`,
      JSON.stringify(data),
      'EX',
      DEFAULT_TTL_SECONDS
    );

    return data;
  }

  public static async getHeldTransaction(transactionId: string): Promise<IHeldTransaction | null> {
    const store = getHoldStore();
    const raw = await store.get(`${HOLD_PREFIX}${transactionId}`);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as IHeldTransaction;
    } catch {
      return null;
    }
  }

  public static async releaseHold(transactionId: string): Promise<void> {
    const store = getHoldStore();
    await store.del(`${HOLD_PREFIX}${transactionId}`);
  }

  public static async checkExpiredHolds(): Promise<void> {
    const store = getHoldStore();
    const keys = await store.keys(`${HOLD_PREFIX}*`);
    const now = Date.now();

    for (const key of keys) {
      const raw = await store.get(key);
      if (!raw) continue;
      try {
        const item: IHeldTransaction = JSON.parse(raw);
        if (now >= item.expiresAt) {
          // Transaction has expired without guardian action
          await Transaction.findByIdAndUpdate(item.transactionId, {
            status: 'EXPIRED',
            guardianDecision: 'EXPIRED',
            guardianDecisionTime: new Date()
          });

          await store.del(key);

          // Notify sockets
          const io = getSocketManager();
          if (io) {
            io.to(`user:${item.senderId}`).emit('transaction:expired', {
              transactionId: item.transactionId,
              message: 'Transaction expired due to guardian approval timeout (10 mins).'
            });
            io.to(`guardian:${item.guardianId}`).emit('transaction:expired', {
              transactionId: item.transactionId
            });
          }
        }
      } catch (err) {
        console.error('[HoldService] Expiry process error:', err);
      }
    }
  }
}
