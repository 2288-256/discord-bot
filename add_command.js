import DiscordJS, { Intents } from "discord.js";
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
	description: `実装予定(今は動きません)`,
};
const slot = {
	name: `slot`,
	description: `実装予定(今は動きません)`,
};
const botinfo = {
	name: `botinfo`,
	description: `Botの情報を表示します`,
};
const stop = {
	name: `stop`,
	description: `Botを強制終了させます`,
};
const test = {
	name: `test`,
	description: `テストコマンド`,
};
const uuid = {
	name: "uuid",
	description: "MCIDを入力するとUUIDを返します",
	type: 1,
	options: [
		{
			name: "uuid",
			description: "Java版のユーザー名を入力してください",
			type: 3,
			required: true,
		},
	],
};
const commands = [leave, ping, omikuzi, slot, botinfo, stop, test, uuid];
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
