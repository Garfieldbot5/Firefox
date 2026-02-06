

const { cmd } = require('../command');

cmd({
    pattern: "hack",
    desc: "Displays a dynamic and playful 'Hacking' message for fun.",
    category: "fun",
    react: "💻",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        const steps = [
            '💻 *DINUWH HACK SERVER...* 💻',
            '',
            '*hacking plugins install...* 🛠️',
            '*hacking sever connected...* 🌐',
            '',
            '[▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▒]10%☠️\n> *POWERD BY DINUWAH-MD*'                                            ,
            '[▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▒▒▒]20%☠️\n> *POWERD BY DINUWAH-MD*'                                   ,
            '[▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▒▒▒▒▒]30%☠️\n> *POWERD BY DINUWAH-MD*'                               ,
            '[▓▓▓▓▓▓▓▓▓▓▓▓▓▓▒▒▒▒▒▒▒]40%☠️\n> *POWERD BY DINUWAH-MD*'                            ,
            '[▓▓▓▓▓▓▓▓▓▓▓▓▒▒▒▒▒▒▒▒▒]50%☠️\n> *POWERD BY DINUWAH-MD*'                       ,
            '[▓▓▓▓▓▓▓▓▓▓▒▒▒▒▒▒▒▒▒▒▒]60%☠️\n> *POWERD BY DINUWAH-MD*'                 ,
            '[▓▓▓▓▓▓▓▓▒▒▒▒▒▒▒▒▒▒▒▒▒]70%☠️\n> *POWERD BY DINUWAH-MD*'            ,
            '[▓▓▓▓▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒]80%☠️\n> *POWERD BY DINUWAH-MD*'        ,
            '[▓▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒]90%☠️\n> *POWERD BY DINUWAH-MD*'    ,
            '[▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒]100%☠️\n> *POWERD BY DINUWAH-MD*',
            '',
            '🔒 *System Breach: Successful!* 🔓',
            '🚀 *Command Execution: Complete!* 🎯',
            '',
            '*📡 DINUWH MD Data transmissoin...* ☠️',
            '_🕵️‍♂️ DINUWH MD Ensuring stealth..._ 🤫',
            '*🔧 DINUWH MD Finalizing operations...* 🏁',
            '',
            '> ⚠️ *Note:* DINUWH MD ALL actions are for demonstration purposes only.',
            '> ⚠️ *Reminder:*DINUWH MD Ethical hacking is the only way to ensure security.',
            '',
            '> *DINUWH-MD HACKING TRANSMISSOIN SUCCESSFUL*'
        ];

        for (const line of steps) {
            await conn.sendMessage(from, { text: line }, { quoted: mek });
            await new Promise(resolve => setTimeout(resolve, 1000)); // Adjust the delay as needed
        }
    } catch (e) {
        console.log(e);
        reply(`❌ *Error:* ${e.message}`);
    }
});

/*
FIRST CREDIT BY SUPUN FERNANDO
OWNER OF DARK SHADOW MODZ

Don't Remove Credit 😒💥
**/
