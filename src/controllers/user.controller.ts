import { Request, Response } from 'express';
import User from '../models/user.model';
// import bcrypt from 'bcryptjs'; // Uncomment when installed

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;
    
    // Basic validation
    if (!name || !email || !password) {
        res.status(400).json({ success: false, message: 'Please provide name, email and password' });
        return;
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        res.status(400).json({ success: false, message: 'User already exists' });
        return;
    }

    // TODO: Hash password
    // const salt = await bcrypt.genSalt(10);
    // const passwordHash = await bcrypt.hash(password, salt);
    const passwordHash = password; // TEMPORARY

    const user = await User.create({
      name,
      email,
      passwordHash,
      role
    });

    res.status(201).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().select('-passwordHash'); // Exclude password from response
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

export const getUserById = async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.params.id).select('-passwordHash');
        if (!user) {
            res.status(404).json({ success: false, message: 'User not found' });
            return;
        }
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, error });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).select('-passwordHash');
        if (!user) {
            res.status(404).json({ success: false, message: 'User not found' });
            return;
        }
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, error });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            res.status(404).json({ success: false, message: 'User not found' });
            return;
        }
    } catch (error) {
        res.status(500).json({ success: false, error });
    }
};

import { logActivity } from '../middleware/activityLogger.middleware';
import mongoose from 'mongoose';

export const logoutUser = async (req: Request, res: Response) => {
    try {
        // Assuming req.user is populated by an authentication middleware
        const userId = (req as any).user?._id || new mongoose.Types.ObjectId('60d0fe4f5b5e7e001c8c9c0f'); // Placeholder if req.user is not available yet

        await logActivity(
            userId,
            'USER_LOGOUT',
            'User',
            userId, // Entity is the user themselves
            { message: 'User logged out successfully' }
        );

        res.status(200).json({ success: true, message: 'Logged out successfully' });
    } catch (error) {
        console.error('Error logging out and recording activity:', error);
        res.status(500).json({ success: false, error: 'Internal server error during logout' });
    }
};

