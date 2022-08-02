import express, { Application, Request, Response } from "express";
import db from "./db.config";

//routes
import todoRoute from "./routes/todo";

const app = express();
const port = 3000;

// config middleware
app.use(express.json());

// config DB

db.sync()
  .then(() => {
    console.log("connect to db");
  })
  .catch((err) => {
    throw err;
  });

// config route

app.use("/", todoRoute);

app.listen(port, () => console.log(`server is runing at port ${port}`));
