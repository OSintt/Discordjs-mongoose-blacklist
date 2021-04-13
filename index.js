const DiscordS = require('discord.js-plus');
const Discord = require('discord.js');
const client = new Discord.Client();
const db = require('mongoose');
const Blacklist = require('./schemas.js');
const config = require('./config.json');

////const Blacklist ////
const dbUseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: true,
  useCreateIndex: true
}

const osint = "800972830719344650";
  
client.once("ready", async () => {
  console.log(client.user.username, client.user.discriminator)
  function presence(){
    client.user.setPresence({
        status:"online",
        activity: {
            name: "www.xxxhackersquad.gq | Ness <3",
            type: "PLAYING"
        }
    });
  }
  presence();
  await db.connect(config.uri, dbUseOptions).then(console.log("Active"));

});
client.on("message", async message => {
  /* const */
  const blk = await Blacklist.findOne({userId: message.author.id});

  const args = message.content.split(' ').slice(1)

  function noperm() { 
    let emb = new Discord.MessageEmbed()
      .setDescription("No posee el permiso de ejecutar este comando.")
      .setColor("RED");
    message.channel.send(emb);
  }
  /* bot */
  if (message.content.startsWith("xblacklistin")){
    if (message.author.id === osint){
      let user = message.mentions.members.first();
      if (!user) return message.channel.send("No se especificó ningún usuario");
      let reason = args.slice(1).join(" ");
      if (!reason) return message.channel.send("No se ha proporcionado una razón válida");
      
      let blacklist = new Blacklist({
        _id: db.Types.ObjectId(),
        username: user.user.username,
        userId: user.user.id,
        reason: reason,
        reportedBy: message.author.username,
        reportedById: message.author.id
      });

      blacklist.save().catch(err => console.log(err));
      message.channel.send(`${user} fue ingresado a la blacklist!`)
    }else{
      message.channel.send("NUNCA!!!!!!!!");
    }
  }
  if (message.content.startsWith("xblacklistout")){
    if (message.author.id === osint){
      if (args == "all") return (
        await Blacklist.deleteMany().then(
        message.channel.send("Se han eliminado todos los usuarios de la blacklist!"))
      );
      let user = message.mentions.members.first();
      if (!user) return message.channel.send("No se especificó ningún usuario");
      await Blacklist.deleteMany({userId: user.user.id});
      message.channel.send(`Se ha eliminado a ${user} de la blacklist!`);
  }
  }
  if (message.content === "xblacklist"){
    let lista = await Blacklist.find();
    let bl = lista.map(user => `**User:** ${user.username} | **Reason**: ${user.reason} | ${user.userId}`).join("\n") || "No hay nadie en la blacklist";

    message.channel.send(new Discord.MessageEmbed()
    .setTitle("Blacklist")
    .setDescription(`${bl}`));
  }
});

client.login(config.token)
