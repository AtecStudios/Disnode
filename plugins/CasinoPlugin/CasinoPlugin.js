const numeral = require('numeral');
const logger = require('disnode-logger');
const Countdown = require('countdownjs');
const CasinoUtils = require('./CasinoUtils');
const Blackjack = require('./Blackjack');
const dateformat = require('dateformat');
const ua = require('universal-analytics');
class CasinoPlugin {
  constructor() {
    var self = this;
    this.wheelItems = [
      {display:":white_circle: :zero:", type: 0},
      {display:":red_circle: :one:", type: 1},
      {display:":red_circle: :two:", type: 1},
      {display:":black_circle: :three:", type: 2},
      {display:":black_circle: :four:", type: 2},
      {display:":red_circle: :five:", type: 1},
      {display:":red_circle: :six:", type: 1},
      {display:":black_circle: :seven:", type: 2},
      {display:":black_circle: :eight:", type: 2},
      {display:":red_circle: :nine:", type: 1},
      {display:":red_circle: :keycap_ten:", type: 1},
      {display:":black_circle: :one: :one:", type: 2},
      {display:":black_circle: :one: :two:", type: 2},
      {display:":red_circle: :one: :three:", type: 1},
      {display:":red_circle: :one: :four:", type: 1},
      {display:":black_circle: :one: :five:", type: 2},
      {display:":black_circle: :one: :six:", type: 2},
      {display:":red_circle: :one: :seven:", type: 1},
      {display:":red_circle: :one: :eight:", type: 1},
      {display:":black_circle: :one: :nine:", type: 2},
      {display:":black_circle: :two: :zero:", type: 2},
      {display:":red_circle: :two: :one:", type: 1},
      {display:":red_circle: :two: :two:", type: 1},
      {display:":black_circle: :two: :three:", type: 2},
      {display:":black_circle: :two: :four:", type: 2},
      {display:":red_circle: :two: :five:", type: 1},
      {display:":red_circle: :two: :six:", type: 1},
      {display:":black_circle: :two: :seven:", type: 2},
      {display:":black_circle: :two: :eight:", type: 2},
      {display:":red_circle: :two: :nine:", type: 1},
      {display:":red_circle: :three: :zero:", type: 1},
      {display:":black_circle: :three: :one:", type: 2},
      {display:":black_circle: :three: :two:", type: 2},
      {display:":red_circle: :three: :three:", type: 1},
      {display:":red_circle: :three: :four:", type: 1},
      {display:":black_circle: :three: :five:", type: 2},
      {display:":black_circle: :three: :six:", type: 2}
    ]
    self.slotItems = [
      {item:":cherries:"},{item:":cherries:"},{item:":cherries:"},{item:":cherries:"},{item:":cherries:"},
      {item:":cherries:"},{item:":cherries:"},{item:":cherries:"},{item:":cherries:"},{item:":cherries:"},
      {item:":cherries:"},{item:":cherries:"},{item:":cherries:"},{item:":cherries:"},{item:":cherries:"},
      {item:":cherries:"},{item:":cherries:"},{item:":cherries:"},{item:":cherries:"},{item:":cherries:"},
      {item:":third_place:"},{item:":third_place:"},{item:":third_place:"},{item:":third_place:"},{item:":third_place:"},
      {item:":third_place:"},{item:":third_place:"},{item:":third_place:"},{item:":third_place:"},{item:":third_place:"},
      {item:":third_place:"},{item:":third_place:"},{item:":third_place:"},{item:":third_place:"},{item:":third_place:"},
      {item:":second_place:"},{item:":second_place:"},{item:":second_place:"},{item:":second_place:"},{item:":second_place:"},
      {item:":second_place:"},{item:":second_place:"},{item:":second_place:"},{item:":second_place:"},{item:":second_place:"},
      {item:":first_place:"},{item:":first_place:"},{item:":first_place:"},{item:":first_place:"},{item:":first_place:"},
      {item:":100:"},{item:":100:"},{item:":100:"},{item:":100:"},{item:":key:"}
    ]
    this.store = [
      {cost: 200, type:0, amount: 1000, item: "Instant $1,000"},
      {cost: 100000, type:1, amount: 50, item: "Add $50 to your income"},
    ]
    this.cratesys = {
      crates: [
        {
          name: "Basic",
          cost: 1,
          items: [
            {item:"$10,000", type: 0, amount: 10000},
            {item:"$25,000", type: 0, amount: 25000},
            {item:"$50,000", type: 0, amount: 50000},
            {item:"50XP", type: 1, amount: 50},
            {item:"100XP", type: 1, amount: 100},
            {item:"150XP", type: 1, amount: 150}
          ]
        },
        {
          name: "Good",
          cost: 5,
          items: [
            {item:"$50,000", type: 0, amount: 50000},
            {item:"$75,000", type: 0, amount: 75000},
            {item:"$100,000", type: 0, amount: 100000},
            {item:"150XP", type: 1, amount: 150},
            {item:"250XP", type: 1, amount: 250},
            {item:"350XP", type: 1, amount: 350}
          ]
        },
        {
          name: "Great",
          cost: 25,
          items: [
            {item:"$100,000", type: 0, amount: 100000},
            {item:"$150,000", type: 0, amount: 150000},
            {item:"$200,000", type: 0, amount: 200000},
            {item:"1000XP", type: 1, amount: 1000},
            {item:"1500XP", type: 1, amount: 1500},
            {item:"2000XP", type: 1, amount: 2000}
          ]
        },
        {
          name: "Epic",
          cost: 75,
          items: [
            {item:"$150,000", type: 0, amount: 150000},
            {item:"$200,000", type: 0, amount: 200000},
            {item:"$225,000", type: 0, amount: 225000},
            {item:"1500XP", type: 1, amount: 1500},
            {item:"2000XP", type: 1, amount: 2000},
            {item:"2250XP", type: 1, amount: 2250}
          ]
        },
        {
          name: "Ultimate",
          cost: 100,
          items: [
            {item:"$1,000,000", type: 0, amount: 1000000},
            {item:"10000XP", type: 1, amount: 10000},
            {item:"1 Income", type: 2},
          ]
        },
        {
          name: "Omega",
          cost: 200,
          items: [
            {item:"$1,500,000", type: 0, amount: 1500000},
            {item:"15000XP", type: 1, amount: 15000},
            {item:"2 Income", type: 3}
          ]
        }
      ]
    }
    this.recentBetters = [];
  }
  Init(done){
    var self = this;

    self.state = self.disnode.state.Init(self);
    self.utils = new CasinoUtils(self.disnode, self.state, this);
    self.Blackjack = new Blackjack(self.disnode);
    self.utils.init().then(function() {
      if(self.utils.AutoStatus() && self.stateAuth) {
        var n = self.utils.getRandomIntInclusive(0,4);
        if(n == 0){
          self.disnode.bot.SetStatus("!casino slot");
        }else if (n == 1) {
          self.disnode.bot.SetStatus("!casino wheel");
        }else if (n == 2) {
          self.disnode.bot.SetStatus("!casino flip");
        }else if (n == 3) {
          self.disnode.bot.SetStatus("!casino 21");
        }else {
          self.disnode.bot.SetStatus("!casino");
        }
      }
      console.log("INIT!")
      done();
    });
  }
  default(command) {
    var self = this;

    var visitor = ua('UA-101624094-2', command.msg.userID, {strictCidFormat: false});
    visitor.pageview("Default Command").send()

    if(command.params[0] == 'dev'){
      command.params.splice(0,1);
      self.commandAdmin(command);
      return;
    }else if (command.params[0] =='mod') {
      command.params.splice(0,1);
      self.commandMod(command);
      return;
    }

    self.utils.getPlayer(command).then(function(player){

      var msg = "";
      for (var i = 0; i < self.commands.length; i++) {
        msg += self.disnode.botConfig.prefix + self.config.prefix + " " + self.commands[i].cmd + " - " + self.commands[i].desc + "\n";
      }

      self.disnode.bot.SendEmbed(command.msg.channel, {
        color: 3447003,
        author: {},
        fields: [ {
          name: 'Casino',
          inline: true,
          value: "Hello, " + player.name + "!\nCasino Bot is a Discord bot that allows users to play casino games on Discord. __**FOR AMUSEMENT ONLY**__.",
        },{
          name: 'Commands:',
          inline: true,
          value: msg,
        }, {
          name: 'Discord Server',
          inline: false,
          value: "**Join our Discord Server for Support and More!:** https://discord.gg/AbZhCen",
        }, {
          name: 'Disnode Ultra',
          inline: false,
          value: "**Do you want to support us, so we can keep our bots up and running? Then buy Disnode Ultra for some sweet perks today!** https://www.disnodeteam.com/ultra (when purchased run `!casino ultra` to activate)",
        }],
          footer: {}
      });
    });
    return;
  }
  commandInvite(command){
    var self = this;
    var visitor = ua('UA-101624094-2', command.msg.userID, {strictCidFormat: false});
    visitor.pageview("Invite Command").send()
    self.disnode.bot.SendCompactEmbed(command.msg.channel, "Invite", "https://discordapp.com/oauth2/authorize?client_id=263330369409908736&scope=bot&permissions=19456");
    return;
  }
  commandTime(command){
    var self = this;
    var visitor = ua('UA-101624094-2', command.msg.userID, {strictCidFormat: false});
    visitor.pageview("Time Command").send();
    self.utils.getPlayer(command).then(function(player) {
      if(!player.rules){
        self.disnode.bot.SendCompactEmbed(command.msg.channel, "Error", "Please read and accept the rules! `!casino rules`", 16772880);
        return;
      }
      if(self.utils.checkBan(player, command))return;
      if(player.Admin || player.Mod){}else {
        if(!self.utils.doChannelCheck(command)){
          self.disnode.bot.SendCompactEmbed(command.msg.channel, "Error", "Please use the <#269839796069859328> channel for this command", 16772880);
          return;
        }
      }
      self.utils.csAPI.get("/time").then(function(resp){
        self.disnode.bot.SendCompactEmbed(command.msg.channel, "Time Until Income", resp.data.readable);
      });
    });
  }
  commandBal(command){
    var self = this;
    var visitor = ua('UA-101624094-2', command.msg.userID, {strictCidFormat: false});
    visitor.pageview("Balanace Command").send()
    if(command.params[0] != undefined){
      self.utils.getPlayer(command).then(function(player) {
        if(!player.rules){
          self.disnode.bot.SendCompactEmbed(command.msg.channel, "Error", "Please read and accept the rules! `!casino rules`", 16772880);
          return;
        }
        if(self.utils.checkBan(player, command))return;
        if(player.Admin || player.Mod){}else {
          if(!self.utils.doChannelCheck(command)){
            self.disnode.bot.SendCompactEmbed(command.msg.channel, "Error", "Please use the <#269839796069859328> channel for this command", 16772880);
            return;
          }
        }
        self.utils.findPlayer(command.params[0]).then(function(res) {
          if(res.found){
            self.disnode.bot.SendEmbed(command.msg.channel, {
              color: 1433628,
              author: {},
              title: res.p.name + " Balance",
              fields: [ {
                name: 'Money',
                inline: true,
                value: "$" + numeral(res.p.money).format('0,0.00'),
              }, {
                name: 'Income / Max Income',
                inline: true,
                value: "$" + numeral(res.p.income).format('0,0.00') + " / " + numeral(res.p.maxIncome).format('0.0a'),
              }, {
                name: 'XP / Next Level',
                inline: true,
                value: res.p.xp + " / " + (res.p.nextlv),
              }, {
                name: 'Premium',
                inline: true,
                value: res.p.Premium,
              }, {
                name: 'Keys',
                inline: true,
                value: res.p.keys,
              }, {
                name: 'Level',
                inline: true,
                value: res.p.lv,
              }],
                footer: {}
            });
          }else {
            self.disnode.bot.SendCompactEmbed(command.msg.channel, "Error", res.msg, 16772880);
          }
        });
      });
    }else {
      self.utils.getPlayer(command).then(function(player) {
        if(!player.rules){
          self.disnode.bot.SendCompactEmbed(command.msg.channel, "Error", "Please read and accept the rules! `!casino rules`", 16772880);
          return;
        }
        if(self.utils.checkBan(player, command))return;
        if(player.Admin || player.Mod){}else {
          if(!self.utils.doChannelCheck(command)){
            self.disnode.bot.SendCompactEmbed(command.msg.channel, "Error", "Please use the <#269839796069859328> channel for this command", 16772880);
            return;
          }
        }
        self.disnode.bot.SendEmbed(command.msg.channel,
          {
            color: 1433628,
            author: {},
            title: player.name + " Balance",
            fields: [ {
              name: 'Money',
              inline: true,
              value: "$" + numeral(player.money).format('0,0.00'),
            }, {
              name: 'Income / Max Income',
              inline: true,
              value: "$" + numeral(player.income).format('0,0.00') + " / " + numeral(player.maxIncome).format('0.0a'),
            }, {
              name: 'XP / Next Level',
              inline: true,
              value: player.xp + " / " + (player.nextlv),
            }, {
              name: 'Premium',
              inline: true,
              value: player.Premium,
            }, {
              name: 'Keys',
              inline: true,
              value: player.keys,
            }, {
              name: 'Level',
              inline: true,
              value: player.lv,
            }],
              footer: {}
          }
        );
      })
    }
    return;
  }
  commandJackpotInfo(command){
    var self = this;

    var visitor = ua('UA-101624094-2', command.msg.userID, {strictCidFormat: false});
    visitor.pageview("Jackpot Info Command").send()

    self.utils.getPlayer(command).then(function(player) {
      self.utils.getCasinoObj().then(function(casinoObj){
        if(!player.rules){
          self.disnode.bot.SendCompactEmbed(command.msg.channel, "Error", "Please read and accept the rules! `!casino rules`", 16772880);
          return;
        }
          if(self.utils.checkBan(player, command))return;
          if(player.Admin || player.Mod){}else {
            if(!self.utils.doChannelCheck(command)){
              self.disnode.bot.SendCompactEmbed(command.msg.channel, "Error", "Please use the <#269839796069859328> channel for this command", 16772880);
              return;
            }
          }
          if(player.money > 8500){
            var minJackpotBet = (player.money * 0.03);
          }else var minJackpotBet = 250;
          self.utils.updateLastSeen(player);
          self.disnode.bot.SendEmbed(command.msg.channel, {
            color: 1433628,
            author: {},
            fields: [ {
              name: 'JACKPOT Value',
              inline: true,
              value: "$" + numeral(casinoObj.jackpotValue).format('0,0.00'),
            },{
              name: 'Minimum bet to Win JACKPOT',
              inline: false,
              value: "$" + numeral(minJackpotBet).format('0,0.00')
            }, {
              name: 'JACKPOT History',
              inline: false,
              value: "**Last won by:** " + casinoObj.jackpotstat.lastWon + " **Amount Won:** $" + numeral(casinoObj.jackpotstat.LatestWin).format('0,0.00'),
            }],
              footer: {}
            }
          )
      });
    });
    return;
  }
  commandSlot(command){
    var self = this;
    var visitor = ua('UA-101624094-2', command.msg.userID, {strictCidFormat: false});
    visitor.pageview("Slot Command").send()
    self.utils.getPlayer(command).then(function(player) {
      self.utils.getCasinoObj().then(function(casinoObj){
        if(!player.rules){
          self.disnode.bot.SendCompactEmbed(command.msg.channel, "Error", "Please read and accept the rules! `!casino rules`", 16772880);
          return;
        }
        if(self.utils.checkBan(player, command))return;
        if(player.Admin || player.Mod){}else {
          if(!self.utils.doChannelCheck(command)){
            self.disnode.bot.SendCompactEmbed(command.msg.channel, "Error", "Please use the <#269839796069859328> channel for this command", 16772880);
            return;
          }
        }
        switch (command.params[0]) {
          case "info":
            if(player.money > 8500){
              var minJackpotBet = (player.money * 0.03);
            }else var minJackpotBet = 250;
            self.disnode.bot.SendEmbed(command.msg.channel, {
              color: 1433628,
              author: {},
              title: 'Casino Slots',
              description: 'Info',
              fields: [ {
                name: 'Slot Items',
                inline: false,
                value: ":cherries: - Cherries (Most Common)\n\n:third_place:\n\n:second_place:\n\n:first_place:\n\n:100: - 100 (Most Rare)",
              }, {
                name: 'Slot Wins and Payouts',
                inline: false,
                value: "\n:cherries::cherries::cherries: - 2x bet 10XP\n"+
                ":third_place::third_place::third_place: - 4x bet 20XP\n"+
                ":second_place::second_place::second_place: - 8x bet 40XP\n"+
                ":first_place::first_place::first_place: - 16x bet 80XP\n"+
                ":100::100::100: - JACKPOT value - 1000XP\n" +
                ":key::key::key: -  3 Keys (**Minimum Jackpot Bet Required**)\n" +
                "At least one :key: - 1 Key (**Minimum Jackpot Bet Required**)\n" +
                "At least one :cherries: - 1/2 your Original Bet",
              },{
                name: 'Minimum bet to Win Jackpot',
                inline: false,
                value: "Minimum bet: $**" + numeral(minJackpotBet).format('0,0.00') + "** (if money < 8,500 min bet = 250) else (min bet = money * 0.03 or 3%))"
              },{
                name: 'XP',
                inline: false,
                value: "The XP system has changed a bit, if your bet is lower than $250, you will not get any XP",
              },{
                name: 'Jackpot',
                inline: false,
                value: "Jackpot Value is increased every time someone plays slots, the value is increased by the players bet amount and has a default value of $100,000\n**Current Jackpot Value: **$" + numeral(casinoObj.jackpotValue).format('0,0.00'),
              }, {
                name: 'Jackpot History',
                inline: true,
                value: "**Last won by:** " + casinoObj.jackpotstat.lastWon,
              }],
                footer: {}
              });
            break;
          case undefined:
            self.disnode.bot.SendCompactEmbed(command.msg.channel, "Slots", "Hi, and welcome to slots. If you need any info on the slots, run the command `!casino slot info`.\n\nIf you want to try the slots, then type `!casino slot [bet]. For example, `!casino slot 100` will run the slots with $100 as the bet.");
            break;
          default:
            if(command.params[0]){
              if(command.params[0].toLowerCase() == "allin"){
                command.params[0] = player.money;
              }
              var bet = numeral(command.params[0]).value();
              var timeoutInfo = self.utils.checkTimeout(player, 5);
              if(player.Premium)timeoutInfo = self.utils.checkTimeout(player, 2);
              if(player.Admin)timeoutInfo = self.utils.checkTimeout(player, 0);
              if(!timeoutInfo.pass){
                logger.Info("Casino", "Slot", "Player: " + player.name + " Tried the slots before their delay of: " + timeoutInfo.remain);
                self.disnode.bot.SendCompactEmbed(command.msg.channel, "Error", ":warning: You must wait **" + timeoutInfo.remain + "** before playing again.", 16772880);
                return;
              }
              if(bet > 0.01){
                if(bet > player.money | bet == NaN | bet == "NaN"){// Checks to see if player has enough money for their bet
                  self.disnode.bot.SendCompactEmbed(command.msg.channel, "Error", ":warning: You dont have that much Money! You have $" + numeral(player.money).format('0,0.00'), 16772880);
                  return;
                }else{
                  player.money -= parseFloat(bet);
                  casinoObj.jackpotValue += parseFloat(bet);
                  player.money = parseFloat(player.money.toFixed(2));
                  casinoObj.jackpotValue = parseFloat(casinoObj.jackpotValue.toFixed(2));
                }
                var slotInfo = {
                  bet: bet,
                  player: player,
                  casinoObj: casinoObj,
                  winText: "",
                  winAmount: 0,
                  reel1: self.slotItems[self.utils.getRandomIntInclusive(0,(self.slotItems.length - 1))].item,
                  reel2: self.slotItems[self.utils.getRandomIntInclusive(0,(self.slotItems.length - 1))].item,
                  reel3: self.slotItems[self.utils.getRandomIntInclusive(0,(self.slotItems.length - 1))].item,
                  fake1: self.slotItems[self.utils.getRandomIntInclusive(0,(self.slotItems.length - 1))].item,
                  fake2: self.slotItems[self.utils.getRandomIntInclusive(0,(self.slotItems.length - 1))].item,
                  fake3: self.slotItems[self.utils.getRandomIntInclusive(0,(self.slotItems.length - 1))].item,
                  fake4: self.slotItems[self.utils.getRandomIntInclusive(0,(self.slotItems.length - 1))].item,
                  fake5: self.slotItems[self.utils.getRandomIntInclusive(0,(self.slotItems.length - 1))].item,
                  fake6: self.slotItems[self.utils.getRandomIntInclusive(0,(self.slotItems.length - 1))].item
                }
                self.utils.didWin(slotInfo);
                if(player.money > 8500){
                  var minJackpotBet = (player.money * 0.03);
                }else var minJackpotBet = 250;
                if(timeoutInfo.remain){
                  logger.Info("Casino", "Slot", "Player: " + player.name + " Slot Winnings: " + slotInfo.winAmount + " original bet: " + bet + " Time since they could use this command again: " + timeoutInfo.remain);
                }else {
                  logger.Info("Casino", "Slot", "Player: " + player.name + " Slot Winnings: " + slotInfo.winAmount + " original bet: " + bet);
                }
                player.money = parseFloat(player.money.toFixed(2));
                minJackpotBet = parseFloat(minJackpotBet.toFixed(2));
                player.stats.moneyWon = parseFloat(parseFloat(player.stats.moneyWon) + parseFloat(slotInfo.winAmount));
                player.stats.moneyWon = player.stats.moneyWon.toFixed(2);
                casinoObj.jackpotValue = parseFloat(casinoObj.jackpotValue.toFixed(2));
                self.utils.handleRecentBetters(player);
                self.utils.updateLastSeen(player);
                self.utils.checkLV(player, command.msg.channel);
                self.disnode.bot.SendEmbed(command.msg.channel, {
                  color: 1433628,
                  author: {},
                  fields: [ {
                    name: ':slot_machine: ' + player.name + ' Slots Result :slot_machine:',
                    inline: false,
                    value: "| " + slotInfo.fake1 + slotInfo.fake2 + slotInfo.fake3 + " |\n**>**" + slotInfo.reel1 + slotInfo.reel2 + slotInfo.reel3 +"**<** Pay Line\n| " + slotInfo.fake4 + slotInfo.fake5 + slotInfo.fake6 + " |\n\n" + slotInfo.winText,
                  }, {
                    name: 'Bet',
                    inline: true,
                    value: "$" + numeral(bet).format('0,0.00'),
                  }, {
                    name: 'Winnings',
                    inline: true,
                    value: "$" + numeral(slotInfo.winAmount).format('0,0.00'),
                  }, {
                    name: 'Net Gain',
                    inline: true,
                    value: "$" + numeral(slotInfo.winAmount - bet).format('0,0.00'),
                  }, {
                    name: 'Balance',
                    inline: true,
                    value: "$" + numeral(player.money).format('0,0.00'),
                  }, {
                    name: 'Keys',
                    inline: true,
                    value: player.keys
                  }, {
                    name: 'XP',
                    inline: true,
                    value: player.xp,
                  }, {
                    name: 'Minimum JACKPOT bet',
                    inline: true,
                    value: "$" + numeral(minJackpotBet).format('0,0.00'),
                  }, {
                    name: 'JACKPOT Value',
                    inline: true,
                    value: "$" + numeral(casinoObj.jackpotValue).format('0,0.00'),
                  }],
                    footer: {}
                  }
                );
                self.utils.updatePlayerLastMessage(player);
                self.utils.DB.Update("players", {"id":player.id}, player);
                self.utils.updateCasinoObj(casinoObj);
              }else {
                self.disnode.bot.SendCompactEmbed(command.msg.channel, "Error", ":warning: Please use a Number for bet or `!casino slot` for general help", 16772880)
              }
            }
        }
      });
    });
    return;
  }
  commandCoinFlip(command){
      var self = this;
      var visitor = ua('UA-101624094-2', command.msg.userID, {strictCidFormat: false});
      visitor.pageview("Cloin Flip Command").send()
      self.utils.getPlayer(command).then(function(player) {
        if(!player.rules){
          self.disnode.bot.SendCompactEmbed(command.msg.channel, "Error", "Please read and accept the rules! `!casino rules`", 16772880);
          return;
        }
        if(self.utils.checkBan(player, command))return;
        if(player.Admin || player.Mod){}else {
          if(!self.utils.doChannelCheck(command)){
            self.disnode.bot.SendCompactEmbed(command.msg.channel, "Error", "Please use the <#269839796069859328> channel for this command", 16772880);
            return;
          }
        }
        if(player.lv < 2){
          self.disnode.bot.SendCompactEmbed(command.msg.channel, "Error", ":warning: You must be Level 2 to Play Coin Flip!", 16772880);
          return;
        }
        var flipinfo = {
          flip: self.utils.getRandomIntInclusive(0,1),
          winText: "",
          winAmount: 0,
          playerPick: 0,
          tag: ""
        }
        if(command.params[0] == "heads"){
          flipinfo.playerPick = 0;
          flipinfo.tag = "Heads";
          flipinfo.ltag = "Tails";
        }else if (command.params[0] == "tails") {
          flipinfo.playerPick = 1;
          flipinfo.tag = "Tails";
          flipinfo.ltag = "Heads";
        }else {
          self.disnode.bot.SendCompactEmbed(command.msg.channel, "Coin Flip", "Welcome to coin flip! To play, use this command: `!casino flip [heads/tails]`. Here are some examples: `!casino flip heads 100` and `!casino flip tails 100`.", 1433628);
          return;
        }if(command.params[1]){
          if(command.params[1].toLowerCase() == "allin"){
            command.params[1] = player.money;
          }
        }
        if(numeral(command.params[1]).value() >= 1){
          var bet;
          var bet = numeral(command.params[1]).value();
          var timeoutInfo = self.utils.checkTimeout(player, 5);
          if(player.Premium)timeoutInfo = self.utils.checkTimeout(player, 2);
          if(player.Admin)timeoutInfo = self.utils.checkTimeout(player, 0);
          if(!timeoutInfo.pass){
            self.disnode.bot.SendCompactEmbed(command.msg.channel, "Error", ":warning: You must wait **" + timeoutInfo.remain + "** before playing again.", 16772880);
            return;
          }
          if(bet > player.money){// Checks to see if player has enough money for their bet
            self.disnode.bot.SendCompactEmbed(command.msg.channel, "Error", ":warning: You dont have that much Money! You have $" + numeral(player.money).format('0,0.00'), 16772880);
            return;
          }else{
            var minbet = player.money * 0.015;
            player.money -= bet;
            player.money = Number(parseFloat(player.money).toFixed(2));
          }
          player.stats.coinPlays++;
          if(flipinfo.flip == flipinfo.playerPick){
            player.stats.coinWins++;
            if(flipinfo.playerPick == 0){
              player.stats.coinHeads++;
            }else player.stats.coinTails++;
            flipinfo.winText = flipinfo.tag + " You Win!"
            flipinfo.winAmount = Number(parseFloat(bet * 2).toFixed(2));
            player.stats.moneyWon += Number(parseFloat(flipinfo.winAmount).toFixed(2));
            player.stats.moneyWon = Number(parseFloat(player.stats.moneyWon).toFixed(2));
            player.money += Number(parseFloat(flipinfo.winAmount).toFixed(2));
            player.money = Number(parseFloat(player.money).toFixed(2));
            if(bet >= minbet){
              player.xp += 5;
            }else {
              flipinfo.winText += " `You bet lower than $" + numeral(minbet).format('0,0.00') + " fair warning here, you wont get any XP`"
            }
            logger.Info("Casino", "CoinFlip", "Player: " + player.name + " Has Won Coin Flip Winnings: " + flipinfo.winAmount + "original bet: " + bet);
            self.utils.updateLastSeen(player);
            minbet = player.money * 0.015;
            self.disnode.bot.SendEmbed(command.msg.channel, {
              color: 1433628,
              author: {},
              fields: [ {
                name: ':moneybag: Coin Flip :moneybag:',
                inline: false,
                value: flipinfo.winText,
              }, {
                name: 'Bet',
                inline: true,
                value: "$" + numeral(bet).format('0,0.00'),
              }, {
                name: 'Winnings',
                inline: true,
                value: "$" + numeral(flipinfo.winAmount).format('0,0.00'),
              }, {
                name: 'Net Gain',
                inline: true,
                value: "$" + numeral(flipinfo.winAmount - bet).format('0,0.00'),
              }, {
                name: 'Balance',
                inline: true,
                value: "$" + numeral(player.money).format('0,0.00'),
              }, {
                name: 'Minimum Bet',
                inline: true,
                value: "$" + numeral(minbet).format('0,0.00'),
              }, {
                name: 'XP',
                inline: true,
                value: player.xp,
              }],
                footer: {}
              }
            );
            self.utils.updatePlayerLastMessage(player);
            self.utils.updateLastSeen(player);
            self.utils.checkLV(player, command.msg.channel);
          }else {
            flipinfo.winText = flipinfo.ltag + " House Wins!";
            if(bet >= 250){}else {
              flipinfo.winText += " `You bet lower than $250 fair warning here, you wont get any XP`"
            }
            if(flipinfo.playerPick == 0){
              player.stats.coinTails++;
            }else player.stats.coinHeads++;
            logger.Info("Casino", "CoinFlip", "Player: " + player.name + " Has Lost Coin Flip Winnings: " + flipinfo.winAmount + "original bet: " + bet);
            self.utils.updateLastSeen(player);
            self.disnode.bot.SendEmbed(command.msg.channel, {
              color: 3447003,
              author: {},
              fields: [ {
                name: ':moneybag: Coin Flip :moneybag:',
                inline: false,
                value: flipinfo.winText,
              }, {
                name: 'Bet',
                inline: true,
                value: "$" + numeral(bet).format('0,0.00'),
              }, {
                name: 'Winnings',
                inline: true,
                value: "$" + numeral(flipinfo.winAmount).format('0,0.00'),
              }, {
                name: 'Net Gain',
                inline: true,
                value: "$" + numeral(flipinfo.winAmount - bet).format('0,0.00'),
              }, {
                name: 'Balance',
                inline: true,
                value: "$" + numeral(player.money).format('0,0.00'),
              }, {
                name: 'XP',
                inline: true,
                value: player.xp,
              }],
                footer: {}
              }
            );
            self.utils.updatePlayerLastMessage(player);
            self.utils.updateLastSeen(player);
            self.utils.checkLV(player, command.msg.channel);
          }
          self.utils.DB.Update("players", {"id":player.id}, player);
          
        }else {
          self.disnode.bot.SendCompactEmbed(command.msg.channel, "Error", ":warning: Please enter a bet! Example `!casino flip tails 100`", 16772880);
        }
      });
      return;
  }
  commandWheel(command){
    var self = this;
    var wheelInfo;
    var winspots = [];
    var whatcontains = {
      has1st: false,
      has2nd: false,
      has3rd: false
    }
    var invalidbets = [];
    var timeoutInfo;
    var visitor = ua('UA-101624094-2', command.msg.userID, {strictCidFormat: false});
    visitor.pageview("Wheel Command").send()
    self.utils.getPlayer(command).then(function(player) {
      if(!player.rules){
        self.disnode.bot.SendCompactEmbed(command.msg.channel, "Error", "Please read and accept the rules! `!casino rules`", 16772880);
        return;
      }
      if(self.utils.checkBan(player, command))return;
      if(player.Admin || player.Mod){}else {
        if(!self.utils.doChannelCheck(command)){
          self.disnode.bot.SendCompactEmbed(command.msg.channel, "Error", "Please use the <#269839796069859328> channel for this command", 16772880);
          return;
        }
      }
      switch (command.params[0]) {
        case "spin":
          if(player.lv < 2){
            self.disnode.bot.SendCompactEmbed(command.msg.channel, "Error", ":warning: You must be Level 2 to Play The Wheel!", 16772880);
            return;
          }
          if(command.params[1] == "allin"){
            var bet = numeral(player.money).value();
          }else {
            var bet = numeral(command.params[1]).value();
          }
          if(bet > 0){
          var timeoutInfo = self.utils.checkTimeout(player, 5);
          if(player.Premium)timeoutInfo = self.utils.checkTimeout(player, 2);
          if(player.Admin)timeoutInfo = self.utils.checkTimeout(player, 0);
            if(!timeoutInfo.pass){
              self.disnode.bot.SendCompactEmbed(command.msg.channel, "Error", ":warning: You must wait **" + timeoutInfo.remain + "** before playing again.", 16772880);
              return;
            }
            if(command.params.length > 7){
              self.disnode.bot.SendCompactEmbed(command.msg.channel, "Error", ":warning: You can only put a maximum of 5 Bet Types!", 16772880);
              return;
            }
            for (var i = 2; i < command.params.length; i++) {
              if(command.params[i] == undefined)break;
              if(self.utils.checkValidWheel(command.params[i])){
                if(command.params[i].toLowerCase() == "1st"){
                  whatcontains.has1st = true;
                }
                if(command.params[i].toLowerCase() == "2nd"){
                  whatcontains.has2nd = true;
                }
                if(command.params[i].toLowerCase() == "3rd"){
                  whatcontains.has3rd = true;
                }
                winspots.push(command.params[i].toLowerCase());
              }else {
                invalidbets.push(command.params[i]);
              }
            }
            if(winspots.length == 0){
              if(invalidbets.length > 0){
                var msg = "";
                for (var i = 0; i < invalidbets.length; i++) {
                  msg += invalidbets[i] + " ";
                }
                self.disnode.bot.SendCompactEmbed(command.msg.channel,"Error", ":warning: Please Enter valid bet types! Invalid: " + msg, 16772880);
                return;
              }else {
                self.disnode.bot.SendCompactEmbed(command.msg.channel,"Error", ":warning: Please Enter valid bet types!", 16772880);
                return;
              }
            }
            if(bet > player.money){// Checks to see if player has enough money for their bet
              self.disnode.bot.SendCompactEmbed(command.msg.channel,"Error", ":warning: You dont have that much Money! You have $" + numeral(player.money).format('0,0.00'), 16772880);
              return;
            }else{
              var minbet = player.money * 0.015;
              var warn = "";
              player.money -= bet;
              player.money = numeral(player.money).value();
            }
            var wheelInfo = {
              bet: bet,
              betperspot: (bet / winspots.length),
              player: player,
              winAmount: 0,
              xpAward: 0,
              wheelNumber: self.utils.getRandomIntInclusive(0,(self.wheelItems.length - 1)),
              winspots: winspots,
              ball: 0,
              whatcontains: whatcontains
            }
            wheelInfo.ball = self.wheelItems[wheelInfo.wheelNumber];
            self.utils.calculateWheelWins(wheelInfo);
            player.stats.wheelPlays++;
            if(wheelInfo.winAmount > 0)player.stats.wheelWins++;
            player.money += wheelInfo.winAmount;
            if(bet < minbet){
              warn = "\n`You didn't bet your Minimum bet to get XP, please note the amount you need to bet below`"
            }else {
              player.xp += wheelInfo.xpAward;
            }
            minbet = player.money * 0.015;
            logger.Info("Casino", "Wheel", "Wheel Player: " + player.name + " bet: " + bet + " Win: " + wheelInfo.winAmount);
          }else {
            self.disnode.bot.SendCompactEmbed(command.msg.channel, "Error", ":warning: Please use a number for your bet!", 16772880);
            return;
          }
          self.disnode.bot.SendEmbed(command.msg.channel, {
            color: 1433628,
            author: {},
            fields: [ {
              name: ':money_with_wings: The Wheel :money_with_wings:',
              inline: false,
              value: wheelInfo.ball.display + warn,
            }, {
              name: 'Bet',
              inline: true,
              value: "$" + numeral(bet).format('0,0.00'),
            }, {
              name: 'bet per Type',
              inline: false,
              value: "$" + numeral(wheelInfo.betperspot).format('0,0.00'),
            }, {
              name: 'Winnings',
              inline: true,
              value: "$" + numeral(wheelInfo.winAmount).format('0,0.00'),
            }, {
              name: 'Net Gain',
              inline: true,
              value: "$" + numeral(wheelInfo.winAmount - bet).format('0,0.00'),
            }, {
              name: 'Balance',
              inline: true,
              value: "$" + numeral(player.money).format('0,0.00'),
            }, {
              name: 'Min Bet',
              inline: true,
              value: "$" + numeral(minbet).format('0,0.00'),
            }, {
              name: 'XP',
              inline: true,
              value: player.xp,
            }],
              footer: {}
            }
          );
          self.utils.updatePlayerLastMessage(player);
          self.utils.updateLastSeen(player);
          self.utils.checkLV(player, command.msg.channel);
          self.utils.DB.Update("players", {"id":player.id}, player);
          
          break;
        case "info":
          self.disnode.bot.SendEmbed(command.msg.channel, {
              color: 3447003,
              author: {},
              fields: [ {
                name: ':money_with_wings: The Wheel :money_with_wings:',
                inline: false,
                value: "The wheel acts much like a game of roulette, however, it has a differing rule set to roulette.",
              }, {
                name: 'Playing The Wheel',
                inline: false,
                value: "To play the wheel, you can type `!casino wheel spin [bet] [Bet Type] [Bet Type]...` Example: `!casino wheel spin 100 black`",
              }, {
                name: 'Bet Types',
                inline: true,
                value: "As shown, bet types can be one of the following: `[black/red, 0-36, even/odd, 1st/2nd/3rd, and low/high]`\n`Black/Red` - Number must match the colour to win.\n`Even/Odd` - Depending on what number you choose, if that number is even or odd, you win.\n`1st/2nd/3rd` - 1st consists of numbers 1-12, 2nd consists of numbers 13-24, and 3rd consists of numbers 25-36.\n`Low/High` - Low consists of numbers 1-18, and High consists of numbers 19-36.",
              }, {
                name: 'Winnings',
                inline: true,
                value: "0 - Upon winning 0, you get 37 times the amount you bet as your win.\nAny other number (1-36) - Upon winning, you get 36 times the amount you bet as your win.\n1st/2nd/3rd - Upon winning any of these bet types, you get 3 times the amount you bet as your win.\nEven/Odd, Black/Red, Low and High - Upon winning any of these bet types, you get 2 times the amount you bet as your win.",
              }, {
                name: 'Numbers',
                inline: true,
                value: ":white_circle: # ~ 0\n:red_circle: # ~ 1, 2, 5, 6, 9, 10, 13, 14, 17, 18, 21, 22, 25, 26, 29, 30, 33, 34\n:black_circle:  # ~ 3, 4, 7, 8, 11, 12, 15, 16, 19, 20, 23, 24, 27, 28, 31, 32, 35, 36,"
              }],
              footer: {}
            }
          );
          break;
        default:
          self.disnode.bot.SendEmbed(command.msg.channel, {
            color: 3447003,
            author: {},
            fields: [ {
              name: "The Wheel (Roulette)",
              inline: false,
              value: "Welcome to the wheel! To play, use this command: `!casino wheel spin 100 black`. For more info on what the win types are, and how the game is played out, use `!casino wheel info`.",
            }],
              footer: {}
            }
          );
          break;
      }
    });
    return;
  }
  commandDice(command){
    var self = this;
    var timeoutInfo;
    var visitor = ua('UA-101624094-2', command.msg.userID, {strictCidFormat: false});
    visitor.pageview("Dice Command").send()
    self.utils.getPlayer(command).then(function(player) {
      if(!player.rules){
        self.disnode.bot.SendCompactEmbed(command.msg.channel, "Error", "Please read and accept the rules! `!casino rules`", 16772880);
        return;
      }
      if(self.utils.checkBan(player, command))return;
      if(player.Admin || player.Mod){}else {
        if(!self.utils.doChannelCheck(command)){
          self.disnode.bot.SendCompactEmbed(command.msg.channel, "Error", "Please use the <#269839796069859328> channel for this command", 16772880);
          return;
        }
      }

      switch (command.params[0]) {
        case "roll":
          timeoutInfo = self.utils.checkTimeout(player, 5);
          if(player.Premium)timeoutInfo = self.utils.checkTimeout(player, 2);
          if(player.Admin)timeoutInfo = self.utils.checkTimeout(player, 0);
          if(!timeoutInfo.pass){
            self.disnode.bot.SendCompactEmbed(command.msg.channel, "Error", ":warning: You must wait **" + timeoutInfo.remain + "** before playing again.", 16772880);
            return;
          }
          if(command.params[1]){
            var dicenum = numeral(command.params[1]).value();
            if(dicenum >= 5 && dicenum <= 10000){
              if(command.params[2]){
                var pick = numeral(command.params[2]).value();
                if(pick >= 1 && pick <= dicenum){
                  if(command.params[3]){
                    var bet = numeral(command.params[3]).value();
                    if(bet >= 0 && player.money >= bet){
                      player.money -= bet;
                      var rolled = self.utils.getRandomIntInclusive(1, dicenum);
                      var winnings = 0;
                      if(rolled == pick){
                        winnings = (bet * dicenum);
                        player.money += winnings;
                        var xpmult = Math.floor((dicenum / 10));
                        if(xpmult <= 0)xpmult = 1;
                        player.xp += 10 * xpmult;
                      }
                      self.disnode.bot.SendEmbed(command.msg.channel, {
                        color: 1433628,
                        author: {},
                        fields: [ {
                          name: ':game_die: ' + player.name + ' Dice Result :game_die:',
                          inline: false,
                          value: "Rolled a " + rolled + " On a " + dicenum + " Sided Die.",
                        }, {
                          name: 'Your Pick',
                          inline: true,
                          value: "" + pick,
                        }, {
                          name: 'Bet',
                          inline: true,
                          value: "$" + numeral(bet).format('0,0.00'),
                        }, {
                          name: 'Winnings',
                          inline: true,
                          value: "$" + numeral(winnings).format('0,0.00'),
                        }, {
                          name: 'Net Gain',
                          inline: true,
                          value: "$" + numeral(winnings - bet).format('0,0.00'),
                        }, {
                          name: 'Balance',
                          inline: true,
                          value: "$" + numeral(player.money).format('0,0.00'),
                        }, {
                          name: 'XP',
                          inline: true,
                          value: player.xp,
                        }],
                          footer: {}
                        }
                      );
                      self.utils.updatePlayerLastMessage(player);
                      self.utils.updateLastSeen(player);
                      self.utils.checkLV(player, command.msg.channel);
                      self.utils.DB.Update("players", {"id":player.id}, player);
                      
                    }else{
                      self.disnode.bot.SendCompactEmbed(command.msg.channel, "Error", ":warning: You must enter a bet that is greater than 0, Or you cant afford the bet that you want to place.", 16772880);
                    }
                  }else{
                    self.disnode.bot.SendCompactEmbed(command.msg.channel, "Error", ":warning: You either put in an invalid bet ore you cant afford the bet you placed.", 16772880);
                  }
                }else{
                  self.disnode.bot.SendCompactEmbed(command.msg.channel, "Error", ":warning: must pick a number starting with 1 and go no higher than the number of sides to your dice.", 16772880);
                }
              }else{
                self.disnode.bot.SendCompactEmbed(command.msg.channel, "Error", ":warning: You must pick a number on the dice to roll! like `!casino dice roll 7 3 100`", 16772880);
              }
            }else{
              self.disnode.bot.SendCompactEmbed(command.msg.channel, "Error", ":warning: the amount of sides to the dice must be between 5 and 10,000  `!casino dice roll 7 3 100`", 16772880);
            }
          }else{
            self.disnode.bot.SendCompactEmbed(command.msg.channel, "Error", ":warning: Please enter the amount of sides to the dice (5 and up) like `!casino dice roll 7 3 100`", 16772880);
          }
          break;

        default:
          self.disnode.bot.SendCompactEmbed(command.msg.channel, "Dice Roll", "Welcome to Dice Roll! Here you can choose how many sides you want to roll. The general command structure is `!casino dice roll (sides) (your pick) (bet)` example `!casino dice roll 10 4 1000`.\nYou get `x times your bet` if you pick the same number the dice landed on. where x is the number of sides the dice has.");
          break;
      }
    });
  }
  commandRecentBetters(command){
    var self = this;
    var visitor = ua('UA-101624094-2', command.msg.userID, {strictCidFormat: false});
    visitor.pageview("Recent Betters Command").send()
    self.utils.getPlayer(command).then(function(player) {
      if(!player.rules){
        self.disnode.bot.SendCompactEmbed(command.msg.channel, "Error", "Please read and accept the rules! `!casino rules`", 16772880);
        return;
      }
      if(self.utils.checkBan(player, command))return;
      if(player.Admin || player.Mod){}else {
        if(!self.utils.doChannelCheck(command)){
          self.disnode.bot.SendCompactEmbed(command.msg.channel, "Error", "Please use the <#269839796069859328> channel for this command", 16772880);
          return;
        }
      }
      var msg = "Name // Last Time Played\n";
      for (var i = 0; i < self.utils.recentBetters.length; i++) {
        msg += (i+1) + ". **" + self.utils.recentBetters[i].name + "** -=- `" + self.utils.recentBetters[i].time + "`\n";
      }
      self.disnode.bot.SendCompactEmbed(command.msg.channel, "Recent Betters -=- Current Time: " + self.utils.getDateTime(), msg);
    });
    return;
  }
  commandTop(command){
    var self = this;
    var visitor = ua('UA-101624094-2', command.msg.userID, {strictCidFormat: false});
    visitor.pageview("Top Command").send();
    self.utils.getPlayer(command).then(function(player) {
      var pid = player.id;
      if(!player.rules){
        self.disnode.bot.SendCompactEmbed(command.msg.channel, "Error", "Please read and accept the rules! `!casino rules`", 16772880);
        return;
      }
      if(self.utils.checkBan(player, command))return;
      if(player.Admin || player.Mod){}else {
        if(!self.utils.doChannelCheck(command)){
          self.disnode.bot.SendCompactEmbed(command.msg.channel, "Error", "Please use the <#269839796069859328> channel for this command", 16772880);
          return;
        }
      }
      self.utils.DB.Find("players", {}).then(function(players) {
        var mode = "";
        if(command.params[0] == undefined){}else{
          mode = command.params[0].toLowerCase();
        }
        switch (mode) {
          case "income":
          case "money":
          case "lv":
          case "overall":
            mode = command.params[0].toLowerCase()
            break;
          default:
            self.disnode.bot.SendEmbed(command.msg.channel, {
              color: 1433628,
              author: {},
              title: 'Top Command',
              fields: [ {
                name: 'Info',
                inline: false,
                value: "The top command can be used to see who is the best player in several different fields.",
              },{
                name: 'Commands',
                inline: false,
                value: "all commands are formatted like this `!casino top (mode) (page)` page is an optional field if you don't supply a page the top 10 is shown for that mode.",
              },{
                name: 'Modes',
                inline: false,
                value: "Modes:\n**income**: Sorts users by income\n**money**: Sorts users by how much money they have\n**lv**: Sorts users by their Level\n**overall**: Sorts users by a calculated score the calulation is as follows: `((income / 1000) + (lv * 1000))`",
              }],
                footer: {}
              }
            );
            return;
        }
        var ordered = [];
        switch (mode) {
          case "income":
          case "money":
          case "lv":
            ordered = self.utils.orgArray(players, mode);
            break;
          default:
            for (var i = 0; i < players.length; i++) {
              players[i].score = ((players[i].income / 1000) + (players[i].lv * 1000))
            }
            ordered = self.utils.orgArray(players, "score");
            break;
        }
        var playerplace = 0;
        for (var i = 0; i < ordered.length; i++) {
          var el = ordered[i];
          if(el.id == pid){
            playerplace = i + 1;
            break;
          }
        }
        var page = 1;
        if(command.params[1] && numeral(command.params[1]).value() > 0){
          ordered = self.utils.pageArray(ordered, numeral(command.params[1]).value());
          page = numeral(command.params[1]).value();
        }else{
          ordered = self.utils.pageArray(ordered);
        }
        var msg = "**Page:** " + page + "\n";
        for (var i = 0; i < ordered.length; i++) {
          var player = ordered[i];
          switch (mode) {
            case "income":
              if(page>1){
                msg += "" + (i + ((page * 10) - 9)) + ". **" + player.name + "** -=- $" + numeral(player.income).format('0,0.00') + "\n";
              }else{
                msg += "" + (i + 1) + ". **" + player.name + "** -=- $" + numeral(player.income).format('0,0.00') + "\n";
              }
              break;
            case "money":
              if(page>1){
                msg += "" + (i + ((page * 10) - 9)) + ". **" + player.name + "** -=- $" + numeral(player.money).format('0,0.00') + "\n";
              }else{
                msg += "" + (i + 1) + ". **" + player.name + "** -=- $" + numeral(player.money).format('0,0.00') + "\n";
              }
              break;
            case "lv":
              if(page>1){
                msg += "" + (i + ((page * 10) - 9)) + ". **" + player.name + "** -=- Level: " + player.lv + "\n";
              }else{
                msg += "" + (i + 1) + ". **" + player.name + "** -=- Level: " + player.lv + "\n";
              }
              break;
            default:
              if(page>1){
                msg += "" + (i + ((page * 10) - 9)) + ". **" + player.name + "** -=- Score: " + numeral(player.score).format('0,0.00') + "\n";
              }else{
                msg += "" + (i + 1) + ". **" + player.name + "** -=- Score: " + numeral(player.score).format('0,0.00') + "\n";
              }
              break;
          }
        }
        msg += "\n**Your Rank:** " + playerplace;
        self.disnode.bot.SendCompactEmbed(command.msg.channel, "Order: " + mode, msg);
      });
    });
  }
  commandCrate(command){
    var self = this;
    var visitor = ua('UA-101624094-2', command.msg.userID, {strictCidFormat: false});
    visitor.pageview("Create Command").send()
    self.utils.getPlayer(command).then(function(player) {
      if(!player.rules){
        self.disnode.bot.SendCompactEmbed(command.msg.channel, "Error", "Please read and accept the rules! `!casino rules`", 16772880);
        return;
      }
      if(self.utils.checkBan(player, command))return;
      if(player.Admin || player.Mod){}else {
        if(!self.utils.doChannelCheck(command)){
          self.disnode.bot.SendCompactEmbed(command.msg.channel, "Error", "Please use the <#269839796069859328> channel for this command", 16772880);
          return;
        }
      }
      switch (command.params[0]) {
        case "open":
        var timeoutInfo = self.utils.checkTimeout(player, 5);
        if(player.Premium)timeoutInfo = self.utils.checkTimeout(player, 2);
        if(player.Admin)timeoutInfo = self.utils.checkTimeout(player, 0);
          if(!timeoutInfo.pass){
            self.disnode.bot.SendCompactEmbed(command.msg.channel, "Error", ":warning: You must wait **" + timeoutInfo.remain + "** before playing again.", 16772880);
            return;
          }
          var CrateID = numeral(command.params[1]).value();
          if(CrateID >= 0 && CrateID < self.cratesys.crates.length){
            var Crate = self.cratesys.crates[CrateID];
            if(Crate == undefined){
              self.disnode.bot.SendCompactEmbed(command.msg.channel, "Error", "The ID that you entered is not valid!", 16772880);
              return;
            }
            if(command.params[2]){
							var quantity = numeral(command.params[2]).value();
							if(quantity == 0)quantity = 1;
							if(player.keys >= (Crate.cost * quantity)){
								player.keys -= (Crate.cost * quantity);
								var amountWon = [0,0,0,0];
								for (var i = 0; i < quantity; i++) {
									var Item = Crate.items[self.utils.getRandomIntInclusive(0, (Crate.items.length - 1))];
									switch (Item.type) {
										case 0:
											player.money += Item.amount;
											amountWon[0] += Item.amount;
											break;
										case 1:
											player.xp += Item.amount;
											amountWon[1] += Item.amount;
											break;
										case 2:
											player.money += player.income;
											amountWon[2] += player.income;
											break;
										case 3:
											player.money += (player.income * 2);
											amountWon[3] += (player.income * 2);
											break;
									}
								}
								var msg = quantity + " " + Crate.name + " Crates Opened\n";
								for (var i = 0; i < amountWon.length; i++) {
									if(amountWon[i] == 0)continue;
									switch (i) {
										case 0:
											msg += "You got **$" + numeral(amountWon[i]).format('0,0.00') + "**\n";
											break;
										case 1:
											msg += "You got **" + numeral(amountWon[i]).format('0,0') + "** XP\n";
											break;
										case 2:
											msg += "You got **$" + numeral(amountWon[i]).format('0,0.00') + "** of Instant Income\n";
											break;
										case 3:
											msg += "You got **$" + numeral(amountWon[i]).format('0,0.00') + "** of Instant Income\n";
											break;
									}
								}
								self.disnode.bot.SendCompactEmbed(command.msg.channel, "Crates", msg, 3447003);
								self.utils.updatePlayerLastMessage(player);
								self.utils.updateLastSeen(player);
								self.utils.checkLV(player, command.msg.channel);
								self.utils.DB.Update("players", {
									"id": player.id
								}, player);
								self.utils.DB.Update("casinoObj", {
									"id": self.state.data.casinoObj.id
								}, self.state.data.casinoObj);
							}else {
								self.disnode.bot.SendCompactEmbed(command.msg.channel, "Error", "You Dont have enough Keys!\nNEED: " + Crate.cost + "\nHAVE: " + player.keys, 16772880);
							}
						}else{
              if(player.keys >= Crate.cost){
                player.keys -= Crate.cost;
                var Item = Crate.items[self.utils.getRandomIntInclusive(0, (Crate.items.length - 1))];
                switch (Item.type) {
                  case 0:
                    player.money += Item.amount;
                    self.disnode.bot.SendCompactEmbed(command.msg.channel, "Complete", "You Opened the **" + Crate.name + "** Crate and got: **" + Item.item + "**", 3447003);
                    break;
                  case 1:
                    player.xp += Item.amount;
                    self.disnode.bot.SendCompactEmbed(command.msg.channel, "Complete", "You Opened the **" + Crate.name + "** Crate and got: **" + Item.item + "**", 3447003);
                    break;
                  case 2:
                    player.money += player.income;
                    self.disnode.bot.SendCompactEmbed(command.msg.channel, "Complete", "You Opened the **" + Crate.name + "** Crate and got: **" + Item.item + "**", 3447003);
                    break;
                  case 3:
                    player.money += (player.income * 2);
                    self.disnode.bot.SendCompactEmbed(command.msg.channel, "Complete", "You Opened the **" + Crate.name + "** Crate and got: **" + Item.item + "**", 3447003);
                    break;
                }
                self.utils.updatePlayerLastMessage(player);
                self.utils.updateLastSeen(player);
                self.utils.checkLV(player, command.msg.channel);
                self.utils.DB.Update("players", {"id":player.id}, player);
                
              }else {
                self.disnode.bot.SendCompactEmbed(command.msg.channel, "Error", "You Dont have enough Keys!\nNEED: " + Crate.cost + "\nHAVE: " + player.keys, 16772880);
              }
            }
          }else {
            self.disnode.bot.SendCompactEmbed(command.msg.channel, "Error", "The ID that you entered is not valid!", 16772880);
          }
          break;
        default:
        var crates = "";
        for (var i = 0; i < self.cratesys.crates.length; i++) {
          crates += " --= ID: **" + i + "** Name: **" + self.cratesys.crates[i].name + "** / **" + self.cratesys.crates[i].cost + "** Keys \n";
          for (var l = 0; l < self.cratesys.crates[i].items.length; l++) {
            crates += " # **" + self.cratesys.crates[i].items[l].item + "**\n";
          }
        }
        self.disnode.bot.SendEmbed(command.msg.channel, {
          color: 3447003,
          author: {},
          fields: [ {
            name: 'Crate System',
            inline: true,
            value: "Crates are boosts that help you keep going! Use the keys that you find in slots to open crates.\nUse `!casino crate open ID` to open a crate!",
          },{
            name: 'Crates',
            inline: false,
            value: crates
          }],
            footer: {}
          }
        );
      }
    });
    return;
  }
  commandStats(command){
    var self = this;
    var visitor = ua('UA-101624094-2', command.msg.userID, {strictCidFormat: false});
    visitor.pageview("Stats Command").send()
    self.utils.getPlayer(command).then(function(player) {
      if(!player.rules){
        self.disnode.bot.SendCompactEmbed(command.msg.channel, "Error", "Please read and accept the rules! `!casino rules`", 16772880);
        return;
      }
      if(self.utils.checkBan(player, command))return;
      if(player.Admin || player.Mod){}else {
        if(!self.utils.doChannelCheck(command)){
          self.disnode.bot.SendCompactEmbed(command.msg.channel, "Error", "Please use the <#269839796069859328> channel for this command", 16772880);
          return;
        }
      }
      if(command.params[0]){
        self.utils.findPlayer(command.params[0]).then(function(res) {
          if(res.found){
            self.utils.DB.Find("players", {}).then(function(players) {
              var orderTop = []
              for (var i = 0; i < players.length; i++) {
                var placed = false;
                for (var x = 0; x < orderTop.length; x++) {
                  if(players[i].money > orderTop[x].money){
                    orderTop.splice(x, 0, players[i]);
                    placed = true;
                    break;
                  }
                }
                if(!placed){
                  orderTop.push(players[i]);
                }
              }
              for (var i = 0; i < orderTop.length; i++) {
                if(res.p.id == orderTop[i].id){
                  var placement = "**Rank**: " + (i+1) + " **out of** " + (orderTop.length);
                  break;
                }
              }
              var slotstats = "**Slot -=- Wins / Plays**:\t  " + res.p.stats.slotWins + " / " + res.p.stats.slotPlays + "\n" +
              "**Slot Wins**:\n " +
              ":cherries: **Single cherries**: " + res.p.stats.slotSingleC + "\n" +
              ":cherries: :cherries: :cherries: **Triple cherries**: " + res.p.stats.slotTripleC + "\n" +
              ":third_place: :third_place: :third_place: **Triple 3\'s**: " + res.p.stats.slot3s + "\n" +
              ":second_place: :second_place: :second_place: **Triple 2\'s**: " + res.p.stats.slot2s + "\n" +
              ":first_place: :first_place: :first_place: **Triple 1\'s**: " + res.p.stats.slot1s + "\n" +
              ":100: :100: :100: **JACKPOTS**: " + res.p.stats.slotJackpots + "\n\n";
              var coinstats = "**Coin Flip -=- Wins / Plays**:\t  " + res.p.stats.coinWins + " / " + res.p.stats.coinPlays + "\n\n" +
                "**Coin Landed on Heads**: " + res.p.stats.coinHeads + "\n" +
                "**Coin Landed on Tails**: " + res.p.stats.coinTails;
              var wheelStats = "**The Wheel -=- Plays / Wins**:\t" + res.p.stats.wheelPlays + " / " +  + res.p.stats.wheelWins + "\n\n" +
                "**General Wheel Stats -=- Won with / Landed On**\n" +
                "**0**: " + res.p.stats.wheel0 + " / " + res.p.stats.wheelLanded0 + "\n" +
                "**Number other than 0**: " + res.p.stats.wheelNumber + " / " + res.p.stats.wheelLandedNumber + "\n" +
                "**1st, 2nd, 3rd**: " + res.p.stats.wheelsections + " / " + res.p.stats.wheelLandedsections + "\n" +
                "**High, Low**: " + res.p.stats.wheellowhigh + " / " + res.p.stats.wheelLandedlowhigh + "\n" +
                "**Even, Odd**: " + res.p.stats.wheelevenodd + " / " + res.p.stats.wheelLandedevenodd + "\n" +
                "**Red, Black**: " + res.p.stats.wheelcolor + " / " + res.p.stats.wheelLandedcolor;
              self.disnode.bot.SendEmbed(command.msg.channel,{
                color: 1433628,
                author: {},
                fields: [ {
                  name: "Stats",
                  inline: false,
                  value: placement,
                }, {
                  name: 'Slots',
                  inline: true,
                  value: slotstats,
                }, {
                  name: 'Wheel',
                  inline: true,
                  value: wheelStats,
                }, {
                  name: 'Coin Flip',
                  inline: true,
                  value: coinstats,
                }],
                  footer: {}
                }
              );
            });
          }else {
            self.disnode.bot.SendCompactEmbed(command.msg.channel, "Error", ":warning: Player card Not Found Please @mention the user you are trying to send to or make sure you have the correct name if not using a @mention! Also make sure they have a account on the game!\n\n" + res.msg, 16772880);
          }
        })
      }else {
        self.utils.DB.Find("players", {}).then(function(players) {
          var orderTop = []
          for (var i = 0; i < players.length; i++) {
            var placed = false;
            for (var x = 0; x < orderTop.length; x++) {
              if(players[i].money > orderTop[x].money){
                orderTop.splice(x, 0, players[i]);
                placed = true;
                break;
              }
            }
            if(!placed){
              orderTop.push(players[i]);
            }
          }
          for (var i = 0; i < orderTop.length; i++) {
            if(player.id == orderTop[i].id){
              var placement = "**Rank**: " + (i+1) + " **out of** " + (orderTop.length);
              break;
            }
          }
          var slotstats = "**Slot -=- Wins / Plays**:\t  " + player.stats.slotWins + " / " + player.stats.slotPlays + "\n" +
          "**Slot Wins**:\n " +
          ":cherries: **Single cherries**: " + player.stats.slotSingleC + "\n" +
          ":cherries: :cherries: :cherries: **Triple cherries**: " + player.stats.slotTripleC + "\n" +
          ":third_place: :third_place: :third_place: **Triple 3\'s**: " + player.stats.slot3s + "\n" +
          ":second_place: :second_place: :second_place: **Triple 2\'s**: " + player.stats.slot2s + "\n" +
          ":first_place: :first_place: :first_place: **Triple 1\'s**: " + player.stats.slot1s + "\n" +
          ":100: :100: :100: **JACKPOTS**: " + player.stats.slotJackpots + "\n\n";
          var coinstats = "**Coin Flip -=- Wins / Plays**:\t  " + player.stats.coinWins + " / " + player.stats.coinPlays + "\n\n" +
            "**Coin Landed on Heads**: " + player.stats.coinHeads + "\n" +
            "**Coin Landed on Tails**: " + player.stats.coinTails;
            var wheelStats = "**The Wheel -=- Plays / Wins**:\t" + player.stats.wheelPlays + " / " +  + player.stats.wheelWins + "\n\n" +
              "**General Wheel Stats -=- Won with / Landed On**\n" +
              "**0**: " + player.stats.wheel0 + " / " + player.stats.wheelLanded0 + "\n" +
              "**Number other than 0**: " + player.stats.wheelNumber + " / " + player.stats.wheelLandedNumber + "\n" +
              "**1st, 2nd, 3rd**: " + player.stats.wheelsections + " / " + player.stats.wheelLandedsections + "\n" +
              "**High, Low**: " + player.stats.wheellowhigh + " / " + player.stats.wheelLandedlowhigh + "\n" +
              "**Even, Odd**: " + player.stats.wheelevenodd + " / " + player.stats.wheelLandedevenodd + "\n" +
              "**Red, Black**: " + player.stats.wheelcolor + " / " + player.stats.wheelLandedcolor;
          self.disnode.bot.SendEmbed(command.msg.channel,{
            color: 1433628,
            author: {},
            fields: [ {
              name: "Stats",
              inline: false,
              value: placement,
            }, {
              name: 'Slots',
              inline: true,
              value: slotstats,
            }, {
              name: 'Wheel',
              inline: true,
              value: wheelStats,
            }, {
              name: 'Coin Flip',
              inline: true,
              value: coinstats,
            }],
              footer: {}
            }
          );
        });
      }
    });
    return;
  }
  commandAdmin(command){
    var self = this;
    var visitor = ua('UA-101624094-2', command.msg.userID, {strictCidFormat: false});
    visitor.pageview("Admin Command").send()
    self.utils.getPlayer(command).then(function(player) {
      if(self.utils.checkBan(player, command))return;
      if(player.Admin == undefined)player.Admin = false;
      if(!player.Admin){
        self.disnode.bot.SendCompactEmbed(command.msg.channel, "Error", ":warning: YOU SHALL NOT PASS! (**You are not an Admin in the Disnode Official Discord Server**)", 16772880);
      }else {
        switch (command.params[0]) {
          case "reset":
            if(command.params[1]){
              self.utils.findPlayer(command.params[1]).then(function(res) {
                if(res.found){
                  res.p.money = 10000;
                  res.p.income = 1000;
                  res.p.xp = 0;
                  res.p.keys = 0;
                  res.p.lv = 1;
                  res.p.nextlv = 500;
                  res.p.maxIncome = 1000;
                  self.utils.DB.Update("players", {"id":res.p.id}, res.p);
                  self.disnode.bot.SendCompactEmbed(command.msg.channel, "Action Complete", ":white_check_mark: Player: " + res.p.name + " Is now reset", 3447003);
                }else {
                  self.disnode.bot.SendCompactEmbed(command.msg.channel, "Error", res.msg, 16772880);
                }
              });
            }
            break;
          case "ban":
            if(command.params[1]){
              self.utils.findPlayer(command.params[1]).then(function(res) {
                if(res.found){
                  if(!res.p.banned){
                    res.p.money = 0;
                    res.p.income = 0;
                    res.p.xp = 0;
                    res.p.keys = 0;
                    res.p.lv = 0;
                    res.p.banned = true;
                    res.p.maxIncome = 1000;
                    if(command.params[2]){
                      res.p.banreason = command.params[2]
                    }else {
                      res.p.banreason = "You have been banned! The admin that banned you didn't provide a reason."
                    }
                    self.utils.DB.Update("players", {"id":res.p.id}, res.p);
                  }else {
                    res.p.money = 10000;
                    res.p.income = 1000;
                    res.p.xp = 0;
                    res.p.keys = 0;
                    res.p.lv = 1;
                    res.p.nextlv = 500;
                    res.p.banned = false;
                      res.p.banreason = "";
                    res.p.maxIncome = 1000;
                    self.utils.DB.Update("players", {"id":res.p.id}, res.p);
                  }
                  self.disnode.bot.SendCompactEmbed(command.msg.channel, "Action Complete", ":white_check_mark: Player: " + res.p.name + " Is now Banned", 3447003);
                }else {
                  self.disnode.bot.SendCompactEmbed(command.msg.channel, "Error", res.msg, 16772880);
                }
              });
            }
            break;
          case "save":
            
            self.disnode.bot.SendCompactEmbed(command.msg.channel, "Complete", ":white_check_mark: Database Saved!", 3447003);
            break;
          case "player":
            switch (command.params[1]) {
              case "get":
                self.utils.findPlayer(command.params[2]).then(function(res) {
                  if(res.found){
                    self.disnode.bot.SendMessage(command.msg.channel, "```json\n" + JSON.stringify(res.p, false, 2) + "```");
                  }else {
                    self.disnode.bot.SendCompactEmbed(command.msg.channel, "Error", res.msg, 16772880);
                  }
                });
                break;
              case "set":
                switch (command.params[2]) {
                  case "money":
                    self.utils.findPlayer(command.params[3]).then(function(res) {
                      if(res.found){
                        var setTo = numeral(command.params[4]).value();
                        if(setTo >= 0)res.p.money = setTo;
                        self.utils.DB.Update("players", {"id":res.p.id}, res.p);
                        self.disnode.bot.SendCompactEmbed(command.msg.channel, "Complete", res.p.name + " Money set to: $" + setTo, 3447003);
                      }else {
                        self.disnode.bot.SendCompactEmbed(command.msg.channel, "Error", res.msg, 16772880);
                      }
                    });
                    break;
                  case "income":
                    self.utils.findPlayer(command.params[3]).then(function(res) {
                      if(res.found){
                        var setTo = numeral(command.params[4]).value();
                        if(setTo >= 0)res.p.income = setTo;
                        self.utils.DB.Update("players", {"id":res.p.id}, res.p);
                        self.disnode.bot.SendCompactEmbed(command.msg.channel, "Complete", res.p.name + " Income set to: $" + setTo, 3447003);
                      }else {
                        self.disnode.bot.SendCompactEmbed(command.msg.channel, "Error", res.msg, 16772880);
                      }
                    });
                    break;
                  case "xp":
                    self.utils.findPlayer(command.params[3]).then(function(res) {
                      if(res.found){
                        var setTo = numeral(command.params[4]).value();
                        if(setTo >= 0)res.p.xp = setTo;
                        self.utils.DB.Update("players", {"id":res.p.id}, res.p);
                        self.disnode.bot.SendCompactEmbed(command.msg.channel, "Complete", res.p.name + " XP set to: " + setTo, 3447003);
                      }else {
                        self.disnode.bot.SendCompactEmbed(command.msg.channel, "Error", res.msg, 16772880);
                      }
                    });
                    break;
                  case "name":
                    self.utils.findPlayer(command.params[3]).then(function(res) {
                      if(res.found){
                        var setTo = command.params[4];
                        var oldname = res.p.name;
                        res.p.name = setTo;
                        self.utils.DB.Update("players", {"id":res.p.id}, res.p);
                        self.disnode.bot.SendCompactEmbed(command.msg.channel, "Complete", oldname + " Name set to: " + setTo, 3447003);
                      }else {
                        self.disnode.bot.SendCompactEmbed(command.msg.channel, "Error", res.msg, 16772880);
                      }
                    });
                    break;
                  case "lv":
                    self.utils.findPlayer(command.params[3]).then(function(res) {
                      if(res.found){
                        var setTo = numeral(command.params[4]).value();
                        if(setTo >= 0)res.p.lv = setTo;
                        self.utils.DB.Update("players", {"id":res.p.id}, res.p);
                        self.disnode.bot.SendCompactEmbed(command.msg.channel, "Complete", res.p.name + " LV set to: " + setTo, 3447003);
                      }else {
                        self.disnode.bot.SendCompactEmbed(command.msg.channel, "Error", res.msg, 16772880);
                      }
                    });
                    break;
                  case "maxincome":
                    self.utils.findPlayer(command.params[3]).then(function(res) {
                      if(res.found){
                        var setTo = numeral(command.params[4]).value();
                        if(setTo >= 0)res.p.maxIncome = setTo;
                        self.utils.DB.Update("players", {"id":res.p.id}, res.p);
                        self.disnode.bot.SendCompactEmbed(command.msg.channel, "Complete", res.p.name + " Max Income set to: $" + setTo, 3447003);
                      }else {
                        self.disnode.bot.SendCompactEmbed(command.msg.channel, "Error", res.msg, 16772880);
                      }
                    });
                    break;
                  case "keys":
                    self.utils.findPlayer(command.params[3]).then(function(res) {
                      if(res.found){
                        var setTo = numeral(command.params[4]).value();
                        if(setTo >= 0)res.p.key = setTo;
                        self.utils.DB.Update("players", {"id":res.p.id}, res.p);
                        self.disnode.bot.SendCompactEmbed(command.msg.channel, "Complete", res.p.name + " Keys set to: " + setTo, 3447003);
                      }else {
                        self.disnode.bot.SendCompactEmbed(command.msg.channel, "Error", res.msg, 16772880);
                      }
                    });
                    break;
                  case "admin":
                    self.utils.findPlayer(command.params[3]).then(function(res) {
                      if(res.found){
                        if(command.params[4] == "true")res.p.Admin = true;
                        if(command.params[4] == "false")res.p.Admin = false;
                        self.utils.DB.Update("players", {"id":res.p.id}, res.p);
                        self.disnode.bot.SendCompactEmbed(command.msg.channel, "Complete", res.p.name + " Admin set to: " + command.params[4], 3447003);
                      }else {
                        self.disnode.bot.SendCompactEmbed(command.msg.channel, "Error", res.msg, 16772880);
                      }
                    });
                    break;
                  case "mod":
                    self.utils.findPlayer(command.params[3]).then(function(res) {
                      if(res.found){
                        if(command.params[4] == "true")res.p.Mod = true;
                        if(command.params[4] == "false")res.p.Mod = false;
                        self.utils.DB.Update("players", {"id":res.p.id}, res.p);
                        self.disnode.bot.SendCompactEmbed(command.msg.channel, "Complete", res.p.name + " Mod set to: " + command.params[4], 3447003);
                      }else {
                        self.disnode.bot.SendCompactEmbed(command.msg.channel, "Error", res.msg, 16772880);
                      }
                    });
                    break;
                  default:

                }
                break;
              default:

            }
            break;
          case "prem":
            self.utils.findPlayer(command.params[1]).then(function(res) {
              if(res.found){
                if(command.params[2] == "true"){
                  res.p.Premium = true;
                  res.p.money += 25000;
                  res.p.xp += 2000;
                }else if(command.params[2] == "false"){
                  res.p.Premium = false;
                }
                self.utils.DB.Update("players", {"id":res.p.id}, res.p);
                self.disnode.bot.SendCompactEmbed(command.msg.channel, "Complete", res.p.name + " Premium set to: " + res.p.Premium, 3447003);
              }else {
                self.disnode.bot.SendCompactEmbed(command.msg.channel, "Error", res.msg, 16772880);
              }
            });
            break;
          case "eval":
            command.params.splice(0,1);
            var code = command.params.join(" ");
            console.log(code);
            try {
              var evaled = eval(code);
              if(typeof evaled !== "string")evaled = require("util").inspect(evaled);
              self.disnode.bot.SendMessage(command.msg.channel,"```\n" + evaled + "\n```");
            } catch (e) {
              self.disnode.bot.SendMessage(command.msg.channel,"```\n" + e + "\n```");
            }
            break;
          case "listprem":
            self.utils.DB.Find("players", {}).then(function(players) {
              var msg = "";
              for (var i = 0; i < players.length; i++) {
                if(players[i].Premium){
                  self.utils.ultraCheck(players[i]).then(function(data) {

                  });
                  msg += players[i].name + "\n";
                }
              }
              self.disnode.bot.SendCompactEmbed(command.msg.channel, "Premium Users", msg, 3447003);
            });
            break;
          default:

        }
      }
    });
    return;
  }
  commandMod(command){
    var self = this;
    var visitor = ua('UA-101624094-2', command.msg.userID, {strictCidFormat: false});
    visitor.pageview("Mod Command").send()
    self.utils.getPlayer(command).then(function(player) {
      if(self.utils.checkBan(player, command))return;
      if(player.Mod == undefined)player.Mod = false;
      if(!player.Mod){
        self.disnode.bot.SendCompactEmbed(command.msg.channel, "Error", ":warning: YOU SHALL NOT PASS! (**You are not a Moderator or above in the Disnode Official Discord Server**)", 16772880);
      }else {
        switch (command.params[0]) {
          case "cleartimers":
          self.utils.DB.Find("players", {}).then(function(players) {
            var msg = "";
            for (var i = 0; i < players.length; i++) {
              players[i].lastMessage = null;
              self.utils.DB.Update("players", {"id":players[i].id}, players[i]);
            }
            self.disnode.bot.SendCompactEmbed(command.msg.channel, "Premium Users", ":white_check_mark: Timeouts Cleared!", 3447003);
          });
            break;
          default:

        }
      }
    });
    return;
  }
  commandStore(command){
    var self = this;
    var visitor = ua('UA-101624094-2', command.msg.userID, {strictCidFormat: false});
    visitor.pageview("Store Command").send()
    self.utils.getPlayer(command).then(function(player) {
      if(!player.rules){
        self.disnode.bot.SendCompactEmbed(command.msg.channel, "Error", "Please read and accept the rules! `!casino rules`", 16772880);
        return;
      }
      if(self.utils.checkBan(player, command))return;
      if(player.Admin || player.Mod){}else {
        if(!self.utils.doChannelCheck(command)){
          self.disnode.bot.SendCompactEmbed(command.msg.channel, "Error", "Please use the <#269839796069859328> channel for this command", 16772880);
          return;
        }
      }
      switch (command.params[0]) {
        case "list":
          var msg = "**ID**\t//\t**ITEM**\t//\t**COST**\n";
          for (var i = 0; i < self.store.length; i++) {
            var cost;
            if(player.Admin || player.Premium){
              cost = (self.store[i].cost /2)
            }else cost = self.store[i].cost;
            if(self.store[i].type == 1){
              msg += "" + i + "\t//\t" + self.store[i].item + "\t//\t$" + numeral(cost).format('0,0.00') + "\n";
            }else {
              msg += "" + i + "\t//\t" + self.store[i].item + "\t//\t" + cost + "XP\n";
            }
          }
          msg += "\n\n**XP:** " + player.xp + "\nStore items are subject to change, please be aware of prices and items PRIOR to making a purchase!";
          var title;
          if(player.Admin || player.Premium){
            title = "Premium Store List";
          }else title = "Store List";
          self.disnode.bot.SendCompactEmbed(command.msg.channel, title, msg);
          break;
        case "buy":
          if(command.params[1] && (command.params[1] >= 0 && command.params[1] <= (self.store.length - 1))){
            var ID = parseInt(command.params[1]);
            var quantity = 0;
            if(command.params[2] == "max"){
              if(player.Admin || player.Premium){
                if(self.store[ID].type == 0){
                  quantity = Math.floor((player.xp / (self.store[ID].cost / 2)));
                }else {
                  var remainMax = player.maxIncome - player.income;
                  var counter = 0;
                  var cost = (self.store[ID].cost /2);
                  while (true) {
                    if((counter * cost) >= player.money)break;
                    if((counter * self.store[ID].amount) >= remainMax)break;
                    counter++;
                  }
                  quantity = counter - 1;
                }
              }else {
                if(self.store[ID].type == 0){
                  quantity = Math.floor((player.xp / (self.store[ID].cost)));
                }else {
                  var remainMax = player.maxIncome - player.income;
                  var counter = 1;
                  var cost = (self.store[ID].cost);
                  while (true) {
                    if((counter * cost) >= player.money)break;
                    if((counter * self.store[ID].amount) >= remainMax)break;
                    counter++;
                  }
                  quantity = counter - 1;
                }
              }
            }else{
              quantity = numeral(command.params[2]).value();
            }
            if(quantity < 1){
              quantity = 1;
            }
            if(self.store[ID].type == 1){
              var remainMax = player.maxIncome - player.income;
              if(((self.store[ID].amount * quantity)) > remainMax){
                console.log((self.store[ID].amount * quantity) + " / " + remainMax);
                self.disnode.bot.SendCompactEmbed(command.msg.channel, "Error", ":warning: Such transaction will exceed your Max Income of: $" + numeral(player.maxIncome).format('0,00.00') + "\nLevel up to increase this max.", 16772880);
                return;
              }
            }
            var cost;
            if(player.Admin || player.Premium){
              cost = (self.store[ID].cost /2) * quantity;
            }else cost = self.store[ID].cost * quantity;
            var costString;
            if(self.store[ID].type == 1){
              costString =  "$" + cost;
              if(player.money < cost){
                self.disnode.bot.SendCompactEmbed(command.msg.channel, "Error", ":warning: You dont have that much Money!\nNeed: $" + cost + "\nYou have: $" + player.money, 16772880);
                return;
              }
            }else {
              costString = cost + " XP"
              if(player.xp < cost){
                self.disnode.bot.SendCompactEmbed(command.msg.channel, "Error", ":warning: You dont have that much XP!\nNeed: " + cost + "XP\nYou have: " + player.xp, 16772880);
                return;
              }
            }
            switch (self.store[ID].type) {
              case 0:
                player.xp -= cost;
                player.money += (self.store[ID].amount * quantity);
                break;
              case 1:
                player.money -= cost;
                player.income += (self.store[ID].amount * quantity);
                break;
              default:
                break;
            }
            self.disnode.bot.SendEmbed(command.msg.channel, {
              color: 1433628,
              author: {},
              fields: [ {
                name: "Store",
                inline: false,
                value: ":white_check_mark: Your purchase of `" + quantity + "x " + self.store[ID].item + "` was successful! Thank you for your business!",
              }, {
                name: 'Money',
                inline: true,
                value: "$" + numeral(player.money).format('0,0.00'),
              }, {
                name: 'Income / 30min.',
                inline: true,
                value: "$" + numeral(player.income).format('0,0.00'),
              }, {
                name: 'XP',
                inline: true,
                value: player.xp,
              }],
                footer: {}
              }
            );
            self.utils.updateLastSeen(player);
            self.utils.DB.Update("players", {"id":player.id}, player);
            
          }
          break;
        default:
          self.disnode.bot.SendCompactEmbed(command.msg.channel, "Store", "Welcome to the store! To see a list of items, use `!casino store list`. When buying, use the ID of that item; for example: `!casino store buy 0`. If you want to purchase one or more of the item, use `!casino store buy 0 10`. To buy as much as you can, use `!casino store buy 0 max`.");
      }
    });
    return;
  }
  commandTransfer(command){
    var self = this;
    var visitor = ua('UA-101624094-2', command.msg.userID, {strictCidFormat: false});
    visitor.pageview("Transfer Command").send()
    self.utils.getPlayer(command).then(function(player) {
      if(!player.rules){
        self.disnode.bot.SendCompactEmbed(command.msg.channel, "Error", "Please read and accept the rules! `!casino rules`", 16772880);
        return;
      }
      if(self.utils.checkBan(player, command))return;
      if(player.Admin || player.Mod){}else {
        if(!self.utils.doChannelCheck(command)){
          self.disnode.bot.SendCompactEmbed(command.msg.channel, "Error", "Please use the <#269839796069859328> channel for this command", 16772880);
          return;
        }
      }
      var timeoutInfo = self.utils.checkTimeout(player, 5);
      if(player.Premium)timeoutInfo = self.utils.checkTimeout(player, 2);
      if(player.Admin)timeoutInfo = self.utils.checkTimeout(player, 0);
      if(!timeoutInfo.pass){
        logger.Info("Casino", "Slot", "Player: " + player.name + " Tried the slots before their delay of: " + timeoutInfo.remain.sec);
        self.disnode.bot.SendCompactEmbed(command.msg.channel, "Error", ":warning: You must wait **" + timeoutInfo.remain + "** before playing again.", 16772880);
        return;
      }
      if(command.params[0]){
        self.utils.findPlayer(command.params[0]).then(function(res) {
          if(res.found){
            var transferPlayer = res.p;
            var toTransfer = numeral(command.params[1]).value();
            if(transferPlayer.id == player.id){
              self.disnode.bot.SendCompactEmbed(command.msg.channel, "Error", "You cant transfer to yourself!", 16772880);
              return;
            } else if (transferPlayer.lv < 3) {
							self.disnode.bot.SendCompactEmbed(command.msg.channel, "Error", "You cant transfer to a player whos level is less than 3!", 16772880);
							return;
						}
            if(toTransfer > 0){
              if(toTransfer > player.money){
                self.disnode.bot.SendCompactEmbed(command.msg.channel, "Error", ":warning: You dont have that much Money! You have $" + numeral(player.money).format('0,0.00'), 16772880);
                return;
              }else {
                var pbalbef = player.money
                var sbalbef = transferPlayer.money
                player.money -= toTransfer;
                transferPlayer.money += toTransfer
                player.money = Number(parseFloat(player.money).toFixed(2));
                transferPlayer.money = Number(parseFloat(transferPlayer.money).toFixed(2));
                self.disnode.bot.SendEmbed(command.msg.channel, {
                  color: 3447003,
                  author: {},
                  fields: [ {
                    name: 'From',
                    inline: false,
                    value: player.name + "\nBalance Prior: $" + numeral(pbalbef).format('0,0.00') + "\nBalance After: $" + numeral(player.money).format('0,0.00'),
                  }, {
                    name: 'To',
                    inline: false,
                    value: transferPlayer.name + "\nBalance Prior: $" + numeral(sbalbef).format('0,0.00') + "\nBalance After: $" + numeral(transferPlayer.money).format('0,0.00'),
                  }, {
                    name: 'Amount',
                    inline: true,
                    value: "$ " + numeral(toTransfer).format('0,0.00'),
                  }, {
                    name: "Status",
                    inline: false,
                    value: ":white_check_mark: Transfer complete!",
                  }],
                    footer: {}
                  }
                );
                self.utils.DB.Update("players", {"id":transferPlayer.id}, transferPlayer);
                self.utils.DB.Update("players", {"id":player.id}, player);
                return;
              }
            }else {
              self.disnode.bot.SendCompactEmbed(command.msg.channel, "Error", ":warning: Please enter a number for the transfer amount! example `!casino transfer FireGamer3 100`", 16772880);
            }
          }else {
            self.disnode.bot.SendCompactEmbed(command.msg.channel, "Error", res.msg, 16772880);
          }
        });
      }else {
				self.disnode.bot.SendCompactEmbed(command.msg.channel, "transfer", "This command allows you to transfer money from one person to another as long as the other person is lv 3. Example `!casino transfer FireGamer3 100`");
			}
    });
    return;
  }
  commandBlackjack(command){
    var self = this;
    var visitor = ua('UA-101624094-2', command.msg.userID, {strictCidFormat: false});
    visitor.pageview("BlackJack Command").send()
    self.utils.getPlayer(command).then(function(player) {
      if(!player.rules){
        self.disnode.bot.SendCompactEmbed(command.msg.channel, "Error", "Please read and accept the rules! `!casino rules`", 16772880);
        return;
      }
      if(!player.Premium){
        self.disnode.bot.SendCompactEmbed(command.msg.channel, "Error", ":warning: Blackjack is an Ultra exclusive Command. Only Ultra members may access this game mode. To learn more about Ultra and its perks, look at the bottom of `!casino` Thanks for your support of our bots!", 16772880);
        return;
      }
      switch (command.params[0]) {
        case "start":
          if(command.params[1]){
            var wager;
            if(command.params[1].toLowerCase() == "allin"){
              wager = numeral(player.money).value();
            }else{
              wager = numeral(command.params[1]).value();
            }
            if(wager > 0){
              if(player.money >= wager){
                player.money -= wager;
                self.Blackjack.newGame(player, wager, command.msg.channel);
              }else {
                self.disnode.bot.SendCompactEmbed(command.msg.channel, "Error", ":warning: You dont have that much Money! You have $" + numeral(player.money).format('0,0.00'), 16772880);
              }
            }
          }
          break;
        case "hit":
          self.Blackjack.hit(player, command.msg.channel);
          break;
        case "stand":
          self.Blackjack.stand(player, command.msg.channel);
          break;
        default:
          var commands = "`!casino 21 start (bet)` - Start a game of blackjack with a Wager amount\n`!casino 21 hit` - Draw a card (In game)\n`!casino 21 stand` - End your turn and let the dealer start playing (In game)";
          self.disnode.bot.SendCompactEmbed(command.msg.channel,"Blackjack", commands);
          break;
      }
      self.utils.handleRecentBetters(player);
      self.utils.updateLastSeen(player);
      self.utils.checkLV(player, command.msg.channel);
      self.utils.updatePlayerLastMessage(player);
      self.utils.DB.Update("players", {"id":player.id}, player);
    });
    return;
  }
  commandRules(command){
    var self = this;
    var visitor = ua('UA-101624094-2', command.msg.userID, {strictCidFormat: false});
    visitor.pageview("Rules Command").send()
    switch (command.params[0]) {
      case "accept":
        self.utils.getPlayer(command).then(function(player) {
          player.rules = true;
          self.utils.DB.Update("players", {"id":player.id}, player);
          self.disnode.bot.SendCompactEmbed(command.msg.channel, "Rules", "Thanks for accepting the rules! Enjoy our bot.");
        });
        break;
      default:
      self.disnode.bot.SendEmbed(command.msg.channel, {
        color: 1433628,
        author: {},
        fields: [ {
          name: 'Casino Rules',
          inline: false,
          value: "Hello, please read the rules before using our bot.",
        }, {
          name: 'ALTS (alternate accounts)',
          inline: false,
          value: "ALTS or the use of alternate accounts are not allowed. Anyone using an ALT will have that ALT banned; __**no exceptions**__.",
        }, {
          name: 'Accept',
          inline: false,
          value: "To accept these rules, type !casino rules accept (__read all of the rules first__).",
        }, {
          name: 'Bots and Macros',
          inline: false,
          value: "The use of bots and/or macros aren't allowed.",
        }, {
          name: 'Ultra',
          inline: false,
          value: "If you want to get Ultra, visit this link: https://www.disnodeteam.com/ultra - account resets no longer occur as you can pay when able.",
        }, {
          name: 'Data Collection',
	        inline: false,
	        value: "We, Disnode Team, only collect usernames upon the first command you issue to the bot. Currently, that is the only EUD we collect with Casino Bot.",
	      }, {
	        name: 'Discord TOS',
	        inline: false,
	        value: "With a new revision to the Discord TOS on 8/20/2017, if you accept the rules, you agree that we collect the data described above, and that you agree to the Discord TOS (https://www.discordapp.com/developers/docs/legal) and the Discord Privacy Policy (https://www.discordapp.com/privacy).",
	      }],
        footer: {}
      });
    }
    return;
  }
  commandUltra(command){
    var self = this;
    var visitor = ua('UA-101624094-2', command.msg.userID, {strictCidFormat: false});
    visitor.pageview("Ultras Command").send()
    self.utils.getPlayer(command).then(function(player) {
      self.utils.ultraCheck(player).then(function(data) {
        if(data.isUltra){
          self.disnode.bot.SendEmbed(command.msg.channel, {
            color: 1433628,
            author: {},
            fields: [ {
              name: 'Ultra',
              inline: false,
              value: "" + data.isUltra,
            }, {
              name: 'Expires On',
              inline: true,
              value: "" + dateformat(new Date(data.expiresOn), "dddd, mmmm dS, yyyy, h:MM:ss TT"),
            }, {
              name: 'Purchased On',
              inline: true,
              value: "" + dateformat(new Date(data.purchasedOn), "dddd, mmmm dS, yyyy, h:MM:ss TT"),
            }],
            footer: {
              text: command.msg.user,
              icon_url: self.utils.avatarCommandUser(command),
            },
            timestamp: new Date(),
            });
        }else {
          self.disnode.bot.SendCompactEmbed(command.msg.channel, "Ultra", "You Dont have Ultra!");
        }
        self.utils.DB.Update("players", {"id":player.id}, player);
      }).catch(function(err) {
        console.log(err);
        self.disnode.bot.SendCompactEmbed(command.msg.channel, "Error", ":warning: Something went wrong! try again!\n" + err, 16772880);
        return;
      });
    });
  }
}

module.exports = CasinoPlugin;
