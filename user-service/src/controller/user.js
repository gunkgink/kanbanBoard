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
        console.error("Error creating user: ", error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};
exports.getUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
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
        console.error("Error fetching user: ", error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};
exports.updateUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const user = await User.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        user.name = name || user.name;
        user.email = email || user.email;
        user.password = password || user.password;
        await user.save();
        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        console.error("Error updating user: ", error);
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
        console.error("Error deleting user: ", error);
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
        console.error("Error fetching users: ", error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};
exports.getUserById = async (req, res) => {
    const { id } = req.params;
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
        console.error("Error fetching user: ", error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};
