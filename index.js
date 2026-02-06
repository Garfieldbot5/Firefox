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

  
  sock.ev.on('messages.upsert', async ({ messages }) => {
    console.log('📩 MESSAGE RECEIVED')
    console.log('📥 messages.upsert fired')

    sock.ev.on('messages.upsert', async ({ messages }) => {
  const msg = messages[0]
  if (!msg || !msg.message || msg.key.fromMe) return

  
  await commandHandler(sock, msg)
})

    const msg = messages[0]
    if (!msg || !msg.message) {
      console.log('❌ No message content')
      return
    }

    if (msg.key.fromMe) {
      console.log('↩️ Ignored own message')
      return
    }

    const text =
      msg.message.conversation ||
      msg.message.extendedTextMessage?.text

    console.log('📩 TEXT:', text)

    if (text === '!ping') {
      await sock.sendMessage(msg.key.remoteJid, {
        text: 'pong 🏓'
      })
    }
  })
}

startBot()
