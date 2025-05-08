const Event = require("../models/Event");
const { eventSchema } = require("../schema/eventSchema");
const sharp = require("sharp");

// Create a new event (admin only)
exports.createEvent = async (req, res) => {
  // Validate the request body using the Zod schema
  const parsedData = eventSchema.safeParse(req.body);
  // If validation fails, return an error response
  if (!parsedData.success) {
    return res.status(400).json({
      result: false,
      message: "Invalid data",
      data: parsedData.error.errors, // Error details
    });
  }
  try {
    const { Event_name, description, Target_fund, coverPhoto } =
      parsedData.data;
    const Event_date = new Date();
    const Current_fund = 0;
    const base64Data = coverPhoto.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");

    // Convert to low-quality version
    const lowQualityBuffer = await sharp(buffer)
      .resize({ width: 64 }) // Resize to 800px width
      .jpeg({ quality: 60 }) // Medium compression (60% quality)
      .toBuffer();

    const coverPhotoHighQuality = coverPhoto; // Keep original base64
    const coverPhotoLowQuality = `data:image/jpeg;base64,${lowQualityBuffer.toString(
      "base64"
    )}`;
    // Create a new event with the provided fields
    const event = new Event({
      Event_name,
      description,
      Target_fund,
      Current_fund,
      Event_date,
      coverPhotoHighQuality,
      coverPhotoLowQuality,
    });
    await event.save();

    // Return standardized response
    res.status(201).json({
      result: true,
      message: "Event created successfully",
      data: event,
    });
  } catch (err) {
    res.status(500).json({
      result: false,
      message: "Server error",
      data: null,
    });
  }
};

// Get all events
exports.getAllEvents = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 10; // Default limit 10
    const skip = (page - 1) * limit;
    const events = await Event.find({}, "-coverPhotoHighQuality")
      .skip(skip)
      .limit(limit)
      .sort({ Event_date: -1 });

    const totalEvents = await Event.countDocuments();
    const totalPages = Math.ceil(totalEvents / limit);
    // Return standardized response
    res.json({
      result: true,
      message: "All events retrieved successfully",
      data: events,
      pagination: {
        totalEvents,
        totalPages: totalPages || 1,
        currentPage: page,
      },
    });
  } catch (err) {
    res.status(500).json({
      result: false,
      message: "Server error",
      data: null,
    });
  }
};

// Get event by ID
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) {
      return res.status(404).json({
        result: false,
        message: "Event not found",
        data: null,
      });
    }

    // Return standardized response
    res.json({
      result: true,
      message: "Event retrieved successfully",
      data: event,
    });
  } catch (err) {
    res.status(500).json({
      result: false,
      message: "Server error",
      data: null,
    });
  }
};

// Delete an event (admin only)
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.eventId);
    if (!event) {
      return res.status(404).json({
        result: false,
        message: "Event not found",
        data: null,
      });
    }

    // Return standardized response
    res.json({
      result: true,
      message: "Event deleted successfully",
      data: event,
    });
  } catch (err) {
    res.status(500).json({
      result: false,
      message: "Server error",
      data: null,
    });
  }
};

// Update an event (admin only)
exports.updateEvent = async (req, res) => {
  const parsedData = eventSchema.safeParse(req.body);
  const isImageUpdated = req.query.isImageUpdated;
  // If validation fails, return an error response
  if (!parsedData.success) {
    return res.status(400).json({
      result: false,
      message: "Invalid data",
      data: parsedData.error.errors, // Error details
    });
  }
  try {
    const { Event_name, description, Target_fund, coverPhoto } =
      parsedData.data;
    if (isImageUpdated) {
      const base64Data = coverPhoto.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Data, "base64");

      // Convert to low-quality version
      const lowQualityBuffer = await sharp(buffer)
        .resize({ width: 64 }) // Resize to 800px width
        .jpeg({ quality: 60 }) // Medium compression (60% quality)
        .toBuffer();

      const coverPhotoHighQuality = coverPhoto; // Keep original base64
      const coverPhotoLowQuality = `data:image/jpeg;base64,${lowQualityBuffer.toString(
        "base64"
      )}`;
      // Find the event by ID and update the fields
      const event = await Event.findByIdAndUpdate(
        req.params.eventId,
        {
          Event_name,
          description,
          Target_fund,
          coverPhotoHighQuality,
          coverPhotoLowQuality,
        },
        { new: true } // This option returns the updated document
      ).select("-coverPhotoHighQuality -__v");

      if (!event) {
        return res.status(404).json({
          result: false,
          message: "Event not found",
          data: null,
        });
      }
      // Return standardized response
      res.json({
        result: true,
        message: "Event updated successfully",
        data: event,
      });
    } else {
      const event = await Event.findByIdAndUpdate(
        req.params.eventId,
        {
          Event_name,
          description,
          Target_fund,
        },
        { new: true } // This option returns the updated document
      );
      // Return standardized response
      res.json({
        result: true,
        message: "Event updated successfully",
        data: event,
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
