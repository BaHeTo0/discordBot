var profiles = require("./profiles");
var timers = require("./timers");

var bot;
var initialize = function(b){
  bot = b;
}
module.exports.initialize = initialize;

var MONSTER = {
  stats: {
    str: 1,
    agi: 1,
    int: 1
  },
  loot:{
    xp: 1,
    gold: 1,
    gem: true
  },
}
var MONSTER_EVENT = {
   monster : MONSTER,
   players : [],
   timeLeft : 0
}

module.exports.MONSTER_EVENT = MONSTER_EVENT;
module.exports.MONSTER = MONSTER;

var fightMonster = function(){
  if(MONSTER_EVENT.players == undefined || MONSTER_EVENT.players.length === 0){
    profiles.lootAllPlayers();
  }else{
    var totalPlayerStats = getTotalPlayerStats();
    var points = 0;
    if(totalPlayerStats.str > MONSTER.stats.str){
      points++;
    }
    if(totalPlayerStats.agi > MONSTER.stats.agi){
      points++;
    }
    if(totalPlayerStats.int > MONSTER.stats.int){
      points++;
    }

    if(points > 1){
      var xp = Math.ceil(MONSTER.loot.xp/MONSTER_EVENT.players.length);
      var gold = Math.ceil(MONSTER.loot.xp/MONSTER_EVENT.players.length);
      MONSTER_EVENT.players.forEach(function(prof){
        prof.xp += xp;
        prof.gold += gold;
        tell(profiles.getUserById(prof.id)+" looted "+xp+" XP and "+gold+" gold from the monster!");
        profiles.save();
      });
      if(MONSTER.loot.gem){
        var luckyOne = Math.floor(Math.random()*MONSTER_EVENT.players.length) - 1;
        MONSTER.players[luckyOne].gem++;
        tell(profiles.getUserById(MONSTER.players[luckyOne].id)+" got lucky and also stole the monsters gem!");
        profiles.save();
      }
    }else{
      MONSTER_EVENT.players.forEach(function(prof){
        profiles.lootPlayer(prof);
      });
    }
  }
}
module.exports.fightMonster = fightMonster;

var tell = function(msg){
  bot.guilds.forEach(function(guild){
    guild.channels.forEach(function(gc){
      if(gc.type === "text"){
        if(gc.name === "galdam_town"){
          gc.send(msg);
        }
      }
    });
  });
}
module.exports.tell = tell;

var joinFight = function(prof){
  MONSTER_EVENT.players.push(prof);
}
module.exports.joinFight = joinFight;

var getTotalPlayerStats = function(){
  console.log("total player stats gets called");
  var toReturn = {
    str: 0,
    agi: 0,
    int: 0
  }
    MONSTER_EVENT.players.forEach(function(player){
      toReturn.str += player.stats.str;
      console.log(toReturn.str +" + "+ player.stats.str);
      toReturn.agi += player.stats.agi;
      console.log(toReturn.agi +" + "+ player.stats.agi);
      toReturn.int += player.stats.int;
      console.log(toReturn.int +" + "+ player.stats.int);
    });
    console.log(toReturn);
  return toReturn;
}
module.exports.getTotalPlayerStats = getTotalPlayerStats;

var spawnCommonMonster = function(){
  var totalStats = profiles.totalStats();
  MONSTER.stats.str = Math.ceil((totalStats.str*(5/100)) + (Math.random()*(totalStats.str*(5/100))));
  MONSTER.stats.agi = Math.ceil((totalStats.agi*(5/100)) + (Math.random()*(totalStats.agi*(5/100))));
  MONSTER.stats.int = Math.ceil((totalStats.int*(5/100)) + (Math.random()*(totalStats.int*(5/100))));

  MONSTER.loot.xp = 2 + Math.floor(Math.random()*8);
  MONSTER.loot.gold = 4 + Math.floor(Math.random()*16);
  MONSTER.loot.gem = false;

  MONSTER_EVENT.timeLeft = 10;
  MONSTER_EVENT.players = [];

  var toTell = "A common monster is attacking the town!";
  toTell += "\nIts stats are: ";
  toTell += "\n    Strength: "+MONSTER.stats.str;
  toTell += "\n    Agility: "+MONSTER.stats.agi;
  toTell += "\n    Intelligence: "+MONSTER.stats.int;
  toTell += "\nIts loot contains: ";
  toTell += "\n    - "+MONSTER.loot.xp+" XP";
  toTell += "\n    - "+MONSTER.loot.gold+ " gold";
  if(MONSTER.loot.gem){
    toTell += "\n    - and a magnificent gem!";
  }else{
    toTell += "\n    - and no gem!";
  }
  toTell += "\n";
  toTell += "\nUse the command \"/join\" to join the fight against it or it will dissapear in "+MONSTER_EVENT.timeLeft+" minutes!";

  tell(toTell);
}
module.exports.spawnCommonMonster = spawnCommonMonster;

