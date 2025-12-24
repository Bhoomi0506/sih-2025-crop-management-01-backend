import { Router } from 'express';
import * as CropController from '../controllers/crop.controller';

const router = Router();

router.post('/', CropController.createCrop);
router.get('/', CropController.getCrops);

export default router;
