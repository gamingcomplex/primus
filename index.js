const Discord = require("discord.js");
const { Client, Attachment, MessageEmbed } = require("discord.js");
const db = require("quick.db");
const bot = new Discord.Client();
const ms = require("ms");

const token = "NzE3NTMzNDQyOTQ1ODQzMzIx.XtbuCw.m_MebsUHnQYKaiFqE4U_Du23Xx4";

const PREFIX = "r!";

var version = "Official Release 1.1.1";

bot.on("ready", () => {
     bot.user.setActivity("r!help", { type: "PLAYING" })

    let allUsers = bot.users;
    for (let i = 0; i < allUsers.length; i++) {
        if (isNull(db.get(allUsers[i].id))) {
            db.set(allUsers[i].id, { money: 500, items: [] })
        }
    }

    console.log("Bot has started!");
})
var blacklist = [];

bot.on("message", message => {
    if (blacklist.includes(message.author.id)) return;

    let args = message.content.substring(PREFIX.length).split(" ")
    let channel = message.channel;
    if (!message.guild) return;
    let serverMember = message.guild.member(message.mentions.users.first())
    let roles = message.guild.roles;
    let lockRole = roles.cache.find(r => r.name === "Verified");
    let person = message.guild.member(message.mentions.users.first() || message.guild.members.cache.get(args[1]))
    let mainrole = message.guild.roles.cache.find(role => role.name === "Verified")
    let muterole = message.guild.roles.cache.find(role => role.name === "Muted")
    const warn1 = message.guild.roles.cache.find(r => r.name === "Warning 1")
    const warn2 = message.guild.roles.cache.find(r => r.name === "Warning 2")
    const warn3 = message.guild.roles.cache.find(r => r.name === "Warning 3")
    const warn4 = message.guild.roles.cache.find(r => r.name === "Warning 4")
    const warn5 = message.guild.roles.cache.find(r => r.name === "Warning 5")
    let warnTarget = message.guild.member(message.mentions.users.first() || message.guild.members.cache.get(args[1]))
    var blacklistMessage = ("Are you **__ABSOLUTELY__** sure that you want to blacklist this user? This will mean that I will no longer respond to any of their commands.")

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
                                    message.channel.send("Successfully blacklisted `" + person.id + "`. They will no longer be able to use commands.")
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
                .setColor("#f93a2f")
                .setDescription("To view any of the rules, type r! and what the rule is about (e.g. to view Rule 1 you would type r!nsfw")
                .setFooter("The default prefix is: r!")

            message.author.send(helpEmbed);
            break;
        case "about":
            const aboutEmbed = new MessageEmbed()
                .setTitle("About")
                .addField("Version", version)
                .addField("Creator/Developer", "The Gaming Complex#3879")
                .addField("Beta Tester", "SansMLGDunker#6909")
                .setColor("#0099e1")
                .setThumbnail("https://cdn.discordapp.com/icons/598726673885822977/8b1319e63d508b2a0dac7bc18ee97c12.webp?size=128")

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

            if (serverMember) {
                serverMember.kick("You were kicked from`" + message.guild.name + "`.").then(() => {
                    message.reply("Successfully kicked`" + serverMember.tag + "`.")
                }).catch(err => {
                    message.reply("Unable to kick member, might be because of permissions.")
                    message.channel.send("```" + err + "```")
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

            if (serverMember) {
                serverMember.ban({ reason: "You were banned from " + (message.guild.name + ".") }).then(() => {
                    message.reply("Successfully banned `" + serverMember.tag + "`.")
                }).catch(err => {
                    message.reply("Unable to ban member, might be because of permissions.")
                    message.channel.send("```" + err + "```")
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
                .setColor("#cc7900")

            message.channel.send(muteEmbed);

            setTimeout(function () {
                person.roles.add(mainrole.id);
                person.roles.remove(muterole.id);

                const expireEmbed = new Discord.MessageEmbed()
                    .setTitle("Mute Duration Expired")
                    .addField("Duration", ms(ms(time)))
                    .setDescription("`" + person.user.tag + "` has been unmuted.")
                    .setColor("#008369")

                message.channel.send(expireEmbed)
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

            message.channel.send(unmuteEmbed)
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
                    .setColor("#a62019")
                    .setDescription("`" + message.channel.name + "` has been locked down.")
                    .setFooter("Don't use the other channels to talk because this one is locked down. The channel was locked down for a reason.")

                message.channel.send(lockEmbed)
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

            message.channel.send(unlockEmbed)
            break;
        case "warn":
            if (warnTarget.roles.cache.some(r => r.name === "Warning 1") && !(warnTarget.roles.cache.some(r => r.name === "Warning 2")) && !(warnTarget.roles.cache.some(r => r.name === "Warning 3"))) {
                warnTarget.roles.add(warn2);
                message.channel.send("`" + warnTarget.user.tag + "` has been warned. This is warning number `2`.")
            } else {
                if (warnTarget.roles.cache.some(r => r.name === "Warning 2") && !(warnTarget.roles.cache.some(r => r.name === "Warning 3"))) {
                    warnTarget.roles.add(warn3);
                    message.channel.send("`" + warnTarget.user.tag + "` has been warned. This is warning number `3`.")
                } else {
                    if (warnTarget.roles.cache.some(r => r.name === "Warning 3") && !(warnTarget.roles.cache.some(r => r.name === "Warning 4"))) {
                        warnTarget.roles.add(warn4)
                        message.channel.send("`" + warnTarget.user.tag + "` has been warned. This is warning number `4`.")
                    } else {
                        if (warnTarget.roles.cache.some(r => r.name === "Warning 4") && !(warnTarget.roles.cache.some(r => r.name === "Warning 5"))) {
                            warnTarget.roles.add(warn4)
                            message.channel.send("`" + warnTarget.user.tag + "` has been warned. This is warning number `5`.")
                        } else {
                            warnTarget.roles.add(warn1);
                            message.channel.send("`" + warnTarget.user.tag + "` has been warned. This is warning number `1`.")
                        }
                    }
                }
            }
            break;
        case "deletewarn":
            if (warnTarget.roles.cache.some(r => r.name === "Warning 1") && !(warnTarget.roles.cache.some(r => r.name === "Warning 2")) && !(warnTarget.roles.cache.some(r => r.name === "Warning 3"))) {
                warnTarget.roles.remove(warn1);
                message.channel.send("Deleted one warning for `" + warnTarget.user.tag + "`. They now have `0` warnings.")
            } else {
                if (warnTarget.roles.cache.some(r => r.name === "Warning 2") && !(warnTarget.roles.cache.some(r => r.name === "Warning 3"))) {
                    warnTarget.roles.remove(warn2);
                    message.channel.send("Deleted one warning for `" + warnTarget.user.tag + "`. They now have `1` warning.")
                } else {
                    if (warnTarget.roles.cache.some(r => r.name === "Warning 3") && !(warnTarget.roles.cache.some(r => r.name === "Warning 4"))) {
                        message.channel.send("Deleted one warning for `" + warnTarget.user.tag + "`. They now have `2` warnings.")
                        warnTarget.roles.remove(warn3);
                    } else {
                        if (warnTarget.roles.cache.some(r => r.name === "Warning 4") && !(warnTarget.roles.cache.some(r => r.name === "Warning 5"))) {
                            message.channel.send("Deleted one warning for `" + warnTarget.user.tag + "`. They now have `3` warnings.")
                            warnTarget.roles.remove(warn4);
                        } else {
                            if (warnTarget.roles.cache.some(r => r.name === "Warning 5")) {
                                message.channel.send("Deleted one warning for `" + warnTarget.user.tag + "`. They now have `4` warnings.")
                                warnTarget.roles.remove(warn5);
                            } else {
                                message.channel.send("This user does not have any warnings.")
                            }
                        }
                    }
                }
            }
            break;
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
    if (message.content.includes("lmao")) {
        message.react("😂");
    }
    if (message.content.includes("norman")) {
        message.react("713121792281018468");
    }
    if (message.content.includes("kamran")) {
        message.react("🤮");
    }
    if (message.content.includes("oliver")) {
        message.react("🇴")
            .then(() => message.react("🇱"))
            .then(() => message.react("🇮"))
            .then(() => message.react("🇨"))
            .then(() => message.react("🇪"))
            .then(() => message.react("🇷"))
    }
    if (message.content.includes("neal")) {
        message.react("663950022601211926")
            .then(() => message.react("🇲"))
            .then(() => message.react("🇪"))
            .then(() => message.react("🇦"))
            .then(() => message.react("🇱"))
    }
})

bot.login(token);