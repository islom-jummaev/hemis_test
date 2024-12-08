const express = require("express")
const app = express.Router()
const Ctrl = require("./test.ctrl")

app.get("/", Ctrl.index)
app.get("/start/:_id", Ctrl.start)
app.post("/submit", Ctrl.submit)

module.exports = app
