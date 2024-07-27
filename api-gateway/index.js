// api-gateway/index.js
require("dotenv").config();
const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const auth = require("../shared/middlewares/auth");
const apiKeyMiddleware = require("../shared/middlewares/apiKey");

const app = express();
const PORT = process.env.PORT || 3000;

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

app.use(
    "/auth",
    createProxyMiddleware({
        target: "http://localhost:4000",
        changeOrigin: true,
    })
);
app.use(
    "/user",
    auth,
    createProxyMiddleware({
        target: "http://localhost:4001",
        changeOrigin: true,
    })
);
app.use(
    "/product",
    auth,
    createProxyMiddleware({
        target: "http://localhost:4002",
        changeOrigin: true,
    })
);

app.listen(PORT, () => {
    console.log(`API Gateway running on port ${PORT}`);
});
