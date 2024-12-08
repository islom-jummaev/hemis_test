const express = require("express")
const jwt = require("jsonwebtoken")
const app = express.Router()

app.post("/login", (req, res, next) => {
    try {
        const { login, password } = req.body

        if (login !== "admin" || password !== "12345") {
            throw new Error("Login yoki parol xato")
        }

        const token = jwt.sign({ login, password }, "hemis_secret123")

        res.status(200).json({ success: true, message: "Login successful", token })
    } catch (error) {
        next(error)
    }
})

module.exports = app
