// product-service/index.js
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const api = require("../shared/middlewares/apiKey");

const app = express();
const PORT = process.env.PORT || 4002;

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error(err));

const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    description: String,
});
const Product = mongoose.model("Product", productSchema);

app.use(bodyParser.json());

app.get("/list", api, async (req, res) => {
    const products = await Product.find();
    res.json({ message: "Product list", products });
});

app.listen(PORT, () => {
    console.log(`Product service running on port ${PORT}`);
});
