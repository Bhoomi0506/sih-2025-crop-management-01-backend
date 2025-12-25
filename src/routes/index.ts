import { Router } from 'express';
import userRoutes from './user.routes';
import cropRoutes from './crop.routes';
import activityRoutes from './activity.routes'; // ADD THIS LINE

const router = Router();

router.use('/users', userRoutes);
router.use('/crops', cropRoutes);
router.use('/activities', activityRoutes); // ADD THIS LINE

export default router;
