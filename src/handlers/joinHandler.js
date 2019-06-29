const Discord = require('discord.js');
const {client} = require('../wumpi.js');
const botUsers = require('../lib/botUsers');
const emojiCharacters = require('../lib/emojiCharacters');

client.on('guildMemberAdd', member => {
    if (member.avatarURL === member.defaultAvatarURL) {
        captcha(member);
    }
    let a = member.username.toString();
    if (a.includes('1') || a.includes('2') || a.includes('3') || a.includes('4') || a.includes('5') || a.includes('6') || a.includes('7') || a.includes('8') || a.includes('9') || a.includes('0')) {
        captcha(member);
    }
    let d = new Date();
    d.setDate(d.getDate() - 90);
    if (member.createdAt.getUTCDate() > d) {
        captcha(member);
    }

    function captcha(member) {
        let blockedUserRole = member.guild.roles.find(r => r.name === "muted");
        if (blockedUserRole) {
            member.addRole(blockedUserRole).catch();
            member.guild.channels.forEach(c => {
                c.overwritePermissions(blockedUserRole, {
                    READ_MESSAGES: false,
                    SEND_MESSAGES: false,
                    ADD_REACTIONS: false
                }).catch()
            })
        } else {
            member.guild.createRole({
                name: "muted"
            }).then(role => {
                member.addRole(role).catch();
            }).catch();
            member.guild.channels.forEach(c => {
                c.overwritePermissions(blockedUserRole, {
                    READ_MESSAGES: false,
                    SEND_MESSAGES: false,
                    ADD_REACTIONS: false
                }).catch()
            })
        }
        let a = (Math.floor((Math.random() * 9) + 1));
        let b = (Math.floor((Math.random() * 9) + 1));
        let c = (Math.floor((Math.random() * 9) + 1));
        let d = (Math.floor((Math.random() * 9) + 1));
        let code = a.toString() + b.toString() + c.toString() + d.toString();
        let captchaEmbed = new Discord.RichEmbed()
            .setTitle('CAPTCHA')
            .setTimestamp()
            .setColor(0xfc4705)
            .setThumbnail(member.avatarURL)
            .setFooter(member.guild.name)
            .setDescription(
                'Hello '
                + member.tag
                + ', \n\n'
                + 'Your account has been flagged by our auto-moderation.'
                + '\n\n'
                + 'Please reply to this message with the following:'
                + '\n'
                + emojiCharacters[a] + emojiCharacters[b] + emojiCharacters[c] + emojiCharacters[d]);
        return member.send(captchaEmbed)
            .then(() => {
                botUsers.findOne({
                    userID: member.id
                }, (err, user) => {
                    if (!user) {
                        const newbotUsers = new botUsers({
                            userID: member.id,
                            username: member.name,
                            code: code,
                            checked: false,
                            isBot: false,
                            isSus: true
                        });
                        return newbotUsers.save();
                    } else {
                        user.userID = member.id;
                        user.code = code;
                        user.checked = false;
                        user.isSus = true;
                        user.save();
                    }
                }).catch(error => {
                    console.error(`Failed to send help DM to ${member.tag}.\n`, error);
                });
            });
    }
});