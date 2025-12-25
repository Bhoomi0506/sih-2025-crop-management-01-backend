import { Request, Response } from 'express';
import Field from '../models/field.model';
import { logActivity } from '../middleware/activityLogger.middleware'; // ADD THIS LINE
import mongoose from 'mongoose'; // ADD THIS LINE

export const createField = async (req: Request, res: Response) => {
  try {
    const field = await Field.create(req.body);

    // Integrate activity logging for Field creation
    // Assuming req.user is populated by an authentication middleware
    const userId = (req as any).user?._id || new mongoose.Types.ObjectId('60d0fe4f5b5e7e001c8c9c0f'); // Placeholder

    await logActivity(
        userId,
        'FIELD_CREATED',
        'Field',
        field._id,
        {
            fieldName: field.name, // Example detail
            // Other relevant details from req.body could be added here
        }
    );

    res.status(201).json({ success: true, data: field });
  } catch (error) {
    res.status(400).json({ success: false, error });
  }
};

export const getFields = async (req: Request, res: Response) => {
  try {
    const fields = await Field.find().populate('farmer');
    res.status(200).json({ success: true, data: fields });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

export const getFieldById = async (req: Request, res: Response) => {
    try {
        const field = await Field.findById(req.params.id).populate('farmer');
        if (!field) {
            res.status(404).json({ success: false, message: 'Field not found' });
            return;
        }
        res.status(200).json({ success: true, data: field });
    } catch (error) {
        res.status(500).json({ success: false, error });
    }
};

export const updateField = async (req: Request, res: Response) => {
    try {
        const fieldId = req.params.id;
        const userId = (req as any).user?._id || new mongoose.Types.ObjectId('60d0fe4f5b5e7e001c8c9c0f'); // Placeholder

        // Fetch the field before update
        const fieldBeforeUpdate = await Field.findById(fieldId);
        if (!fieldBeforeUpdate) {
            res.status(404).json({ success: false, message: 'Field not found' });
            return;
        }

        const field = await Field.findByIdAndUpdate(fieldId, req.body, { new: true, runValidators: true });
        if (!field) { // This check is mostly redundant if fieldBeforeUpdate was found
            res.status(404).json({ success: false, message: 'Field not found' });
            return;
        }

        // Integrate activity logging for Field update
        await logActivity(
            userId,
            'FIELD_UPDATED',
            'Field',
            field._id,
            {
                before: fieldBeforeUpdate.toObject(), // Capture 'before' state
                after: field.toObject(), // Capture 'after' state
                changes: req.body, // Capture what was sent in the request body for change context
            }
        );

        res.status(200).json({ success: true, data: field });
    } catch (error) {
        res.status(500).json({ success: false, error });
    }
};

export const deleteField = async (req: Request, res: Response) => {
    try {
        const field = await Field.findByIdAndDelete(req.params.id);
        if (!field) {
            res.status(404).json({ success: false, message: 'Field not found' });
            return;
        }
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, error });
    }
};
