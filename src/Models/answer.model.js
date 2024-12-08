const mongoose = require("mongoose")

const AnswerSchema = new mongoose.Schema({
    questionNumber: { type: Number, required: true }, // Savol raqami
    selectedVariant: { type: String, required: true }, // Tanlangan variant (A, B, C, D)
    _id: false, // ID ni o'chirish
})

const TestAnswerSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Foydalanuvchi ID
        testId: { type: mongoose.Schema.Types.ObjectId, ref: "Test", required: true }, // Test ID
        answers: [AnswerSchema], // Foydalanuvchining javoblari
        completionTime: { type: Date, default: Date.now }, // Testni yakunlash vaqti
        status: { type: String, enum: ["completed", "in-progress"], default: "in-progress" }, // Test holati
    },
    { timestamps: true }
)

module.exports = mongoose.model("TestAnswer", TestAnswerSchema)
