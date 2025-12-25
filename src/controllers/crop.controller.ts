import { Request, Response } from 'express';
import Crop from '../models/crop.model';
import { logActivity } from '../middleware/activityLogger.middleware'; // ADD THIS LINE
import mongoose from 'mongoose'; // ADD THIS LINE

export const createCrop = async (req: Request, res: Response) => {
  try {
    const crop = await Crop.create(req.body);

    // Integrate activity logging for Crop creation
    // Assuming req.user is populated by an authentication middleware
    const userId = (req as any).user?._id || new mongoose.Types.ObjectId('60d0fe4f5b5e7e001c8c9c0f'); // Placeholder

    await logActivity(
        userId,
        'CROP_CREATED',
        'Crop',
        crop._id,
        {
            cropName: crop.name, // Example detail
            // Other relevant details from req.body could be added here
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
        // Assuming req.user is populated by an authentication middleware
        const userId = (req as any).user?._id || new mongoose.Types.ObjectId('60d0fe4f5b5e7e001c8c9c0f'); // Placeholder

        // Fetch the crop before update
        const cropBeforeUpdate = await Crop.findById(cropId);
        if (!cropBeforeUpdate) {
            res.status(404).json({ success: false, message: 'Crop not found' });
            return;
        }

        const crop = await Crop.findByIdAndUpdate(cropId, req.body, { new: true, runValidators: true }); // Added runValidators: true
        if (!crop) {
            res.status(404).json({ success: false, message: 'Crop not found' });
            return;
        }

        // Integrate activity logging for Crop update
        await logActivity(
            userId,
            'CROP_UPDATED',
            'Crop',
            crop._id,
            {
                before: cropBeforeUpdate.toObject(), // Capture 'before' state
                after: crop.toObject(), // Capture 'after' state
                changes: req.body, // Capture what was sent in the request body for change context
            }
        );

        res.status(200).json({ success: true, data: crop });
    } catch (error) {
        res.status(500).json({ success: false, error });
    }
};

export const deleteCrop = async (req: Request, res: Response) => {
    try {
        const crop = await Crop.findByIdAndDelete(req.params.id);
        if (!crop) {
            res.status(404).json({ success: false, message: 'Crop not found' });
            return;
        }
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, error });
    }
};
