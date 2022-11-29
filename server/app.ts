const express = require("express"),
  app = express(),
  router = require("./routes"),
  cors = require("cors"),
  mongoose = require("mongoose"),
  httpResponse = require("express-http-response"),
  { Server } = require("socket.io"),
  PORT = process.env.PORT || 3000;

mongoose
  .connect("mongodb://127.0.0.1:27017/gupshup", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .catch((err) => {
    console.log(err);
  })
  .then(() => {
    console.log(`connected to db in Dev environment`);
  });

// mongoose.set('debug',true);

require("../server/models/User");
require("../server/models/Chat");
require("../server/models/Group");

app.use(express.json());
app.use(cors());
app.use(router);
app.use(httpResponse.Middleware);

app.listen(PORT, () => {
  console.log(`Listening at port ${PORT}.`);
});