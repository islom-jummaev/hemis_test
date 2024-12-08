const errorMiddleware = (err, req, res, next) => {
    let status = err.status || 500 // Standart xato kodi
    let message = err.message || "Internal server error" // Xato xabari

    // Axios xatolarini tekshirish
    if (err.isAxiosError) {
        if (err.response) {
            status = err.response.status || 500
            message = err.response.data?.message || "Error occurred while fetching data"
        } else if (err.request) {
            status = 500
            message = "No response received from the server"
        } else {
            status = 500
            message = "Error occurred while setting up the request"
        }
    }

    // MongoDB ValidationError xatolarini tekshirish
    if (err.name === "ValidationError") {
        status = 400 // Bad Request
        message = Object.values(err.errors)
            .map((val) => val.message)
            .join(", ")
    }

    // MongoDB castError (noto'g'ri formatdagi ID) xatolarini tekshirish
    if (err.name === "CastError") {
        status = 400 // Bad Request
        message = `Invalid value for ${err.path}: ${err.value}`
    }

    // Xato haqida qo'shimcha ma'lumot
    const errorDetails = {
        message: message,
        status: status,
        method: req.method,
        url: req.originalUrl,
        stack: process.env.NODE_ENV === "production" ? null : err.stack, // Stack trace faqat ishlab chiqarishda ko'rsatilmasin
    }

    // Foydalanuvchiga javob qaytarish
    res.status(status).json(errorDetails)
}

module.exports = errorMiddleware
