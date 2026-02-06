import makeWASocket, {
  useMultiFileAuthState,
  DisconnectReason
} from "@whiskeysockets/baileys"

import express from "express"
import readline from "readline"

const app = express()
const PORT = 3000

let pairedOnce = false
let pairingCode = null

console.log("🚀 index.js loaded")

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

  // 🔗 REQUEST LINK CODE (ONLY FIRST TIME)
  if (!sock.authState.creds.registered) {
    rl.question(
      "📱 Enter WhatsApp number (countrycode + number): ",
      async (number) => {
        pairingCode = await sock.requestPairingCode(number)
        console.log("🔢 WhatsApp Link Code:", pairingCode)
        rl.close()
      }
    )
  }

  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect } = update

    if (connection === "open") {
      console.log("✅ WhatsApp Connected")

      if (!pairedOnce) {
        pairedOnce = true
        const myJid = sock.user?.id

        if (myJid) {
          await sock.sendMessage(myJid, {
            text: "✅ Bot successfully paired & connected"
          })
        }
      }
    }

    if (connection === "close") {
      const statusCode = lastDisconnect?.error?.output?.statusCode

      if (statusCode === DisconnectReason.loggedOut) {
        console.log("❌ Logged out. Delete session & relink.")
        pairedOnce = false
      } else {
        console.log("⚠️ Connection closed. Restart app if needed.")
      }
    }
  })
}

startBot()

/* 🌐 WEBSITE: SHOW LINK CODE */
app.get("/code", (req, res) => {
  if (!pairingCode) {
    return res.send("Pairing code not generated yet.")
  }

  res.send(`
    <h2>WhatsApp Link Code</h2>
    <h1>${pairingCode}</h1>
    <p>Open WhatsApp → Linked Devices → Link with phone number</p>
  `)
})

app.listen(PORT, () => {
  console.log(`🌐 Open http://localhost:${PORT}/code`)
})
