const Discord = require(`discord.js`);
const { Client, Intents } = require(`discord.js`);
const client = new Client({
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});
const status = require("minecraft-server-api");
require(`dotenv`).config();
var packagejson = require(`./package.json`);
const TOKEN = process.env.DISCORD_TOKEN;
const wait = require(`util`).promisify(setTimeout);
const usedCommandRecently1 = new Set();
//    絵文字↓
const yosi = `<:touka_yosi:916710636891824229>`;
const cron = require("node-cron");
const mcapi = require("minecraft-lookup");
const { MessageActionRow, MessageButton } = require(`discord.js`);

client.on(`ready`, () => {
	console.log(
		`Logged in as ${client.user.tag}!\nlocation: ${process.env.OS}\n----------------------`
	);
});
client.on(`messageCreate`, async (message) => {
	const { guild, content, channel } = message;
	if (guild === null) {
		return;
	}
	if (
		content.match(/入れな|はいれな|参加できな|さんかできな|入れん|はいれん/)
	) {
		const row = new MessageActionRow().addComponents(
			new MessageButton()
				.setCustomId("no-join-message-send")
				.setLabel("サーバーに参加できない場合")
				.setStyle("DANGER")
		);
		channel.send({
			content: `[<@${message.member.user.id}>さんが質問されました||<@669735475270909972>||]\n`,
			components: [row],
		});
	}
	if (content.match(/ヨシ|よし/)) {
		channel.send(yosi);
	}
});
client.on(`interactionCreate`, async (interaction) => {
	const { commandName, options, member, guild, user, client } = interaction;
	if (!interaction.isCommand()) {
		return;
	}
	if (guild === null) {
		interaction.reply(
			`この機能なかったらBot落ちてたんだぞ？？？\n対策はしたけどむやみに送信するのはやめてね？`
		);
		await wait(5000);
		return interaction.editReply(`DMは対応していません`);
	}
	if (commandName === `ping`) {
		const now = Date.now();
		const msg = [`GW: ${client.ws.ping}ms`];
		await interaction.reply({ content: msg.join(`\n`), ephemeral: true });
		await interaction.editReply(
			[
				...msg,
				`RTT: ${
					Date.now() - now
				}ms\n\n反応あり...<:touka_yosi:916710636891824229>`,
			].join(`\n`)
		);
		console.log(`${user.tag}がpingを使用しました`);
		return;
	}
	if (commandName === `leave`) {
		if (member.id !== `669735475270909972`) {
			interaction.reply({
				content: `あなたにはこのBotをKickする権限がありません`,
				ephemeral: true,
			});
			return console.log(`${member.user.tag}がleaveを使用しました`);
		} else {
			await interaction.reply(`サーバーからKickしました`);
			await guild.leave();
		}
	}
	if (commandName === `stop`) {
		if (user.id !== `669735475270909972`) {
			interaction.reply({
				content: `あなたにはこのBotを停止する権限がありません`,
				ephemeral: true,
			});
			return console.log(`${user.tag}がstopを使用しましたが失敗しました`);
		} else {
			await interaction.reply(`Botを停止しました`);
			await process.exit();
		}
	}
	if (commandName === `test`) {
		interaction.reply({
			content: `テスト`,
			ephemeral: true,
		});
	}
	if (commandName === `botinfo`) {
		const time = client.uptime;
		const sec = Math.floor(time / 1000) % 60;
		const min = Math.floor(time / 1000 / 60) % 60;
		const hours = Math.floor(time / 1000 / 60 / 60) % 24;
		const days = Math.floor(time / 1000 / 60 / 60 / 24);
		var d = new Date(client.readyTimestamp);
		const embed1 = new Discord.MessageEmbed()
			.setColor(`RANDOM`)
			.setTitle(`Botの詳細`)
			.setFields(
				{
					name: `Botの名前`,
					value: `\`${client.user.tag}\``,
					inline: true,
				},
				{
					name: `起動OS`,
					value: `\`${process.env.OS}\``,
					inline: true,
				},
				{
					name: `Botバージョン`,
					value: `\`${packagejson.version}\``,
					inline: true,
				},
				{
					name: `Node.js バージョン`,
					value: `\`${packagejson.engines[`node`]}\``,
					inline: true,
				},
				{
					name: `Discord.js バージョン`,
					value: `\`${packagejson.dependencies[`discord.js`]}\``,
					inline: true,
				},
				{
					name: `認識しているサーバー数`,
					value: `\`${client.guilds.cache.size}サーバー\``,
					inline: true,
				},
				{
					name: `認識しているメンバー数`,
					value: `\`${client.guilds.cache
						.map((guild) => guild.memberCount)
						.reduce((p, c) => p + c)}人\``,
					inline: true,
				},
				{
					name: `起動時間`,
					value: `\`${days}日${hours}時間${min}分${sec}秒\``,
					inline: true,
				},
				{
					name: `最終起動時刻`,
					value: `\`${d.toLocaleString()}\``,
					inline: true,
				}
			);
		console.log(`処理前`);
		interaction.reply({ embeds: [embed1], ephemeral: true });
		console.log(`${interaction.user.tag}がbotinfoを使用しました`);
		console.log(`処理後`);
	}
	if (interaction.commandName === `omikuzi`) {
		if (usedCommandRecently1.has(interaction.user.id)) {
			console.log(`クールダウン時間中`);
			interaction.reply({
				content: `おみくじは一日一回しか引けません`,
				ephemeral: true,
			});
		} else {
			usedCommandRecently1.add(interaction.user.id);
			setTimeout(() => {
				usedCommandRecently1.delete(interaction.user.id);
			}, 86400000);
			let omikuzi = [
				`大吉`,
				`中吉`,
				`小吉`,
				`凶`,
				`大大吉`,
				`中小吉`,
				`小中吉`,
			];
			let weight = [200, 500, 800, 1, 10, 700, 600];
			let totalWeight = 0;
			for (var i = 0; i < weight.length; i++) {
				totalWeight += weight[i];
			}
			let random = Math.floor(Math.random() * totalWeight);
			for (var i = 0; i < weight.length; i++) {
				if (random < weight[i]) {
					interaction.reply(omikuzi[i]);
					return;
				} else {
					random -= weight[i];
				}
			}
		}
	}
	if (interaction.commandName === `uuid`) {
		if (interaction.channel.id !== `904429990429491280`) {
			interaction.reply({
				content: `ここでは実行できません\n<#904429990429491280>で実行してください`,
				ephemeral: true,
			});
			return;
		} else {
			mcapi.user(interaction.options._hoistedOptions[0].value).then((data) => {
				const str = data.id;
				const a = str.substring(0, 8);
				const b = `-`;
				const c = str.substring(8, 12);
				const d = str.substring(12, 16);
				const e = str.substring(16, 20);
				const f = str.substring(20, 32);
				const id = a + b + c + b + d + b + e + b + f;
				interaction.reply({
					content: `${interaction.options._hoistedOptions[0].value}さんのUUIDです`,
				});
				interaction.followUp({
					content: id,
				});
			});
		}
	}
	if (interaction.commandName === `test1`) {
		interaction.reply({
			content: `テスト1`,
			ephemeral: true,
		});
	}
});
client.on(`interactionCreate`, async (interaction) => {
	if (interaction.customId === `test`) {
		await interaction.reply({
			content: `ボタンが押されました。`,
			ephemeral: true,
		});
	}
	client.on(`interactionCreate`, async (interaction) => {
		const { customId } = interaction;
		if (customId === `test`) {
			interaction.reply({
				content: `ボタンが押されました。`,
				ephemeral: true,
			});
		}
		if (customId === `no-join-message-send`) {
			const embed = new Discord.MessageEmbed()
				.setColor(`RANDOM`)
				.setTitle(`サーバーに参加できない方向け`)
				.setDescription(`確認事項一覧`)
				.setFields(
					{
						name: `ステップ1`,
						value: `<#779310447186411520>等にサーバーメンテナンス又はサーバー閉鎖中と書かれていないか？(ピン留めにある時もあります)`,
					},
					{
						name: `ステップ2`,
						value: `サーバーアドレスやポートがあっているか？`,
					},
					{
						name: `解決したら`,
						value: `質問のメッセージを消してください\n解決したかどうかはわかりません`,
					},
					{
						name: `解決しなかったら`,
						value: `先ほど送信したメッセージを削除してどんな状況かを詳しく書いてください\n詳しく書かないと返答できません`,
					},
					{
						name: `その他`,
						value: `以下の様な画像の場合は<@669735475270909972>にDMを送って対応をお待ちください`,
					}
				)
				.setImage(
					`https://media.discordapp.net/attachments/720388991127519264/912706067392253962/unknown.png`
				)
				.setTimestamp()
				.setFooter(`このメッセージはあなただけに表示されています`);
			await interaction.reply({
				const: `Q&A`,
				embeds: [embed],
				ephemeral: true,
			});
		}
	});
});

client.login(TOKEN);
