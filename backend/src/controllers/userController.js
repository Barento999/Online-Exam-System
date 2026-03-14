import User from "../models/User.js";
import xlsx from "xlsx";

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build query
    const query = {};
    if (req.query.role) query.role = req.query.role;
    if (req.query.status) query.status = req.query.status;
    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search, $options: "i" } },
        { email: { $regex: req.query.search, $options: "i" } },
      ];
    }

    const users = await User.find(query)
      .select("-password")
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    res.json({
      users,
      page,
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
};

// @desc    Create user
// @route   POST /api/users
// @access  Private/Admin
export const createUser = async (req, res, next) => {
  try {
    const { name, email, password, role, status } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error("User already exists");
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
      status,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
export const updateUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    const { name, email, role, status } = req.body;

    user.name = name || user.name;
    user.email = email || user.email;
    user.role = role || user.role;
    user.status = status || user.status;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      status: updatedUser.status,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    await user.deleteOne();
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// @desc    Export users to CSV
// @route   GET /api/users/export/csv
// @access  Private/Admin
export const exportUsers = async (req, res, next) => {
  try {
    // Get all users (no pagination for export)
    const query = {};
    if (req.query.role) query.role = req.query.role;
    if (req.query.status) query.status = req.query.status;

    const users = await User.find(query)
      .select("-password -__v")
      .sort({ createdAt: -1 });

    // Transform data for CSV
    const csvData = users.map((user) => ({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt.toISOString().split("T")[0],
    }));

    // Create workbook and worksheet
    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(csvData);

    // Add worksheet to workbook
    xlsx.utils.book_append_sheet(wb, ws, "Users");

    // Generate buffer
    const buffer = xlsx.write(wb, { type: "buffer", bookType: "csv" });

    // Set headers for download
    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=users_export_${Date.now()}.csv`,
    );

    res.send(buffer);
  } catch (error) {
    next(error);
  }
};

// @desc    Import users from CSV
// @route   POST /api/users/import/csv
// @access  Private/Admin
export const importUsers = async (req, res, next) => {
  try {
    console.log("=== User import request received ===");
    console.log("File:", req.file);

    if (!req.file) {
      res.status(400);
      throw new Error("Please upload a CSV file");
    }

    // Read the uploaded file
    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet, {
      raw: false,
      defval: "",
    });

    console.log("Parsed data:", data.length, "rows");

    // Validate and transform data
    const usersToCreate = [];
    const errors = [];
    const skipped = [];

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const rowNum = i + 2; // Excel rows start at 1, header is row 1

      // Validate required fields
      const missingFields = [];
      if (!row.name?.trim()) missingFields.push("name");
      if (!row.email?.trim()) missingFields.push("email");
      if (!row.password?.trim()) missingFields.push("password");
      if (!row.role?.trim()) missingFields.push("role");

      if (missingFields.length > 0) {
        errors.push(
          `Row ${rowNum}: Missing required fields: ${missingFields.join(", ")}`,
        );
        continue;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(row.email.trim())) {
        errors.push(`Row ${rowNum}: Invalid email format`);
        continue;
      }

      // Validate role
      const validRoles = ["admin", "teacher", "student"];
      if (!validRoles.includes(row.role.trim().toLowerCase())) {
        errors.push(
          `Row ${rowNum}: Invalid role. Must be: admin, teacher, or student`,
        );
        continue;
      }

      // Check if user already exists
      const existingUser = await User.findOne({
        email: row.email.trim().toLowerCase(),
      });
      if (existingUser) {
        skipped.push(
          `Row ${rowNum}: User with email ${row.email} already exists`,
        );
        continue;
      }

      // Validate password length
      if (row.password.trim().length < 6) {
        errors.push(`Row ${rowNum}: Password must be at least 6 characters`);
        continue;
      }

      usersToCreate.push({
        name: row.name.trim(),
        email: row.email.trim().toLowerCase(),
        password: row.password.trim(),
        role: row.role.trim().toLowerCase(),
        status: row.status?.trim().toLowerCase() || "active",
      });
    }

    // Delete the uploaded file
    const fs = await import("fs");
    fs.unlinkSync(req.file.path);

    if (errors.length > 0 && usersToCreate.length === 0) {
      res.status(400);
      throw new Error(`Validation errors:\n${errors.join("\n")}`);
    }

    // Create users
    let createdCount = 0;
    const creationErrors = [];

    for (const userData of usersToCreate) {
      try {
        await User.create(userData);
        createdCount++;
      } catch (error) {
        creationErrors.push(
          `Failed to create user ${userData.email}: ${error.message}`,
        );
      }
    }

    res.status(201).json({
      message: `Successfully imported ${createdCount} user(s)`,
      created: createdCount,
      skipped: skipped.length,
      errors: errors.length + creationErrors.length,
      details: {
        skipped,
        validationErrors: errors,
        creationErrors,
      },
    });
  } catch (error) {
    // Delete uploaded file if it exists
    if (req.file) {
      const fs = await import("fs");
      try {
        fs.unlinkSync(req.file.path);
      } catch (e) {
        // File already deleted or doesn't exist
      }
    }
    next(error);
  }
};
