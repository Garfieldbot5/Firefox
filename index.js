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

  const number = await new Promise(resolve => {
    rl.question(
      "📱 Enter WhatsApp number (countrycode + number): ",
      answer => resolve(answer.replace(/\D/g, ""))
    )
  })

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: false,
    logger: pino({ level: "silent" }),
    browser: ["Ubuntu", "Chrome", "22.04.4"] // REQUIRED
  })

  sock.ev.on("creds.update", saveCreds)

  // ⏳ WAIT LONGER — THIS FIXES "WRONG CODE"
  setTimeout(async () => {
    try {
      if (!sock.authState.creds.registered) {
        const code = await sock.requestPairingCode(number)
        console.log("\n🔢 PAIR CODE:", code)
        console.log("📲 WhatsApp → Linked Devices → Link with phone number")
      } else {
        console.log("✅ Already paired")
      }
    } catch (e) {
      console.log("❌ Pairing failed:", e.message)
    } finally {
      rl.close()

       process.on("SIGINT", async () => {
    console.log("\n🔓 Logging out WhatsApp...")
    try {
      await sock.logout()
    } catch {}
    process.exit(0)
  })
    }
  }, 5000) // ⬅️ IMPORTANT
}

startBot()
