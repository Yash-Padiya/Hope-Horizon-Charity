const express = require("express");
const eventController = require("../controllers/eventController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", authMiddleware("admin"), eventController.createEvent);
router.get("/", eventController.getAllEvents);
router.get("/find/:eventId", eventController.getEventById);
// Update an event (admin only)
router.put("/:eventId", authMiddleware("admin"), eventController.updateEvent);
// Delete an event (admin only)
router.delete(
  "/:eventId",
  authMiddleware("admin"),
  eventController.deleteEvent
);
module.exports = router;
