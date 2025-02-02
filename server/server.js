require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./app");

const { MONGODB_CONNECTION_STRING, PORT } = process.env;

mongoose.connect(MONGODB_CONNECTION_STRING);
const db = mongoose.connection;

db.once("open", () => console.log("Connected to MongoDB"));
db.on("error", (error) =>
  console.error("MOngoDB connection error:", error.name),
);

const server = app.listen(PORT, () => {
  console.log("app is running on port 4000");
});

process.on("unhandledRejection", (error) => {
  console.log(error.name, error.message);
  server.close(() => {
    throw new Error(
      `UNHANDLED REJECTION ERROR:\n name: ${error.name}\n message: ${error.message}\n Shutting down...`,
    );
  });
});
