import makeWASocket, { useMultiFileAuthState } from "@whiskeysockets/baileys"
import readline from "readline"

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("./session")

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: false,
    logger: { level: "silent" } // 🔕 silence Baileys logs
  })

  sock.ev.on("creds.update", saveCreds)

  let requested = false

  sock.ev.on("connection.update", async ({ connection }) => {
    if (connection === "open" && !requested && !sock.authState.creds.registered) {
      requested = true

      // ⏳ wait a bit so WA finishes handshake
      setTimeout(() => {
        rl.question(
          "📱 Enter WhatsApp number (countrycode + number): ",
          async (number) => {
            try {
              const code = await sock.requestPairingCode(number)
              console.log("\n🔢 PAIR CODE:", code)
              console.log("📲 WhatsApp → Linked Devices → Link with phone number")
            } catch (e) {
              console.log("❌ Failed to generate pairing code")
            } finally {
              rl.close()
            }
          }
        )
      }, 2000)
    }
  })
}

startBot()
