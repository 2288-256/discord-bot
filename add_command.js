const { Client, ClientApplication } = require("discord.js");
async function register(client, commands, guildID) {
	if (guildID == null) {
		return client.application.commands.set(commands);
	}
	const guild = await client.guilds.fetch(guildID);
	return guild.commands.set(commands);
}
const leave = {
	name: "leave",
	description: "サーバーからBotを退出させます",
};
const ping = {
	name: "ping",
	description: "Pingを送信します",
};
const omikuzi = {
	name: "omikuzi",
	description: "実装予定(今は動きません)",
};
const slot = {
	name: "slot",
	description: "実装予定(今は動きません)",
};
const bot-info = {
  name: "bot-info"
  description: "Botの情報を表示します"
}
const commands = [leave, ping, omikuzi, slot, bot-info];
const client = new Client({
	intents: 0,
});
require("dotenv").config();
client.token = process.env.DISCORD_TOKEN;
async function main() {
	client.application = new ClientApplication(client, {});
	await client.application.fetch();
	await register(client, commands, process.argv[2]);
	console.log("registration succeed!");
}
main().catch((err) => console.error(err));
