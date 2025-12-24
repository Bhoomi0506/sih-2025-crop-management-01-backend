import { Request, Response } from 'express';
import Crop from '../models/crop.model';

export const createCrop = async (req: Request, res: Response) => {
  try {
    const crop = await Crop.create(req.body);
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
        const crop = await Crop.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!crop) {
            res.status(404).json({ success: false, message: 'Crop not found' });
            return;
        }
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
