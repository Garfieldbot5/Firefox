const { cmd } = require('../command');

cmd({
    pattern: "jid",
    desc: "Get the bot's JID.",
    category: "owner",
    filename: __filename
}, 
async (conn, mek, m, { isOwner, reply }) => {
    if (!isOwner) return reply("❌ You are not the owner!");
    reply(`🤖 Bot JID: ${conn.user.jid}`);
});
