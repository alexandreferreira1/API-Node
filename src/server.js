require('express-async-errors')
const database = require('./database/sqlite/index.js')
const AppError = require('./utils/AppError.js')
const express = require("express");
const app = express();
const routes = require("./routes/index.js");


app.use(express.json());

app.use(routes)

database()

app.use((error, request, response, next) => {
    console.error(error)
    if (error instanceof AppError) {
        return response.status(error.statusCode).json({
            status: "error",
            message: error.message,
        })
    }


    return response.status(500).json({
        status: "error",
        message: "Internal Server Error",
    })
})

const port = 3333;
app.listen(port, () => console.log(`Server is running on Port ${port}`));
