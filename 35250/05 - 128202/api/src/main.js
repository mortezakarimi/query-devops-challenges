const express = require("express");
const app = express();
const { createClient, WatchError } = require("redis");

app.get("/", async (req, res) => {
    try {
        const client = createClient({
            url: "redis://redis:6379",
            database: "0",
        });

        client.on("error", (err) => console.log("Redis Client Error", err));

        await client.connect();

        const key = req.headers["client-key"];
        if (key) {
            await client.incr(key);
        }

        const state = {};
        for await (const key of client.scanIterator()) {
            // use the key!
            state[key] = parseInt(await client.get(key));
        }

        res.json({
            state,
        });
        await client.quit();
    } catch (e) {
        console.error(e);
    }
});

module.exports = app;
