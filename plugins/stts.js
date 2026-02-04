const { cmd } = require('../command');

// Variable to manage the state of auto status
let autoStatusEnabled = false;

cmd({
    pattern: "autostatuson",
    alias: ["statuson"],
    desc: "Enable auto status reading and mark as seen.",
    category: "automation",
    filename: __filename
},
async (robin, mek, m, { reply }) => {
    try {
        if (autoStatusEnabled) {
            return reply("Auto status reading is already enabled!");
        }

        autoStatusEnabled = true;

        // Event listener for status updates
        robin.ev.on('status.update', async (status) => {
            if (!autoStatusEnabled) return; // Ensure feature is enabled
            try {
                console.log(`Reading status from: ${status.participant}`);
                
                // Automatically mark the status as seen
                await robin.readStatus(status.id);
                
                console.log(`Status from ${status.participant} marked as seen.`);
            } catch (err) {
                console.error('Error reading status:', err);
            }
        });

        reply("Auto status reading has been enabled. All statuses will now be marked as seen.");
    } catch (e) {
        console.error('Error enabling auto status:', e);
        reply("An error occurred while enabling auto status reading.");
    }
});

cmd({
    pattern: "autostatusoff",
    alias: ["statusoff"],
    desc: "Disable auto status reading.",
    category: "automation",
    filename: __filename
},
async (robin, mek, m, { reply }) => {
    try {
        if (!autoStatusEnabled) {
            return reply("Auto status reading is already disabled!");
        }

        autoStatusEnabled = false;

        reply("Auto status reading has been disabled.");
    } catch (e) {
        console.error('Error disabling auto status:', e);
        reply("An error occurred while disabling auto status reading.");
    }
});
