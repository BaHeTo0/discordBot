var profiles = require("./profiles");
var monster = require("./monster");

module.exports.onCommand = function(msg, cmd, args){

  //roll
  if(cmd === "roll"){
    if(args.length === 0){
      var r =  Math.floor(Math.random()*100);
      msg.channel.send(msg.author+" has rolled "+r+" out of 100");
    }else{
      if(args.length === 1){
        var max = parseInt(args[0]);
        var r =  Math.floor(Math.random()*max);
        msg.channel.send(msg.author+" has rolled "+r+" out of "+max);
      }else if(args.length === 2){
        var max = parseInt(args[1]);
        var times = parseInt(args[0]);
        if(times > 20){
          times = 20;
        }

        for(var i = 0; i < times; i++){
            var r =  Math.floor(Math.random()*max);
            msg.channel.send(msg.author+" has rolled "+r+" out of "+max);
        }
      }
    }
  }
  if(cmd === "profile"){
    if(args.length === 0){
      var id = msg.author.id;
      var prof = profiles.getProfile(id);
      var toSend = msg.author+"\'s profile:\nLevel: "+prof.level+"\nXP: "+prof.xp+"/"+prof.xpNeed+"\nGold: "+prof.gold+"\nGems: "+prof.gems+"\nStats:\n    Strength: "+prof.stats.str+"\n    Agility: "+prof.stats.agi+"\n    Intelligence: "+prof.stats.int+"\nTags: ";
      if(prof.tags === undefined || prof.tags.length === 0){
        toSend = toSend+"Sorry you have none, use /tag add <gameName> to add some";
      }else{
        prof.tags.forEach(function(tag){
          toSend = toSend + "\n    "+tag;
        });
      }
      msg.channel.send(toSend);
    }else if(args.length === 1){
      var id = profiles.getIdByName(args[0]);
      var prof = profiles.getProfile(id);
      if(prof==undefined){
        //taggedUser
        var taggedUser = profiles.getUserByTag(args[0]);
        prof = profiles.getProfile(taggedUser.id);
        if(prof==undefined){
          return;
        }

        var toSend = taggedUser+"\'s profile:\nLevel: "+prof.level+"\nXP: "+prof.xp+"/"+prof.xpNeed+"\nGold: "+prof.gold+"\nGems: "+prof.gems+"\nStats:\n    Strength: "+prof.stats.str+"\n    Agility: "+prof.stats.agi+"\n    Intelligence: "+prof.stats.int+"\nTags: ";
        if(prof.tags === undefined || prof.tags.length === 0){
          toSend = toSend+"Sorry you have none, use /tag add <gameName> to add some";
        }else{
          prof.tags.forEach(function(tag){
            toSend = toSend + "\n    "+tag;
          });
        }
        msg.channel.send(toSend);

        return;
      }
      var toSend = profiles.getUserById(id)+"\'s profile:\nLevel: "+prof.level+"\nXP: "+prof.xp+"/"+prof.xpNeed+"\nGold: "+prof.gold+"\nGems: "+prof.gems+"\nStats:\n    Strength: "+prof.stats.str+"\n    Agility: "+prof.stats.agi+"\n    Intelligence: "+prof.stats.int+"\nTags: ";
      if(prof.tags === undefined || prof.tags.length === 0){
        toSend = toSend+"Sorry you have none, use /tag add <gameName> to add some";
      }else{
        prof.tags.forEach(function(tag){
          toSend = toSend + "\n    "+tag;
        });
      }
      msg.channel.send(toSend);
    }
  }
  if(cmd === "summon"){
    if(args.length === 0){
      msg.channel.send(msg.author+" use \"/summon <gameName>\" to summon players!");
    }else if(args.length === 1){
      var tag = args[0];
      var profs = profiles.getProfiles;
      var summoning = profiles.getTagged(tag);

      var toSend = msg.author+" is summoning the following players: ";
      summoning.forEach(function(prof){
        toSend = toSend+" "+profiles.getUserById(prof.id)+",";
      });
      toSend = toSend+" to play "+tag+"!";
      msg.channel.send(toSend);
    }
  }
  if(cmd === "tag"){
    if(args.length !== 2){
      msg.channel.send(msg.author+"\nUse \"/tag add <gameName>\" to add a game to your tag list!\nUse \"/tag remove <gameName>\" to remove a tag from your tag list!");
    }else{
      var user = msg.author;
      var prof = profiles.getProfile(user.id);

      if(args[0] === "add"){
          var hasIt = false;

          if(!(prof.tags == undefined || prof.tags.length === 0)){
            prof.tags.forEach(function(tag){
              if(tag === args[1]){
                hasIt = true;
              }
            });
          }
          if(!hasIt){
            prof.tags.push(args[1]);
            msg.channel.send(msg.author+" the tag \""+args[1]+"\" was added to your tag list!");
            profiles.save();
          }
      }else if(args[0] === "remove"){
        var hasIt = false;
        var index = 0;

        if(!(prof.tags == undefined || prof.tags.length === 0)){
          prof.tags.forEach(function(tag){
            if(tag === args[1]){
              hasIt = true;
              index = prof.tags.indexOf(tag);
              return;
            }
          });
          if(hasIt){
            prof.tags.splice(index,1);
            msg.channel.send(msg.author+" \""+args[1]+"\" was removed from your tag list!");
            profiles.save();
          }
        }

      }
    }
  }
  if(cmd === "help"){
    var toSend = msg.author+"";
    toSend = toSend + "\n\"/help\" brings you here obviously!";
    toSend = toSend + "\n\"/profile\" shows your profile!";
    toSend = toSend + "\n\"/profile <name>\" shows someone else\'s profile!";
    toSend = toSend + "\n\"/summon <gameName>\" summons everyone who has the game in his tag list!";
    toSend = toSend + "\n\"/tag add <gameName>\" adds the game in your tag list!"
    toSend = toSend + "\n\"/tag remove <gameName>\" removes the game from your tag list!"
    toSend = toSend + "\n\"/join\" makes you join the party to fight the monster!"

    msg.channel.send(toSend);
  }
  if(cmd === "join"){
    console.log(monster);
    if(args.length === 0){
      if(monster.MONSTER_EVENT.timeLeft>0){
        var prof = profiles.getProfile(msg.author.id);
        var alreadyIn = false;
        if(!(monster.MONSTER_EVENT.players == undefined || monster.MONSTER_EVENT.players.length === 0)){
          monster.MONSTER_EVENT.players.forEach(function(player){
            if(player.id === prof.id){
              alreadyIn = true;
            }
          });
        }
        if(!alreadyIn){
          monster.MONSTER_EVENT.players.push(prof);
          console.log("trying to call the function");
          var st = monster.getTotalPlayerStats();
          console.log("passed the function call");
          var toSend = profiles.getUserById(prof.id)+" has joined the fight against the monster!";
          toSend += "\nParty members: ";
          monster.MONSTER_EVENT.players.forEach(function(p){
            toSend += "\n    - "+profiles.getUserById(p.id);
          });
          toSend += "\n";
          toSend += "\nThe party total stats are now: ";
          toSend += "\n    Strength: "+st.str;
          toSend += "\n    Agility: "+st.agi;
          toSend += "\n    Intelligence: "+st.int;
          toSend += "\n";
          toSend += "\nVersus the monster\'s: ";
          toSend += "\n    Strength: "+monster.MONSTER.stats.str;
          toSend += "\n    Agility: "+monster.MONSTER.stats.agi;
          toSend += "\n    Intelligence: "+monster.MONSTER.stats.int;
          monster.tell(toSend);
        }
      }else{
        msg.channel.send(msg.author+" there is no monster at the moment!");
      }
    }
  }

}
