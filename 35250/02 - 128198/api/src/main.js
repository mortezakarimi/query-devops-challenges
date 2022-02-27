const express = require("express");
const app = express();

const state = {};
app.get("/", (req, res) => {
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
