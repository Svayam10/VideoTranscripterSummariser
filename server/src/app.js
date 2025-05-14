import express, { urlencoded } from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

app.use(express.json({ limit: '16kb' }))
app.use(urlencoded({ limit: '16kb', extended: true }))
app.use(express.static('public'))
app.use(cookieParser())

import videoRouter from "./routes/video.route.js"
app.use(videoRouter)

export { app }