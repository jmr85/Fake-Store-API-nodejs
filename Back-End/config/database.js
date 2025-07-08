const mongoose = require("mongoose");
require("dotenv").config(); // access environment variables

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connect to MongooDB....");
  })
  .catch((err) => {
    console.log(err);
  });
