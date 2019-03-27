const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();

const productRouter = require("../server/routes/product");
const userRouter = require("../server/routes/user");

const app = express();


mongoose.connect(
  process.env.DB_URL,
  {
    useNewUrlParser: true,
    autoIndex: false
  },
  () => {
    console.log("connected to database");
  }
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

// Setting routes
app.use("/api", productRouter);
app.use("/api", userRouter);



const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});
