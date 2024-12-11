const axios = require("axios");
const jwt = require("jsonwebtoken");
const UserModel = require("../../Models/user.model");

// Tashqi so'rov yuborish (login)
async function sendLoginRequest(login, password, next) {
    const url = "https://stdmau.hemis.uz/rest/v1/auth/login";
    const data = { login, password };
    console.log(data);
    const headers = {
        "Content-Type": "application/json",
        Authorization: `${process.env.Authorization}`,
    };

    try {
        const response = await axios.post(url, data, { headers });

        if (response.data.success) {
            return response.data.data.token; // Tokenni qaytarish
        } else {
            console.log("Hemis login", response)
            throw new Error("Login failed on external server.");
        }
    } catch (error) {
        console.log("sendLoginRequest", error)
        return handleAxiosError(error, next);
    }
}

// Profildan ma'lumot olish
async function fetchProfileData(token, next) {
    const url = `${process.env.BASE_URL}/account/me`;
    const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
    };

    try {
        const response = await axios.get(url, { headers });

        if (response.data.success) {
            return response.data.data; // Profil ma'lumotlarini qaytarish
        } else {
            throw new Error("Failed to fetch profile data from external server.");
        }
    } catch (error) {
        console.log("fetchProfileData", error)
        return handleAxiosError(error, next);
    }
}

// Xatolarni boshqarish
function handleAxiosError(error, next) {
    if (error.response) {
        console.error(
            "Response Error:",
            error.response.data || "No additional error information"
        );
        const err = new Error(
            error.response.data.message || "Error occurred while contacting external server."
        );
        err.status = error.response.status || 400;
        return next(err);
    } else if (error.request) {
        console.error("Request Error: No response received from the external server.");
        const err = new Error("No response received from the external server.");
        err.status = 500;
        return next(err);
    } else {
        console.error("Setup Error:", error.message || "Unknown error occurred.");
        const err = new Error("Error occurred while setting up the request.");
        err.status = 500;
        return next(err);
    }
}


// Login funksiyasi
exports.login = async (req, res, next) => {
    try {
        const { login, password } = req.body;

        // Foydalanuvchini bazadan izlash
        let user = await UserModel.findOne({ login });

        // Agar foydalanuvchi mavjud bo‘lmasa, uni yaratish
        if (!user) {
            user = await UserModel.create({ login });
        }

        // Tashqi serverga login so'rovi yuborish
        const token = await sendLoginRequest(login, password, next);
        console.log(token)
        if (token) {
            // Profil ma'lumotlarini olish
            // const profileData = await fetchProfileData(token, next);

            // Foydalanuvchini yangilash
            user = await UserModel.findOneAndUpdate(
                { login },
                { token },
                { new: true }
            );

            // JWT token yaratish
            const jwtToken = jwt.sign({ _id: user._id }, "hemis_secret123");

            return res.status(200).json({
                success: true,
                message: "Login successful",
                token: jwtToken,
                student: user.student, // Profil ma'lumotlarini qaytarish
            });
        } else {
            return res.status(400).json({ success: false, message: "Login failed" });
        }
    } catch (error) {
        console.error("Login Error:", error.message || error);
        return next(error);
    }
};
