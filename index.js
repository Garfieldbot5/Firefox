import makeWASocket, { useMultiFileAuthState } from "@whiskeysockets/baileys"
import express from "express"
import QRCode from "qrcode"

let pairedOnce = false

console.log('🔥 index.js loaded')

async function startBot() {
  
  const { state, saveCreds } = await useMultiFileAuthState('./session')

 async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState("./session")
   
  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true
  })

  
  sock.ev.on('creds.update', saveCreds)

   sock.ev.on("connection.update", async (update) => {
        const { connection, qr } = update

        if (qr) {
            latestQR = qr
            console.log("📱 QR received")
        }

        if (connection === "open") {
            console.log("✅ WhatsApp Connected")
        }
    })
}

    if (!pairedOnce) {
      pairedOnce = true

      const myJid = sock.user?.id
if (myJid) {
  await sock.sendMessage(myJid, {
    image: { url: 'https://i.postimg.cc/SKWWycnC/2f219c4e-35ba-41b3-bb11-91fdfe78291f.jpg' },
    caption: '✅ Bot successfully paired & connected 🎉'
  })
}
    }
  }

  if (connection === 'close') {
    if (lastDisconnect?.error?.output?.statusCode !== 401) {
      console.log('🔄 Reconnecting...')
      startBot()
    } else {
      console.log('⚠️ Logged out. Scan QR again.')
      pairedOnce = false
    }
  }
})


startBot()

app.get("/qr", async (req, res) => {
    if (!latestQR) {
        return res.send("QR not ready yet")
    }

    const qrImage = await QRCode.toDataURL(latestQR)

    res.send(`
        <h2>Scan WhatsApp QR</h2>
        <img src="${qrImage}" />
        <script>setTimeout(()=>location.reload(),3000)</script>
    `)
})

app.listen(3000, () => {
    console.log("🌐 Open http://localhost:3000/qr")
})

