const jwt = require("jsonwebtoken")
const UserModel = require("../Models/user.model")

module.exports = async (req, res, next) => {
    try {
        if (!req?.headers?.authorization) {
            return res.status(404).json({
                success: false,
                message: "Нет доступа или токен",
            })
        }

        const token = req.headers.authorization?.replace(/Bearer\s?/, "")

        console.log("Auth middleware", token)

        if (!token) {
            return res.status(404).json({
                success: false,
                message: "Нет доступа или токен",
            })
        }

        const decoded = jwt.verify(token, "hemis_secret123")

        const user = await UserModel.findById(decoded["_id"])

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Нет доступа или токен",
            })
        }

        req.user = user

        next()
    } catch (error) {
        console.log(error)
        res.status(400).json({ success: false, message: error + "" })
    }
}
