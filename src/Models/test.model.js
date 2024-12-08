const mongoose = require("mongoose")

const QuestionSchema = new mongoose.Schema({
    questionText: { type: String, required: true }, // Savol matni
    options: [
        {
            "variant": { type: String, required: true },
            "javob": { type: String, required: true }, // Javob varianti
            _id: false, // ID ni o'chirish, chunki variantlar faqat matndan iborat
        },
    ],
    _id: false, // Savolning ID sini o'chirish
})

const TestSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String }, 
        time: { type: Number, required: true },
        questions: [QuestionSchema], 
        // user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
    { timestamps: true } 
)

module.exports = mongoose.model("Test", TestSchema)
