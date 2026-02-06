const { readEnv } = require('../lib/database');
const { cmd } = require('../command');
const { exec } = require('child_process'); // For executing commands in the system

cmd({
    pattern: "restart", // Command pattern to trigger
    alias: ["reboot"], // You can also use "reboot" as alias
    desc: "Restart the bot",
    category: "admin", // Keep this in admin category to restrict access
    filename: __filename,
}, async (robin, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, isMe, isOwner, reply }) => {
    try {
        // Ensure only the bot owner can use this command
        if (!isOwner) return reply("❌ You don't have permission to restart the bot!");

        // Notify that the bot is restarting
        reply("🔄 Restarting the bot... Please wait!");

        // Restart the bot by executing the restart command on the system
        exec('pm2 restart bot', (err, stdout, stderr) => {
            if (err) {
                console.error(`Error restarting bot: ${stderr}`);
                reply(`❌ Error restarting bot: ${stderr}`);
                return;
            }

            // Send a confirmation message once the bot is restarted
            console.log(`Bot restarted successfully: ${stdout}`);
            reply("✅ Bot has been successfully restarted!");
        });
    } catch (e) {
        console.error(e);
        reply(`❌ Error: ${e.message || "An unknown error occurred!"}`);
    }
});
