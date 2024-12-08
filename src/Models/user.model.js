const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    login: String,
    password: String,
    token: String,
    student: {}
},
{
    timestamps: true
});

module.exports = mongoose.model("User", UserSchema);