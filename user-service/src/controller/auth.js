const User = require("../model/User");
const ms = require("ms");

const sendTokenResponse = (user, statusCode, res) => {
    const token = user.getSignedJwtToken();
    const options = {
        expires: new Date(Date.now() + ms(process.env.JWT_EXPIRE)),
        httpOnly: true,
    };
    if (process.env.NODE_ENV === "production") options.secure = true;
    res.status(statusCode).cookie("token", token, options).json({
        success: true,
        token,
    });
};
// utils/validators.js
const validateRegisterInput = (name, email, password) => {
    const errors = [];

    if (!name || name.trim().length < 2) {
        errors.push("Name must be at least 2 characters");
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.push("Valid email is required");
    }

    if (!password || password.length < 6) {
        errors.push("Password must be at least 6 characters");
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
};

exports.login = async (req, res) => {
    const { name, email, password } = req.body;
    if (name || !email || !password)
        return res.status().json({
            success: false,
            msg: "Please provide email and password",
        });

    // For easy testing
    // const { valid, error } = validateRegisterInput(name, email, password);
    // if (!valid) return res.status(400).json({ success: false, message: error });

    const user = await User.findOne({ where: { email } });
    if (!user) {
        return res.status(401).json({
            success: false,
            msg: "Invalid credentials",
        });
    }
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
        return res.status(401).json({
            success: false,
            msg: "Invalid credentials",
        });
    }

    sendTokenResponse(user, 200, res);
};
exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                msg: "Please provide name, email and password",
            });
        }
        const user = await User.create({
            name,
            email,
            password,
        });

        sendTokenResponse(user, 201, res);
    } catch (error) {
        console.error("Registration Error:");
        if (error.name === "SequelizeUniqueConstraintError") {
            console.error("Unique constraint violation:", error.message);
            return res.status(400).json({
                success: false,
                msg: "Email already exists. Please use a different one.",
            });
        }
        console.error("Unexpected Error:", error.message);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};
exports.getMe = async (req, res) => {
    try {
        const user = req.user;
        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        console.error("Error fetching user: ", error.message);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

exports.logout = async (req, res) => {
    res.cookie("token", "none", {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
    });
    res.status(200).json({
        success: true,
        message: "Logged out successfully",
    });
};
