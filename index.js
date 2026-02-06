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
  if (!msg.message || msg.key.fromMe) return

  // 🛑 Anti-spam
  const sender = msg.key.participant || msg.key.remoteJid
  const now = Date.now()

  if (userCooldown[sender] && now - userCooldown[sender] < 5000) return
  userCooldown[sender] = now

  const text =
    msg.message.conversation ||
    msg.message.extendedTextMessage?.text

  if (!text || !text.startsWith('!')) return

  const command = text.slice(1).toLowerCase()

  if (command === 'ping') {
    await delay(randomDelay(1500, 3000))
    await sock.sendMessage(msg.key.remoteJid, {
      text: 'pong 🏓'
    })
  }
})

    else if (command === 'menu') {
      await sock.sendMessage(msg.key.remoteJid, {
        text:
`🤖 *BOT MENU*
!ping – test bot
!menu – show menu
!help – help info`
      })
    }

    else if (command === 'help') {
      await sock.sendMessage(msg.key.remoteJid, {
        text: 'Type !menu to see all commands'
      })
    }

    else {
      await sock.sendMessage(msg.key.remoteJid, {
        text: '❌ Unknown command. Type !menu'
      })
    }
  })
}

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
