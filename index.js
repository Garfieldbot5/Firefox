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

  // 🔹 Ask number FIRST so terminal responds
  const number = await new Promise(resolve => {
    rl.question(
      "📱 Enter WhatsApp number (countrycode + number): ",
      answer => resolve(answer.trim())
    )
  })

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: false,
    logger: pino({ level: "silent" }) // 🔕 silent logs
  })

  sock.ev.on("creds.update", saveCreds)

  let requested = false

  sock.ev.on("connection.update", async ({ connection }) => {
    // 🔗 Generate pair code only once
    if (
      connection === "open" &&
      !requested &&
      !sock.authState.creds.registered
    ) {
      requested = true

      // ⏳ let WhatsApp finish handshake
      setTimeout(async () => {
        try {
          const code = await sock.requestPairingCode(number)
          console.log("\n🔢 PAIR CODE:", code)
          console.log("📲 WhatsApp → Linked Devices → Link with phone number")
        } catch (e) {
          console.log("❌ Failed to generate pairing code:", e.message)
        }
      }, 3000)
    }

    // ✅ Already paired
    if (connection === "open" && sock.authState.creds.registered) {
      console.log("✅ Already paired & connected")
      rl.close()
    }
  })
}

startBot()
