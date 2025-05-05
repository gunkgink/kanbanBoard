const axios = require("axios");
require("dotenv").config();

exports.isUserExists = async (userId, token) => {
    try {
        const checkUrl = `${process.env.USER_API}/api/user/${userId}`;
        const response = await axios.get(checkUrl, {
            headers: {
                Authorization: `Bearer ${token}`, // Include the token
            },
        });
        return response.status === 200;
    } catch (err) {
        console.error("User check failed:", err.response?.data || err.message);
        return false;
    }
};
