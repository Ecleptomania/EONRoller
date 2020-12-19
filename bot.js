
const auth = require('./auth.json'); //(with path)
const commandWords = require('./commandWords.json');
const hit_tables = require('./hit_tables.json');
const damage_tables = require('./damage_tables.json');

const Discord = require("discord.js");
const bot = new Discord.Client();
const token = auth.token;
const prefix = commandWords.prefix;
const diceRegexExplode = /[0-9]+[td][0-9]+/g;
const diceRegexNormal = /[0-9]+[n][0-9]+/g;
const d100DiceKind = 100;
const d10Dicekind = 10;
const yttreSkadanLimit = 9;

var keepHitType =  "hugg";
var keepHitArea = "ansikte";

bot.on('ready', () => {
  console.log('bot is ready')
})

bot.login(token)



bot.on('message', async (msg) => {
  //if our message doesnt start with our defined prefix, dont go any further into function
  if(!msg.content.startsWith(prefix)) {
    //be careful, this filters away the bots own messages as well
    return
  }
  
  //slices off prefix from our message, then trims extra whitespace, then returns our array of words from the message
  const args = msg.content.slice(prefix.length).trim().split(' ')
  console.log(args)
  //splits off the first word from the array, which will be our command
  const command = args.shift().toLowerCase()
  const firstArgumentStr =  args.shift().toLowerCase();
  //log the command
  console.log('command: ', command)
  //log any arguments passed with a command


  if(command === "eon") {

    //Roll OB exploding Dice
    if(firstArgumentStr.search(diceRegexExplode) != -1){

        var message = msg.content;
        var diceDescriptor = firstArgumentStr.split(/[td]/);
        //var numrolls = parseInt(args[0]);
        var numrolls = parseInt(diceDescriptor[0]);
        var dicekind = parseInt(diceDescriptor[1]);
        var outroll = "" + parseInt(numrolls) + "T" +dicekind + "  : ";
        //var lus = 0;
        //var times = 0; 
        var count = 0;
        var total = 0;
        var roll = 0;
        var first = true;

        var output = "" + outroll + "" ;
        while (count < numrolls) {
            roll = Math.floor(Math.random() * dicekind) + 1;
            if (roll === dicekind) {
                if(first == true){
                    output = output + "["+ dicekind+ "]";
                    first = false;
                    numrolls = numrolls + 2;
                }
                else{
                    output = output + ",["+ dicekind+ "]";
                    numrolls = numrolls + 2;
                    }
            } else {
                total += roll;
                if(first == true){
                    output = output + roll;
                    first = false;
                    }
                else{
                    output = output + "," + roll;
                    }
                }
                count++;
            }

            console.log("summa : " + (total) + "");

            msg.channel.send( output +  " Total: " + (total) + " ");
            

    }
    else if(firstArgumentStr.search(diceRegexNormal) != -1) {
        //Roll Normal Dice
        var message = msg.content;
        var diceDescriptor = firstArgumentStr.split(/[n]/);
        //var numrolls = parseInt(args[0]);
        var numrolls = parseInt(diceDescriptor[0]);
        var dicekind = parseInt(diceDescriptor[1]);
        var outroll = "" + parseInt(firstArgumentStr[0]) + "T" +dicekind + "  : ";

        count = 0;
        var total = 0;
        var roll = 0;
        var output = "" + outroll + "" ;
        var first = true;
        while (count < numrolls) {
            roll = Math.floor(Math.random() * dicekind) + 1;
            
            total += roll;
            count ++;
            if (first){
                output = output + " " + roll;
                first = false;
            }else{
                output = output + "," + roll;
            }
            
        }
        console.log("summa : " + (total) + "");

        msg.channel.send( output +  " Total: " + (total) + " ");
    } else if(firstArgumentStr === commandWords.hitCommandWord)
    {

        if (args.length < 2){
                    msg.channel.send( "Incocrecct Hit Syntax: Missing arguments \n The hit command needs a hit type and an attack angle:"
                        + "\n \"!eon hit \'hit type\' \'attack angle\' \"");
                    return;
        }
        const attackKind = args.shift().toLowerCase();
        const attackAngle = args.shift().toLowerCase();

        if (!((attackKind === commandWords.huggCommandWord)||(attackKind === commandWords.stickCommandWord)))
        {
            msg.channel.send( "Incocrecct Hit Syntax: Hit type not valid \n Hit types are: \'"+ commandWords.huggCommandWord + "\'' and \'" + commandWords.stickCommandWord + "\'");
            return;
       }


        if (!((attackAngle === commandWords.normalAttackWord)||(attackAngle === commandWords.highAttackWord)||(attackAngle === commandWords.lowAttackWord)))
        {
            msg.channel.send( "Incocrecct Hit Syntax: Hit Angle not valid \n Hit angles are: \'"+ commandWords.normalAttackWord + "\'' ,  \'" + commandWords.highAttackWord + "\' and \'" + commandWords.lowAttackWord + "\'");
            return;
       }

        roll = Math.floor(Math.random() * d100DiceKind) + 1;

        for (i = 0; i < hit_tables.tables.length; i ++){
            var attackKindTable = hit_tables.tables[i];

            if (attackKindTable.typ === attackKind) {

                const attackTableUsed = attackKindTable.table;
                if (attackTableUsed.name === attackAngle){
                    for (j = 0; j < attackTableUsed.values.length; j ++){
                        var partHit = attackTableUsed.values[j];
                        if (roll <= partHit.maxValue){
                            msg.channel.send( "Du rullade "  + roll + ",  Attackerade: " 
                                + partHit.träffområde + " och träffade: " +  partHit.delområde);
                        return;
                        }
                    }
                }

            }
        }


        msg.channel.send( "Hit command logged: rolled: "  + roll + "");

    }else if(firstArgumentStr === commandWords.damageCommandWord){


        if (keepHitType ===  "-1" || keepHitArea === "-1"){
            msg.channel.send( "Incocrecct command: No previous hit to calculate damage for.");
            return;
        }



        //split of the first word, damage, to get the value to be used as damage
        if (args.length <1){
            msg.channel.send( "Incocrecct damage command, missing arguments. ");
            return;
        }


        var diceDescriptor = args.shift().toLowerCase(); // get the damage value from teh input array
        var totalDamage = parseInt(diceDescriptor);

        for (i = 0; i < damage_tables.tables.length; i ++){
            var damageTable = damage_tables.tables[i];
            console.log("Success  " + damageTable.typ + " : " + keepHitType +" : " + damageTable.delområde + " : " + keepHitArea + " damage: " + totalDamage);    
            if (damageTable.typ === keepHitType) {
                if (damageTable.delområde === keepHitArea) { 

                    var T_damage = 0;
                    var S_damage = 0;
                    var B_damage = 0;
                    var Additions = "no addtional effects";
                    var specificArea = keepHitArea;

                    if (totalDamage <= yttreSkadanLimit){
                        T_damage = damageTable.ytligSkada.trauma;
                        S_damage = damageTable.ytligSkada.smarta;
                        B_damage = damageTable.ytligSkada.blodning;
                    }else{
                        roll = Math.floor(Math.random() * d10Dicekind); // no +1, we want to use this d10 to look up a index.
                        T_damage = Math.floor(totalDamage * damageTable.allvarligaSkador[roll].trauma);
                        S_damage = Math.floor(totalDamage * damageTable.allvarligaSkador[roll].smarta);
                        B_damage = Math.floor(totalDamage * damageTable.allvarligaSkador[roll].blodning);
                        Additions = damageTable.allvarligaSkador[roll].effect;
                        specificArea = damageTable.allvarligaSkador[roll].träffområde;
                    }

                    var response = " You hit " + specificArea +  " for: trauma: " + T_damage + ", smärta: "+ S_damage + ", trauma: " + B_damage + " and caused: " + Additions;
                    msg.channel.send(response);
                    return;

                    
                }
                
            }
        }




    }

    else{
        //Error Message
        msg.channel.send( "Incocrecct command: " + firstArgumentStr);
    }


 }
 } 
) //this ) closes the main bot function, keep it last 


