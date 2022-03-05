const { Client, ClientApplication } = require(`discord.js`);
async function register(client, commands, guildID) {
	if (guildID == null) {
		return client.application.commands.set(commands);
	}
	const guild = await client.guilds.fetch(guildID);
	return guild.commands.set(commands);
}
const leave = {
	name: `leave`,
	description: `サーバーからBotを退出させます`,
};
const ping = {
	name: `ping`,
	description: `Pingを送信します`,
};
const omikuzi = {
	name: `omikuzi`,
	description: `実装予定`,
};
const slot = {
	name: `slot`,
	description: `実装予定`,
};
const botinfo = {
	name: `botinfo`,
	description: `Botの情報を表示します`,
};
const restart = {
	name: `restart`,
	description: `Botを再起動させます`,
};
const test = {
	name: `test`,
	description: `テストコマンド`,
};
const mcid = {
	name: "mcid",
	description: "MCIDを入力するとUUIDを返します",
	type: 1,
	options: [
		{
			name: "mcid",
			description: "Java版のユーザー名を入力してください",
			type: 3,
			required: true,
		},
	],
};
const uuid = {
	name: "uuid",
	description: "UUIDを入力するとMCIDを返します",
	type: 1,
	options: [
		{
			name: "uuid",
			description: "UUIDを入力してください",
			type: 3,
			required: true,
		},
	],
};
const maintenance = {
	name: "maintenance",
	description: "メンテナンスモードを切り替えます",
};
const serverlist = {
	name: "serverlist",
	description: "[未実装]PlayerWorldのサーバーリストを表示します",
};
const serverinfo = {
	name: "serverinfo",
	description: "PlayerWorldのサーバー詳細情報を表示します",
	type: 1,
	options: [
		{
			name: "mcid",
			description:
				"サーバーの詳細情報を表示したいJava版のユーザー名を入力してください",
			type: 3,
			required: true,
		},
	],
};
const send = {
	name: "send",
	description: "指定したチャンネルにメッセージを送信します",
	type: 1,
	options: [
		{
			name: "channel",
			description: "送信したいチャンネル名を入力してください",
			type: 7,
			required: true,
		},

		{
			name: "line1",
			description: "[1行目]送信したいメッセージを入力してください",
			type: 3,
			required: true,
		},
		{
			name: "line2",
			description: "[2行目]送信したいメッセージを入力してください",
			type: 3,
			required: false,
		},
		{
			name: "line3",
			description: "[3行目]送信したいメッセージを入力してください",
			type: 3,
			required: false,
		},
		{
			name: "line4",
			description: "[4行目]送信したいメッセージを入力してください",
			type: 3,
			required: false,
		},
	],
};
const invite = {
	name: "invite",
	description: "このBotの招待リンクを送信します",
};
const commands = [
	leave,
	ping,
	omikuzi,
	slot,
	botinfo,
	restart,
	test,
	mcid,
	uuid,
	maintenance,
	serverlist,
	serverinfo,
	send,
	invite,
];
const client = new Client({
	intents: 0,
});
require(`dotenv`).config();
client.token = process.env.DISCORD_TOKEN;
async function main() {
	client.application = new ClientApplication(client, {});
	await client.application.fetch();
	await register(client, commands, process.argv[2]);
	console.log(`registration succeed!`);
}
main().catch((err) => console.error(err));
