
const Discord = require("discord.js");
const bot = new Discord.Client();
const token = 'NzgyMjAyNzI4ODYzNjI5MzIz.X8IxDw.bLR1MmEcIPCIYABxl-a98oJF4Dw';

const prefix = '!'
const diceRegexExplode = /[0-9]+[td][0-9]+/g;
const diceRegexNormal = /[0-9]+[n][0-9]+/g;

bot.on('ready', () => {
  console.log('bot is ready')
})

bot.login(token)



bot.on('message', async (msg) => {
  //if our message doesnt start with our defined prefix, dont go any further into function
  if(!msg.content.startsWith(prefix)) {
    console.log('no prefix')
    return
  }
  
  //slices off prefix from our message, then trims extra whitespace, then returns our array of words from the message
  const args = msg.content.slice(prefix.length).trim().split(' ')
  
  //splits off the first word from the array, which will be our command
  const command = args.shift().toLowerCase()
  const firstArgumentStr =  args.shift().toLowerCase();
  //log the command
  console.log('command: ', command)
  //log any arguments passed with a command
  console.log(args)



  if(command === "eon") {

    //Roll OB exploding Dice
    if(firstArgumentStr.search(diceRegexExplode) != -1){

        var message = msg.content;
        var diceDescriptor = firstArgumentStr.split(/[td]/);
        //var numrolls = parseInt(args[0]);
        var numrolls = parseInt(diceDescriptor[0]);
        var dicekind = parseInt(diceDescriptor[1]);
        var outroll = "" + parseInt(args[0]) + "T" +dicekind + "  : ";
        var plus = 0;
        var times = 0; 
        //var ids = msg.split(/--/)[1];
        /*
        if(msg.search(/\+/g)!=-1){
            plus = parseInt(msg.split("+")[1]);
        }
        else if(msg.search(/\*//*g)!=-1){
            times = parseInt(msg.split("*")[1]);
        }
        */

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
        var outroll = "" + parseInt(args[0]) + "T" +dicekind + "  : ";

        count = 0;
        var total = 0;
        var roll = 0;
        var output = "" + outroll + "" ;
        while (count < numrolls) {
            roll = Math.floor(Math.random() * dicekind) + 1;
            
            total += roll;
            count ++;
            output = output + "," + roll;

            
        }
        console.log("summa : " + (total) + "");

        msg.channel.send( output +  " Total: " + (total) + " ");
    }
    else{
        //Error Message
        msg.channel.send( "Incocrecct command: " + firstArgumentStr);
  }
 }

  
})

