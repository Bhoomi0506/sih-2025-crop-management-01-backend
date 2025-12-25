import { Router, Request, Response } from 'express';
import User from '../models/user.model';
import { logoutUser } from '../controllers/user.controller'; // Import logoutUser
// Note: Install bcryptjs and jsonwebtoken for real security
// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';

const router = Router();

router.post('/register', async (req: Request, res: Response) => {
    try {
        const { name, email, password, role } = req.body;
        
        const existingUser = await User.findOne({ email });
        if (existingUser) {
             res.status(400).json({ success: false, message: 'User already exists' });
             return;
        }

        // TODO: Hash password
        // const passwordHash = await bcrypt.hash(password, 10);
        const passwordHash = password; 

        const user = await User.create({ name, email, passwordHash, role });
        res.status(201).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, error });
    }
});

router.post('/login', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        
        // TODO: Compare password
        // const isMatch = await bcrypt.compare(password, user.passwordHash);
        const isMatch = user && user.passwordHash === password;

        if (!isMatch) {
             res.status(401).json({ success: false, message: 'Invalid credentials' });
             return;
        }

        // TODO: Generate Token
        // const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET!, { expiresIn: '1d' });
        const token = 'mock-jwt-token';

        res.status(200).json({ success: true, token });
    } catch (error) {
        res.status(500).json({ success: false, error });
    }
});

router.post('/logout', logoutUser); // Use the imported logoutUser function

export default router;
