const express = require('express');
const router = express.Router();
const donationController = require('../controllers/donationController');
const authMiddleware = require('../middleware/authMiddleware');
// Route to create a donation
router.post('/', authMiddleware('donor'), donationController.createDonation);
// PayU success and failure routes
router.post("/payment-success", donationController.paymentSuccess);
router.post("/payment-failure", donationController.paymentFailure);
// Route to get a donation by ID for admin and donor
router.get("/:donationId",authMiddleware("donor"), donationController.getDonationById);
router.get("/find/my-donations", authMiddleware("donor"), donationController.getMyDonations);
// Route to get all donations for admin
router.get("/get-all/donations", authMiddleware("admin"), donationController.getAllDonations);
router.delete("/remove/", authMiddleware("admin"), donationController.deleteDonation);

module.exports = router;
