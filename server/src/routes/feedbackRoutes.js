const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware('donor'), feedbackController.createFeedback);
router.get('/', feedbackController.getAllFeedbacks);

module.exports = router;
