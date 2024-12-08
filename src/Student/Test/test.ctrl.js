const TestModel = require("../../Models/test.model")
const AnswerModel = require("../../Models/answer.model")

exports.index = async (req, res, next) => {
    try {
        // Testlarni faqat kerakli maydonlar bilan olish
        const tests = await TestModel.find()
            .select("_id title description time questions") // Faqat kerakli maydonlarni olish
            .lean() // JSON formatida ma'lumotni olish
            .exec()

        // Savollar sonini hisoblash va questions maydonini olib tashlash
        const updatedTests = tests.map((test) => {
            return {
                _id: test._id,
                title: test.title,
                description: test.description,
                time: test.time,
                questionsCount: test.questions.length, // Savollar sonini qo'shish
            }
        })

        res.status(200).json({
            success: true,
            data: updatedTests,
        })
    } catch (error) {
        next(error)
    }
}

exports.start = async (req, res, next) => {
    try {
        const { _id } = req.params

        const test = await TestModel.findById(_id).populate("questions")

        res.status(200).json({
            success: true,
            data: test,
        })
    } catch (error) {
        next(error)
    }
}

exports.submit = async (req, res, next) => {
    try {
        const { testId, answers } = req.body // Test ID va javoblar
        const userId = req.user._id // Foydalanuvchi ID

        // Testni va foydalanuvchini tekshirish
        const test = await TestModel.findById(testId)
        if (!test) {
            return res.status(404).json({ success: false, message: "Test not found." })
        }

        // Javoblarni saqlash
        const formattedAnswers = answers.map((answer, index) => ({
            questionNumber: index + 1, // Savol raqami 1dan boshlanadi
            selectedVariant: answer.selectedVariant, // Tanlangan variant
        }))

        const testAnswer = new AnswerModel({
            userId,
            testId,
            answers: formattedAnswers,
            completionTime: new Date(),
            status: "completed", // Test yakunlandi
        })

        await testAnswer.save()

        res.status(200).json({ success: true, message: "Test submitted successfully." })
    } catch (error) {
        next(error) // Xatolikni error middleware ga yuborish
    }
}
