const request = require("supertest");
const app = require("../api/app.js");
const { User } = require("../api/models/user.js");
const { checkDBStatus } = require("../modules/database/connection.js");

describe("User creation and check duplication", () => {
  let userId;
  let encodedStr;

  beforeAll(async () => {
    await checkDBStatus();
  });

  afterAll(async () => {
    await User.destroy({ where: {} });
  });

  test("Create user and get details", async () => {
    const userObj = {
      first_name: "Anirban",
      last_name: "Dutta",
      password: "Boston",
      username: "anirbandutta98@gmail.com",
    };
    const responsePostReq = await request(app).post("/v3/user/").send(userObj);
    expect(responsePostReq.status).toBe(201);

    userId = responsePostReq.body.id;

    encodedStr = Buffer.from(
      `${userObj.username}:${userObj.password}`
    ).toString("base64");

    const responseGetReq = await request(app)
      .get("/v3/user/self/")
      .set("Authorization", `Basic ${encodedStr}`);
    expect(responseGetReq.status).toBe(200);
    expect(responseGetReq.body.id).toBe(userId);
  });

  test("Update account and verify updation", async () => {
    const updatedUsrObj = {
      first_name: "Bunny",
      last_name: "Noida",
    };
    const responsePostReq = await request(app)
      .put("/v3/user/self/")
      .set("Authorization", `Basic ${encodedStr}`)
      .send(updatedUsrObj);
    expect(responsePostReq.status).toBe(204);

    const responseGetReq = await request(app)
      .get("/v3/user/self/")
      .set("Authorization", `Basic ${encodedStr}`);
    expect(responseGetReq.status).toBe(200);
    expect(responseGetReq.body.id).toBe(userId);
    expect(responseGetReq.body.first_name).toBe(updatedUsrObj.first_name);
    expect(responseGetReq.body.last_name).toBe(updatedUsrObj.last_name);
    expect(responseGetReq.body.account_created).not.toBe(
      responseGetReq.body.account_updated
    );
  });
});
