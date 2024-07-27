// user-service/index.js
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const auth = require("../shared/middlewares/auth");

const app = express();
const PORT = process.env.PORT || 4001;

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error(err));

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    apiKey: String,
});
const User = mongoose.model("User", userSchema);

app.use(bodyParser.json());

app.get("/profile", auth, async (req, res) => {
    const user = await User.findOne({ username: req.user.username });
    console.log("User:", user);
    res.json({ message: "User profile", user });
});

app.listen(PORT, () => {
    console.log(`User service running on port ${PORT}`);
});
