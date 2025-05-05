const axios = require("axios");
require("dotenv").config();
const user_api = "http://localhost:3003/api/me";
exports.protect = async (req, res, next) => {
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies?.token) {
        token = req.cookies.token;
    }

    if (!token) {
        return res.status(401).json({ success: false, message: "No token" });
    }

    try {
        const getmeUrl = user_api;
        const response = await axios.get(getmeUrl, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        req.user = response.data.data;
        next();
    } catch (error) {
        console.error("Error in protect middleware:", error.message);
        // console.log(error);
        return res
            .status(401)
            .json({ success: false, message: "Unauthorized" });
    }
};
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `User role ${req.user.role} is not authorized to access this route`,
            });
        }
        next();
    };
};
