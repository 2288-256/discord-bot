const Discord = require(`discord.js`);
const { Client, Intents } = require(`discord.js`);
const client = new Client({
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});
const status = require("minecraft-server-api");
require(`dotenv`).config();
var packagejson = require(`./package.json`);
var config = require(`./config.json`);
const TOKEN = process.env.DISCORD_TOKEN;
const wait = require(`util`).promisify(setTimeout);
const usedCommandRecently1 = new Set();
//    絵文字↓
const yosi = `<:touka_yosi:916710636891824229>`;
const cron = require("node-cron");
const mcapi = require("minecraft-lookup");
const { MessageActionRow, MessageButton } = require(`discord.js`);
var fs = require("fs");
var path = require("path");
var maintenance = config.maintenance;

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
			var d = new Date(client.readyTimestamp);
			let message = [
				`稼働時間:${days}日${hours}時間${min}分${sec}秒`,
				`Ping:${client.ws.ping}ms`,
				`Version:${packagejson.version}`,
				`${client.guilds.cache
					.map((guild) => guild.memberCount)
					.reduce((p, c) => p + c)}人を監視中`,
				`${client.guilds.cache.size}サーバーを監視中`,
				`最終起動日:${d.toLocaleString()}`,
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
		interaction.reply({ embeds: [embed1], ephemeral: true });
		console.log(`${interaction.user.tag}がbotinfoを使用しました`);
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
	if (interaction.commandName === `slot`) {
		const row = new MessageActionRow().addComponents(
			new MessageButton()
				.setCustomId("slot")
				.setLabel("回す(β版)")
				.setStyle("DANGER")
		);
		interaction.reply({
			content: `スロット`,
			components: [row],
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
			content: `Q&A`,
			embeds: [embed],
			ephemeral: true,
		});
	}
	if (customId === `slot`) {
		let slot = [
			`〇〇〇`,
			`〇〇×`,
			`〇〇△`,
			`〇×〇`,
			`〇××`,
			`〇×△`,
			`〇△〇`,
			`〇△×`,
			`〇△△`,
			`×〇〇`,
			`×〇×`,
			`×〇△`,
			`××〇`,
			`×××`,
			`××△`,
			`×△〇`,
			`×△×`,
			`×△△`,
			`△〇〇`,
			`△〇×`,
			`△〇△`,
			`△×〇`,
			`△××`,
			`△×△`,
			`△△〇`,
			`△△×`,
			`△△△`,
		];
		let weight = [
			1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
			1, 1,
		];
		let totalWeight = 0;
		for (var i = 0; i < weight.length; i++) {
			totalWeight += weight[i];
		}
		let random = Math.floor(Math.random() * totalWeight);
		for (var i = 0; i < weight.length; i++) {
			if (random < weight[i]) {
				if (slot[i] !== /〇〇〇|×××|△△△/) {
					const str = slot[i];
					const a1 = str.substring(0, 1);
					const b1 = str.substring(1, 2);
					const c1 = str.substring(2, 3);
					const a2 = a1.replace("△", ":mahjong:");
					const a3 = a2.replace("×", ":black_joker:");
					const a = a3.replace("〇", ":flower_playing_cards:");
					const b2 = b1.replace("△", ":mahjong:");
					const b3 = b2.replace("×", ":black_joker:");
					const b = b3.replace("〇", ":flower_playing_cards:");
					const c2 = c1.replace("△", ":mahjong:");
					const c3 = c2.replace("×", ":black_joker:");
					const c = c3.replace("〇", ":flower_playing_cards:");
					await interaction.reply({ content: a, ephemeral: true });
					await wait(2000);
					await interaction.editReply({ content: a + b, ephemeral: true });
					await wait(2000);
					await interaction.editReply({ content: a + b + c, ephemeral: true });
					await wait(2000);
					await interaction.editReply({
						content: a + b + c + "\nハズレ",
						ephemeral: true,
					});
					return;
				} else {
					const str = slot[i];
					const a = str.substring(0, 1);
					const b = str.substring(1, 2);
					const c = str.substring(2, 3);
					await interaction.reply({ content: a, ephemeral: true });
					await wait(2000);
					await interaction.editReply({ content: a + b, ephemeral: true });
					await wait(2000);
					await interaction.editReply({ content: a + b + c, ephemeral: true });
					await wait(2000);
					await interaction.editReply({
						content: a + b + c + "\n🎯当たり🎯",
						ephemeral: true,
					});
				}
			} else {
				random -= weight[i];
			}
		}
	}
});

client.login(TOKEN);
