const Discord = require("discord.js");
const { Client, Intents } = require("discord.js");
const client = new Client({
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});
require("dotenv").config();
const TOKEN = process.env.DISCORD_TOKEN;

const usedCommandRecently = new Set();

client.on("ready", () => {
	console.log(`Logged in as ${client.user.tag}!\nlocation: ` + process.env.OS + `\n----------------------`);
});

client.on("messageCreate", async (message) => {
	if (message.guild === null) {
		return;
	}
});
client.on("interactionCreate", async (interaction) => {
	if (!interaction.isCommand()) {
		return;
	}
			if (interaction.guild === null) {
			const wait = require("util").promisify(setTimeout);
			return interaction.reply(
				"この機能なかったらBot落ちてたんだぞ？？？\n対策はしたけどむやみに送信するのはやめてね？"
			);
			await wait(5000);
			interaction.editReply("DMは対応していません");
		} else {
	if (interaction.commandName === "ping") {
		const now = Date.now();
		const msg = [`GW: ${interaction.client.ws.ping}ms`];
		const wait = require("util").promisify(setTimeout);
		await interaction.reply({ content: msg.join("\n"), ephemeral: true });
		await interaction.editReply(
			[...msg, `RTT: ${Date.now() - now}ms`].join("\n")
		);
		console.log(interaction.member.user.tag + "がpingを使用しました")
		return;
	}
	if (interaction.commandName === "leave") {
			if (!interaction.member.id !== "669735475270909972") {
				interaction.reply({
					content: "あなたにはこのBotをKickする権限がありません",
					ephemeral: true,
				});
				return console.log(interaction.member.user.tag + "がleaveを使用しました")
			} else {
				await interaction.reply("サーバーからKickしました");
				await interaction.guild.leave();
			}
		}
		if (interaction.commandName === "stop") {
		  
			if (!interaction.member.id !== "669735475270909972") {
				interaction.reply({
					content: "あなたにはこのBotを停止するする権限がありません",
					ephemeral: true,
				});
				return console.log(interaction.member.user.tag + "がstopを使用しました")
			} else {
				await interaction.reply("Botを停止しました");
				await process.exit()
			}
		}
		}
});
client.on("messageCreate", async (message) => {
	if (
		message.content.match(
			/入れな|はいれな|参加できな|さんかできな|入れん|はいれん/
		)
	) {
		if (usedCommandRecently.has(message.guild.id)) {
			const wait = require("util").promisify(setTimeout);
			const send = await message.reply("クールダウンのテストです");
			await wait(5000);
			await send.delete;
		} else {
			usedCommandRecently.add(message.guild.id);
			setTimeout(() => {
				usedCommandRecently.delete(message.guild.id);
			}, 3600000);
			const wait = require("util").promisify(setTimeout);
			const embed = new Discord.MessageEmbed()
				.setColor("RANDOM")
				.setTitle("サーバーに参加できない方向け")
				.setAuthor("[自動メッセージ]")
				.setDescription("確認事項一覧")
				.setFields(
					{
						name: "ステップ1",
						value:
							"<#779310447186411520>等にサーバーメンテナンス又はサーバー閉鎖中と書かれていないか？(ピン留めにある時もあります)",
					},
					{
						name: "ステップ2",
						value: "サーバーアドレスやポートがあっているか？",
					},
					{
						name: "解決したら",
						value:
							"質問のメッセージを消してください\n解決したかどうかはわかりません",
					},
					{
						name: "解決しなかったら",
						value:
							"先ほど送信したメッセージを削除してどんな状況かを詳しく書いてください\n詳しく書かないと返答できません",
					},
					{ name: "その他", value: "以下の画像の場合は対応をお待ちください" }
				)
				.setImage(
					"https://media.discordapp.net/attachments/720388991127519264/912706067392253962/unknown.png"
				)
				.setTimestamp() //引数にはDateオブジェクトを入れることができる。何も入れないと今の時間になる
				.setFooter("このメッセージは2分後に削除されます");
			const reply = await message.channel.send({ embeds: [embed] });
			await wait(180000);
			await reply.delete();
		}
	}
});
client.login(TOKEN);
