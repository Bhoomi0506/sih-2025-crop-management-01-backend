import { Request, Response } from 'express';
import ActivityService from '../services/activity.service';
import mongoose from 'mongoose';

export const getActivities = async (req: Request, res: Response) => {
  try {
    // Extract filters from query parameters
    const { userId, action, entityType, startDate, endDate, page, limit } = req.query;

    const filters: Record<string, any> = {};
    if (userId && typeof userId === 'string' && mongoose.Types.ObjectId.isValid(userId)) {
      filters.userId = new mongoose.Types.ObjectId(userId);
    }
    if (action && typeof action === 'string') {
      filters.action = action;
    }
    if (entityType && typeof entityType === 'string') {
      filters.entityType = entityType;
    }
    if (startDate && typeof startDate === 'string') {
      filters.startDate = startDate;
    }
    if (endDate && typeof endDate === 'string') {
      filters.endDate = endDate;
    }

    // Extract pagination parameters
    const pagination = {
      page: parseInt(page as string) || 1,
      limit: parseInt(limit as string) || 10,
    };

    const { activities, total } = await ActivityService.getActivities(filters, pagination);

    res.status(200).json({
      success: true,
      message: 'Activity logs retrieved successfully',
      data: activities,
      meta: {
        totalDocs: total,
        limit: pagination.limit,
        page: pagination.page,
        totalPages: Math.ceil(total / pagination.limit),
        hasNextPage: pagination.page * pagination.limit < total,
        hasPrevPage: pagination.page > 1,
      },
    });
  } catch (error) {
    console.error('Error retrieving activity logs:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
