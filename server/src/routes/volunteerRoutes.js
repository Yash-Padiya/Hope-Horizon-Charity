const express = require('express');
const router = express.Router();
const volunteerController = require('../controllers/volunteerController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware('admin'), volunteerController.createVolunteer);
router.get('/', authMiddleware('admin'), volunteerController.getAllVolunteers);
router.get('/:volunteerId', authMiddleware('admin'), volunteerController.getVolunteerById);
router.put('/:volunteerId', authMiddleware('admin'), volunteerController.updateVolunteer);
router.delete('/:volunteerId', authMiddleware('admin'), volunteerController.deleteVolunteer);
router.patch('/mark-left/:volunteerId', authMiddleware('admin'), volunteerController.markVolunteerAsLeft);

module.exports = router;