import { PREFIX, OWNER } from './config.js'

export default async function commandHandler(sock, msg) {
  const jid = msg.key.remoteJid

  const text =
    msg.message.conversation ||
    msg.message.extendedTextMessage?.text

  if (!text) return
  if (!text.startsWith(PREFIX)) return

  const args = text.slice(PREFIX.length).trim().split(/ +/)
  const command = args.shift().toLowerCase()

const delay = Math.floor(Math.random() * 1000) + 800
await new Promise(r => setTimeout(r, delay))


  // 🧾 MENU
  if (command === 'menu') {
    const menu = `
🤖 *Firefox Bot Menu*
\\________________//
📌 *Main*
• !ping
• !menu
• !alive

👑 *Owner*
• !botpublic
• !botprivate

🌐 *Social*
• !yt
• !ig
• !fb
• !sinesubz
• !xnxx

👑 Owner: Dineth
Contact - wa/me+94775473247
    `
    await sock.sendMessage(jid, { text: menu })
  }

  // 🏓 PING
  else if (command === 'ping') {
    await sock.sendMessage(jid, { text: 'pong 🏓' })
  }

  // ❤️ ALIVE
  else if (command === 'alive') {
    await sock.sendMessage(jid, {
      image: { url: process.env.ALIVE_IMG || 'https://i.postimg.cc/SKWWycnC/2f219c4e-35ba-41b3-bb11-91fdfe78291f.jpg' },
      caption: process.env.ALIVE_MSG || 'Hi, im online now 🎲.'
    })
  }

  // 🌐 SOCIAL COMMANDS
  else if (command === 'yt') {
    await sock.sendMessage(jid, { text: '📺 YouTube: https://youtube.com/@yourchannel' })
  }

  else if (command === 'ig') {
    await sock.sendMessage(jid, { text: '📸 Instagram: https://instagram.com/yourprofile' })
  }

  else if (command === 'fb') {
    await sock.sendMessage(jid, { text: '📘 Facebook: https://facebook.com/yourpage' })
  }

  else if (command === 'sinecubz') {
    await sock.sendMessage(jid, { text: '🎞 Sinesubz https://cinesubz.co/filmname' })
  }

  else if (command === 'xnxx') {
    await sock.sendMessage(jid, { text: '🔞 xnxx https://en.xnxx.place/search/videoname' })
  }
}

// 🔐 PRIVATE CHAT ONLY
 else if (command === 'botprivate') {
  if (!isOwner) return

  BOT_MODE = 'private'
  await sock.sendMessage(jid, { text: '🔒 Bot is now PRIVATE' })
}

else if (command === 'botpublic') {
  if (!isOwner) return

  BOT_MODE = 'public'
  await sock.sendMessage(jid, { text: '🔓 Bot is now PUBLIC' })
}


  // 👑 OWNER ONLY
  else if (command === 'shutdown') {
    if (!isOwner) {
      return sock.sendMessage(jid, {
        text: '❌ Owner only command'
      })
    }

    await sock.sendMessage(jid, { text: 'Bot shutting down...' })
    process.exit(0)
  }
