const { cmd } = require('../command');

cmd({
    pattern: "menu",
    desc: "Display the bot menu",
    category: "main",
    react: "📜",
    filename: __filename
},
async (conn, mek, m, { from, reply, q, pushname }) => {
    try {
        let madeMenu = `╭───「 🌟 *DINUWH MD BOT* 🌟 」───╮
👋 *Hello, ${pushname}!* 

📜 *Main:*
│◾️ .alive - Bot Status
│◾️ .menu - Show Menu
│◾️ .system - Info
│◾️ .owner - Owner Info
│◾️ .uptime - Uptime

🎵 *Download:*
│◾️ .song <text> - Songs
│◾️ .video <text> - Videos
│◾️ .fb <link> - FB Video
│◾️ .ytmp3 <link> - YT to MP3
│◾️ .ytmp4 <link> - YT to MP4

🛠️ *Owner:*
│◾️ .restart - Restart
│◾️ .update - Update

🖼️ *Convert:*
│◾️ .sticker <img> - Sticker
│◾️ .img <sticker> - Image
│◾️ .tts <text> - TTS
│◾️ .tr <lang> <text> - Translate

🔍 *Search:*
│◾️ .add <num> - Add Members
│◾️ .del <num> - Remove Members

📢 *Join Channel:*
https://whatsapp.com/channel/0029Vat7xHl7NoZsrUVjN844

╰───────────────────╯`;

        let messageContent = {
            image: {
                url: "https://i.ibb.co/J7b69bD/f6aa689d2b20c62a.jpg"
            },
            caption: madeMenu,
            sourceUrl: 'https://whatsapp.com/channel/0029VagJIAr3bbVBCpEkAM07'
        };

        await conn.sendMessage(
            from,
            messageContent,
            { quoted: mek }
        );
    } catch (e) {
        console.log(e);
        reply(`Error: ${e}`);
    }
});
