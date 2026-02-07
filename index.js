import makeWASocket, { useMultiFileAuthState } from "@whiskeysockets/baileys"
import readline from "readline"
import pino from "pino"

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

async function startBot() {
  console.log("🚀 Starting WhatsApp bot...")

  const { state, saveCreds } = await useMultiFileAuthState("./session")

  let useQR = false
  let asked = false

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: false, // QR disabled initially
    logger: pino({ level: "silent" })
  })

  sock.ev.on("creds.update", saveCreds)

  sock.ev.on("connection.update", async ({ connection }) => {
    if (connection === "open") {
      console.log("✅ WhatsApp connected")
      return
    }
     if (!sentOnce) {
      sentOnce = true

      const myJid = sock.user?.id
      if (myJid) {
        setTimeout(async () => {
          await sock.sendMessage(myJid, {
            text: "❤ Firefox connected successfully"
          })
        }, 2000)
      }
    }
    
    if (
      connection === "connecting" &&
      !sock.authState.creds.registered &&
      !asked
    ) {
      asked = true

      // give WhatsApp time to handshake
      setTimeout(() => {
        rl.question(
          "📱 Enter WhatsApp number (countrycode + number): ",
          async (number) => {
            try {
              console.log("🔗 Trying pairing code...")
              const code = await sock.requestPairingCode(number.trim())
              console.log("\n🔢 PAIR CODE:", code)
              console.log("📲 WhatsApp → Linked Devices → Link with phone number")
              rl.close()
            } catch (err) {
              console.log("❌ Pair code failed, switching to QR...")

              useQR = true
              rl.close()

              // recreate socket with QR enabled
              sock.end()

              const qrSock = makeWASocket({
                auth: state,
                printQRInTerminal: true,
                logger: pino({ level: "silent" })
              })

              qrSock.ev.on("creds.update", saveCreds)
            }
          }
        )
      }, 3000)
    }
  })
}

startBot()
