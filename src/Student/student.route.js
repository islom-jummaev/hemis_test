const express = require("express")
const app = express.Router()
const AuthMiddleware = require("../Middlewares/auth.middleware")

app.use("/auth", require("./Auth/auth.route"))
app.use("/profile", AuthMiddleware, require("./Profile/profile.route"))
app.use("/test", AuthMiddleware, require("./Test/test.route"))

module.exports = app
