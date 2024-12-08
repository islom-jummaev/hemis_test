const TestModel = require("../../Models/test.model")

exports.index = async (req, res, next) => {
    try {
        const query = req.query

        const page = parseInt(query.page) || 1 
        const limit = parseInt(query.limit) || 10 

        const tests = await TestModel.find(query)
            .skip((page - 1) * limit) 
            .limit(limit)

        const totalTests = await TestModel.countDocuments(query)

        const totalPages = Math.ceil(totalTests / limit)

        res.status(200).json({
            success: true,
            message: "Testlar topildi",
            data: tests,
            pagination: {
                totalTests,
                totalPages,
                currentPage: page,
                perPage: limit,
            },
        })
    } catch (error) {
        next(error)
    }
}


exports.show = async (req, res) => {
    try {
        const test = await TestModel.findById(req.params._id)

        if (!test) {
            return res.status(404).json({ success: false, message: "Test topilmadi" })
        }

        res.status(200).json({ success: true, message: "Test topildi", data: test })
    } catch (error) {
        next(error)
    }
}


exports.create = async (req, res) => {
    try {
        const test = await TestModel.create(req.body)

        res.status(200).json({ success: true, message: "Test muvaffaqiyatli yaratildi", data: test })
    } catch (error) {
        next(error)
    }
}


exports.update = async (req, res) => {
    try {
        const test = await TestModel.findByIdAndUpdate(req.params._id, req.body, {
            new: true,
        })

        res.status(200).json({ success: true, message: "Test muvaffaqiyatli yangilandi", data: test })
    } catch (error) {
        next(error)
    }
}


exports.delete = async (req, res) => {
    try {
        const test = await TestModel.findByIdAndDelete(req.params._id)

        res.status(200).json({ success: true, message: "Test muvaffaqiyatli o'chirildi", data: test })
    } catch (error) {
        next(error)
    }
}