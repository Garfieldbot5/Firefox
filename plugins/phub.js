// CODED BY KALIYA-X


const { cmd } = require('../command')
const { fetchJson } = require('../lib/functions')

const apilink = 'https://www.dark-yasiya-api.site' 



cmd({
    pattern: "phub",
    alias: ["ph","porndown","pornhub"],
    react: "🔞",
    desc: "Download pornhub.com porn video",
    category: "download",
    use: '.phub < text >',
    filename: __filename
},
async(conn, mek, m,{from, quoted, reply, q }) => {
try{

  if(!q) return await reply("Please give me few word !")
    
const phub_search = await fetchJson(`${apilink}/search/phub?q=${q}`)
if(phub_search.result.length < 0) return await reply("Not results found !")

const phub_info = await fetchJson(`${apilink}/download/phub?url=${phub_search.result[0].url}`)
    
  // GET FIRST VIDEO
  
const phubcaption =` 

       🔥   *PORNHUB DOWNLOADER*   🔥

     
🔮 *Title* - ${phub_info.result.video_title}
🔮 *Uploader* - ${phub_info.result.video_uploader}
🔮 *Duration* - ${phub_info.result.analyze_time}
`
await conn.sendMessage( from, { image: { url: phub_info.result.video_cover || '' }, caption: phubcaption }, { quoted: mek })

// SEND 240P QUALITY VIDEO
await conn.sendMessage(from, { document: { url: phub_info.result.format[0].download_url }, mimetype: "video/mp4", fileName: phub_info.result.video_title, caption: phub_info.result.video_title }, { quoted: mek });


} catch (error) {
console.log(error)
reply(error)
}
})
