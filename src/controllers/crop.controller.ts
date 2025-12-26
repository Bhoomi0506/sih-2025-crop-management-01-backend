import { Request, Response } from 'express';
import Crop from '../models/crop.model';
import { logActivity } from '../middleware/activityLogger.middleware';
import mongoose from 'mongoose';

export const createCrop = async (req: Request, res: Response) => {
  try {
    const crop = (await Crop.create(req.body)) as any;

    // Integrate activity logging for Crop creation
    const userId = (req as any).user?._id || new mongoose.Types.ObjectId('60d0fe4f5b5e7e001c8c9c0f');

    await logActivity(
        userId,
        'CROP_CREATED',
        'Crop',
        crop._id,
        {
            cropName: crop.name,
        }
    );

    res.status(201).json({ success: true, data: crop });
  } catch (error) {
    res.status(400).json({ success: false, error });
  }
};

export const getCrops = async (req: Request, res: Response) => {
  try {
    const crops = await Crop.find().populate('farmer');
    res.status(200).json({ success: true, data: crops });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

export const getCropById = async (req: Request, res: Response) => {
    try {
        const crop = await Crop.findById(req.params.id).populate('farmer');
        if (!crop) {
            res.status(404).json({ success: false, message: 'Crop not found' });
            return;
        }
        res.status(200).json({ success: true, data: crop });
    } catch (error) {
        res.status(500).json({ success: false, error });
    }
};

export const updateCrop = async (req: Request, res: Response) => {
    try {
        const cropId = req.params.id;
        const userId = (req as any).user?._id || new mongoose.Types.ObjectId('60d0fe4f5b5e7e001c8c9c0f');

        const cropBeforeUpdate = await Crop.findById(cropId);
        if (!cropBeforeUpdate) {
            res.status(404).json({ success: false, message: 'Crop not found' });
            return;
        }

        const crop = (await Crop.findByIdAndUpdate(cropId, req.body, { new: true, runValidators: true })) as any;
        if (!crop) {
            res.status(404).json({ success: false, message: 'Crop not found' });
            return;
        }

        await logActivity(
            userId,
            'CROP_UPDATED',
            'Crop',
            crop._id,
            {
                before: cropBeforeUpdate.toObject(),
                after: crop.toObject(),
                changes: req.body,
            }
        );

        res.status(200).json({ success: true, data: crop });
    } catch (error) {
        res.status(500).json({ success: false, error });
    }
};

export const deleteCrop = async (req: Request, res: Response) => {
    try {
        const cropId = req.params.id;
        const userId = (req as any).user?._id || new mongoose.Types.ObjectId('60d0fe4f5b5e7e001c8c9c0f');

        const cropToDelete = await Crop.findById(cropId);
        if (!cropToDelete) {
            res.status(404).json({ success: false, message: 'Crop not found' });
            return;
        }

        const crop = await Crop.findByIdAndDelete(cropId);
        if (!crop) {
            res.status(404).json({ success: false, message: 'Crop not found' });
            return;
        }

        await logActivity(
            userId,
            'CROP_DELETED',
            'Crop',
            new mongoose.Types.ObjectId(cropId), // Cast string ID to ObjectId
            {
                cropName: cropToDelete.name,
                deletedCropData: cropToDelete.toObject(),
            }
        );

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, error });
    }
};
