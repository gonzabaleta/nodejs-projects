const mongoose = require("mongoose");

// Require dotenv
require("dotenv").config();

// Configure App
const express = require("express");
const app = express();
app.use(express.json());

// Connect MONGO ATLAS if selected
const { PERSIST_METHOD, MONGO_ATLAS_URL } = process.env;
if (PERSIST_METHOD === "mongo") {
  const URL = MONGO_ATLAS_URL;
  mongoose.connect(URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("MONGO ATLAS CONNECTED");
} else if (PERSIST_METHOD === "firebase") {
  const admin = require("firebase-admin");
  const serviceAccount = require("./db/firebase/coder-ee87b-firebase-adminsdk-sn9i4-115aa27bb2.json");

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log("FIREBASE INITIALIZED");
}

// Configure main API router
const apiRouter = require("./routes");
app.use("/api", apiRouter);

// Initialize server
const PORT = 3001;
app.listen(PORT, () => console.log(`Server on port ${PORT}`));
