// User route definitions for admin user-management endpoints.
const express = require('express');
const auth = require('../middleware/auth');
const requireRole = require('../middleware/requireRole');
const userController = require('../controllers/userController');

const router = express.Router();

router.get('/', auth, requireRole('admin'), userController.getAgents);

module.exports = router;
