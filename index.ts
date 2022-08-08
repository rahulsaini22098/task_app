import express, {  } from 'express'
import db from './models/index'
import * as dotenv from 'dotenv'

dotenv.config()

//routes
import todoRoute from './routes/todo'

const app = express()
const port = 3000 || process.env.PORT

// config middleware
app.use(express.json())
app.use('/', todoRoute)

// config DB
db.sequelize.sync()
    .then(() => {
        app.listen(port, () => console.log(`server is runing at port ${port}`))
    })
    .catch((err: Error) => {
        console.log(err)
    })
