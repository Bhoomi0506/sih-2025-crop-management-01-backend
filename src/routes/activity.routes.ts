import { Router } from 'express';
import { getActivities } from '../controllers/activity.controller';
import { authorize } from '../middleware/rbac.middleware'; // Import authorize
// import { authenticate } from '../middleware/auth.middleware'; // Assuming this middleware populates req.user

const router = Router();

router.get('/activities', 
    // authenticate, // Placeholder: Authentication middleware should populate req.user
    authorize('admin'), // Apply authorization for 'admin' role
    getActivities
);

export default router;
