const { readEnv } = require('../lib/database');
const { cmd } = require('../command');

cmd(
  {
    pattern: "system",  // Change pattern to 'system'
    desc: "Show bot system details like ping, uptime, and time",
    category: "utility",  // Category can remain as utility
    filename: __filename,
  },
  async (
    robin,
    mek,
    m,
    {
      from,
      quoted,
      reply,
    }
  ) => {
    try {
      const config = await readEnv();

      // Bot uptime calculation
      const uptime = process.uptime(); // Uptime in seconds
      const hours = Math.floor(uptime / 3600);
      const minutes = Math.floor((uptime % 3600) / 60);
      const seconds = Math.floor(uptime % 60);

      // Calculate ping
      const start = Date.now();
      await reply("Calculating ping...");
      const ping = Date.now() - start;

      // Get current time
      const currentTime = new Date().toLocaleString("en-US", {
        timeZone: "Asia/Colombo",
        hour12: true,
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
      });

      // Greeting message based on time
      const hourNow = new Date().toLocaleString("en-US", {
        timeZone: "Asia/Colombo",
        hour: "numeric",
        hour12: false,
      });

      const greeting =
        hourNow >= 5 && hourNow < 12
          ? "🌅 Good Morning"
          : hourNow >= 12 && hourNow < 18
          ? "☀️ Good Afternoon"
          : "🌙 Good Evening";

      // Deployment site URL
      const deployedLink = "https://your-deployment-site.com"; // Replace with your actual site URL

      // Response message
      const message = `
${greeting} 👋

🤖 *𝙳𝙸𝙽𝚄𝚆𝙷 𝙼𝙳 𝚂𝚈𝚂𝚃𝙴𝙼 𝙸𝙽𝙵𝙾*:


🕒 *𝚄𝙿𝚃𝙸𝙼𝙴*: ${hours}h ${minutes}m ${seconds}s
📡 *𝙿𝙸𝙽𝙶*: ${ping}ms
⏰ *𝙲𝚄𝚁𝚁𝙴𝙽𝚃 𝚃𝙸𝙼𝙴*: ${currentTime}


> *°•°𝙿𝙾𝚆𝙴𝚁𝙳 𝙱𝚈 𝙳𝙸𝙽𝚄𝚆𝙷 𝙼𝙳 ☊°_°🖤*
`;

      // Sending the message
      return await robin.sendMessage(
        from,
        {
          image: { url: config.ALIVE_IMG || "https://via.placeholder.com/300" }, // Default image if ALIVE_IMG not set
          caption: message,
        },
        { quoted: mek }
      );
    } catch (e) {
      console.error(e); // Log any errors
      reply(`❌ Error: ${e.message || "An unknown error occurred!"}`);
    }
  }
);
