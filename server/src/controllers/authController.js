const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const userSchema = require("../schema/userSchema");

// Register a new user (donor)
// Register a new user (donor or admin)
exports.register = async (req, res) => {
  const validatedData = userSchema.safeParse(req.body);
  if (!validatedData.success) {
    return res.status(400).json({
      result: false,
      message: "Validation failed",
      data: validatedData.error.errors, // Provide all validation errors
    });
  }
  try {
    const {
      username,
      email,
      password,
      user_type,
      address,
      mobile_no,
      aadhar_no,
      pan_no,
    } = validatedData.data;
    // Check if the email is already in use
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user with the provided data
    const user = new User({
      username, // Username, not null
      email, // Email, not null
      password: hashedPassword, // Hashed password, not null
      user_type: user_type || "donor", // User type (donor or admin), not null
      address, // Address, not null
      mobile_no, // Mobile number, not null
      aadhar_no, // Aadhar number, not null
      pan_no, // PAN number, not null
    });

    // Save the new user to the database
    await user.save();

    // Create a JWT token for the user
    const token = jwt.sign(
      { userId: user._id, user_type: user.user_type },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );
    res.cookie(
      "authData",
      JSON.stringify({
        token,
        username: user.username,
        userId: user._id,
        email: user.email,
        user_type: user.user_type,
      }),
      {
        httpOnly: false,
        secure: process.env.DEP_TYPE === "production", // Secure cookie in production
        maxAge: 24 * 60 * 60 * 1000, // Token expiration time (24 hours)
        sameSite: "Lax",
      }
    );
    // Respond with the token and user data
    res.status(201).json({
      result: true,
      message: "User registered successfully",
      data: {
        token,
        user: {
          username: user.username,
          email: user.email,
          user_type: user.user_type,
          userId: user._id,
        },
      },
    });
  } catch (err) {
    res
      .status(500)
      .json({ result: false, message: "Server error", data: null });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        result: false,
        message: "User does not exist",
        data: null,
      });
    }

    // Compare the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        result: false,
        message: "Invalid credentials",
        data: null,
      });
    }

    // Generate a token
    const token = jwt.sign(
      { userId: user._id, user_type: user.user_type },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );
    res.cookie(
      "authData",
      JSON.stringify({
        token,
        username: user.username,
        userId: user._id,
        email: user.email,
        user_type: user.user_type,
      }),
      {
        httpOnly: false,
        secure: process.env.DEP_TYPE === "production", // Secure cookie in production
        maxAge: 24 * 60 * 60 * 1000, // Token expiration time (2 hours)
        sameSite: "Lax",
      }
    );
    // Send the response in the standardized format
    res.json({
      result: true,
      message: "Login successful",
      data: {
        token,
        username: user.username,
        userId: user._id,
        email: user.email,
        user_type: user.user_type,
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

// Refresh token
exports.refreshToken = (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({
      result: false,
      message: "Token is required",
      data: null,
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({
        result: false,
        message: "Invalid token",
        data: null,
      });
    }

    // Generate a new token
    const newToken = jwt.sign(
      { userId: decoded.userId, role: decoded.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Send the response in the standardized format
    res.json({
      result: true,
      message: "Token refreshed successfully",
      data: { token: newToken },
    });
  });
};
exports.changePassword = async (req, res) => {
  try {
    const { email, currentPassword, newPassword, confirmNewPassword } =
      req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        result: false,
        message: "User does not exist",
        data: null,
      });
    }
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        result: false,
        message: "Invalid Current Password",
        data: null,
      });
    }

    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({
        result: false,
        message: "New Password and Confirm New Password do not match",
        data: null,
      });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      result: true,
      message: "Password changed successfully",
      data: null,
    });
  } catch (err) {
    res.status(500).json({
      result: false,
      message: "Server error",
      data: null,
    });
  }
};
exports.updateUser = async (req, res) => {
  try {
    // Validate the request body (except password)
    const validatedData = userSchema
      .omit({ password: true, email: true, user_type: true })
      .parse(req.body);

    const { username, address, mobile_no, aadhar_no, pan_no } = validatedData;

    // Get userId from the decoded token (from authMiddleware)
    const userId = req.user.userId;

    // Check if the user exists
    const user = await User.findById(userId); // Use the userId from the token
    if (!user) {
      return res
        .status(404)
        .json({ result: false, message: "User not found", data: null });
    }

    // If user wants to update email, check for duplicates
    // if (email && email !== user.email) {
    //   const existingUser = await User.findOne({ email });
    //   if (existingUser) {
    //     return res.status(400).json({ message: "Email already in use" });
    //   }
    // }

    // Update the user details
    user.username = username || user.username;
    // user.email = email || user.email;
    // user.user_type = user_type || user.user_type;
    user.address = address || user.address;
    user.mobile_no = mobile_no || user.mobile_no;
    user.aadhar_no = aadhar_no || user.aadhar_no;
    user.pan_no = pan_no.toUpperCase() || user.pan_no;

    await user.save();

    // Respond with updated user data
    res.status(200).json({
      result: true,
      message: "User updated successfully",
      data: {
        username: user.username,
        address: user.email,
        mobile_no: user.mobile_no,
        aadhar_no: user.aadhar_no,
        pan_no: user.pan_no,
      },
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res
        .status(400)
        .json({ result: false, message: err.errors[0].message, data: null });
    }
    res
      .status(500)
      .json({ result: false, message: "Server error", data: null });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const userId = req.user.userId;
    const donor = await User.findById(userId, "-password -user_type -__v");
    if (!donor) {
      return res.status(404).json({
        result: false,
        message: "User does not exist",
        data: null,
      });
    }
    res.status(200).json({
      result: true,
      message: "Donor retrieved successfully",
      data: donor,
    });
  } catch (err) {
    res.status(500).json({
      result: false,
      message: "Server error",
      data: null,
    });
  }
};
exports.getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 10; // Default limit 10
    const skip = (page - 1) * limit;

    // Fetch users with pagination, excluding sensitive fields
    const donors = await User.find(
      { user_type: "donor" },
      "-password -user_type -__v"
    )
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total user count (for pagination info)
    const totalUsers = await User.countDocuments({ user_type: "donor" });

    res.status(200).json({
      result: true,
      message: "All donors retrieved successfully",
      data: donors,
      pagination: {
        totalUsers,
        totalPages: Math.ceil(totalUsers / limit),
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

// Delete a user (admin only)
exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    // Find and delete the user by ID
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({
        result: false,
        message: "User not found",
        data: null,
      });
    }

    res.status(200).json({
      result: true,
      message: "User deleted successfully",
      data: deletedUser,
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

exports.addDonor = async (req, res) => {
  const validatedData = userSchema.safeParse(req.body);
  if (!validatedData.success) {
    return res.status(400).json({
      result: false,
      message: "Validation failed",
      data: validatedData.error.errors, // Provide all validation errors
    });
  }
  try {
    const {
      username,
      email,
      password,
      user_type,
      address,
      mobile_no,
      aadhar_no,
      pan_no,
    } = validatedData.data;
    // Check if the email is already in use
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user with the provided data
    const user = new User({
      username, // Username, not null
      email, // Email, not null
      password: hashedPassword, // Hashed password, not null
      user_type: user_type || "donor", // User type (donor or admin), not null
      address, // Address, not null
      mobile_no, // Mobile number, not null
      aadhar_no, // Aadhar number, not null
      pan_no, // PAN number, not null
    });

    // Save the new user to the database
    await user.save();
    // Respond with the token and user data
    res.status(201).json({
      result: true,
      message: "Donor added successfully",
      data: {
        userId: user._id,
        username: user.username,
        email: user.email,
        address: user.address,
        mobile_no: user.mobile_no,
        aadhar_no: user.aadhar_no,
        pan_no: user.pan_no,
      },
    });
  } catch (err) {
    res
      .status(500)
      .json({ result: false, message: "Server error", data: null });
  }
};
