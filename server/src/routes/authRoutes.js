const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh-token',authMiddleware('donor'), authController.refreshToken);
router.put('/update-user', authMiddleware('donor'), authController.updateUser);
router.put('/change-password', authMiddleware('donor'), authController.changePassword);
router.get('/fetch-details', authMiddleware('donor'), authController.getUserById);
router.post('/add-donor',authMiddleware('admin'), authController.addDonor);
router.get("/donors", authMiddleware('admin'), authController.getAllUsers);
router.delete("/remove-user/:userId", authMiddleware('admin'), authController.deleteUser);

module.exports = router;
