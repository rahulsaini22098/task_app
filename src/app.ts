import express, {  } from 'express'
import db from './models/index'
import * as dotenv from 'dotenv'
import cors from 'cors'

//routes
import todoRoutes from './routes/todo'
import userRoutes from './routes/user'

dotenv.config()

const app = express()

// config middleware
app.use(cors())
app.use(express.json())

// routes
app.use('/', todoRoutes)
app.use('/user', userRoutes)

// config DB
db.sequelize.sync().catch((err: Error) => {
    console.log(err)
})


export default app