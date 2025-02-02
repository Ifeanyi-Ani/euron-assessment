const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const xssClean = require("xss-clean");
const mongoSanitizer = require("express-mongo-sanitize");
const rateLimit = require("express-rate-limit");

const globalError = require("./controllers/globalErrorController");
const referralRoutes = require("./routes/referralRoutes");
const AppError = require("./utils/AppError");

const limiter = rateLimit({
  max: 200,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests for this IP, please try again in an hour",
});

const app = express();

app.use(helmet());
app.use(limiter);
app.use(mongoSanitizer());
app.use(xssClean());
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/codes", referralRoutes);
app.all("*", (req, _res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalError);

module.exports = app;
