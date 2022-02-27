const server = require("../src/main");
const request = require("supertest");

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
});
async function sendClientKeyRequest(key, state) {
    const res = await request(server)
        .get("/")
        .set({ "CLIENT-KEY": key })
        .expect(200);

    expect(res.body).toHaveProperty("state", state);
}
async function sendRequestWithoutClientKey(state) {
    const res = await request(server).get("/").expect(200);

    expect(res.body).toHaveProperty("state", state);
}
