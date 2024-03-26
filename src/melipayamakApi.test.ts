import "dotenv/config";
import { describe, expect, it } from "vitest";

import { MelipayamakApi } from "./melipayamakApi";

const username = process.env.MELIPAYAMAK_USERNAME;
const password = process.env.MELIPAYAMAK_API_TOKEN;

if (!username || !password) {
  throw new Error("set username and password in .env file");
}
const melipayamakApi = new MelipayamakApi({
  username,
  password,
});

describe("melipayamakApi", () => {
  // it("test send sms", async () => {
  // 	const sendResponse = await melipayamakApi.send({
  // 		from: "50002710013070",
  // 		to: "09212745038",
  // 		text: `تست پیامک
  // 			لغو11`,
  // 	});
  // 	expect(sendResponse.retStatus).toBe(1);
  // 	expect(sendResponse.strRetStatus).toBe("Ok");
  // });

  it("test send sms not delivered", async () => {
    const sendResponse = await melipayamakApi.send({
      from: "50002710013070",
      to: "09123956118",
      text: `تست پیامک
				لغو11`,
    });
    expect(sendResponse.retStatus).toBe(1);
    expect(sendResponse.strRetStatus).toBe("Ok");
    expect(sendResponse.description).toBe("ارسال نشده");
  });

  it("test send sms verify lookup", async () => {
    try {
      await melipayamakApi.verifyLookup({
        to: "09212745038",
        text: ["code1", "code2"],
        bodyId: 1,
      });
    } catch (error) {
      expect((error as Error).message).toBe(
        "کد متن ارسالی صحیح نمی‌باشد و یا توسط مدیر سامانه تأیید نشده است"
      );
    }
  });
});
