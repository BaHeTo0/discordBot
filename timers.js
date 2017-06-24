var schedule = require('node-schedule');
var monsters = require("./monster");

var timeTillSpawn = 0;
var spawnTried = false;
var killed = false;

setInterval(function(){
  if(timeTillSpawn>0){
    timeTillSpawnT--;
  }else if(timeTillSpawn===0){
    if(!spawnTried){
      var chance = Math.floor(Math.random()*100);
      if(chance >= 0){
        monsters.spawnRandomMonster();
      }
      spawnTried=true;
    }else{
      if(!killed){
        if(monsters.MONSTER_EVENT.timeLeft > 0){
          console.log("monster has "+monsters.MONSTER_EVENT.timeLeft+" minutes left");
          monsters.MONSTER_EVENT.timeLeft--;
          if(monsters.MONSTER_EVENT.timeLeft > 1){
            monsters.tell("The monster will be done with its evil doing in "+  monsters.MONSTER_EVENT.timeLeft+" minutes");
          }else{
            monsters.tell("The monster will be done with its evil doing in 1 minute");
          }
        }else{
          console.log("fighting the monster");
          monsters.fightMonster();
          killed = true;
        }
      }
    }
  }
}, 60000);

var j = schedule.scheduleJob('59 * * * *', function(){
  timeTillSpawnTry = 1 + (Math.floor(Math.random()*0));
  killed = false;
  spawnTried = false;
});
