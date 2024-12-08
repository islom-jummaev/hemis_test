const path = require("path")
const express = require("express")
const app = express()
const dotenv = require("dotenv")
const { default: mongoose } = require("mongoose")
const cors = require("cors")
const morgan = require("morgan")
const errorMiddleware = require("./src/Middlewares/error.middleware")

dotenv.config()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, "public")))
app.use(morgan("dev"))
app.use(cors("*"))

app.get("/", (req, res) => {
    res.status(200).json({ success: true, message: "Server is running..." })
})

app.use("/api/admin", require("./src/Admin/admin.route"))
app.use("/api/student", require("./src/Student/student.route"))

app.use(errorMiddleware)

// Foydalanuvchining mavjud bo'lmagan yo'nalishga yuborgan so'rovlariga javob
app.all("*", (req, res) => {
    const errorDetails = {
        message: `The requested route ${req.originalUrl} does not exist on this server.`,
        status: 404,
        method: req.method,
        url: req.originalUrl,
        stack: process.env.NODE_ENV === "production" ? null : "No stack trace available", // Stack trace faqat ishlab chiqarishda ko'rsatilmasin
    }

    res.status(404).json(errorDetails)
})

const port = process.env.PORT || 3000

async function dev() {
    try {
        await mongoose
            .connect(process.env.MONGO_URL)
            .then((res) => {
                console.log(`Mongodb START:`, res.connection.name)
            })
            .catch((error) => {
                console.log(error)
            })

        // await createSuperAdmin()

        app.listen(port, `0.0.0.0`, () => {
            console.log("TEST server is running HOST PORT:", `http://localhost:${port}`)
        })
    } catch (error) {
        console.log(error)
    }
}

dev()
