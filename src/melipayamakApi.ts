import { request, RequestOptions } from "https";
import { stringify } from "querystring";

import {
	MelipayamakApiOptions,
	MelipayamakConfigs,
	ResponseResult,
	Result,
	SendSMSParams,
} from "./types";

type RequestParams = {
	[key: string]: any;
};

export class MelipayamakApi {
	private readonly options: MelipayamakApiOptions;

	private readonly messages: { [key: string]: string } = {
		"0": "نام کاربری یا رمز عبور اشتباه می‌باشد",
		"2": "اعتبار کافی نمی‌باشد",
		"3": "محدودیت در ارسال روزانه",
		"4": "محدودیت در حجم ارسال",
		"5": "شماره فرستنده معتبر نمی‌باشد",
		"6": "سامانه در حال بروز رسانی می باشد",
		"7": "متن حاوی کلمه فیلتر شده می باشد",
		"9": "ارسال از خطوط عمومی از طریق وب سرویس امکان پذیر نمی‌باشد",
		"10": "کاربر مورد نظر فعال نمی‌باشد",
		"11": "ارسال نشده",
		"12": "مدارک کاربر کامل نمی‌باشد",
		"13": "متن حاوی لینک می‌باشد",
		"15": "ارسال به بیش از 1 شماره همراه بدون درج 'لغو11' ممکن نیست",
		"35": "شماره در لیست سیاه مخابرات می‌باشد.",
	};

	constructor({ username, password }: MelipayamakConfigs) {
		this.options = {
			host: "rest.payamak-panel.com",
			path: "api/SendSMS",
			data: {
				username,
				password,
			},
		};
	}

	private sendReq(
		method: string,
		params?: RequestParams
	): Promise<ResponseResult> {
		const postData = stringify({ ...this.options.data, ...params });
		const postRequestOptions: RequestOptions = {
			host: this.options.host,
			port: "443",
			path: `/${this.options.path}/${method}`,
			method: "POST",
			headers: {
				"Content-Length": Buffer.byteLength(postData),
				"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
			},
		};
		return new Promise((resolve, reject) => {
			const req = request(postRequestOptions, (res) => {
				res.setEncoding("utf8");
				let result = "";
				res.on("data", (data) => {
					result += data;
				});

				res.on("end", () => {
					try {
						const jsonObject: Result = JSON.parse(result);
						if (
							res.statusCode &&
							res.statusCode >= 200 &&
							res.statusCode < 300 &&
							jsonObject.StrRetStatus === "Ok"
						) {
							const description =
								jsonObject.Value === "11"
									? "ارسال نشده"
									: jsonObject.Value.concat(",").includes("11")
									? "تعدادی از پیامک‌ها ارسال نشدند"
									: jsonObject.RetStatus === 1
									? "با موفقیت انجام شد"
									: this.messages[jsonObject.Value] || "خطای نامعلوم";

							resolve({
								value: jsonObject.Value,
								retStatus: jsonObject.RetStatus,
								strRetStatus: jsonObject.StrRetStatus,
								description,
							});
						} else {
							const message = this.messages[jsonObject.Value] || "خطای نامعلوم";
							reject({
								message,
								status: 500,
								description: "Request rejected",
							});
						}
					} catch (e: unknown) {
						if (e instanceof Error) {
							reject({
								message: e.message,
								status: 500,
								description: "Exception occurred",
							});
						} else {
							reject({
								message: "Unknown error occurred",
								status: 500,
								description: "Exception occurred",
							});
						}
					}
				});
			});

			req.on("error", (e) => {
				reject({
					error: e.message,
					status: 500,
					description: "Error occurred",
				});
			});

			req.write(postData, "utf8");
			req.end();
		});
	}

	async send(data: SendSMSParams): Promise<ResponseResult> {
		if (Array.isArray(data.to)) {
			data.to = data.to.join(",");
		}
		return this.sendReq("SendSMS", data);
	}
}
