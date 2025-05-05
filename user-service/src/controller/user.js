const User = require("../model/User");
exports.createUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const user = await User.create({
            name,
            email,
            password,
        });

        res.status(201).json({
            success: true,
            msg: "Create user succesfully",
        });
    } catch (error) {
        console.error(
            "Error creating user:",
            error.errors.map((e) => e.message).join(", ")
        );
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

exports.updateUser = async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        if (role == "admin") user.role = role || user.role;

        user.name = name || user.name;
        user.email = email || user.email;
        user.password = password || user.password;
        await user.save();
        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        console.error(
            "Error updating user:",
            error.errors.map((e) => e.message).join(", ")
        );
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};
exports.deleteUser = async (req, res) => {
    console.log(req.params.id);
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        await user.destroy();
        res.status(200).json({
            success: true,
            message: "User deleted successfully",
        });
    } catch (error) {
        console.error(
            "Error deleting user:",
            error.errors.map((e) => e.message).join(", ")
        );
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json({
            success: true,
            data: users,
        });
    } catch (error) {
        console.error(
            "Error getting all user:",
            error.errors.map((e) => e.message).join(", ")
        );
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};
exports.getUsersByIds = async (req, res) => {
    const { userIds } = req.body;
    console.log(req.body);

    if (!Array.isArray(userIds) || userIds.length === 0) {
        return res.status(400).json({
            success: false,
            message: "userIds must be a non-empty array",
        });
    }

    try {
        const users = await User.findAll({
            where: {
                id: userIds,
            },
        });

        res.status(200).json({
            success: true,
            data: users,
        });
    } catch (error) {
        console.error("Error getting users by IDs:", error.message);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

exports.getUserById = async (req, res) => {
    const id = req.params.id;
    try {
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        console.log("fuck");
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};
