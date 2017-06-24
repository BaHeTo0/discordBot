var jf = require("jsonfile");
var fs = require("fs");
var monster = require("./monster");

var file = "gamers.json";
var profiles = [];
var bot;

module.exports.initialize = function(b){
  bot = b;
  if(!fs.existsSync(file)){
    fs.open("./gamers.json","w",function(err){
      console.log(err);
    });
    b.guilds.forEach(function(guild){
      guild.members.forEach(function(member){
        var user = member.user;
        createProfile(user);
      });
    });
    save();
  }else{
    load();

    b.guilds.forEach(function(guild){
      guild.members.forEach(function(member){
        var user = member.user;
        var isNewUser = true;

        profiles.forEach(function(prof){
          if(user.id === prof.id){
            isNewUser = false;
          }
        });
        if(isNewUser){
          createProfile(user);
        }
      });
    });

  }
}


var updateLevels = function(){
  profiles.forEach(function(prof){
    var maxXP = 10 + (prof.level*5);
    while(prof.xp >= maxXP){
      prof.level++;
      prof.xp = prof.xp - maxXP;
      maxXP +=5;
      prof.stats.str++;
      prof.stats.agi++;
      prof.stats.int++;
      monster.tell(getUserById(prof.id)+" has hit level  "+prof.level+", congratulations!");
    }
  });
}
module.exports.updateLevels = updateLevels;

var load = function(){
  jf.readFile(file, function(err, obj) {
    profiles = obj;
  })
}
module.exports.load = load;

var save = function(){
  updateLevels();

  jf.writeFileSync(file,profiles);
}
module.exports.save = save;

var lootAllPlayers = function(){
  monster.tell("No brave hero tied to stop the monster from looting the townsmen gold @here !");
  profiles.forEach(function(prof){
    lootPlayer(prof);
  });
}
module.exports.lootAllPlayers = lootAllPlayers;

var lootPlayer = function(player){
  player.gold -= Math.floor(player.gold*(5/100));
  save();
  monster.tell("The monster stole "+ Math.floor(player.gold*(5/100)+" gold from "+getUserById(player.id)));
}
module.exports.lootPlayer = lootPlayer;

var getIdByName = function(name){
  var id = null;
  bot.guilds.forEach(function(guild){
    guild.members.forEach(function(member){
      var user = member.user;
      if(user.username.toLowerCase() === name){
        id = user.id;
      }
    });
  });
  return id;
}
module.exports.getIdByName = getIdByName;

var getNameById = function(id){
  var name = null;
  bot.guilds.forEach(function(guild){
    guild.members.forEach(function(member){
      var user = member.user;
      if(user.id === id){
        name = user.username;
      }
    });
  });
  return name;
}
module.exports.getNameById = getNameById;

var getUserById = function(id){
  var user = null;
  bot.guilds.forEach(function(guild){
    guild.members.forEach(function(member){
      var userr = member.user;
      if(userr.id === id){
        user = userr;
      }
    });
  });
  return user;
}
module.exports.getUserById = getUserById;

var getUserByTag = function(tag){
  var user = null;
  bot.guilds.forEach(function(guild){
    guild.members.forEach(function(member){
      var userr = member.user;
      var userrTAG = "<@"+userr.id+">";
      if(userrTAG === tag){
        user = userr;
      }
    });
  });
  return user;
}
module.exports.getUserByTag = getUserByTag;

var getProfile = function(id){
  var foundProf = null;
  profiles.forEach(function(prof){
    if(prof.id === id){
      foundProf = prof;
      return;
    }
  });
  return foundProf;
}
module.exports.getProfile = getProfile;

module.exports.getProfiles = profiles;

var createProfile = function(user){

  var stats = {
    str: 1,
    agi: 1,
    int: 1
  }

  var profile = {
    id: user.id,
    level: 1,
    xp: 0,
    xpNeed: 10,
    gold: 0,
    gems: 0,
    stats: stats,
    tags: []
  }
  profiles.push(profile);
}
module.exports.createProfile = createProfile;

var getTagged = function(tag){
  var tagged = [];
  profiles.forEach(function(prof){
    if(!(prof.tags == undefined || prof.tags.length === 0)){
      prof.tags.forEach(function(tagG){
        if(tagG === tag){
          tagged.push(prof);
        }
      });
    }
  });
  return tagged;
}
module.exports.getTagged = getTagged;

var totalStats = function(){
  var stats = {
    str:0,
    agi:0,
    int:0
  };
  profiles.forEach(function(prof){
    stats.str += prof.stats.str;
    stats.agi += prof.stats.agi;
    stats.int += prof.stats.int;
  });
  return stats;
}
module.exports.totalStats = totalStats;
