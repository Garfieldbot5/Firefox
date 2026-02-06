const { cmd } = require('../command');

cmd({
    pattern: "unmute",
    alias: ["unlock"],
    desc: "Allow everyone to send messages in the group.",
    category: "main",
    filename: __filename
},
async (robin, mek, m, { from, isGroup, isAdmins, isBotAdmins, reply }) => {
    try {
        // Check if the command is used in a group
        if (!isGroup) return reply("⚠️ This command can only be used in a group!");

        // Check if the user is an admin
        if (!isAdmins) return reply("⚠️ This command is only for group admins!");

        // Check if the bot is an admin
        if (!isBotAdmins) return reply("⚠️ I need to be an admin to execute this command!");

        // Set the group to everyone can message
        await robin.groupSettingUpdate(from, "not_announcement");

        // Confirm the action
        return reply("✅ Group has been unmuted. Everyone can send messages now!");
    } catch (e) {
        console.error("Unmute Error:", e);
        reply(`❌ Failed to unmute the group. Error: ${e.message}`);
    }
});
