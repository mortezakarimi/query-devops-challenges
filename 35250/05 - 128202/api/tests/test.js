const server = require("../src/main");
const request = require("supertest");
const { createClient } = require("redis");

let client;
beforeEach(async () => {
    jest.clearAllMocks();
    client = createClient({
        url: "redis://redis:6379",
    });

    client.on("error", (err) => console.log("Redis Client Error", err));
    await client.connect();
});

afterEach(async () => {
    for await (const key of client.scanIterator()) {
        // use the key!
        await client.del(key);
    }
    await client.quit();
});

describe("Test API", () => {
    it("GET / should be response with HTTP 200 code", async () => {
        await request(server).get("/").expect(200);
    });

    it("GET / should be response with content-type json", async () => {
        await request(server)
            .get("/")
            .set("Accept", "application/json")
            .expect("Content-Type", /json/);
    });

    it("GET / should return latest status", async () => {
        await sendRequestWithoutClientKey({});
    });

    it("GET / should return client key value times", async () => {
        await sendClientKeyRequest("one", { one: 1 });
        await sendClientKeyRequest("one", { one: 2 });
        await sendClientKeyRequest("two", { one: 2, two: 1 });
        await sendRequestWithoutClientKey({ one: 2, two: 1 });
    });

    it("GET / should concurrency call stay sync", async () => {
        await Promise.all([
            sendRequest("one"),
            sendRequest("one"),
            sendRequest("two"),
            sendRequest("two"),
            sendRequest("two"),
            sendRequest("two"),
        ]).catch((e) => {
            console.log(e);
        });

        await sendRequestWithoutClientKey({ one: 2, two: 4 });
    });
});
async function sendClientKeyRequest(key, state) {
    const res = await sendRequest(key).expect(200);
    expect(res.body).toHaveProperty("state", state);
}
function sendRequest(key) {
    return request(server).get("/").set({ "CLIENT-KEY": key });
}

async function sendRequestWithoutClientKey(state) {
    const res = await request(server).get("/").expect(200);

    expect(res.body).toHaveProperty("state", state);
}
