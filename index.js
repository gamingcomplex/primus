const Discord = require("discord.js"); const { Client, Attachment, MessageEmbed } = require("discord.js");
const bot = new Discord.Client();
const ms = require("ms");
const fs = require("fs");
const parsems = require("parse-ms")
const money = require("./money.json")
const cooldowns = require("./cooldowns.json")

const token = "NzE3NTMzNDQyOTQ1ODQzMzIx.XvpLxw.hmHLaGN6PIiGT_jK2qNqB0OOe4Y";

const PREFIX = "r!";

var version = "Official Release 1.2.0";

bot.on("ready", () => {
    bot.user.setActivity("r!help", { type: "PLAYING" })
    console.log("Bot has started!");
})
var blacklist = [];

bot.on("message", message => {
    if (blacklist.includes(message.author.id)) return;

    let args = message.content.substring(PREFIX.length).split(" ")

    if (!message.guild) return;
    let channel = message.channel;
    let person = message.guild.member(message.mentions.users.first() || message.guild.members.cache.get(args[1]))
    let roles = message.guild.roles;
    let lockRole = roles.cache.find(r => r.name === "Verified");
    let mainrole = message.guild.roles.cache.find(role => role.name === "Verified")
    let muterole = message.guild.roles.cache.find(role => role.name === "Muted")
    var warnNum = 0;
    const warn1 = message.guild.roles.cache.find(r => r.name === "Warning 1")
    const warn2 = message.guild.roles.cache.find(r => r.name === "Warning 2")
    const warn3 = message.guild.roles.cache.find(r => r.name === "Warning 3")
    const warn4 = message.guild.roles.cache.find(r => r.name === "Warning 4")
    const warn5 = message.guild.roles.cache.find(r => r.name === "Warning 5")
    let warnTarget = message.guild.member(message.mentions.users.first() || message.guild.members.cache.get(args[1]))
    var blacklistMessage = ("Are you **__ABSOLUTELY__** sure that you want to blacklist this user? This will mean that I will no longer respond to any of their commands.")
    const logChannel = bot.channels.cache.get("704448219618345001");

    switch (args[0]) {
        case "blacklist":
            if (!message.member.roles.cache.some(r => r.name === "Bot Developer")) return message.channel.reply("Don't even think about it.")

            if (!args[1]) return message.reply("Please specify which user you would like to blacklist.")

            if (person) {
                message.reply("Are you **__ABSOLUTELY__** sure that you want to blacklist this user? This will mean that I will no longer respond to any of their commands.")
                    .then(message => {
                        message.react("✅")
                        message.awaitReactions((reaction, user) => user.id === message.author.id && (reaction.emoji.name === "✅"),
                            { max: 1, time: 10000 }).then(collected => {
                                if (collected.first().emoji.name === "✅") {
                                    blacklist.push(person.id);
                                    message.channel.send("Successfully blacklisted `" + person.user.tag + "`. They will no longer be able to use commands.")
                                } else {
                                    message.reply("Operation canceled.")
                                }
                            }).catch(() => {
                                message.reply("No reaction in 10 seconds, operation canceled.")
                            });
                    })
            }
        case "ping":
            if (!message.member.roles.cache.some(r => r.name === "Moderators")) return message.channel.send("You need to have the `Moderators` role in order to use this command.")

            message.channel.send("pong!")
            break;
        case "help":
            const helpEmbed = new Discord.MessageEmbed()
                .setTitle("Commands")
                .addField("General", "`help`, `about`, `info`, `rules`")
                .addField("Moderation", "`clear`, `kick`, `ban`, `mute`, `unmute`, `lock`, `unlock`, `warn`, `deletewarn`")
                .addField("Lenny", "`lenny`, `tableflip`, `tableplace`, `cry`, `sunglasses`, `middlefinger`, `creepyshrug`, `wink`")
                .addField("Fun", "`8ball`")
                .addField("Currency", "`bal`, `daily`, `bet`")
                .setColor("#f93a2f")
                .setDescription("To view any of the rules, type r! and what the rule is about (e.g. to view Rule 1 you would type r!nsfw")
                .setFooter("The default prefix is: r!")

            message.author.send(helpEmbed);
            break;
        case "about":
            const aboutEmbed = new MessageEmbed()
                .setTitle("About")
                .addField("Version", version)
                .addField("Creator/Developer", "`The Gaming Complex#3879`")
                .addField("Beta Tester", "`SansMLGDunker#6909`")
                .addField("Special Thanks to", "`Milk#0628`, `Nekuskus(a♡)#6078`, `jemand2001#0666`")
                .setColor("#0099e1")
                .setThumbnail("https://cdn.discordapp.com/attachments/583074971916435478/720365830709313640/RanchoServerIcon.jpg")

            message.channel.send(aboutEmbed);
            break;
        case "info":
            if (!args[1]) {
                const embed = new Discord.MessageEmbed()
                    .setTitle("User Information")
                    .addField("User Name", message.author.username)
                    .addField("Account Creation Date", message.author.createdAt)
                    .addField("Server Join Date", message.member.joinedAt)
                    .setColor("#00d166")
                    .setThumbnail(message.author.displayAvatarURL())

                message.channel.send(embed);
            } else {
                let user = message.mentions.users.first();
                const userEmbed = new Discord.MessageEmbed()
                    .setTitle("User Information")
                    .addField("User Name", user.username)
                    .addField("Account Creation Date", user.createdAt)
                    .addField("Server Join Date", message.guild.member(message.mentions.users.first()).joinedAt)
                    .setColor("#00d166")
                    .setThumbnail(user.displayAvatarURL())
                message.channel.send(userEmbed);
            }
            break;

        case "rules":
            const rulesEmbed = new Discord.MessageEmbed()
                .setTitle("Rancho Middle School Server Rules")
                .addField("Rule 1", "No visual NSFW will be allowed. Light nsfw text and words are fine. Anything that is literal smut, or worse however, will not be allowed. Violation will result in a warning/mute/kick/ban depending on severity.")
                .addField("Rule 2", "Profanity is allowed, but please do not direct it towards others, and if someone dislikes hearing/seeing profanity, please respect their wishes and try to turn it down. Violation will result in a warning, then a mute if repeatedly violated.")
                .addField("Rule 2B", "Slurs(like the n word) will under no circumstances be tolerated. Violation will result in an immidiate mute, as well as a warning. Repeated violation will result in a kick or ban.")
                .addField("Rule 3", "Do not spam/spam ping, for the former, go to #spamming, for the latter, don't do it at all. If you are caught doing either of these in the incorrect channel, it's a warn (further continuous spam may result in more warns/mutes/kicks/bans).")
                .addField("Rule 3B", "Raiding, participating in, or starting a raid on this server will result in an instant ban. Non-negotiable.")
                .addField("Rule 4", "Use the channels for their intended purpose. If an administrative figure tells you to move to a channel, do so. Violation will result in a mere reminder, but repeated defiance of administrative reminder will result in a warning.")
                .addField("Rule 5", "Be reasonable with who you invite to this server. Only invite people that you really trust, or have connection to MUSD. If a person you invited causes trouble, there may be consequences depending upon the severity.")
                .addField("Rule 6", "Only choose the proper roles for yourself. Violation will result in a warning.")
                .addField("Rule 7", "Do not start arguments or drama in this server. If such things start anyways, take it to DMS. Violation will result in warnings, a mute, or even a kick if severe.")
                .addField("Warnings", "Right now, you may accumulate up to 5 warnings. If you reach 5 warnings, you will be muted. After your mute is over, it will revert back to 4 warnings. If you accumulate 3 mutes, you will be kicked. 5 mutes will result in a ban. According to severity of incidents, some of these stages may be skipped. Bans may be appealed, but are unlikely accepted. Depending on the reason behind them, warnings may expire after a period of time.")
                .addField("Administrative Rules", "Just because you are an administrative figure, doesn't mean you are above the rules. You are subject to the rules just like everyone elseDo not abuse your power in any way. This includes server sabotage, creating, editing, or deleting channels and roles without permission, removing warnings without approval, banning or kicking people for personal reasons, and other things that fall into this category. Violation will result in one black mark. For every administrative action you take, you must provide a detailed documentation(ex. screenshot on rule breaking.) Otherwise, the action may be challenged and invalidated. Three black marks will result in being instantly stripped of your position. Hopefully no one will ever reach that point. Depending on the reason behind a black mark, it may expire after a period of time. Depending also on severity, you may be instantly demoted, or given multiple marks for one incident.")
                .setColor("#f93a2f")

            message.author.send(rulesEmbed);
            break;
        case "nsfw":
            const nsfwEmbed = new Discord.MessageEmbed()
                .setTitle("Rancho Middle School Rules")
                .addField("Rule 1", "No visual NSFW will be allowed. Light nsfw text and words are fine. Anything that is literal smut, or worse however, will not be allowed. Violation will result in a warning/mute/kick/ban depending on severity.")
                .setColor("#f8c300")
                .setFooter("Type r!rules to have the full rules list dm'ed to you.")

            message.channel.send(nsfwEmbed);
            break;
        case "profanity":
            const profanityEmbed = new Discord.MessageEmbed()
                .setTitle("Rancho Middle School Rules")
                .addField("Rule 2", "Profanity is allowed, but please do not direct it towards others, and if someone dislikes hearing/seeing profanity, please respect their wishes and try to turn it down. Violation will result in a warning, then a mute if repeatedly violated.")
                .setColor("#f8c300")
                .setFooter("Type r!rules to have the full rules list dm'ed to you.")

            message.channel.send(profanityEmbed);
            break;
        case "slurs":
            const slursEmbed = new Discord.MessageEmbed()
                .setTitle("Rancho Middle School Rules")
                .addField("Rule 2B", "Slurs(like the n word) will under no circumstances be tolerated. Violation will result in an immidiate mute, as well as a warning. Repeated violation will result in a kick or ban.")
                .setColor("#f8c300")
                .setFooter("Type r!rules to have the full rules list dm'ed to you.")

            message.channel.send(slursEmbed);
            break;
        case "spam":
            const spamEmbed = new Discord.MessageEmbed()
                .setTitle("Rancho Middle School Rules")
                .addField("Rule 3", "Do not spam/spam ping, for the former, go to #spamming, for the latter, don't do it at all. If you are caught doing either of these in the incorrect channel, it's a warn (further continuous spam may result in more warns/mutes/kicks/bans).")
                .setColor("#f8c300")
                .setFooter("Type r!rules to have the full rules list dm'ed to you.")

            message.channel.send(spamEmbed);
            break;
        case "raiding":
            const raidingEmbed = new Discord.MessageEmbed()
                .setTitle("Rancho Middle School Rules")
                .addField("Rule 3B", "Raiding, participating in, or starting a raid on this server will result in an instant ban. Non-negotiable.")
                .setColor("#f8c300")
                .setFooter("Type r!rules to have the full rules list dm'ed to you.")

            message.channel.send(raidingEmbed);
            break;
        case "channels":
            const channelsEmbed = new Discord.MessageEmbed()
                .setTitle("Rancho Middle School Rules")
                .addField("Rule 4", "Use the channels for their intended purpose. If an administrative figure tells you to move to a channel, do so. Violation will result in a mere reminder, but repeated defiance of administrative reminder will result in a warning.")
                .setColor("#f8c300")
                .setFooter("Type r!rules to have the full rules list dm'ed to you.")

            message.channel.send(channelsEmbed);
            break;
        case "invites":
            const invitesEmbed = new Discord.MessageEmbed()
                .setTitle("Rancho Middle School Rules")
                .addField("Rule 5", "Be reasonable with who you invite to this server. Only invite people that you really trust, or have connection to MUSD. If a person you invited causes trouble, there may be consequences depending upon the severity.")
                .setColor("#f8c300")
                .setFooter("Type r!rules to have the full rules list dm'ed to you.")

            message.channel.send(invitesEmbed);
            break;
        case "roles":
            const rolesEmbed = new Discord.MessageEmbed()
                .setTitle("Rancho Middle School Rules")
                .addField("Rule 6", "Only choose the proper roles for yourself. Violation will result in a warning.")
                .setColor("#f8c300")
                .setFooter("Type r!rules to have the full rules list dm'ed to you.")

            message.channel.send(rolesEmbed);
            break;
        case "drama":
            const dramaEmbed = new Discord.MessageEmbed()
                .setTitle("Rancho Middle School Rules")
                .addField("Rule 7", "Do not start arguments or drama in this server. If such things start anyways, take it to DMS. Violation will result in warnings, a mute, or even a kick if severe.")
                .setColor("#f8c300")
                .setFooter("Type r!rules to have the full rules list dm'ed to you.")

            message.channel.send(dramaEmbed);
            break;
        case "warnings":
            const warningsEmbed = new Discord.MessageEmbed()
                .setTitle("Rancho Middle School Rules")
                .addField("Warnings", "Right now, you may accumulate up to 5 warnings. If you reach 5 warnings, you will be muted. After your mute is over, it will revert back to 4 warnings. If you accumulate 3 mutes, you will be kicked. 5 mutes will result in a ban. According to severity of incidents, some of these stages may be skipped. Bans may be appealed, but are unlikely accepted. Depending on the reason behind them, warnings may expire after a period of time.")
                .setColor("#f8c300")
                .setFooter("Type r!rules to have the full rules list dm'ed to you.")

            message.channel.send(warningsEmbed);
            break;
        case "adminrules":
            const adminRulesEmbed = new Discord.MessageEmbed()
                .setTitle("Rancho Middle School Rules")
                .addField("Administrative Rules", "Just because you are an administrative figure, doesn't mean you are above the rules. You are subject to the rules just like everyone elseDo not abuse your power in any way. This includes server sabotage, creating, editing, or deleting channels and roles without permission, removing warnings without approval, banning or kicking people for personal reasons, and other things that fall into this category. Violation will result in one black mark. For every administrative action you take, you must provide a detailed documentation(ex. screenshot on rule breaking.) Otherwise, the action may be challenged and invalidated. Three black marks will result in being instantly stripped of your position. Hopefully no one will ever reach that point. Depending on the reason behind a black mark, it may expire after a period of time. Depending also on severity, you may be instantly demoted, or given multiple marks for one incident.")
                .setColor("#f8c300")
                .setFooter("Type r!rules to have the full rules list dm'ed to you.")

            message.channel.send(adminRulesEmbed);
            break;

        case "clear":
            if (!message.member.roles.cache.some(r => r.name === "Moderators")) return message.channel.send("You need to have the `Moderators` role in order to use this command.")

            if (!args[1]) return message.reply("Please specify the amount of messages you want to delete.")
            message.channel.bulkDelete(args[1]);
            message.channel.send("Successfully cleared `" + (args[1]) + "` message(s)");
            break;
        case "kick":
            if (!message.member.roles.cache.some(r => r.name === "Moderators") && !message.member.roles.cache.some(r => r.name === "Bot Developer")) return message.channel.send("You need to have the `Moderators` role in order to use this command.")

            if (message.member.roles.cache.some(r => r.name === "Bot Developer")) return message.reply("don't even try. Just because you coded me doesn't mean you can abuse your power.")

            if (!args[1]) return message.reply("Please specify what user you would like to kick.")

            if (!args[2]) return message.reply("Please specify a reason for the kick.")

            if (person) {
                person.kick("You were kicked from`" + message.guild.name + "`.").then(() => {
                    const kickEmbed = new Discord.MessageEmbed()
                        .setTitle("Member Kicked")
                        .setDescription(`Successfully kicked \`${person.user.tag}\`.`)
                        .addField("Reason", args[2])
                        .addField("Moderator", message.author)
                        .setColor("#f0ad4e")
                    message.channel.send(kickEmbed);
                    logChannel.send(kickEmbed);
                }).catch(err => {
                    message.reply("Unable to kick member, might be because of permissions.")
                    message.channel.send(`\`\`\`${err}\`\`\``)
                    console.log(err);
                });

            } else {
                message.reply("This user is not kickable.")
            }
            break;
        case "ban":
            if (!message.member.roles.cache.some(r => r.name === "Moderators") && !message.member.roles.cache.some(r => r.name === "Bot Developer")) return message.channel.send("You need to have the `Moderators` role in order to use this command.")

            if (message.member.roles.cache.some(r => r.name === "Bot Developer")) return message.reply("don't even try. Just because you coded me doesn't mean you can abuse your power.")

            if (!args[1]) return message.reply("Please specify what user you would like to ban.")

            if (person) {
                person.ban({ reason: "You were banned from " + (message.guild.name + ".") }).then(() => {
                    const banEmbed = new Discord.MessageEmbed()
                        .setTitle("Member Banned")
                        .setDescription(`Successfully banned \`${person.user.tag}\`.`)
                        .addField("Reason", args[2])
                        .addField("Moderator", message.author)
                        .setColor("")
                    message.channel.send(banEmbed);
                    logChannel.send(banEmbed);
                }).catch(err => {
                    message.reply("Unable to ban member, might be because of permissions.")
                    message.channel.send(`\`\`\`${err}\`\`\``)
                    console.log(err);
                });
            } else {
                message.reply("That user isn't in this server.")
            }
            break;
        case "mute":
            if (!message.member.roles.cache.some(r => r.name === "Moderators")) return message.channel.send("You need to have the `Moderators` role in order to use this command.")

            if (!person) return message.reply("That user isn't in this server.")

            if (!muterole) return message.reply("I couldn't find a mute role.");

            let time = args[2];

            if (!time) {
                return message.reply("Please specify the amount of time you would like to mute the selected person for.");
            }

            person.roles.add(muterole.id);
            person.roles.add(mainrole.id);

            const muteEmbed = new Discord.MessageEmbed()
                .setTitle("Member Muted")
                .addField("Duration", ms(ms(time)))
                .addField("Moderator", message.author)
                .setDescription("Successfully muted`" + person.user.tag + "` for `" + ms(ms(time)) + "`.")
                .setColor("#45241c")

            message.channel.send(muteEmbed);
            logChannel.channel.send(muteEmbed);

            setTimeout(function () {
                person.roles.add(mainrole.id);
                person.roles.remove(muterole.id);

                const expireEmbed = new Discord.MessageEmbed()
                    .setTitle("Mute Duration Expired")
                    .addField("Duration", ms(ms(time)))
                    .setDescription("`" + person.user.tag + "` has been unmuted.")
                    .setColor("#008369")

                message.channel.send(expireEmbed);
                logChannel.channel.send(expireEmbed);
            }, ms(time));
            break;
        case "unmute":
            if (!message.member.roles.cache.some(r => r.name === "Moderators")) return message.channel.send("You need to have the `Moderators` role in order to use this command.")

            person = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[1]))
            if (!person) return message.reply("That user isn't in this server.")

            person.roles.remove(muterole.id);

            const unmuteEmbed = new Discord.MessageEmbed()
                .setTitle("Member Unmuted")
                .addField("Moderator", message.author)
                .setDescription("Successfully unmuted `" + person.user.tag + "`.")
                .setColor("#008369")

            message.channel.send(unmuteEmbed);
            logChannel.channel.send(unmuteEmbed);
            break;

        case "lock":
            if (!message.member.roles.cache.some(r => r.name === "Moderators")) return message.channel.send("You need to have the `Moderators` role in order to use this command.")

            if (!args[1]) {
                channel.updateOverwrite(
                    lockRole,
                    { SEND_MESSAGES: false }
                );
                channel.updateOverwrite(
                    "Moderators",
                    { SEND_MESSAGES: true }
                );

                message.channel.send("Successfully locked down `" + message.channel.name + "`.");
            } else {
                channel.updateOverwrite(
                    lockRole,
                    { SEND_MESSAGES: false }
                );
                channel.updateOverwrite(
                    "Moderators",
                    { SEND_MESSAGES: true }
                );

                const lockEmbed = new Discord.MessageEmbed()
                    .setTitle("Channel Lockdown")
                    .addField("Reason", args[1])
                    .addField("Moderator", message.author)
                    .setThumbnail("https://image.flaticon.com/icons/png/512/891/891399.png")
                    .setColor("#ffc107")
                    .setDescription("`" + message.channel.name + "` has been locked down.")
                    .setFooter("Don't use the other channels to talk because this one is locked down. The channel was locked down for a reason.")

                message.channel.send(lockEmbed);
                logChannel.channel.send(lockEmbed);
            }

            break;
        case "unlock":
            if (!message.member.roles.cache.some(r => r.name === "Moderators")) return message.channel.send("You need to have the `Moderators` role in order to use this command.")

            channel.permissionOverwrites.get(lockRole.id).delete();
            const unlockEmbed = new Discord.MessageEmbed()
                .setTitle("Channel Unlock")
                .addField("Moderator", message.author)
                .setThumbnail("https://cdn.discordapp.com/attachments/717823988986019956/723998060207669298/unknown.png")
                .setColor("#008e44")
                .setDescription("`" + message.channel.name + "` has been unlocked.")

            message.channel.send(unlockEmbed);
            logChannel.channel.send(unlockEmbed);
            break;
        case "warn":
            if (!args[1]) return message.reply("please specify the member you would like to warn.");

            if (!args[2]) return message.reply("please specify a reason for the warning.")

            if (warnTarget.roles.cache.some(r => r.name === "Warning 1") && !(warnTarget.roles.cache.some(r => r.name === "Warning 2")) && !(warnTarget.roles.cache.some(r => r.name === "Warning 3"))) {
                warnTarget.roles.add(warn2);
                warnNum = "2";
            } else {
                if (warnTarget.roles.cache.some(r => r.name === "Warning 2") && !(warnTarget.roles.cache.some(r => r.name === "Warning 3"))) {
                    warnTarget.roles.add(warn3);
                    warnNum = "3";
                } else {
                    if (warnTarget.roles.cache.some(r => r.name === "Warning 3") && !(warnTarget.roles.cache.some(r => r.name === "Warning 4"))) {
                        warnTarget.roles.add(warn4)
                        warnNum = "4";
                    } else {
                        if (warnTarget.roles.cache.some(r => r.name === "Warning 4") && !(warnTarget.roles.cache.some(r => r.name === "Warning 5"))) {
                            warnTarget.roles.add(warn5)
                            warnNum = "5";
                        } else {
                            warnTarget.roles.add(warn1);
                            warnNum = "1";
                        }
                    }
                }
            }
            const warnEmbed = new Discord.MessageEmbed()
                .setTitle("Member Warned")
                .setDescription("`" + warnTarget.user.tag + "` was warned.")
                .addField("Reason", args[2])
                .addField("Warning Number", warnNum)
                .addField("Moderator", message.author)
                .setColor("#d9534f")
            message.channel.send(warnEmbed);
            logChannel.send(warnEmbed);

            break;
        case "deletewarn":
            if (!message.member.roles.cache.some(r => r.name === "Moderators")) return message.channel.send("You need to have the `Moderators` role in order to use this command.")

            if (!args[1]) return message.reply("please specify the member you would like to delete a warn for.");

            if (warnTarget.roles.cache.some(r => r.name === "Warning 1") && !(warnTarget.roles.cache.some(r => r.name === "Warning 2")) && !(warnTarget.roles.cache.some(r => r.name === "Warning 3"))) {
                warnTarget.roles.remove(warn1);
                warnNum = "0";
            } else {
                if (warnTarget.roles.cache.some(r => r.name === "Warning 2") && !(warnTarget.roles.cache.some(r => r.name === "Warning 3"))) {
                    warnTarget.roles.remove(warn2);
                    warnNum = "1";
                } else {
                    if (warnTarget.roles.cache.some(r => r.name === "Warning 3") && !(warnTarget.roles.cache.some(r => r.name === "Warning 4"))) {
                        warnTarget.roles.remove(warn3);
                        warnNum = "2";
                    } else {
                        if (warnTarget.roles.cache.some(r => r.name === "Warning 4") && !(warnTarget.roles.cache.some(r => r.name === "Warning 5"))) {
                            warnTarget.roles.remove(warn4);
                            warnNum = "3";
                        } else {
                            if (warnTarget.roles.cache.some(r => r.name === "Warning 5")) {
                                warnTarget.roles.remove(warn5);
                                warnNum = "4";
                            } else {
                                message.channel.send("This user does not have any warnings.")
                            }
                        }
                    }
                }
            }
            const unwarnEmbed = new Discord.MessageEmbed()
                .setTitle("Member Unwarned")
                .setDescription("`" + warnTarget.user.tag + "` was unwarned.")
                .addField("Warning Number", warnNum)
                .addField("Moderator", message.author)
                .setColor("#5cb85c")
            message.channel.send(unwarnEmbed);
            logChannel.send(unwarnEmbed);

            break;
        case "8ball":
            var answers = [
                "Yes, ofc!",
                "Ofc not.",
                "Maybe 🤔",
                "wE'lL nEvEr KnOw... 👐",
                "Only if you say that Rancho Bot is best bot in <#598727852103565332>",
                "Ask again later 🕒",
                "What part of \"Ask again Later\" don't you understand??? 😒",
                "Only if my nickname is `Rancho Bot // r!`",
                "Not now, but maybe later.",
                "Yes, but only for the time being.",
                "ur mum gae LMAO roted!!!11!1!!!!funniiiiiiii!!!11!1!!!roasted-->rosted-->roted-->!!!11!!1!",
                "Always.",
                "Never!"
            ]

            if (!args[1]) return message.channel.send("Mate, I can't give an answer to nothing.");

            const ballEmbed = new Discord.MessageEmbed()
                .setTitle("Rancho Bot's Magic 8 Ball 🎱")
                .addField("Question",)
                .addField("Answer", (answers[Math.floor(Math.random() * answers.length)]))
                .addField("Asked by", message.author)
                .setColor("#603084")
                .setThumbnail("https://static.thenounproject.com/png/124586-200.png")
            message.channel.send(ballEmbed);
            logChannel.send(ballEmbed);
            break;
        case "bal":
            if (!args[1]) {
                var userr = message.author;
            } else {
                var userr = message.guild.member(message.mentions.users.first() || message.guild.members.cache.get(args[1]))
            }

            if (userr = null) {
                message.channel.send("bruh ur null")
            }

            userr = message.author;
            if (money[userr.id] == null) {
                money[userr.id] = {
                    money: 500
                }
                fs.writeFile("./money.json", JSON.stringify(money), (err) => {
                    if (err) message.channel.send(`\`\`\`${err}\`\`\``)
                });
                message.reply("you have successfully been initialized into the currency system and given `500` coins.")
            }

            const balEmbed = new Discord.MessageEmbed()
                .setTitle(`${userr}'s Balance`)
                .setDescription(`Wallet: \`${money[message.author.id].money}\`\nBank: bruh Oliver hasn't coded this yet`)
                .setColor("RANDOM")
            break;
        case "daily":
            let timeout = 86400000;
            let reward = 2000;

            let dailyEmbed = new Discord.MessageEmbed()
                .setTitle("Daily Coins")

            if (!money[message.author.id]) {
                money[message.author.id] = {
                    name: bot.users.cache.get(message.author.id).tag,
                    money: reward
                }
                fs.writeFile("./money.json", JSON.stringify(money), (err) => {
                    if (err) message.channel.send(`\`\`\`${err}\`\`\``);
                });

                if (!cooldowns[message.author.id]) {
                    cooldowns[message.author.id] = {
                        name: bot.users.cache.get(message.author.id).tag,
                        daily: Date.now()
                    }
                    fs.writeFile("./cooldowns.json", JSON.stringify(cooldowns), (err) => {
                        if (err) message.channel.send(`\`\`\`${err}\`\`\``);
                    });
                } else {
                    cooldowns[message.author.id].daily = Date.now();
                    fs.writeFile("./cooldowns.json", JSON.stringify(cooldowns), (err) => {
                        if (err) message.channel.send(`\`\`\`${err}\`\`\``);
                    });
                }

                return message.channel.send(dailyEmbed.setDescription(`You claimed your daily reward and recieved \`${reward}\` coins. You now have \`${money[message.author.id].money}\`.`)
                    .setColor("RANDOM")
                );
            } else {
                if (!cooldowns[message.author.id]) {
                    cooldowns[message.author.id] = {
                        name: bot.users.cache.get(message.author.id).tag,
                        daily: Date.now()
                    }
                    fs.writeFile("./cooldowns.json", JSON.stringify(cooldowns), (err) => {
                        if (err) message.channel.send(`\`\`\`${err}\`\`\``);
                    });

                    money[message.author.id].money += reward;
                    fs.writeFile("./cooldowns.json", JSON.stringify(cooldowns), (err) => {
                        if (err) message.channel.send(`\`\`\`${err}\`\`\``);
                    });
                    return message.channel.send(dailyEmbed.setDescription(`You claimed your daily reward and recieved \`${reward}\` coins. You now have \`${money[message.author.id].money}\`.`)
                        .setColor("RANDOM")
                    );
                } else {
                    if (timeout - (Date.now() - cooldowns[message.author.id].daily) > 0) {
                        let timee = parsems(timeout - (Date.now() - cooldowns[message.author.id].daily));

                        return message.channel.send(dailyEmbed
                            .setColor("RANDOM")
                            .setDescription("You already claimed your daily coins.")
                            .addField("Claim in", `\`${timee.hours}h ${timee.minutes}m ${timee.seconds}s\``)
                        );
                    } else {
                        money[message.author.id].money += reward;
                        fs.writeFile("./cooldowns.json", JSON.stringify(cooldowns), (err) => {
                            if (err) message.channel.send(`\`\`\`${err}\`\`\``);
                        });
                        cooldowns[message.author.id].daily = Date.now();
                        fs.writeFile("./cooldowns.json", JSON.stringify(cooldowns), (err) => {
                            if (err) message.channel.send(`\`\`\`${err}\`\`\``);
                        });
                        return message.channel.send(dailyEmbed.setDescription(`You claimed your daily reward and recieved \`${reward}\` coins. You now have \`${money[message.author.id].money}\`.`)
                            .setColor("RANDOM")
                        );
                    }
                }
            }
        case "bet":
            var maxBet = 100000;

            const betEmbed = new Discord.MessageEmbed()
                .setTitle("Rancho Bot's Gambling Table 🎲")

            if (!money[message.author.id] || money[message.author.id].money <= 0) return message.reply("dream on you don't have any money lmao!!1!11!1!!!11!");

            if (!args[1]) return message.reply("tell me what to bet smh.");

            if (args[1].toLowerCase() === "all") args[1] = money[message.author.id].money;

            try {
                var bet = parseFloat(args[1]);
            } catch {
                return message.reply("you can only bet numbers. Who skipped kindergarten math?");
            }

            if (bet != Math.floor(bet)) return message.reply("bet a whole number, not a decimal smh.");

            if (money[message.author.id].money < bet) return message.reply("you don't even have enough money to cover your bet LMAO POOR");

            if (bet > maxBet) return message.channel.send(`You can't bet more than \`${maxBet.toLocaleString()}\` coins.`)

            let betOutcomes = ["win", "lose"]
            var pick = betOutcomes[Math.floor(Math.random() * betOutcomes.length)];

            if (pick === "lose") {
                money[message.author.id].money -= bet;
                fs.writeFile("./money.json", JSON.stringify(money), (err) => {
                    if (err) message.channel.send(`\`\`\`${err}\`\`\``);
                });
                betEmbed.setDescription(`\`${message.author}\` lost \`${bet}\` coins.`)
                    .setFooter(`You now have \`${money[message.author.id].money}\` coins.`)
                    .setColor("#8b0000")
                return message.channel.send(betEmbed);
            } else {
                money[message.author.id].money += bet;
                fs.writeFile("./money.json", JSON.stringify(money), (err) => {
                    if (err) message.channel.send(`\`\`\`${err}\`\`\``);
                });
                betEmbed.setDescription(`\`${message.author}\` won \`${bet}\` coins.`)
                    .setFooter(`You now have \`${money[message.author.id].money}\` coins.`)
                    .setColor("#32cd32")
                return message.channel.send(betEmbed);
            }
        case "confiemra":
            if (!args[1]) {
                message.channel.send("smh choose someone to confiemra")
            } else {
                message.channel.send(`confiemra?@A?!AQ!?!lmao funni rosted!!1!!!!11!1!!!!!${person}is a nob at mc lmao funni!!1!!!!11!1!!!!!`)
            }
            break;
        case "lenny":
            message.channel.send("( ͡° ͜ʖ ͡°)")
            break;
        case "tableflip":
            message.channel.send("(╯°□°)╯︵ ┻━┻")
            break;
        case "tableplace":
            message.channel.send("┬──┬◡ﾉ(° -°ﾉ)")
            break;
        case "cry":
            message.channel.send("ಥʖ̯ಥ")
            break;
        case "sunglasses":
            message.channel.send("(▀̿Ĺ̯▀̿ ̿)")
            break;
        case "gun":
            message.member.roles.lowest
            message.channel.send("━╤デ╦︻(▀̿̿Ĺ̯̿̿▀̿ ̿)")
            break;
        case "middlefinger":
            message.channel.send("╭∩╮( ͡° ͜ʖ ͡°)╭∩╮")
            break;
        case "creepyshrug":
            message.channel.send("┐(͠≖ ͜ʖ͠≖)┌")
            break;
        case "wink":
            message.channel.send("° ͜ʖ ͡ – ✧")
            break;
        case "requestcmd":
            let reqer = message.author;

            if (!args[1]) return message.reply("Please enter your suggestion.")

            const reqEmbed = new Discord.MessageEmbed()
                .setTitle("Command Request Sent")
                .addField("Requestor", reqer)
                .addField("Request", args[1])
                .setColor("#f93a2f")
                .setFooter("Thanks for submitting your request!")

            message.channel.send(reqEmbed);
            message.channel.send("<@546208503841292288>, there's a suggestion waiting for you.")
            break;
        case "video":
            message.channel.send("<https://www.youtube.com/watch?v=dQw4w9WgXcQ>")
            break;
    }
    if (message.content.includes("no u")) {
        message.react("663955085729988639");
    }
    if (message.content.includes("norman")) {
        message.react("713121792281018468");
    }
    if (message.content.includes("kamran")) {
        message.react("🤮");
    }
})

bot.login(token);