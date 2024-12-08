const express = require("express")
const app = express.Router()
const Ctrl = require("./test.ctrl")

app.get("/", Ctrl.index)
app.get("/:_id", Ctrl.show)
app.post("/create", Ctrl.create)
app.put("/:_id", Ctrl.update)
app.delete("/:_id", Ctrl.delete)

module.exports = app
