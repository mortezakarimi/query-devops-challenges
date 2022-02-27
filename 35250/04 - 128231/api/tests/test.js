const server = require("../src/main");
const request = require("supertest");

describe("Test API", () => {
    beforeEach(() => {
        jest.useFakeTimers("modern");
    });

    afterEach(() => {
        jest.useRealTimers();
        jest.restoreAllMocks();
    });

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

    it("GET / should get 429 status if too much request", async () => {
        for (let i = 0; i < 10; i++) {
            await sendRequest("three").expect(200);
        }
        const { body } = await sendRequest("three").expect(429);
        expect(body).toStrictEqual({ message: "Too many request from three" });
    });

    it("GET / should get 200 status if requests time more than 1 minutes", async () => {
        for (let i = 0; i < 10; i++) {
            await sendRequest("four").expect(200);
            jest.advanceTimersByTime(6500);
        }
        const { body } = await sendRequest("four").expect(200);
        expect(body).toHaveProperty("state");
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
