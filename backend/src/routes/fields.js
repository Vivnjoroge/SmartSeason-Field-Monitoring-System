// Field route definitions with auth and role guards.
const express = require('express');
const auth = require('../middleware/auth');
const requireRole = require('../middleware/requireRole');
const fieldController = require('../controllers/fieldController');

const router = express.Router();

router.use(auth);

router.get('/', fieldController.getFields);
router.post('/', requireRole('admin'), fieldController.createField);
router.get('/:id', fieldController.getFieldById);
router.patch('/:id/stage', requireRole('agent'), fieldController.updateStage);
router.post('/:id/notes', requireRole('agent'), fieldController.addNote);

module.exports = router;
