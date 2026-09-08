import AuditLog from '../models/AuditLog';

export class AuditService {
  public static async log(
    action: string,
    entity: string,
    userId?: string,
    entityId?: string,
    metadata: Record<string, any> = {}
  ): Promise<void> {
    try {
      await AuditLog.create({
        userId,
        action,
        entity,
        entityId,
        metadata,
        timestamp: new Date()
      });
    } catch (err) {
      console.error('[AuditService] Failed to write audit log:', err);
    }
  }
}
