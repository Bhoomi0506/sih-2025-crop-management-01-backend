import mongoose from 'mongoose';
import Activity from '../models/activity.model';

/**
 * Deletes activity logs older than a specified duration.
 * This function is intended to be called by a scheduled job.
 * @param retentionDays The number of days to retain activity logs. Defaults to 365 (1 year).
 * @returns The number of deleted documents.
 */
export const cleanOldActivityLogs = async (retentionDays: number = 365): Promise<number> => {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

    const result = await Activity.deleteMany({
      createdAt: { $lt: cutoffDate },
    });

    console.log(`Deleted ${result.deletedCount} activity logs older than ${retentionDays} days.`);
    return result.deletedCount;
  } catch (error) {
    console.error('Error cleaning old activity logs:', error);
    throw error;
  }
};
