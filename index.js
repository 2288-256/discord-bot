const Discord = require("discord.js");
const { Client, Intents } = require("discord.js");
const { MessageActionRow, MessageButton } = require("discord.js");
const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});
require("dotenv").config();
var packagejson = require("./package.json");
const TOKEN = process.env.DISCORD_TOKEN;

const usedCommandRecently = new Set();

client.on("ready", () => {
  console.log(
    `Logged in as ${client.user.tag}!\nlocation: ` +
      process.env.OS +
      `\n----------------------`
  );
});

client.on("messageCreate", async (message) => {
  if (message.guild === null) {
    return;
  }
  if (
    message.content.match(
      /入れな|はいれな|参加できな|さんかできな|入れん|はいれん/
    )
  ) {
    if (usedCommandRecently.has(message.guild.id)) {
      console.log("クールダウン時間中");
    } else {
      usedCommandRecently.add(message.guild.id);
      setTimeout(() => {
        usedCommandRecently.delete(message.guild.id);
      }, 3600000);
      const wait = require("util").promisify(setTimeout);
      const embed = new Discord.MessageEmbed()
        .setColor("RANDOM")
        .setTitle("サーバーに参加できない方向け")
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
        .setTimestamp()
        .setFooter("誤動作の場合はリアクションを押してください");
      /* ボタンでメッセージを削除しようとしていた時の残骸
				const row = new MessageActionRow().addComponents(
				new MessageButton()
					.setCustomId("message-delete")
					.setLabel("誤動作の場合は押してください")
					.setStyle("DANGER")
			);
			*/
      const sent = await message.channel.send({
        content: "[これは自動送信メッセージです]",
        embeds: [embed],
      });
      const reaction = await sent.react("❌");
      const filter = (reaction, user) =>
        reaction.emoji.name === "❌" && !user.bot;
      sent
        .awaitReactions({ filter, max: 1, time: 5000, errors: ["time"] })
        .catch(() => sent.delete());
    }
  }
});
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) {
    return;
  }
  if (interaction.commandName === "ping") {
    const now = Date.now();
    const msg = [`GW: ${interaction.client.ws.ping}ms`];
    const wait = require("util").promisify(setTimeout);
    await interaction.reply({ content: msg.join("\n"), ephemeral: true });
    await interaction.editReply(
      [...msg, `RTT: ${Date.now() - now}ms`].join("\n")
    );
    console.log(interaction.user.tag + "がpingを使用しました");
    return;
  }
  if (interaction.commandName === "leave") {
    if (interaction.guild === null) {
      const wait = require("util").promisify(setTimeout);
      interaction.reply(
        "この機能なかったらBot落ちてたんだぞ？？？\n対策はしたけどむやみに送信するのはやめてね？"
      );
      await wait(5000);
      interaction.editReply("DMは対応していません");
    } else {
      if (interaction.member.id !== "669735475270909972") {
        interaction.reply({
          content: "あなたにはこのBotをKickする権限がありません",
          ephemeral: true,
        });
        return console.log(
          interaction.member.user.tag + "がleaveを使用しました"
        );
      } else {
        await interaction.reply("サーバーからKickしました");
        await interaction.guild.leave();
      }
    }
  }
  if (interaction.commandName === "stop") {
    if (interaction.user.id !== "669735475270909972") {
      interaction.reply({
        content: "あなたにはこのBotを停止するする権限がありません",
        ephemeral: true,
      });
      return console.log(interaction.user.tag + "がstopを使用しました");
    } else {
      await interaction.reply("Botを停止しました");
      await process.exit();
    }
  }
  if (interaction.commandName === "test") {
    const row = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId("test")
        .setLabel("テスト")
        .setStyle("SUCCESS")
    );
    await interaction.reply({
      content: "test",
      components: [row],
      ephemeral: true,
    });
  }
  if (interaction.commandName === "botinfo") {
    const guildsize = client.guilds.cache.size;
    const time = client.uptime;
    const sec = Math.floor(time / 1000) % 60;
    const min = Math.floor(time / 1000 / 60) % 60;
    const hours = Math.floor(time / 1000 / 60 / 60) % 24;
    const days = Math.floor(time / 1000 / 60 / 60 / 24);
    var d = new Date(client.readyTimestamp);
    const embed1 = new Discord.MessageEmbed()
      .setColor("RANDOM")
      .setTitle("Botの詳細")
      .setFields(
        {
          name: "Botの名前",
          value: client.user.tag,
          inline: true,
        },
        {
          name: "起動OS",
          value: process.env.OS,
          inline: true,
        },
        {
          name: "Node.js バージョン",
          value: process.env.node_version,
          inline: true,
        },
        {
          name: "Discord.js バージョン",
          value: "`" + packagejson.dependencies["discord.js"] + "`",
          inline: true,
        },
        {
          name: "認識しているサーバー数",
          value: "`" + client.guilds.cache.size + "サーバー`",
          inline: true,
        },
        {
          name: "認識しているメンバー数",
          value:
            "`" +
            client.guilds.cache
              .map((guild) => guild.memberCount)
              .reduce((p, c) => p + c) +
            "人`",
          inline: true,
        },
        {
          name: "起動時間",
          value: days + "日" + hours + "時間" + min + "分" + sec + "秒",
          inline: true,
        },
        {
          name: "最終起動時刻",
          value: "`" + d.toLocaleString() + "`",
          inline: true,
        }
      );
    interaction.reply({ embeds: [embed1], ephemeral: true });
    return console.log(interaction.user.tag + "がbotinfoを使用しました");
  }
});
client.on("interactionCreate", async (interaction) => {
  if (interaction.customId === "test") {
    await interaction.reply({
      content: "ボタンが押されました。",
      ephemeral: true,
    });
  }
});
client.login(TOKEN);
