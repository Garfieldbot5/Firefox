let pairedOnce = false

import commandHandler from './command.js'
import makeWASocket, { useMultiFileAuthState } from '@whiskeysockets/baileys'

console.log('🔥 index.js loaded')

async function startBot() {
  
  const { state, saveCreds } = await useMultiFileAuthState('./session')

 
  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true
  })

  
  sock.ev.on('creds.update', saveCreds)

  sock.ev.on('connection.update', async (update) => {
  const { connection, lastDisconnect } = update

  if (connection === 'open') {
    console.log('✅ WhatsApp connected')

    if (!pairedOnce) {
      pairedOnce = true

      const myJid = sock.user?.id
if (myJid) {
  await sock.sendMessage(myJid, {
    image: { url: 'https://i.postimg.cc/SKWWycnC/2f219c4e-35ba-41b3-bb11-91fdfe78291f.jpg' },
    caption: '✅ Bot successfully paired & connected 🎉'
  })
}
    }
  }

  if (connection === 'close') {
    if (lastDisconnect?.error?.output?.statusCode !== 401) {
      console.log('🔄 Reconnecting...')
      startBot()
    } else {
      console.log('⚠️ Logged out. Scan QR again.')
      pairedOnce = false
    }
  }
})

startBot()
