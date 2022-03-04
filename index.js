const Discord = require(`discord.js`);
const { Client, Intents } = require(`discord.js`);
const client = new Client({
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});
require(`dotenv`).config();
var packagejson = require(`./package.json`);
var config = require(`./config.json`);
var https = require("https");
const TOKEN = process.env.DISCORD_TOKEN;
const wait = require(`util`).promisify(setTimeout);
//    絵文字↓
const yosi = `<:touka_yosi:916710636891824229>`;
const load = `<a:load:945990887203287040>`;
const mcapi = require("minecraft-lookup");
var fs = require("fs");
var path = require("path");
var maintenance = config.maintenance;
require("date-utils");
var dt = new Date();
var d = dt.toFormat("YYYY/MM/DD HH24時MI分SS秒");

client.on(`ready`, () => {
	if (config.maintenance === false) {
		client.user.setActivity({
			name: `再起動しました`,
		});
		setInterval(() => {
			const time = client.uptime;
			const sec = Math.floor(time / 1000) % 60;
			const min = Math.floor(time / 1000 / 60) % 60;
			const hours = Math.floor(time / 1000 / 60 / 60) % 24;
			const days = Math.floor(time / 1000 / 60 / 60 / 24);
			let message = [
				`稼働時間: ${days}日${hours}時間${min}分${sec}秒`,
				`Ping: ${client.ws.ping}ms`,
				`Version: ${packagejson.version}`,
				`${client.guilds.cache
					.map((guild) => guild.memberCount)
					.reduce((p, c) => p + c)}人を監視中`,
				`${client.guilds.cache.size}サーバーを監視中`,
				`最終起動日: ${d}`,
				`コマンドは全てSlashCommandです`,
			];
			let weight = [3, 2, 1, 2, 2, 3, 1];
			let totalWeight = 0;
			for (var i = 0; i < weight.length; i++) {
				totalWeight += weight[i];
			}
			let random = Math.floor(Math.random() * totalWeight);
			for (var i = 0; i < weight.length; i++) {
				if (random < weight[i]) {
					client.user.setActivity({
						name: `${message[i]}`,
					});
					return;
				} else {
					random -= weight[i];
				}
			}
		}, 15000);
		console.log(
			`Logged in as ${client.user.tag}!\nlocation: ${process.env.OS}\n----------------------`
		);
	}
	if (config.maintenance === true) {
		client.user.setActivity({
			name: `メンテナンス中です`,
		});
		console.log(`メンテナンスモードで起動中`);
	}
});
client.on(`messageCreate`, async (message) => {
	const { guild, content, channel } = message;
	if (guild === null) {
		return;
	}
	if (content.match(/ヨシ|よし|ﾖｼ|yosi|yoshi/)) {
		message.react("916710636891824229");
	}
	if (content.match(/うどん|饂飩|udon|ウドン|ｳﾄﾞﾝ/)) {
		message.react("919560243460055060");
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
	if (member.id !== `669735475270909972`) {
		if (maintenance === true) {
			return interaction.reply({
				content: `メンテナンスモードの為実行できません`,
				ephemeral: true,
			});
		}
	}
	if (commandName === `omikuzi`) {
		interaction.reply({
			content: `このコマンドは廃止されました`,
			ephemeral: true,
		});
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
	if (commandName === `restart`) {
		if (user.id !== `669735475270909972`) {
			interaction.reply({
				content: `あなたにはこのBotを再起動する権限がありません`,
				ephemeral: true,
			});
			return console.log(`${user.tag}がrestartを使用しましたが失敗しました`);
		} else {
			await interaction.reply(`Botを再起動しました`);
			client.user.setActivity({
				name: `再起動中・・・`,
			});
			await process.exit();
		}
	}
	if (commandName === `test`) {
		interaction.reply(`test`);
	}
	if (commandName === `botinfo`) {
		const time = client.uptime;
		const sec = Math.floor(time / 1000) % 60;
		const min = Math.floor(time / 1000 / 60) % 60;
		const hours = Math.floor(time / 1000 / 60 / 60) % 24;
		const days = Math.floor(time / 1000 / 60 / 60 / 24);
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
					value: `\`${d}\``,
					inline: true,
				}
			);
		interaction.reply({ embeds: [embed1], ephemeral: true });
		console.log(`${interaction.user.tag}がbotinfoを使用しました`);
	}
	if (interaction.commandName === `mcid`) {
		if (interaction.channel.id !== `904429990429491280`) {
			interaction.reply({
				content: `ここでは実行できません\n<#904429990429491280>で実行してください`,
				ephemeral: true,
			});
			return;
		} else {
			const check = interaction.options._hoistedOptions[0].value;
			if (/[a-zA-Z_0-9]/.test(check) === false) {
				interaction.reply({
					content: `英数字+アンダーバーを使用してください`,
				});
				return;
			}
			mcapi.user(interaction.options._hoistedOptions[0].value).then((data) => {
				if (data === undefined) {
					interaction.reply({
						content: `MCIDが存在しません`,
						ephemeral: true,
					});
				}
				const str = data.id;
				const a = str.substring(0, 8);
				const b = `-`;
				const c = str.substring(8, 12);
				const d = str.substring(12, 16);
				const e = str.substring(16, 20);
				const f = str.substring(20, 32);
				const id = a + b + c + b + d + b + e + b + f;
				interaction.reply({
					content: `${interaction.options._hoistedOptions[0].value}さんのUUIDです\n${id}`,
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
	if (interaction.commandName === `maintenance`) {
		if (user.id !== `669735475270909972`) {
			return interaction.reply({
				content: `実行する権限がありません`,
				ephemeral: true,
			});
		} else {
			var config = JSON.parse(
				fs.readFileSync(path.resolve(__dirname, "./config.json"))
			);
			if (maintenance === true) {
				interaction.reply({
					content: `メンテナンスモードをoffにしました。`,
				});
				config.maintenance = false;
				fs.writeFileSync(
					path.resolve(__dirname, "./config.json"),
					JSON.stringify(config, null, "  "),
					"utf-8"
				);
				client.user.setActivity({
					name: `再起動中・・・`,
				});
				await wait(5000);
				await process.exit();
			} else {
				interaction.reply({
					content: `メンテナンスモードをonにしました。`,
				});
				config.maintenance = true;
				fs.writeFileSync(
					path.resolve(__dirname, "./config.json"),
					JSON.stringify(config, null, "  "),
					"utf-8"
				);
				client.user.setActivity({
					name: `再起動中・・・`,
				});
				await wait(5000);
				await process.exit();
			}
		}
	}
	if (interaction.commandName === `serverlist`) {
		/*
		var url = "https://api.zpw.jp/serverlist/index.php";
		var data = [];
		var list = [];
		https.get(url, function (res) {
			res
				.on("data", function (chunk) {
					data.push(chunk);
				})
				.on("end", function () {
					var events = Buffer.concat(data);
					var r = JSON.parse(events);

					//console.log(r);

					//for (var i = 0; i < r.length; i++) {
					var servername = r.servername;
					var serverexp = r.serverexp;
					list += { name: r.no };
					list += {
						name: `サーバー名`,
						value: `\`${servername}\``,
						inline: true,
					};
					list += {
						name: `サーバー説明`,
						value: `\`${serverexp}\``,
						inline: true,
					};
					//}
					console.log(list);

					const embed1 = new Discord.MessageEmbed()
						.setColor("RANDOM")
						.setTitle(`サーバーリスト`)
						.setFields(list);

					interaction.reply({
						embeds: [embed1],
						ephemeral: true,
					});
				});
		});
		*/
		interaction.reply({
			content: `現在製作中です`,
			ephemeral: true,
		});
	}
	if (interaction.commandName === `serverinfo`) {
		if (interaction.channel.id !== `904429990429491280`) {
			interaction.reply({
				content: `ここでは実行できません\n<#904429990429491280>で実行してください`,
				ephemeral: true,
			});
			return;
		} else {
			const check = interaction.options._hoistedOptions[0].value;
			if (/[a-zA-Z_0-9]/.test(check) === false) {
				interaction.reply({
					content: `英数字+アンダーバーを使用してください`,
				});
				return;
			}
			mcapi.user(interaction.options._hoistedOptions[0].value).then((data) => {
				if (data === undefined) {
					interaction.reply({
						content: `\`${interaction.options._hoistedOptions[0].value}\`のユーザー名は存在しません\n(BEのユーザには対応していません)`,
					});
					return;
				}
				interaction.reply({ content: `${load}サーバー情報取得中${load}` });
				const str = data.id;
				const a = str.substring(0, 8);
				const b = `-`;
				const c = str.substring(8, 12);
				const d = str.substring(12, 16);
				const e = str.substring(16, 20);
				const f = str.substring(20, 32);
				const id = a + b + c + b + d + b + e + b + f;
				const url = "https://api.zpw.jp/?id=" + id; // + id;
				var data = [];
				https.get(url, function (res) {
					res
						.on("data", function (chunk) {
							data.push(chunk);
						})
						.on("end", function () {
							var events = Buffer.concat(data);
							var r = JSON.parse(events);
							if (JSON.parse(events) === `取得できませんでした`) {
								interaction.deleteReply();
								client.channels.cache
									.get(interaction.channelId)
									.send("以下の理由で表示できませんでした・Bot側のエラー");
								return;
							}
							if (res.statusCode !== 200) {
								interaction.deleteReply();
								client.channels.cache
									.get(interaction.channelId)
									.send(
										"以下の理由で表示できませんでした\n・APIサーバーがダウンしている\n・Bot側のエラー"
									);
								return;
							}
							var r = JSON.parse(events);
							if (r.maxplayer === null) {
								interaction.deleteReply();
								client.channels.cache
									.get(interaction.channelId)
									.send(
										`\`${interaction.options._hoistedOptions[0].value}\`のユーザー情報を以下の理由で表示できませんでした\n・このプレイヤーがサーバーにまだ参加していない\n・サーバーをまだ作成していない`
									);
								return;
							}
							var icon;
							var Color;
							if (r.online === "online") {
								var Color = "0x00FF00";
								var icon = ":green_circle:";
							} else {
								var Color = "0xFF0000";
								var icon = ":red_circle:";
							}
							const embed1 = new Discord.MessageEmbed()
								.setColor(Color)
								.setTitle(`${icon} ${r.servername}サーバーの情報`)
								.setFields(
									{
										name: `サーバー名`,
										value: `\`${r.servername}\``,
										inline: true,
									},
									{
										name: `サーバー説明`,
										value: `\`${r.serverexp}\``,
										inline: true,
									},
									{
										name: `サーバー管理者`,
										value: `\`${interaction.options._hoistedOptions[0].value}\``,
										inline: true,
									},
									{
										name: `人数`,
										value: `\`${r.onlineplayer}/${r.maxplayer}\``,
										inline: true,
									},
									{
										name: `サーバーソフト`,
										value: `\`${r.servertype}\``,
										inline: true,
									},
									{
										name: `バージョン`,
										value: `\`${r.version}\``,
										inline: true,
									},
									{
										name: `IP`,
										value: `\`${r.serverip}\``,
										inline: true,
									},
									{
										name: `投票数`,
										value: `\`${r.votes}\``,
										inline: true,
									},
									{
										name: `サーバー状態`,
										value: `\`${r.online}\``,
										inline: true,
									}
								);
							interaction.deleteReply();
							client.channels.cache
								.get(interaction.channelId)
								.send(
									`${interaction.user.username}#${interaction.user.discriminator}さんが実行しました\n`
								);
							client.channels.cache
								.get(interaction.channelId)
								.send({ embeds: [embed1] });
						});
				});
			});
		}
	}
	if (interaction.commandName === "send") {
		if (member.id !== `669735475270909972`) {
			return interaction.reply({
				content: `このコマンドは許可されていません`,
				ephemeral: true,
			});
		}
		var message1 = interaction.options._hoistedOptions[1].value;
		if (interaction.options._hoistedOptions[2] !== undefined) {
			var message2 = interaction.options._hoistedOptions[2].value;
			if (interaction.options._hoistedOptions[3] !== undefined) {
				var message3 = interaction.options._hoistedOptions[3].value;
				if (interaction.options._hoistedOptions[4] !== undefined) {
					var message4 = interaction.options._hoistedOptions[4].value;
				}
			}
		}
		if (interaction.options._hoistedOptions[2] === undefined) {
			client.channels.cache
				.get(interaction.options._hoistedOptions[0].value)
				.send(`${message1}`);
			return interaction.reply({
				content: `<#${interaction.options._hoistedOptions[0].value}>に\n「\`${message1}\`」\nを送信しました`,
				ephemeral: true,
			});
		}
		if (interaction.options._hoistedOptions[3] === undefined) {
			client.channels.cache
				.get(interaction.options._hoistedOptions[0].value)
				.send(`${message1}\n${message2}`);
			return interaction.reply({
				content: `<#${interaction.options._hoistedOptions[0].value}>にメッセージを送信しました`,
				ephemeral: true,
			});
		}
		if (interaction.options._hoistedOptions[4] === undefined) {
			client.channels.cache
				.get(interaction.options._hoistedOptions[0].value)
				.send(`${message1}\n${message2}\n${message3}`);
			return interaction.reply({
				content: `<#${interaction.options._hoistedOptions[0].value}>にメッセージを送信しました`,
				ephemeral: true,
			});
		}
		if (interaction.options._hoistedOptions[4] !== undefined) {
			client.channels.cache
				.get(interaction.options._hoistedOptions[0].value)
				.send(`${message1}\n${message2}\n${message3}\n${message4}`);
			return interaction.reply({
				content: `<#${interaction.options._hoistedOptions[0].value}>にメッセージを送信しました`,
				ephemeral: true,
			});
		}
	}
	if (commandName === `invite`) {
		interaction.reply({
			content: `このBotの招待リンクは↓です\n\`\`\`https://discord.com/api/oauth2/authorize?client_id=915609498285142027&permissions=1099511884864&scope=bot%20applications.commands\`\`\`\n現在は一部の人のみ招待可能です`,
			ephemeral: true,
		});
	}
});
client.on(`interactionCreate`, async (interaction) => {
	const { customId } = interaction;
	if (customId === `test`) {
		interaction.reply({
			content: `ボタンが押されました。`,
			ephemeral: true,
		});
	}
});

client.login(TOKEN);
