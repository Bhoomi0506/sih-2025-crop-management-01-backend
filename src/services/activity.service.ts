import Activity, { IActivity } from '../models/activity.model';

class ActivityService {
  /**
   * Logs a new activity.
   * @param activityData Partial activity data to create a new activity record.
   * @returns The created activity document.
   */
  public async createActivity(activityData: Partial<IActivity>): Promise<IActivity> {
    const activity = new Activity(activityData);
    return activity.save();
  }

  /**
   * Retrieves activity logs with optional filters and pagination.
   * @param filters An object containing filtering criteria (e.g., userId, action, entityType, dateRange).
   * @param pagination An object containing pagination options (e.g., page, limit).
   * @returns An object containing an array of activities and the total count.
   */
  public async getActivities(
    filters: Record<string, any> = {},
    pagination: { page?: number; limit?: number } = {}
  ): Promise<{ activities: IActivity[]; total: number }> {
    const { page = 1, limit = 10 } = pagination;
    const skip = (page - 1) * limit;

    // Build Mongoose query from filters
    const query: Record<string, any> = {};

    if (filters.userId) {
      query.userId = filters.userId;
    }
    if (filters.action) {
      query.action = filters.action;
    }
    if (filters.entityType) {
      query.entityType = filters.entityType;
    }
    if (filters.startDate || filters.endDate) {
      query.createdAt = {};
      if (filters.startDate) {
        query.createdAt.$gte = new Date(filters.startDate);
      }
      if (filters.endDate) {
        query.createdAt.$lte = new Date(filters.endDate);
      }
    }

    const activities = await Activity.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }) // Sort by newest first
      .exec();

    const total = await Activity.countDocuments(query).exec();

    return { activities, total };
  }
}

export default new ActivityService();
