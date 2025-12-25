import { Request, Response, NextFunction } from 'express';
import ActivityService from '../services/activity.service';
import { IActivity } from '../models/activity.model';
import mongoose from 'mongoose';

/**
 * Logs an activity to the database.
 * This function can be called from various points in the application (controllers, services, other middleware).
 * @param userId The ID of the user performing the action.
 * @param action A descriptive string of the action performed.
 * @param entityType The type of entity primarily affected by the action.
 * @param entityId The ID of the specific entity affected (optional).
 * @param details Additional context for the action (optional).
 */
export const logActivity = async (
  userId: mongoose.Types.ObjectId,
  action: string,
  entityType: string,
  entityId?: mongoose.Types.ObjectId,
  details?: Record<string, any>
): Promise<void> => {
  try {
    await ActivityService.createActivity({
      userId,
      action,
      entityType,
      entityId,
      details,
    });
  } catch (error) {
    console.error('Failed to log activity:', error);
    // Depending on NFR3 (Reliability - gracefully handle failures),
    // we might want to push to a message queue or use a dedicated logging service here.
    // For now, just log the error.
  }
};

/**
 * Express middleware to log specific request activities.
 * This can be used for general requests like 'API_ACCESS' or 'ROUTE_ACCESS'.
 * For specific domain actions (e.g., CROP_CREATED), `logActivity` should be called directly from controllers/services.
 */
export const activityLoggerMiddleware = (action: string, entityType: string = 'System') => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Assuming req.user is populated by an authentication middleware
    const userId = (req as any).user?._id || null; // Replace with actual user ID extraction

    // Log the activity after the request has been processed and response sent
    // or before sending the response, depending on the requirement.
    // For simple request logging, we can log it here.
    // For more complex actions with entityId/details, it's better to call logActivity from controller.
    res.on('finish', async () => {
      // Only log if userId is available and action is relevant for generic middleware
      if (userId) {
        await logActivity(
          userId,
          action,
          entityType,
          undefined, // No specific entityId for generic API access
          {
            method: req.method,
            path: req.originalUrl,
            statusCode: res.statusCode,
            // Add other relevant details like IP, user-agent, etc.
          }
        );
      }
    });

    next();
  };
};
