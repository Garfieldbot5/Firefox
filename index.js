import makeWASocket, { useMultiFileAuthState } from "@whiskeysockets/baileys"
import readline from "readline"
import pino from "pino"

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

let sentOnce = false
let asked = false

async function startBot(printQR = false) {
  console.log("🚀 Starting WhatsApp bot...")

  const { state, saveCreds } = await useMultiFileAuthState("./session")

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: printQR,
    logger: pino({ level: "silent" })
  })

  sock.ev.on("creds.update", saveCreds)

  sock.ev.on("connection.update", async ({ connection }) => {

    // ✅ CONNECTED
    if (connection === "open") {
      console.log("✅ WhatsApp connected")

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
    }

    // 🔗 TRY PAIR CODE
    if (
      connection === "connecting" &&
      !sock.authState.creds.registered &&
      !asked &&
      !printQR
    ) {
      asked = true

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
              console.log("❌ Pair code failed → switching to QR")

              rl.close()
              sock.end()

              // 🔄 restart bot with QR
              startBot(true)
            }
          }
        )
      }, 3000)
    }
  })
}

startBot()
