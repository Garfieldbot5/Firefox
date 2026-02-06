module.exports = async (sock, msg) => {
  const text =
    msg.message?.conversation ||
    msg.message?.extendedTextMessage?.text

  if (!text) return

  console.log('📩 COMMAND TEXT:', text)

  if (text === '!ping') {
    await sock.sendMessage(msg.key.remoteJid, {
      text: 'pong 🏓'
    })
  }

  if (text === '!menu') {
    await sock.sendMessage(msg.key.remoteJid, {
      text: '🤖 Menu\n!ping\n!menu'
    })
  }
}
