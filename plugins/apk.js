const { cmd } = require('../command')
const { fetchJson } = require('../lib/functions')

const apilink = 'https://www.dark-yasiya-api.site' 




cmd({
    pattern: "apk",
    alias: ["app","ps","playstore"],
    react: "🔞",
    desc: "Download App APK ",
    category: "download",
    use: '.apk < text >',
    filename: __filename
},
async(conn, mek, m,{from, quoted, reply, q }) => {
try{

  if(!q) return await reply("Please give me few word !")
    
const apk_search = await fetchJson(`${apilink}/search/apk?text=${q}`)
if(apk_search.result.data.length < 0) return await reply("Not results found !")

const apk_info = await fetchJson(`${apilink}/download/apk?id=${apk_search.result.data[0].id}`)
    
  // GET FIRST APK
  
const apkcaption =` 

       🔥   *APK DOWNLOADER*   🔥

     
🔮 *Name* - ${apk_info.result.name}
🔮 *Package* - ${apk_info.result.package}
🔮 *Size* - ${apk_info.result.size}
`
await conn.sendMessage( from, { image: { url: apk_info.result.image || '' }, caption: apkcaption }, { quoted: mek })

// SEND APK
await conn.sendMessage(from, { document: { url: apk_info.result.dl_link }, mimetype: "application/vnd.android.package-archive", fileName: apk_info.result.name , caption: apk_info.result.name }, { quoted: mek });


} catch (error) {
console.log(error)
reply(error)
}
});
