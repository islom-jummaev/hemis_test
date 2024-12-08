const mongoose = require("mongoose")
const AnswerModel = require("../../Models/answer.model")

exports.index = async (req, res, next) => {
    try {
        const { testId, page = 1, limit = 10 } = req.query; // `page` va `limit`ni olish

        // Asosiy qidiruv filtri
        const match = {};
        if (testId) match.testId = mongoose.Types.ObjectId(testId);

        // Aggregatsiya so'rovi
        const answers = await AnswerModel.aggregate([
            {
                $lookup: {
                    from: "users", // Userlar kolleksiyasi
                    localField: "userId",
                    foreignField: "_id",
                    as: "user",
                },
            },
            { $unwind: "$user" }, // User massivini ochish
            {
                $group: {
                    _id: "$user.student.group.name", // Gruppalash student.group.name bo‘yicha
                    answers: { $push: "$$ROOT" }, // Gruppadagi barcha javoblarni yig'ish
                    count: { $sum: 1 }, // Har bir gruppadagi javoblar sonini hisoblash
                },
            },
            { $sort: { _id: 1 } }, // Gruppani tartiblash (o'sish tartibida)
            {
                $facet: {
                    metadata: [{ $count: "total" }], // Umumiy gruppa sonini hisoblash
                    data: [
                        { $skip: (page - 1) * limit }, // Natijalarni o'tkazib yuborish
                        { $limit: parseInt(limit, 10) }, // Limit bo‘yicha natijalarni olish
                    ],
                },
            },
        ]);

        // Metadata va data natijalarini ajratish
        const metadata = answers[0]?.metadata[0] || { total: 0 };
        const data = answers[0]?.data || [];

        // Javoblarni qaytarish
        res.status(200).json({
            success: true,
            message: "Gruppa bo'yicha javoblar muvaffaqiyatli topildi",
            total: metadata.total, // Umumiy gruppa soni
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
            data,
        });
    } catch (error) {
        next(error);
    }
};




exports.show = async (req, res, next) => {
    try {
        const answer = await AnswerModel.findById(req.params._id).populate("userId").populate("testId").populate("answers.question")

        res.status(200).json({ success: true, data: answer })
    } catch (error) {
        next(error)
    }
}