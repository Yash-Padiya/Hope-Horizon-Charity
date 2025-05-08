const Support = require("../models/Support");
const { supportSchema } = require("../schema/supportSchema");

// Create a support query (donor only)
exports.createSupport = async (req, res) => {
  const parsedData = supportSchema.safeParse(req.body);
  if (!parsedData.success) {
    return res.status(400).json({
      result: false,
      message: "Invalid data",
      data: parsedData.error.errors,
    });
  }
  try {
    const support = new Support({
      user: req.user.userId,
      query: parsedData.data.query,
    });
    await support.save();
    res.status(201).json({
      result: true,
      message: "Support query created successfully",
      data: support,
    });
  } catch (err) {
    res
      .status(500)
      .json({ result: false, message: "Server error", data: null });
  }
};

// Get all support queries (admin only)
exports.getAllSupports = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 10; // Default limit 10
    const status = req.query.status || "pending"; // Default limit 10
    const skip = (page - 1) * limit;
    const supports = await Support.find({ status: status })
      .populate("user", "username email")
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);
    const totalReqs = await Support.countDocuments({ status: "pending" });
    const totalPages = Math.ceil(totalReqs / limit);
    res.json({
      result: true,
      message: "All support queries retrieved",
      data: supports,
      pagination: {
        totalReqs,
        totalPages: totalPages || 1,
        currentPage: page,
      },
    });
  } catch (err) {
    res
      .status(500)
      .json({ result: false, message: "Server error", data: null });
  }
};

// Update support status (admin only)
exports.updateSupportStatus = async (req, res) => {
  const { supportId } = req.params;
  const { status } = req.body;
  try {
    const supportQuery = await Support.findByIdAndUpdate(
      supportId,
      { status: status },
      { new: true }
    ).select("-__v");

    if (!supportQuery) {
      return res.status(404).json({
        result: false,
        message: "Support query not found",
        data: null,
      });
    }

    res.json({
      result: true,
      message: `Support query marked as ${status}`,
      data: supportQuery,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      result: false,
      message: "Server error",
      data: null,
    });
  }
};
