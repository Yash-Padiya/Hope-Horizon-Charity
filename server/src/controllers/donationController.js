const Donation = require("../models/Donation");
const User = require("../models/User");
const Event = require("../models/Event");
const crypto = require("crypto");
const { payuClient } = require("../config/payu.config");
const key = process.env.PAYU_MERCHANT_KEY;

// Helper function to generate checksum
function generateChecksum(data) {
  const salt = process.env.PAYU_SALT;
  const dataString = `${key}|${data.txnid}|${data.amount}|${data.productinfo}|${data.firstname}|${data.email}|${data.udf1}|${data.udf2}|${data.udf3}|${data.udf4}|${data.udf5}|||||${salt}`;
  const checksum = crypto.createHash("sha512").update(dataString).digest("hex");

  return checksum;
}

exports.createDonation = async (req, res) => {
  try {
    const { eventId, amount, message } = req.body;
    const userId = req.user.userId;

    // Fetch user and event data
    const user = await User.findById(userId);
    const event = await Event.findById(eventId);

    if (!event) {
      return res
        .status(404)
        .json({ result: false, message: "Event not found", data: null });
    }
    const eventDetails = await Event.findById(event);
    if (!eventDetails) {
      return res.status(404).json({
        result: false,
        message: "Event not found",
        data: null,
      });
    }

    const currentFund = eventDetails.Current_fund || 0;
    const targetFund = eventDetails.Target_fund || 0;
    const donationAmount = parseFloat(amount);

    // Check if adding this donation exceeds the target
    if (currentFund + donationAmount > targetFund) {
      return res.status(400).json({
        result: false,
        message: "Donation exceeds target fund limit.",
        data: null,
      });
    }

    // If target already reached, prevent donation
    if (currentFund >= targetFund) {
      return res.status(400).json({
        result: false,
        message: "Target fund already reached. No further donations allowed.",
        data: null,
      });
    }
    // Step 1: Save donation record as pending
    const donation = new Donation({
      user: userId,
      event: event._id,
      amount,
      message,
      status: "pending",
    });

    // Save donation to database
    await donation.save();

    // Step 2: Prepare PayU data
    const txnid = donation._id.toString();
    const productinfo = `Donation for ${event.Event_name}`;
    const firstname = user.username;
    const email = user.email;
    const phone = user.mobile_no;
    const surl = process.env.PAYU_SUCCESS_URL;
    const furl = process.env.PAYU_FAILURE_URL;

    const payuData = {
      isAmountFilledByCustomer: false,
      key,
      txnid,
      amount,
      currency: "INR",
      productinfo,
      firstname,
      email,
      phone,
      surl,
      furl,
      udf1: "",
      udf2: "",
      udf3: "",
      udf4: "",
      udf5: "",
    };

    // Step 3: Generate checksum for the payment request
    const checksum = generateChecksum(payuData);
    const paymentData = {
      ...payuData,
      hash: checksum,
    };

    // Step 4: Initiate payment with PayU WebSDK
    const payuResponse = await payuClient.paymentInitiate(paymentData);

    if (payuResponse) {
      res.status(200).json({
        result: true,
        message: "Payment initiated successfully",
        formHtml: payuResponse, // Send the URL to the frontend for redirection
      });
    } else {
      res.status(400).json({
        result: false,
        message: "Error initiating payment",
        data: payuResponse,
      });
    }
  } catch (err) {
    res.status(500).json({
      result: false,
      message: "Server error",
      data: null,
    });
  }
};
// Get donation by ID for admin and donor
exports.getDonationById = async (req, res) => {
  try {
    const { donationId } = req.params;
    const userId = req.user.userId; // Extracted from the JWT token

    // Donor can only retrieve their own donations
    const donation = await Donation.findOne({
      _id: donationId,
      user: userId,
    })
      .populate("user", "username email")
      .populate("event", "Event_name coverPhotoHighQuality");

    if (!donation) {
      return res.status(404).json({
        result: false,
        message: "Donation not found",
        data: null,
      });
    }

    res.status(200).json({
      result: true,
      message: "Donation retrieved successfully",
      data: donation,
    });
  } catch (err) {
    res.status(500).json({
      result: false,
      message: "Server error",
      data: null,
    });
  }
};
exports.getMyDonations = async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Default to page 1
  const limit = parseInt(req.query.limit) || 10; // Default limit 10
  const skip = (page - 1) * limit;
  const userId = req.user.userId; // Extract user ID from authentication middleware
  try {
    const donations = await Donation.find({ user: userId })
      .populate("event")
      .populate("user")
      .skip(skip)
      .limit(limit)
      .sort({ donation_date: -1 });

    if (!donations.length) {
      return res.status(404).json({
        result: false,
        message: "No donations found for this user.",
        data: [],
      });
    }
    const totalDonations = await Event.countDocuments();
    const totalPages = Math.ceil(totalDonations / limit);
    res.status(200).json({
      result: true,
      message: "Donations fetched successfully.",
      data: donations,
      pagination: {
        totalDonations,
        totalPages: totalPages || 1,
        currentPage: page,
      },
    });
  } catch (error) {
    res.status(500).json({
      result: false,
      message: "Server error while fetching donations.",
      data: null,
    });
  }
};

