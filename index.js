import makeWASocket, {
  useMultiFileAuthState
} from '@whiskeysockets/baileys'

import commandHandler from './command.js'

console.log('🔥 Bot starting...')

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

  // ✅ ONLY ONE MESSAGE LISTENER
  sock.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages[0]
    if (!msg || !msg.message || msg.key.fromMe) return

    // pass message to command handler
    await commandHandler(sock, msg)
  })
}

startBot()
