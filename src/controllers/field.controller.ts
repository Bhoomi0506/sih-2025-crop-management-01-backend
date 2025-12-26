import { Request, Response } from 'express';
import Field from '../models/field.model';
import { logActivity } from '../middleware/activityLogger.middleware';
import mongoose from 'mongoose';

export const createField = async (req: Request, res: Response) => {
  try {
    const field = (await Field.create(req.body)) as any;

    const userId = (req as any).user?._id || new mongoose.Types.ObjectId('60d0fe4f5b5e7e001c8c9c0f');

    await logActivity(
        userId,
        'FIELD_CREATED',
        'Field',
        field._id,
        {
            fieldName: field.name,
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
        const userId = (req as any).user?._id || new mongoose.Types.ObjectId('60d0fe4f5b5e7e001c8c9c0f');

        const fieldBeforeUpdate = await Field.findById(fieldId);
        if (!fieldBeforeUpdate) {
            res.status(404).json({ success: false, message: 'Field not found' });
            return;
        }

        const field = (await Field.findByIdAndUpdate(fieldId, req.body, { new: true, runValidators: true })) as any;
        if (!field) {
            res.status(404).json({ success: false, message: 'Field not found' });
            return;
        }

        await logActivity(
            userId,
            'FIELD_UPDATED',
            'Field',
            field._id,
            {
                before: fieldBeforeUpdate.toObject(),
                after: field.toObject(),
                changes: req.body,
            }
        );

        res.status(200).json({ success: true, data: field });
    } catch (error) {
        res.status(500).json({ success: false, error });
    }
};

export const deleteField = async (req: Request, res: Response) => {
    try {
        const fieldId = req.params.id;
        const userId = (req as any).user?._id || new mongoose.Types.ObjectId('60d0fe4f5b5e7e001c8c9c0f');

        const fieldToDelete = await Field.findById(fieldId);
        if (!fieldToDelete) {
            res.status(404).json({ success: false, message: 'Field not found' });
            return;
        }

        const field = await Field.findByIdAndDelete(fieldId);
        if (!field) {
            res.status(404).json({ success: false, message: 'Field not found' });
            return;
        }

        await logActivity(
            userId,
            'FIELD_DELETED',
            'Field',
            new mongoose.Types.ObjectId(fieldId), // Cast string ID to ObjectId
            {
                fieldName: fieldToDelete.name,
                deletedFieldData: fieldToDelete.toObject(),
            }
        );

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, error });
    }
};
