const express = require("express")
const app = express.Router()
const Ctrl = require("./profile.ctrl")

app.get("/", Ctrl.profile)

module.exports = app
