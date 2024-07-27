// auth-service/index.js
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 4000;

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

app.post("/register", async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();
    res.status(201).send("User registered");
});

app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).send("Invalid credentials");
    }
    const token = jwt.sign({ username }, process.env.JWT_SECRET, {
        expiresIn: "1h",
    });
    res.json({ token });
});

app.post("/generate-api-key", async (req, res) => {
    const { username } = req.body;
    const apiKey = require("crypto").randomBytes(20).toString("hex");
    await User.updateOne({ username }, { apiKey });
    res.json({ apiKey });
});

app.listen(PORT, () => {
    console.log(`Auth service running on port ${PORT}`);
});
