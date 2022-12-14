import "module-alias/register";
import router from "./routes/index";
import cors from "cors";
import mongoose from "mongoose";
const { Middleware } = require("express-http-response");
import express from "express";
const app = express(),
  PORT = process.env.PORT || 3001;

mongoose
  .connect("mongodb://127.0.0.1:27017/web3login")
  .catch((err: object) => {
    console.log(err);
  })
  .then(() => {
    console.log(`connected to db in Dev environment`);
  });

// mongoose.set('debug',true);

app.use(express.json());
app.use(cors());
app.use(router);
app.use(Middleware);

app.listen(PORT, () => {
  console.log(`Listening at port ${PORT}.`);
});
