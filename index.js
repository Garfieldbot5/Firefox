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
    printQRInTerminal: false // ❌ NO QR
  })

  sock.ev.on("creds.update", saveCreds)

  // 🔗 REQUEST LINK CODE (ONLY ON FIRST PAIR)
  if (!sock.authState.creds.registered) {
    rl.question("📱 Enter WhatsApp number (countrycode + number): ", async (number) => {
      pairingCode = await sock.requestPairingCode(number)
      console.log("🔢 WhatsApp Link Code:", pairingCode)
      rl.close()
    })
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

      } else {
        console.log("❌ Logged out. Delete session & relink.")
        pairedOnce = false
      }
    }
  })
}

startBot()

/* 🌐 WEBSITE: SHOW LINK CODE (OPTIONAL) */
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
