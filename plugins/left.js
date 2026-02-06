const { cmd } = require('../command');

cmd({
    pattern: "left",
    alias: ["leave", "exit"],
    desc: "Leave the current group.",
    category: "main",
    filename: __filename
},
async (robin, mek, m, { from, isGroup, isOwner, reply }) => {
    try {
        // Check if the command is used in a group
        if (!isGroup) return reply("⚠️ This command can only be used in a group!");

        // Check if the user is the bot owner
        if (!isOwner) return reply("⚠️ Only the owner can use this command!");

        // Leave the group
        await robin.groupLeave(from);

        // Confirm leaving
        console.log(`✅ Successfully left the group: ${from}`);
    } catch (e) {
        console.error("Leave Error:", e);
        reply(`❌ Failed to leave the group. Error: ${e.message}`);
    }
});
