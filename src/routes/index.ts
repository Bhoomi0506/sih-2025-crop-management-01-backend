import { Router } from 'express';
import userRoutes from './user.routes';
import cropRoutes from './crop.routes';
import fieldRoutes from './field.routes';
import activityRoutes from './activity.routes';
import authRoutes from './Auth.route';

const router = Router();

router.use('/users', userRoutes);
router.use('/crops', cropRoutes);
router.use('/fields', fieldRoutes);
router.use('/activities', activityRoutes);
router.use('/auth', authRoutes);

export default router;
