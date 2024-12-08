const express = require("express")
const app = express.Router()
const loginCtrl = require("./auth.ctrl")

app.post("/login", loginCtrl.login)

module.exports = app
