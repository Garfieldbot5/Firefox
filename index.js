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

  sock.ev.on('connection.update', (update) => {
  const { connection, lastDisconnect } = update

  if (connection === 'open') {
    console.log('✅ WhatsApp connected')
  }

  if (connection === 'close') {
    console.log('❌ Connection closed')

    
    if (lastDisconnect?.error?.output?.statusCode !== 401) {
      console.log('🔄 Reconnecting...')
      startBot()
    } else {
      console.log('⚠️ Logged out. Scan QR again.')
    }
  }
})


startBot()
