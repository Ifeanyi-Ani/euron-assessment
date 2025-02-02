const express = require("express");
const globalError = require("./controllers/globalErrorController");
const referralRoutes = require("./routes/referralRoutes");
const AppError = require("./utils/AppError");

const app = express();

app.listen(4000, () => {
  console.log("app is running on port 4000");

app.use("/api/codes", referralRoutes);
app.all("*", (req, _res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalError);

module.exports = app;
