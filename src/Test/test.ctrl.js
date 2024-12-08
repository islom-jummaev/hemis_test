const TestModel = require("../Models/test.model")
const AnswerModel = require("../Models/answer.model")

exports.index = async (req, res) => {
    try {
        const tests = await TestModel.find()
        
        res.status(200).json({ success: true, data: tests })
    } catch (error) {
        res.status(400).json({ success: false, message: error.message })
    }
}

exports.tests = async (req, res) => {
    try {
        const { _id } = req.params

        const test = await TestModel.findById(_id)

        res.status(200).json({ success: true, data: test })
    } catch (error) {
        res.status(400).json({ success: false, message: error.message })
    }
}

exports.create = async (req, res) => {
    try {
        const test = await TestModel.create(req.body)

        res.status(200).json({ success: true, data: test })
    } catch (error) {
        res.status(400).json({ success: false, message: error.message })
    }
}

exports.update = async (req, res) => {
    try {
        const { _id } = req.params

        const test = await TestModel.findByIdAndUpdate(_id, req.body, {
            new: true,
        })

        res.status(200).json({ success: true, data: test })
    } catch (error) {
        res.status(400).json({ success: false, message: error.message })
    }
}

exports.start = async (req, res) => {
    try {
        const { testId } = req.params;

        const test = await TestModel.findById(testId).populate("questions");
        if (!test) {
            return res.status(404).json({ message: "Test topilmadi" });
        }

        res.status(200).json({
            message: "Test boshlash uchun tayyor",
            test: test,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Xatolik yuz berdi" + error.message });
    }
}

exports.finish = async (req, res) => {
    try {
        const { testId, userId, answers } = req.body 
        const userAnswers = new AnswerModel({
            testId,
            userId,
            answers, 
        })

        await userTest.save()

        res.status(200).json({ message: "Javoblar muvaffaqiyatli saqlandi", userAnswers })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: "Javoblarni saqlashda xatolik yuz berdi",
            error: error.message,
        })
    }
}

