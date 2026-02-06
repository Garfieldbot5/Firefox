const { cmd } = require('../command');
const { fetchJson } = require('../lib/functions');

const searchlink = 'https://dark-shan-yt.koyeb.app/download'; // API for YouTube search
const downlink = 'https://dark-shan-yt.koyeb.app/download/ytmp3?url=https://youtube.com/watch?v=yuiPG35iO-E&quality=3'; // API for downloading MP3

cmd({
    pattern: "song",
    desc: "Download songs from YouTube.",
    category: "download",
    react: "🎧",
    filename: __filename
}, async (conn, mek, m, { from, reply, q }) => {
    try {
        if (!q) return reply('⚠️ Please provide a song name or YouTube URL!');

        // Search for the song on YouTube
        const search = await fetchJson(`${searchlink}/search/yt?q=${encodeURIComponent(q)}`);
        
        if (!search.result || !search.result.data || search.result.data.length === 0) {
            return reply('❌ No results found for your query. Please try a different song name.');
        }

        // Get the first result from the search
        const data = search.result.data[0];
        const url = data.url;

        // Fetch the download link
        const ytdl = await fetchJson(`${downlink}/ytmp3?url=${encodeURIComponent(url)}&quality=3`);
        
        if (!ytdl.data || !ytdl.data.download) {
            return reply('❌ Failed to retrieve the download link. Please try again later.');
        }

        // Create a message to send
        let message = `🎶 **YouTube Song Downloader** 🎶

🎵 **Title**: ${data.title}  
⏱ **Duration**: ${data.timestamp}  
🌏 **Uploaded**: ${data.ago}  
🧿 **Views**: ${data.views}  
🤵 **Author**: ${data.author.name}  
📎 **URL**: ${data.url}

────────────────────
💡 *POWERED BY DINUWH MD* 💡`;

        // Send song details with thumbnail
        await conn.sendMessage(from, { image: { url: data.thumbnail }, caption: message }, { quoted: mek });

        // Send the audio as a normal file
        await conn.sendMessage(from, { 
            audio: { url: ytdl.data.download }, 
            mimetype: "audio/mpeg" 
        }, { quoted: mek });

        // Send the audio as a document
        await conn.sendMessage(from, { 
            document: { url: ytdl.data.download }, 
            mimetype: "audio/mpeg", 
            fileName: `${data.title}.mp3`, 
            caption: `${data.title}` 
        }, { quoted: mek });

    } catch (e) {
        console.error("Error occurred:", e.message);
        reply('❌ An unexpected error occurred while processing your request.');
    }
});
