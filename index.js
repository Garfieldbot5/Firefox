const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

import makeWASocket, {
  useMultiFileAuthState
} from '@whiskeysockets/baileys'

async function startBot() {
  const { state, saveCreds } =
    await useMultiFileAuthState('./session')

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true
  })

  sock.ev.on('creds.update', saveCreds)

  sock.ev.on('connection.update', ({ connection }) => {
    if (connection === 'open') {
      console.log('✅ WhatsApp connected')
    }
  })

  // 👇 COMMAND HANDLER
sock.ev.on('messages.upsert', async ({ messages }) => {
  const msg = messages[0]
  if (!msg || !msg.message || msg.key.fromMe) return

  // ✅ READ MESSAGE TEXT SAFELY
  const text =
    msg.message.conversation ||
    msg.message.extendedTextMessage?.text ||
    msg.message.imageMessage?.caption ||
    msg.message.videoMessage?.caption

  if (!text) return

  console.log('📩 Message:', text) // DEBUG (IMPORTANT)

  // ✅ COMMAND PREFIX
  const prefix = '!'
  if (!text.startsWith(prefix)) return

  const command = text.slice(prefix.length).trim().toLowerCase()

  // ✅ COMMANDS
  if (command === 'ping') {
    await delay(randomDelay(1500, 3000))
    return sock.sendMessage(msg.key.remoteJid, {
      text: 'pong 🏓'
    })
  }

  else if (command === 'menu') {
    await delay(randomDelay(1500, 3000))
    return sock.sendMessage(msg.key.remoteJid, {
      text: '🤖 Menu:\n!ping\n!menu\n!help'
    })
  }

  else if (command === 'help') {
    return sock.sendMessage(msg.key.remoteJid, {
      text: 'Type !menu to see commands'
    })
  }
})


startBot()


app.get("/", (req, res) => {
    res.send(`
        <html>
        <body style="text-align:center;">
            <h2>Scan WhatsApp QR</h2>
            ${qrCodeData ? `<img src="${qrCodeData}" />` : "<p>Connected ✅</p>"}
            <script>setTimeout(()=>location.reload(),3000)</script>
        </body>
        </html>
    `)
})

app.listen(3000, () => {
    console.log("🌐 http://localhost:3000")
})
