const UserModel = require("../../Models/user.model")

exports.index = async (req, res, next) => {
    try {
        const {page = 1, limit = 10} = req.query

        const users = await UserModel.find()
            .skip((page - 1) * limit)
            .limit(limit)

        res.status(200).json({ success: true, data: users })
    } catch (error) {
        next(error)
    }
}

exports.show = async (req, res, next) => {
    try {
        const user = await UserModel.findById(req.params._id)

        res.status(200).json({ success: true, data: user })
    } catch (error) {
        next(error)
    }
}