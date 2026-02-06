import commandHandler from './command.js'
import makeWASocket, { useMultiFileAuthState } from '@whiskeysockets/baileys'

console.log('🔥 index.js loaded')

async function startBot() {
  // 🔐 Auth session
  const { state, saveCreds } = await useMultiFileAuthState('./session')

  // 🔌 Create socket
  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true
  })

  // 💾 Save session
  sock.ev.on('creds.update', saveCreds)

  // 🔄 Connection status
  sock.ev.on('connection.update', ({ connection }) => {
    if (connection === 'open') {
      console.log('✅ WhatsApp connected')
    }
  })

  // 📩 MESSAGE HANDLER (PASTE HERE)
  sock.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages[0]
    if (!msg || !msg.message || msg.key.fromMe) return

    console.log('📩 Message received')

    await commandHandler(sock, msg)
  })
}

// ▶️ Start bot
startBot()
