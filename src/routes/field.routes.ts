import { Router } from 'express';
import * as FieldController from '../controllers/field.controller';

const router = Router();

router.post('/', FieldController.createField);
router.get('/', FieldController.getFields);
router.get('/:id', FieldController.getFieldById);
router.put('/:id', FieldController.updateField);
router.delete('/:id', FieldController.deleteField);

export default router;