// Get all donations for admin only
exports.getAllDonations = async (req, res) => {
  const { status } = req.query || "success";
  try {
    // Ensure the user is an admin
    if (req.user.user_type !== "admin") {
      return res.status(403).json({
        result: false,
        message: "Access denied. Admins only.",
        data: null,
      });
    }
    const { timeframe } = req.query || "thisWeek";
    let filter = { status };
    const now = new Date();
    if (timeframe === "thisWeek") {
      filter.donation_date = { $gte: new Date(now.setDate(now.getDate() - 7)) };
    } else if (timeframe === "monthly") {
      filter.donation_date = {
        $gte: new Date(now.getFullYear(), now.getMonth(), 1),
      };
    } else if (timeframe === "quarterly") {
      const currentQuarter = Math.floor(now.getMonth() / 3);
      filter.donation_date = {
        $gte: new Date(now.getFullYear(), currentQuarter * 3, 1),
      };
    } else if (timeframe === "annually") {
      filter.donation_date = { $gte: new Date(now.getFullYear(), 0, 1) };
    }
    // Fetch all donations with populated user and event details
    const donations = await Donation.find(filter)
      .sort({ donation_date: -1 })
      .populate("user", "username email mobile_no") // Include user details
      .populate("event", "Event_name description Target_fund");
    // Include event details

    res.status(200).json({
      result: true,
      message: "All donations retrieved successfully",
      data: donations,
    });
  } catch (err) {
    res.status(500).json({
      result: false,
      message: "Server error",
      data: null,
    });
  }
};
exports.deleteDonation = async (req, res) => {
  const { donationId } = req.query;
  try {
    // Ensure the user is an admin
    if (req.user.user_type !== "admin") {
      return res.status(403).json({
        result: false,
        message: "Access denied. Admins only.",
        data: null,
      });
    }

    // Get the donation ID from request params

    // Find and delete the donation
    const deletedDonation = await Donation.findByIdAndDelete(donationId);

    if (!deletedDonation) {
      return res.status(404).json({
        result: false,
        message: "Donation record not found",
        data: null,
      });
    }

    res.status(200).json({
      result: true,
      message: "Donation deleted successfully",
      data: deletedDonation,
    });
  } catch (err) {
    res.status(500).json({
      result: false,
      message: "Server error",
      data: null,
    });
  }
};

// On success of payment
exports.paymentSuccess = async (req, res) => {
  const {
    txnid,
    mihpayid,
    mode,
    bank_ref_num,
    bankcode,
    upi_transaction_id,
    wallet,
    cardnum,
    status,
    amount,
  } = req.body;

  try {
    if (status === "success") {
      const donation = await Donation.findByIdAndUpdate(
        txnid,
        {
          status: "success",
          mihpayid,
          mode,
          bank_ref_num,
          bankcode,
          upi_transaction_id,
          wallet,
          cardnum,
        },
        { new: true }
      ).populate("event");

      if (!donation) {
        return res.status(404).json({
          result: false,
          message: "Donation record not found",
          data: null,
        });
      }
      if (!donation.event) {
        return res.status(404).json({
          result: false,
          message: "Associated event not found for this donation",
          data: null,
        });
      }
      const donationAmount = parseFloat(amount);
      if (isNaN(donationAmount)) {
        return res.status(400).json({
          result: false,
          message: "Invalid amount received from PayU",
          data: null,
        });
      }

      // ✅ Use $inc to safely update Current_Fund
      await Event.findByIdAndUpdate(
        donation.event._id, // Getting event ID from populated event field
        { $inc: { Current_fund: donationAmount } }, // Incrementing Current_Fund
        { new: true }
      );

      res.redirect(`http://localhost:5173/payment-success/${txnid}`);
    } else {
      res.redirect(`http://localhost:5173/payment-failure/${txnid}`);
    }
  } catch (error) {
    res.redirect(`http://localhost:5173/payment-failure/${txnid}`);
  }
};

// On failure of payment
exports.paymentFailure = async (req, res) => {
  const {
    txnid,
    mihpayid,
    mode,
    bank_ref_num,
    bankcode,
    upi_transaction_id,
    wallet,
    cardnum,
    status,
  } = req.body;
  try {
    if (status === "failure") {
      const donation = await Donation.findByIdAndUpdate(
        txnid,
        {
          status: "failed",
          mihpayid,
          mode,
          bank_ref_num,
          bankcode,
          upi_transaction_id,
          wallet,
          cardnum,
        },
        { new: true }
      );

      if (!donation) {
        return res.status(404).json({
          result: false,
          message: "Donation record not found",
          data: null,
        });
      }
      res.redirect(`http://localhost:5173/payment-failure/${txnid}`);
    }
  } catch (error) {
    res.redirect(`http://localhost:5173/payment-failure/${txnid}`);
  }
};
