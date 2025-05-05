const jwt = require("jsonwebtoken");
const User = require("../user-service/src/model/User");

exports.protect = async (req, res, next) => {
    let token;

    // Extract token from headers or cookies
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Not authorized to access this route, no token",
        });
    }

    try {
        // Decode the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // console.log("Decoded ID:", decoded.id); // Log to ensure the ID is correct

        const user = await User.findByPk(decoded.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        req.user = user;
        // console.log("midd pass");
        next();
    } catch (error) {
        console.error("Error in protect middleware:", error.message);
        return res.status(401).json({
            success: false,
            message: "Not authorized to access this route",
        });
    }
};
