const fs = require("fs");
if (fs.existsSync("config.env"))
  require("dotenv").config({ path: "./config.env" });

function convertToBool(text, fault = "true") {
  return text === fault ? true : false;
}
module.exports = {
  SESSION_ID: process.env.SESSION_ID || "KRpnXCYT#mJv1a4WH0erxR5kq531W5uB_JiPYXdTtc_np5Zv7xbo",
  MONGODB: process.env.MONGODB || "mongodb://mongo:JeYsnjzgdOcWDfnWvayOJMPZpmOkrBxs@viaduct.proxy.rlwy.net:49181",
  export const PREFIX = ','
export const OWNER = ['94775473247']

};
