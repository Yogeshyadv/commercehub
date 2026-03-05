const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', notificationController.getMyNotifications);
router.put('/read-all', notificationController.markAllRead);
router.delete('/clear-all', notificationController.clearAll);
router.put('/:id/read', notificationController.markAsRead);

module.exports = router;
