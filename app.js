const express = require("express");
const app = express();
app.use(express.json());

const cors = require("cors");
app.use(cors());

require("dotenv").config();

require("./db");

const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const productRoute = require("./routes/product");
const cartRoute = require("./routes/cart");
const orderRoute = require("./routes/order");
const paymentRoute = require("./routes/payment");
const adminRoute = require("./routes/admin");

const { errorHandle } = require("./middleware/errorHandle");
const { handleNotFound } = require("./utils/errorHandle");

app.use("/api/auth/", authRoute);
app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/cart", cartRoute);
app.use("/api/order", orderRoute);
app.use("/api/payment", paymentRoute);
app.use("/api/admin", adminRoute);

app.use("/*", handleNotFound);

//Async Await Error Handle
app.use(errorHandle);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log("Background Server is Running At " + PORT);
});
