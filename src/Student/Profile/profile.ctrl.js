const { default: axios } = require("axios")
const UserModel = require("../../Models/user.model")

exports.profile = async (req, res) => {
    try {
        // Foydalanuvchini `req.user` orqali olish
        const userId = req.user.id // `req.user` orqali foydalanuvchi ma'lumotlarini olasiz

        // Tokenni bazadan olish
        const user = await UserModel.findById(userId) // User tokenni saqlagan model
        if (!user || !user.token) {
            return res.status(401).json({ success: false, message: "Token mavjud emas" })
        }

        // API so'rovi uchun URL
        const url = `${process.env.BASE_URL}/account/me`

        // Sarlavhalarni tayyorlash
        const headers = {
            Authorization: `Bearer ${user.token}`, // Foydalanuvchining tokeni
            "Content-Type": "application/json",
        }

        // API'ga so'rov yuborish
        const response = await axios.get(url, { headers })

        // Muvaffaqiyatli javobni qaytarish
        res.status(200).json(response.data)
    } catch (error) {
        // Xatoni qaytarish
        console.error(error)
        res.status(400).json({ success: false, message: error.message })
    }
}
