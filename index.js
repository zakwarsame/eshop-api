const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoute = require('./routes/user')
const authRoute = require('./routes/auth')
const app = express();

dotenv.config();

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("db connected successfully"))
  .catch((err) => console.log(err));

app.get("/api/test",()=> {
    console.log("test is successful");
})

app.use(express.json())
app.use("/api/user", userRoute)
app.use("/api/auth", authRoute)

app.listen(process.env.PORT || 5000, () => {
  console.log("server listening on port 5000!!!");
});
