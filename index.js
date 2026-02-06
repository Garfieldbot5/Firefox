const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys")
const express = require("express")
const QRCode = require("qrcode")

const app = express()
let qrCodeData = null

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState("auth")

    const sock = makeWASocket({
        auth: state
    })

    sock.ev.on("creds.update", saveCreds)

    sock.ev.on("connection.update", async (update) => {
        const { qr, connection } = update

        if (qr) {
            qrCodeData = await QRCode.toDataURL(qr)
        }

        if (connection === "open") {
            console.log("✅ WhatsApp Bot Connected")
            qrCodeData = null
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
