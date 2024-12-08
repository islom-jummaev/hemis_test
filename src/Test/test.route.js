const express = require("express")
const app = express.Router()
const TestCtrl = require("./test.ctrl")

app.post("/create", TestCtrl.create)
app.get("/start/:testId", TestCtrl.start)

module.exports = app