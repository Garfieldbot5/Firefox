const { readEnv } = require('../lib/database');
const { cmd, commands } = require('../command');

cmd(
  {
    pattern: "tagall",
    alias: ["mentionall", "pingall"],
    desc: "Mention all members in the group",
    category: "main",
    filename: __filename,
  },
  async (
    robin,
    mek,
    m,
    {
      from,
      quoted,
      body,
      isCmd,
      command,
      args,
      q,
      isGroup,
      sender,
      senderNumber,
      botNumber2,
      botNumber,
      pushname,
      isMe,
      isOwner,
      groupMetadata,
      groupName,
      participants,
      groupAdmins,
      isBotAdmins,
      isAdmins,
      reply,
    }
  ) => {
    try {
      if (!isGroup) {
        return reply("This command can only be used in a group!");
      }

      // Check if the sender is an admin
      if (!isAdmins && !isOwner && !isBotAdmins) {
        return reply("You need to be an admin to use this command.");
      }

      // Create the mention text for all group members
      const mentions = participants.map((participant) => `@${participant.id.split('@')[0]}`).join(' ');

      const config = await readEnv();
      
      // Prepare the message
      const message = `${mentions}\n\n${config.ALIVE_MSG || 'The bot is alive and running!'}`;

      // Send the message with a custom image and caption
      return await robin.sendMessage(
        from,
        {
          image: { url: config.ALIVE_IMG || "https://via.placeholder.com/300" },  // Default image if ALIVE_IMG not set
          caption: message,
          mentions: participants.map((participant) => participant.id),  // This will mention all participants
        },
        { quoted: mek }
      );
    } catch (e) {
      console.log(e);
      reply(`❌ Error: ${e.message || "An unknown error occurred!"}`);
    }
  }
);
