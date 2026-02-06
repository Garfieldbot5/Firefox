const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys")
const express = require("express")
const QRCode = require("qrcode")

const app = express()
let qrCodeData = null

app.get("/qr", async (req, res) => {

    if (!latestQR) {
        return res.send("QR not ready yet")
    }

    const qrImage = await QRCode.toDataURL(latestQR)

    res.send(`
        <h2>Scan QR</h2>
        <img src="${qrImage}" />
        <script>setTimeout(()=>location.reload(),3000)</script>
    `)
})


async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState("auth")

    const sock = makeWASocket({
        auth: state
        printQRInTerminal: false
    
    })

    sock.ev.on("connection.update", async (update) => {
  const { connection, qr } = update

  if (qr) {
    console.log("📱 QR received")
  }

  if (connection === "open") {
    console.log("✅ WhatsApp connected")
  }

  if (connection === "close") {
    console.log("❌ WhatsApp disconnected")
  }
})
}

startBot()

app.get("/", (req, res) => {
    res.send(`
        <html>
        <body style="text-align:center;">
            <h2>Scan WhatsApp QR</h2>
            ${qrCodeData ? `<img src="${qrCodeData}" />` : "<p>Connected ✅</p>"}
            <script>setTimeout(()=>location.reload(),3000)</script>
        </body>
        </html>
    `)
})

app.listen(3000, () => {
    console.log("🌐 http://localhost:3000")
})
