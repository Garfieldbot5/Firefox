import makeWASocket, { useMultiFileAuthState } from "@whiskeysockets/baileys"
import readline from "readline"
import pino from "pino"

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

let sentOnce = false
let asked = false
let paired = false

async function startBot(printQR = false) {
  console.log("🚀 Starting WhatsApp bot...")

  const { state, saveCreds } = await useMultiFileAuthState("./session")

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: printQR,
    logger: pino({ level: "silent" })
  })

  sock.ev.on("creds.update", saveCreds)


  sock.ev.on("messages.upsert", async ({ messages }) => {
    const msg = messages[0]
    if (!msg?.message) return
    if (!msg.key.fromMe) return

    const text =
      msg.message.conversation ||
      msg.message.extendedTextMessage?.text

    if (text === ".alive") {
      await sock.sendMessage(msg.key.remoteJid, {
        text: "✅ Firefox bot is alive"
      })
    }
  })


  sock.ev.on("connection.update", async ({ connection }) => {


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
              const code = await sock.requestPairingCode(number.trim())
              console.log("\n🔢 PAIR CODE:", code)
              console.log("📲 WhatsApp → Linked Devices → Link with phone number")
              console.log("⏳ Waiting for device to link...")
              rl.close()
            } catch {
              console.log("❌ Pair code failed → switching to QR")
              rl.close()
              sock.end()
              startBot(true)
            }
          }
        )
      }, 3000)
    }


    if (connection === "open" && sock.authState.creds.registered) {
      if (!paired) {
        paired = true
        console.log("✅ Device linked successfully")

        if (!sentOnce) {
          sentOnce = true
          const myJid = sock.user?.id
          if (myJid) {
            await sock.sendMessage(myJid, {
              text: "❤ Firefox connected successfully"
            })
          }
        }
      }
    }
  })
}

startBot()
