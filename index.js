const express = require("express");
const cors = require("cors");
const dbConnect = require("./config/dbConnect");
require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 3000;
dbConnect();
const userRouter = require("./routes/user.route");
const { notFound, errorHandler } = require("./middlewares/errorHandler");

// middlewares
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * routes
app.use("/api/user", userRouter);

app.get("/", (req, res) => {
  res.send("server is running!");
});

// ! error handlers
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`server is running at port ${PORT}`);
});
