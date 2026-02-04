const {readEnv} = require('../lib/database');
const {cmd, commands} = require('../command');

cmd({
    pattern: "add",
    desc: "Add a member to the group.",
    category: "group",
    filename: __filename
}, async (robin, mek, m, {
    from, args, isGroup, isBotAdmins, isAdmins, reply
}) => {
    try {
        // Check if the command is being used in a group
        if (!isGroup) return reply("This command can only be used in groups!");

        // Check if the bot is an admin
        if (!isBotAdmins) return reply("I need to be an admin to add members!");

        // Check if the user is an admin
        if (!isAdmins) return reply("Only group admins can use this command!");

        // Validate the phone number argument
        if (args.length === 0) return reply("Please provide a phone number to add!");
        const phoneNumber = args[0].replace(/[^0-9]/g, '') + "@s.whatsapp.net";

        // Add the member to the group
        await robin.groupParticipantsUpdate(from, [phoneNumber], "add");
        return reply(`✅ Successfully added ${args[0]} to the group.`);
    } catch (e) {
        console.error(e);
        reply(`❌ Failed to add member: ${e.message}`);
    }
});
