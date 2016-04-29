"use strict"
class AudioPlayer {
	constructor(bot, fs){
		this.bot = bot;
		this.fs = fs;
	}
	playFile(path, parms, bot, cb){
		var connection = bot.internal.voiceConnection;
		console.log(path + parms[0] + ".mp3");
		var volume = 0.8;
		if(parms[1]){
			if(parseFloat(parms[1])){
				if(parseFloat(parms[1]) <= 3){
					volume = parseFloat(parms[1]);
					console.log("[AudioPlayer] Set volume:" + volume);
					connection.setVolume(volume);
				}else{
					console.log("[AudioPlay] Volume over threshold! Remains default");
					// Callback used for in execution for more info loud is used as a keyword so the bot can use it's own message
					cb("loud");
				}
			}else{
				console.log("[AudioPlay] Second Parms not Float");
			}
			var converted = parseFloat(parms[1]);

		}
		else{
			console.log("[AudioPlay] No Volume Parm");
		}
		connection.playFile(path + parms[0] + ".mp3", volume);
		console.log("Playing At: " + volume);
	}
	// Unused right now but will be used later
	playFileWithID(path, parms, bot, id){
		var connection = bot.internal.voiceConnection.voiceChannel(id);
		console.log(path + parms[0] + ".mp3");
		var volume = 0.8;
		if(parms[1]){
			if(parseFloat(parms[1])){
				volume = parseFloat(parms[1]);
				console.log("[AudioPlayer] Set volume:" + volume);
				connection.setVolume(volume);
			}else{
				console.log("[AudioPlay] Secound Parms not Float");
			}
			var converted = parseFloat(parms[1]);

		}
		else{
			console.log("[AudioPlay] No Volume Parm");
		}
		connection.playFile(path + parms[0] + ".mp3", volume);
		console.log("Playing At: " + volume);
	}
	stopPlaying(bot){
		var connection = bot.internal.voiceConnection;
		connection.stopPlaying();
	}

	listAll(walk, path, callback, done){
		var walker;
		walker = walk.walk(path);
		walker.on("file", function(root, fileStats, next){
			var command = "play "+fileStats.name.substring(0,fileStats.name.indexOf("."));
			callback(command);
			next();
		});
		walker.on("errors", function (root, nodeStatsArray, next) {
			console.log(nodeStatsArray);
			next();
		});
		walker.on("end", function () {
			done();
			console.log("DONE");
		});
	}
}

module.exports.AudioPlayer = AudioPlayer;