import makeWASocket, { useMultiFileAuthState } from "@whiskeysockets/baileys"
import readline from "readline"
import pino from "pino"

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("./session")

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: false,
    logger: pino({ level: "silent" }) // ✅ correct way
  })

  sock.ev.on("creds.update", saveCreds)

  let requested = false

  sock.ev.on("connection.update", ({ connection }) => {
    if (
      connection === "open" &&
      !requested &&
      !sock.authState.creds.registered
    ) {
      requested = true

      // ⏳ WA needs time to finish handshake
      setTimeout(() => {
        rl.question(
          "📱 Enter WhatsApp number (countrycode + number): ",
          async (number) => {
            try {
              const code = await sock.requestPairingCode(number.trim())
              console.log("\n🔢 PAIR CODE:", code)
              console.log("📲 WhatsApp → Linked Devices → Link with phone number")
            } catch (e) {
              console.log("❌ Failed to generate pairing code:", e.message)
            } finally {
              rl.close()
            }
          }
        )
      }, 3000)
    }
  })
}

startBot()
