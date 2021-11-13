const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const productsRoute = require("./routes/product");
const app = express();

dotenv.config();

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("db connected successfully"))
  .catch((err) => console.log(err));

app.get("/api/test", () => {
  console.log("test is successful");
});

app.use(express.json());
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/products", productsRoute);

app.listen(process.env.PORT || 5000, () => {
  console.log("server listening on port 5000!!!");
});
