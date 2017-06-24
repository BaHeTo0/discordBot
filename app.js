var dis = require("discord.js");
var commands = require("./commands");
var profiles = require("./profiles");
var monster = require("./monster");
var jf = require("jsonfile");
var fs = require("fs");

var token = (jf.readFileSync("config.json")).token;
var bot = new dis.Client();

bot.on("ready", function(){
  console.log("\nReady to work!");
  profiles.initialize(bot);
  monster.initialize(bot);
});

bot.on("guildMemberAdd", function(member){
  profiles.createProfile(member.user);
  profiles.save();
});

bot.on("message", function(msg){
  if(msg.auther === bot.user)return;
  if(msg.content.startsWith("/")){
    var msgL = msg.content.toLowerCase().slice(1);
    var words = msgL.split(" ");
    var cmd = words[0];
    var args = words.slice(1);

    commands.onCommand(msg, cmd, args);
  }

});

bot.login(token);
