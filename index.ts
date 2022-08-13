import express, {  } from 'express'
import db from './models/index'
import * as dotenv from 'dotenv'
import cors from 'cors'

//routes
import todoRoutes from './routes/todo'
import userRoutes from './routes/user'

dotenv.config()

const app = express()
const port = process.env.PORT || 8080

// config middleware
app.use(cors())
app.use(express.json())

// routes
app.use('/', todoRoutes)
app.use('/user', userRoutes)

// config DB
db.sequelize.sync()
    .then(() => {
        app.listen(port, () => console.log(`server is runing at port ${port}`))
    })
    .catch((err: Error) => {
        console.log(err)
    })
