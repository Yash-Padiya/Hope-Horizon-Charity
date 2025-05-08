const Feedback = require("../models/Feedback");
const { feedbackSchema } = require("../schema/feedbackSchema");

exports.createFeedback = async (req, res) => {
  const parsedData = feedbackSchema.safeParse(req.body);
  if (!parsedData.success) {
    return res.status(400).json({
      result: false,
      message: "Invalid data",
      data: parsedData.error.errors,
    });
  }
  try {
    const { ratings, description, eventId } = parsedData.data;
    const feedback = new Feedback({
      user_id: req.user.userId,
      event_id: eventId,
      ratings,
      description,
    });
    await feedback.save();

    res.status(201).json({
      result: true,
      message: "Feedback submitted successfully",
      data: null,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ result: false, message: "Server error", data: null });
  }
};

exports.getAllFeedbacks = async (req, res) => {
  const { eventId } = req.query;
  if (!eventId) {
    return res.status(400).json({ message: "Event ID is required" });
  }
  console.log(eventId);
  try {
    const allFeedbacks = await Feedback.find()
      .populate("event_id", "_id")
      .limit(10)
      .sort({ dateofcreation: -1 });

    res.json({
      result: true,
      message: "All feedbacks retrieved successfully",
      data: allFeedbacks,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ result: false, message: "Server error", data: null });
  }
};
