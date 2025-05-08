const Volunteer = require("../models/Volunteer");
const volunteerSchema = require("../schema/volunteerSchema");

// Create a new volunteer (Admin only)
exports.createVolunteer = async (req, res) => {
  
    const parsedData = volunteerSchema.safeParse(req.body);
    if (!parsedData.success) {
      return res.status(400).json({
        result: false,
        message: "Invalid data",
        data: parsedData.error.errors,
      });
    }
    try {
    const { email } = parsedData.data;
    const existingVolunteer = await Volunteer.findOne({ email });
    if (existingVolunteer) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const volunteer = new Volunteer(parsedData.data);
    await volunteer.save();
    res.status(201).json({
      result: true,
      message: "Volunteer added successfully",
      data: volunteer,
    });
  } catch (err) {
    res
      .status(500)
      .json({ result: false, message: "Server error", data: null });
  }
};
exports.getAllVolunteers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 10; // Default limit 10
    const skip = (page - 1) * limit;
    const sortAs = req.query.sortAs || "active";
    const filter =
      sortAs === "active"
        ? { leaveDate: null } // Active volunteers (leaveDate is null)
        : sortAs === "left"
        ? { leaveDate: { $ne: null } } // Left volunteers (leaveDate is not null)
        : {}; 
    const volunteers = await Volunteer.find(filter)
    .skip(skip)
    .limit(limit)
    .sort({ joinDate: -1 });
    if (!volunteers) {
      res.json({
        result: false,
        message: "Failed to retrieve volunteers",
        data: null,
      });
    }

    const totalVolunteers = await Volunteer.countDocuments();
    const totalPages = Math.ceil(totalVolunteers / limit);
    res.json({
      result: true,
      message: "Volunteers retrieved successfully",
      data: volunteers,
      pagination: {
        totalVolunteers,
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

// Get volunteer by ID (Admin only)
exports.getVolunteerById = async (req, res) => {
  try {
    const volunteer = await Volunteer.findById(req.params.volunteerId);
    if (!volunteer)
      return res
        .status(404)
        .json({ result: false, message: "Volunteer not found", data: null });
    res.json({
      result: true,
      message: "Volunteer retrieved successfully",
      data: volunteer,
    });
  } catch (err) {
    res
      .status(500)
      .json({ result: false, message: "Server error", data: null });
  }
};

// Update volunteer (Admin only)
exports.updateVolunteer = async (req, res) => {
  const parsedData = volunteerSchema.omit({ joinDate: true }).safeParse(req.body);
  try {
    const volunteer = await Volunteer.findByIdAndUpdate(
      req.params.volunteerId,
      parsedData.data,
      { new: true }
    );
    if (!volunteer)
      return res
        .status(404)
        .json({ result: false, message: "Volunteer not found", data: null });
    res.json({
      result: true,
      message: "Volunteer updated successfully",
      data: volunteer,
    });
  } catch (err) {
    res
      .status(500)
      .json({ result: false, message: "Server error", data: null });
  }
};

// Delete volunteer (Admin only)
exports.deleteVolunteer = async (req, res) => {
  try {
    const volunteer = await Volunteer.findByIdAndDelete(req.params.volunteerId);
    if (!volunteer)
      return res
        .status(404)
        .json({ result: false, message: "Volunteer not found", data: null });
    res.json({
      result: true,
      message: "Volunteer deleted successfully",
      data: volunteer,
    });
  } catch (err) {
    res
      .status(500)
      .json({ result: false, message: "Server error", data: null });
  }
};

// Mark volunteer as left (Admin only)
exports.markVolunteerAsLeft = async (req, res) => {
  try {
    const volunteer = await Volunteer.findByIdAndUpdate(
      req.params.volunteerId,
      { leaveDate: new Date() },
      { new: true }
    );
    if (!volunteer)
      return res
        .status(404)
        .json({ result: false, message: "Volunteer not found", data: null });
    res.json({
      result: true,
      message: "Volunteer marked as left",
      data: volunteer,
    });
  } catch (err) {
    res
      .status(500)
      .json({ result: false, message: "Server error", data: null });
  }
};
