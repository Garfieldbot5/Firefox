import commandHandler from './command.js'

console.log('🔥 index.js loaded')

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

  // ✅ ONE message listener ONLY
  sock.ev.on('messages.upsert', async ({ messages }) => {
    console.log('📥 messages.upsert fired')

    const msg = messages[0]
    if (!msg || !msg.message || msg.key.fromMe) return

    // 👇 pass message to command.js
    await commandHandler(sock, msg)
  })
}

startBot()
