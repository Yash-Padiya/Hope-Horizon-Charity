const express = require('express');
const router = express.Router();
const supportController = require('../controllers/supportController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware('donor'), supportController.createSupport);
router.get('/', authMiddleware('admin'), supportController.getAllSupports);
router.put('/set-status/:supportId', authMiddleware('admin'), supportController.updateSupportStatus);

module.exports = router;