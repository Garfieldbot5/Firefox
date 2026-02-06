import makeWASocket, {
  useMultiFileAuthState,
  DisconnectReason
} from "@whiskeysockets/baileys"

import readline from "readline"

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("./session")

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: false
  })

  sock.ev.on("creds.update", saveCreds)

  let askedForCode = false

  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect } = update

    if (connection === "open") {
      console.log("✅ Connected to WhatsApp")

      if (!sock.authState.creds.registered && !askedForCode) {
        askedForCode = true

        rl.question(
          "📱 Enter WhatsApp number (countrycode + number): ",
          async (number) => {
            try {
              const code = await sock.requestPairingCode(number)
              console.log("🔢 PAIR CODE:", code)
              console.log("📲 WhatsApp → Linked Devices → Link with phone number")
            } catch (err) {
              console.error("❌ Failed to get pair code:", err.message)
            } finally {
              rl.close()
            }
          }
        )
      }
    }

    if (connection === "close") {
      const reason = lastDisconnect?.error?.output?.statusCode

      if (reason !== DisconnectReason.loggedOut) {
        console.log("🔄 Reconnecting...")
        startBot()
      } else {
        console.log("❌ Logged out. Delete session folder and relink.")
      }
    }
  })
}

startBot()
