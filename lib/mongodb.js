const mongoose = require('mongoose');
const config = require('../config');
const EnvVar = require('./mongodbenv');

const defaultEnvVariables = [
    { key: 'ALIVE_IMG', value: 'https://github.com/Yutsara4max/PRABATH-MDsecon/raw/refs/heads/main/file-Pz1aQQLbLSSVvJFQFbMjfv%20(1).webp' },
    { key: 'ALIVE_MSG', value: '𝙷𝙴𝙻𝙻𝙾𝚆 ..𝚒 𝚊𝚖 𝙳𝙸𝙽𝚄𝚆𝙷 𝚖𝚍 𝚠𝚑𝚊𝚝𝚜𝚊𝚙𝚙 𝙱𝙾𝚃...\n\n\n*මොකද කරන්නේ හලෝව්*\n\n*menu කමාන්ඩ් එක ගහලා ඕනි දෙයක් කරගම්න✨🖤*\n\n*join our whatsapp channel*\n\n\n> *https://whatsapp.com/channel/0029Vat7xHl7NoZsrUVjN844*\n\n🌝𝚃𝙷𝙰𝙽𝙺 𝚈𝙾𝚄💖' },
    { key: 'PREFIX', value: '.' },
];

// MongoDB connection function
const connectDB = async () => {
    try {
        await mongoose.connect(config.MONGODB);
        console.log('🛜 MongoDB Connected ✅');

        // Check and create default environment variables
        for (const envVar of defaultEnvVariables) {
            const existingVar = await EnvVar.findOne({ key: envVar.key });

            if (!existingVar) {
                // Create new environment variable with default value
                await EnvVar.create(envVar);
                console.log(`➕ Created default env var: ${envVar.key}`);
            }
        }

    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

module.exports = connectDB;
