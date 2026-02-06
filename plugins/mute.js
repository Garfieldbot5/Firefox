const { cmd } = require('../command');

cmd({
    pattern: "mute",
    alias: ["silence", "lock"],
    desc: "Set group chat to admin-only messages.",
    category: "main",
    filename: __filename
},
async (robin, mek, m, { from, isGroup, isAdmins, isBotAdmins, reply }) => {
    try {
        // Check if the command is used in a group
        if (!isGroup) return reply("*⚠️ කට වහන්නද බ්න් චැට් එකේ😂 ගෘප් එකක ගහපම්😂*");

        // Check if the user is an admin
        if (!isAdmins) return reply("*⚠️ ඇඩ්මින් දීල හිටපම් 😂ඉස්සෙල්ලා😒*");

        // Check if the bot is an admin
        if (!isBotAdmins) return reply("*⚠️ ඇඩ්මින් දීල හිටපම් 😂ඉස්සෙල්ලා😒*");

        // Set the group to admin-only
        await robin.groupSettingUpdate(from, "announcement");

        // Confirm the action
        return reply("✅ Group has been muted. Only admins can send messages now!");
    } catch (e) {
        console.error("Mute Error:", e);
        reply(`❌ Failed to mute the group. Error: ${e.message}`);
    }
});
