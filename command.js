export default async function commandHandler(sock, msg) {
  const text =
    msg.message?.conversation ||
    msg.message?.extendedTextMessage?.text ||
    msg.message?.imageMessage?.caption ||
    msg.message?.videoMessage?.caption

  if (!text) return

  console.log('📩 Received:', text)

  const prefix = '!'
  if (!text.startsWith(prefix)) return

  const command = text.slice(1).trim().toLowerCase()

  if (command === 'ping') {
    await sock.sendMessage(msg.key.remoteJid, {
      text: 'pong 🏓'
    })
  }

  else if (command === 'menu') {
    await sock.sendMessage(msg.key.remoteJid, {
      text: '🤖 Menu\n\n!ping\n!menu'
    })
  }
}
