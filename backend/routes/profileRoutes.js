const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken } = require('../middleware/authMiddleware');

router.use(verifyToken);

router.get('/', userController.getProfile);
router.put('/', userController.updateProfile);

module.exports = router;
