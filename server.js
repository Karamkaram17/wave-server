require("dotenv").config();
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");

const corsOptions = require("./config/corsOptions");
const custom404 = require("./middleWare/custom-404");
const connectDB = require("./config/DBconnection");
const credentials = require("./middleWare/credentials");

const port = process.env.PORT || 5000;

app.use(credentials);
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

app.use("/auth", require("./routes/auth-route"));
app.use("/refresh", require("./routes/refresh-route"));
app.use("/logout", require("./routes/logout-route"));
app.use("/users", require("./routes/api/user-route"));
app.use("/posts", require("./routes/api/post-route"));

app.all("*", custom404);

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port);
    console.log(port);
  } catch (error) {
    console.log(error);
  }
};

start();
