const { cmd } = require('../command');

cmd({
    pattern: "clearchats",
    desc: "Clear all chats from the bot.",
    category: "owner",
    filename: __filename
}, 
async (conn, mek, m, { isOwner, reply }) => {
    if (!isOwner) return reply("❌ You are not the owner!");

    try {
        const chats = await conn.chats.all();
        for (const chat of chats) {
            await conn.modifyChat(chat.jid, 'delete');
        }
        reply("🧹 All chats cleared.");
    } catch (e) {
        reply(`❌ Error clearing chats: ${e.message}`);
    }
});
