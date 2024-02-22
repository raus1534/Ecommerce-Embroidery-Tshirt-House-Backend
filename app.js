const express = require("express");
const app = express();
app.use(express.json());

const cors = require("cors");
app.use(cors());

require("dotenv").config();

require("./db");

const authRoute = require("./routes/auth");

const { errorHandle } = require("./middleware/errorHandle");
const { handleNotFound } = require("./utils/errorHandle");

app.use("/api/auth/", authRoute);
// app.use("/api/user");
app.use("/*", handleNotFound);

//Async Await Error Handle
app.use(errorHandle);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log("Background Server is Running At " + PORT);
});