var spawnRareMonster = function(){
  var totalStats = profiles.totalStats();
  MONSTER.stats.str = Math.ceil((totalStats.str*(10/100)) + (Math.random()*(totalStats.str*(15/100))));
  MONSTER.stats.agi = Math.ceil((totalStats.agi*(10/100)) + (Math.random()*(totalStats.agi*(15/100))));
  MONSTER.stats.int = Math.ceil((totalStats.int*(10/100)) + (Math.random()*(totalStats.int*(15/100))));

  MONSTER.loot.xp = 5 + Math.floor(Math.random()*20);
  MONSTER.loot.gold = 10 + Math.floor(Math.random()*25);
  MONSTER.loot.gem = false;

  MONSTER_EVENT.timeLeft = 10;
  MONSTER_EVENT.players = [];

  var toTell = "A rare monster is attacking the town!";
  toTell += "\nIts stats are: ";
  toTell += "\n    Strength: "+MONSTER.stats.str;
  toTell += "\n    Agility: "+MONSTER.stats.agi;
  toTell += "\n    Intelligence: "+MONSTER.stats.int;
  toTell += "\nIts loot contains: ";
  toTell += "\n    - "+MONSTER.loot.xp+" XP";
  toTell += "\n    - "+MONSTER.loot.gold+ " gold";
  if(MONSTER.loot.gem){
    toTell += "\n    - and a magnificent gem!";
  }else{
    toTell += "\n    - and no gem!";
  }
  toTell += "\n";
  toTell += "\nUse the command \"/join\" to join the fight against it or it will dissapear in "+MONSTER_EVENT.timeLeft+" minutes!";

  tell(toTell);
}
module.exports.spawnRareMonster = spawnRareMonster;


var spawnEpicMonster = function(){
  var totalStats = profiles.totalStats();
  MONSTER.stats.str = Math.ceil((totalStats.str*(20/100)) + (Math.random()*(totalStats.str*(30/100))));
  MONSTER.stats.agi = Math.ceil((totalStats.agi*(20/100)) + (Math.random()*(totalStats.agi*(30/100))));
  MONSTER.stats.int = Math.ceil((totalStats.int*(20/100)) + (Math.random()*(totalStats.int*(30/100))));

  MONSTER.loot.xp = 20 + Math.floor(Math.random()*40);
  MONSTER.loot.gold = 35 + Math.floor(Math.random()*45);
  MONSTER.loot.gem = true;

  MONSTER_EVENT.timeLeft = 5;
  MONSTER_EVENT.players = [];

  var toTell = "An EPIC monster is attacking the town!";
  toTell += "\nIts stats are: ";
  toTell += "\n    Strength: "+MONSTER.stats.str;
  toTell += "\n    Agility: "+MONSTER.stats.agi;
  toTell += "\n    Intelligence: "+MONSTER.stats.int;
  toTell += "\nIts loot contains: ";
  toTell += "\n    - "+MONSTER.loot.xp+" XP";
  toTell += "\n    - "+MONSTER.loot.gold+ " gold";
  if(MONSTER.loot.gem){
    toTell += "\n    - and a magnificent gem!";
  }else{
    toTell += "\n    - and no gem!";
  }
  toTell += "\n";
  toTell += "\nUse the command \"/join\" to join the fight against it or it will dissapear in "+MONSTER_EVENT.timeLeft+" minutes!";

  tell(toTell);
}
module.exports.spawnEpicMonster = spawnEpicMonster;


var spawnLegendaryMonster = function(){
  var totalStats = profiles.totalStats();
  MONSTER.stats.str = Math.ceil((totalStats.str*(50/100)) + (Math.random()*(totalStats.str*(40/100))));
  MONSTER.stats.agi = Math.ceil((totalStats.agi*(50/100)) + (Math.random()*(totalStats.agi*(40/100))));
  MONSTER.stats.int = Math.ceil((totalStats.int*(50/100)) + (Math.random()*(totalStats.int*(40/100))));

  MONSTER.loot.xp = 50 + Math.floor(Math.random()*100);
  MONSTER.loot.gold = 100 + Math.floor(Math.random()*200);
  MONSTER.loot.gem = true;

  MONSTER_EVENT.timeLeft = 5;
  MONSTER_EVENT.players = [];

  var toTell = "A LEGENDARY monster is attacking the town!";
  toTell += "\nIts stats are: ";
  toTell += "\n    Strength: "+MONSTER.stats.str;
  toTell += "\n    Agility: "+MONSTER.stats.agi;
  toTell += "\n    Intelligence: "+MONSTER.stats.int;
  toTell += "\nIts loot contains: ";
  toTell += "\n    - "+MONSTER.loot.xp+" XP";
  toTell += "\n    - "+MONSTER.loot.gold+ " gold";
  if(MONSTER.loot.gem){
    toTell += "\n    - and a magnificent gem!";
  }else{
    toTell += "\n    - and no gem!";
  }
  toTell += "\n";
  toTell += "\nUse the command \"/join\" to join the fight against it or it will dissapear in "+MONSTER_EVENT.timeLeft+" minutes!";

  tell(toTell);
}
module.exports.spawnLegendaryMonster = spawnLegendaryMonster;

var spawnRandomMonster = function(){
  var roll = Math.floor(Math.random()*100);
  if(roll >= 98){
    spawnLegendaryMonster();
  }else if(roll >= 85){
    spawnEpicMonster();
  }else if(roll >= 50){
    spawnRareMonster();
  }else{
    spawnCommonMonster();
  }
}
module.exports.spawnRandomMonster = spawnRandomMonster;
