const express = require("express");
const app = express();

const WINDOW_SIZE_MS = 60 * 1000;
const MAX_WINDOW_REQUEST_COUNT = 10;
const state = {};
const rateLimiter = {};

function rateLimiterMiddleware(req, res, next) {
    const key = req.headers["client-key"];
    if (!rateLimiter[key]) {
        rateLimiter[key] = { nextReset: Date.now() + WINDOW_SIZE_MS, total: 1 };
    } else {
        rateLimiter[key].total = rateLimiter[key].total + 1;
    }

    if (rateLimiter[key].nextReset < Date.now()) {
        rateLimiter[key] = { nextReset: Date.now() + WINDOW_SIZE_MS, total: 1 };
    }

    if (rateLimiter[key].total > MAX_WINDOW_REQUEST_COUNT) {
        res.status(429).send({ message: `Too many request from ${key}` });
    } else {
        next();
    }
}

app.get("/", [rateLimiterMiddleware], (req, res) => {
    const key = req.headers["client-key"];
    if (key) {
        if (!state[key]) {
            state[key] = 1;
        } else {
            state[key]++;
        }
    }
    res.json({
        state,
    });
});

module.exports = app;
