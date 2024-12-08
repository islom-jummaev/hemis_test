const express = require("express")
const app = express.Router()

app.use("/auth", require("./Auth/auth.route"))
app.use("/test", require("./Test/test.route"))
app.use("/answer", require("./Answer/answer.route"))
app.use("/student", require("./Student/student.route"))

module.exports = app
