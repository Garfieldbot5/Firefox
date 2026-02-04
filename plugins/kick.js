const { cmd } = require('../command');

cmd({
    pattern: "kick",
    alias: ["remove", "ban"],
    desc: "Remove a mentioned user from the group.",
    category: "main",
    filename: __filename
},
async (robin, mek, m, { from, isGroup, isAdmins, isBotAdmins, reply, quoted }) => {
    try {
        // Check if the command is used in a group
        if (!isGroup) return reply("⚠️ This command can only be used in a group!");

        // Check if the user issuing the command is an admin
        if (!isAdmins) return reply("⚠️ Only group admins can use this command!");

        // Check if the bot is an admin
        if (!isBotAdmins) return reply("⚠️ I need to be an admin to execute this command!");

        // Ensure a user is mentioned
        if (!quoted) return reply("⚠️ Please reply to the user's message you want to kick!");

        // Get the target user to remove
        const target = quoted.sender;

        // Ensure the target is not another admin
        const groupMetadata = await robin.groupMetadata(from);
        const groupAdmins = groupMetadata.participants.filter(participant => participant.admin).map(admin => admin.id);

        if (groupAdmins.includes(target)) {
            return reply("⚠️ I cannot remove another admin from the group!");
        }

        // Kick the target user
        await robin.groupParticipantsUpdate(from, [target], "remove");

        // Confirm the action
        return reply(`✅ Successfully removed: @${target.split('@')[0]}`);
    } catch (e) {
        console.error("Kick Error:", e);
        reply(`❌ Failed to remove the user. Error: ${e.message}`);
    }
});
