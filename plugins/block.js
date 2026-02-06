const { cmd } = require('../command');

cmd({
    pattern: "block",
    alias: ["ban"],
    react: "☠️",  // <- Fixed the missing semicolon here
    desc: "Block a user instantly.",
    category: "main",
    filename: __filename
},
async (robin, mek, m, { quoted, reply, isOwner }) => {
    try {
        // Check if the user is the bot owner
        if (!isOwner) return reply("*⚠️ උබ මගේ(බොට්ගේ) ඔව්නර්ද කියහම්🥲*");

        // Check if the command is used on a quoted message
        if (!quoted) return reply("*⚠️ බ්ලොක් කරන්න ඕනි එකාව මේන්ශන් කරපම්🥲*!");

        // Extract the target user from the quoted message
        const target = quoted.sender;

        // Block the target user
        await robin.updateBlockStatus(target, "block");

        // Confirm success
        return reply(`*✅ බ්ලොක් කලා😌💖*: @${target.split('@')[0]}`);
    } catch (e) {
        console.error("Block Error:", e);
        return reply(`❌ Failed to block the user. Error: ${e.message}`);
    }
});
