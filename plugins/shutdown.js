const { cmd } = require('../command');

cmd({
    pattern: "shutdown",
    desc: "Shutdown the bot.",
    category: "owner",
    filename: __filename
}, 
async (conn, mek, m, { isOwner, reply }) => {
    if (!isOwner) return reply("❌ You are not the owner!");
    reply("🛑 Shutting down...").then(() => process.exit());
});
