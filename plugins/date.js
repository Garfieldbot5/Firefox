const { cmd } = require('../command')
const moment = require('moment')  // Moment.js for date and time formatting

cmd({
    pattern: "info",
    desc: "Show current date, time, and day of the week.",
    category: "information",
    react: "📅",
    filename: __filename
},
async(conn, mek, m, { from, reply }) => {
    try {
        // Get current date and time using moment.js
        const currentDate = moment().format('MMMM Do YYYY'); // Format the full date
        const currentTime = moment().format('hh:mm A'); // Format the time
        const currentDay = moment().format('dddd'); // Get the day of the week
        const poweredBy = "💡 POWERED BY DINUWH MD 💡"; // Footer text

        // Construct a beautiful message
        let message = `🎉 **Today's Information** 🎉

🌍 **Current Date**: *${currentDate}*  
🕒 **Current Time**: *${currentTime}*  
📆 **Day of the Week**: *${currentDay}*

────────────────────
💡 *${poweredBy}* 💡`;

        // Send the formatted message
        await conn.sendMessage(from, { text: message }, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply('Sorry, I encountered an error while fetching the date and time.');
    }
});
