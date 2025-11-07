const express = require("express");
const mongoose = require("mongoose");
const config = require("./utils/config");
const loginRouter = require("./controllers/login");
const blogsRouter = require("./controllers/blogs");
const middleware = require("./utils/middleware");
const usersRouter = require("./controllers/user");
const cors=require('cors');
const app = express();


app.use(cors({
  origin: "http://localhost:5173"
}));

app.use(express.json());
app.use(middleware.tokenExtractor);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);
app.use("/api/blogs", blogsRouter);

if (process.env.NODE_ENV === "test") {
  const testingRouter = require("./controllers/testing");
  app.use("/api/testing", testingRouter);
}

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

mongoose
  .connect(config.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err.message));

module.exports = app;