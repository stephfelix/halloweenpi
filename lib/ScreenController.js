var exec = require('child_process').exec;
var spawn = require('child_process').spawn;

var ScreenController = function(images, logger) {

	var lastRandomIndex;

	this.init = function() {
		doClearScreen();
	}

	function doClearScreen(callback) {
		logger.info("Clearing the screen");
		exec('dd if=/dev/zero of=/dev/fb0', (err, stdout, stderr) => {
		  if (err) {
		    // node couldn't execute the command
		    // in this case it's probably "no space left on device, which is expected"
		    // logger.error("Error displaying image: " + err);
		    // logger.error("stdout: " + stdout);
		    // logger.error("stderr: " + stderr);
		  }

		  if(callback){
		  	callback(err);
		 	}
		});
	}

	function randomImage() {
		var randomIndex = 0;
		do {
			randomIndex = Math.floor(Math.random() * images.length);
		} while (randomIndex === lastRandomIndex);
		lastRandomIndex = randomIndex;

		return images[randomIndex];
	}

	var imageTimeout;
	var fim;

	this.displayRandomImage = function() {
		var image = randomImage();

		logger.info("Displaying image " + image)
		fim = spawn('fim', ['-a', '-q', image], {
			stdio: 'ignore'
		});

		fim.on('close', (code, signal) => {
			clearTimeout(imageTimeout);
		  logger.info(
		    `child process terminated due to receipt of signal ${signal}`);
		  fim = null;
		});

		imageTimeout = setTimeout(function(){
			fim.kill('SIGTERM');
			fim = null;
			doClearScreen();
		}, 10 * 1000);

		return function() {
			clearTimeout(imageTimeout);
			if(fim){
				fim.kill('SIGTERM');
				fim = null;
			}
			doClearScreen();
		};
	}

	this.clear = function() {
		clearTimeout(imageTimeout);
			if(fim){
				fim.kill('SIGTERM');
				fim = null;
			}
			doClearScreen();
	}

}

module.exports = ScreenController;