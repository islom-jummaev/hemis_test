const express = require("express")
const app = express.Router()
const Ctrl = require("./answer.ctrl")

app.get("/", Ctrl.index)
app.get("/:_id", Ctrl.show)

module.exports = app
