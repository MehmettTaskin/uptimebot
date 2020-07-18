require("express")().listen(1343);

const db = require("quick.db");
const discord = require("discord.js");
const client = new discord.Client({ disableEveryone: true });
client.login("");
const fetch = require("node-fetch");
const fs = require('fs')

setInterval(() => {
  var links = db.get("linkler");
  if(!links) return;
  var linkA = links.map(c => c.url)
  linkA.forEach(link => {
    try {
      fetch(link)
    } catch(e) { console.log("" + e) };
  })
  console.log("Pong! Requests sent")
}, 30000)

client.on("message", message => {
  if(message.author.bot) return;
  var spl = message.content.split(" ");
  if(spl[0] == "p!ekle") {
  var link = spl[1]
  fetch(link).then(() => {
    message.channel.send("eklend");
    fs.appendFileSync("./logs.txt", message.author.tag + " ( " + message.author.id + " ) added website: " + link+"\n")
    db.push("linkler", { url: link, owner: message.author.id})
  }).catch(e => {
    return message.channel.send("Hata: " + e)
  })
  }
})