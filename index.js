import makeWASocket, {
  useMultiFileAuthState,
  DisconnectReason
} from '@whiskeysockets/baileys'
import { Boom } from '@hapi/boom'
import readline from 'readline'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

async function startBot () {
  const { state, saveCreds } =
    await useMultiFileAuthState('./session')

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: false // IMPORTANT
  })

  sock.ev.on('creds.update', saveCreds)

  // 🔑 PAIRING CODE FLOW
  if (!sock.authState.creds.registered) {
    rl.question(
      'Enter WhatsApp number (with country code): ',
      async (number) => {
        number = number.replace(/[^0-9]/g, '')

        const code = await sock.requestPairingCode(number)
        console.log('📲 Pairing Code:', code)
        console.log('Open WhatsApp → Linked Devices → Link with phone number')
        rl.close()
      }
    )
  }

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update

    if (connection === 'open') {
      console.log('✅ WhatsApp linked successfully')
    }

    if (connection === 'close') {
      const reason = new Boom(
        lastDisconnect?.error
      )?.output?.statusCode

      if (reason !== DisconnectReason.loggedOut) {
        console.log('🔄 Reconnecting...')
        startBot()
      } else {
        console.log('❌ Logged out, pairing required again')
      }
    }
  })
}

startBot()
