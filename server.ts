import express from "express"
import cors from "cors"
import {config} from "dotenv"
import taskRoute from "./services/tasks/index.js"

let app = express() //init app
config() //config dotenv to read env files

app.use(cors()) //apply cors

app.use(express.json()) //use json format
app.use("/api/tasks", taskRoute)

export default app

