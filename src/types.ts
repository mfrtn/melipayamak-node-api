export type MelipayamakConfigs = {
	username: string;
	password: string;
};

export type MelipayamakApiOptions = {
	host: string;
	path: string;
	data: MelipayamakConfigs;
};

export type SendSMSParams = {
	from: string;
	to: string | string[];
	text: string;
	isFlash?: boolean;
};

export type Result = {
	Value: string;
	RetStatus: number;
	StrRetStatus: string;
};

export type ResponseResult = {
	value: string;
	retStatus: number;
	strRetStatus: string;
	description: string;
};
