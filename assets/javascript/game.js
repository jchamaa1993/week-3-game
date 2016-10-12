var gameStatistics = {
			// How many guesses you have before you lose.
			guessesLeft: 5,
			// How many wins you have.
			wins: 0,
			// Guesses made so far.
			guesses: new Array(),
			// Wrong Guess List.
			wrongGuesses: new Array(),
			// Button Counter
			buttonCounter: 0,
			// Reset game after win.
			resetWins: function() {
				this.wins() = 0;
			},
			restartGame: function() {
				// Reset number of guesses left.
				this.guessesLeft = 5;
				// Reset guesses made so far.
				this.guesses = new Array();
				// Reset guess list.
				this.wrongGuesses = "";
				// Computer picks a word.
				chosenWord=hangmanWord.chooseName();
				// Replaces first and second names with underscores.
				replacedFirstName=hangmanWord.replaceWord(chosenWord[0]);
				replacedSecondName=hangmanWord.replaceWord(chosenWord[1]);
				// Lower case version of chosen name.
				lowerCaseFirstName=chosenWord[0].toLowerCase();
				lowerCaseSecondName=chosenWord[1].toLowerCase();
				// This will remain as all underscores. Used to find location of underscore to replace.
				underscoreFirstName=replacedFirstName;
				underscoreSecondName=replacedSecondName;
				// Restart first name check.
				firstNameCheck = hangmanWord.addSpace(lowerCaseFirstName);
				secondNameCheck = hangmanWord.addSpace(lowerCaseSecondName);
				// Put in HTMl
				document.getElementById("firstName").innerHTML = replacedFirstName;
				document.getElementById("secondName").innerHTML = replacedSecondName;
				document.getElementById("guessesLeft").innerHTML = this.guessesLeft;
				document.getElementById("wrongGuessDiv").innerHTML = this.wrongGuesses;
				// Listen for keys. This is how the game works. (Hopefully)
			},
}
var hangmanWord = {
	// Current available words
	// wordBank: ["Kobe Bryant", "D'Angelo Russell","Julius Randle","Brandon Ingram","Shaquille O'neal","Timofey Mozgov","Robert Horry", "Meta World Peace","Jose Calderon","Pau Gasol","Andrew Bynum","Magic Johnson","Kareem Abdul-Jabbar","Derek Fisher"],
	// Choose a random word from the word bank
	firstNameBank: ["Kobe", "Timofey","Magic","Smush","Robert","Julius","Lou"],
	secondNameBank: ["Bryant", "Mozgov","Johnson","Parker","Horry","Randle","Williams"],

	chooseName: function() {
		var randomNumber=Math.floor(Math.random() * this.firstNameBank.length);
		var chosenFirstName=this.firstNameBank[randomNumber];
		var chosenSecondName=this.secondNameBank[randomNumber];
		return [chosenFirstName,chosenSecondName];
	},
	replaceWord: function(str) {
		var newWord = str.replace(/[a-z]/gi, '_ ');
		return newWord;
	},
	// Find location of desired underscore.
	nthOcurrence: function(str, needle, nth) {
	  for (i=0;i<str.length;i++) {
	    if (str.charAt(i) == needle) {
	        if (!--nth) {
	           return i;    
	        }
	    }
	  }
	  return -1;
	},

	fillInBlanks: function(str1, char1, p1) {
		if(p1>str1.length){
			return str;
		}
		return str1.substr(0,p1) + char1 + str1.substr(p1+1);
	},

	addSpace: function(str1) {
		return str1.split('').join(' ')
	},

	capitalizeCharacter: function(str) {
	    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
	},

}
// Computer picks a word.
var chosenWord=hangmanWord.chooseName();
// Replaces first and second names with underscores.
var replacedFirstName=hangmanWord.replaceWord(chosenWord[0]);
var replacedSecondName=hangmanWord.replaceWord(chosenWord[1]);
// Lower case version of chosen name.
var lowerCaseFirstName=chosenWord[0].toLowerCase();
var lowerCaseSecondName=chosenWord[1].toLowerCase();
// This will remain as all underscores. Used to find location of underscore to replace.
var underscoreFirstName=replacedFirstName;
var underscoreSecondName=replacedSecondName;
// The name to check by adding spaces.
var firstNameCheck = hangmanWord.addSpace(lowerCaseFirstName);
var secondNameCheck = hangmanWord.addSpace(lowerCaseSecondName);
// Image element to place in Image.
// Put in HTMl
document.getElementById("firstName").innerHTML = replacedFirstName;
document.getElementById("secondName").innerHTML = replacedSecondName;
document.getElementById('wins').innerHTML = gameStatistics.wins;
document.getElementById("guessesLeft").innerHTML = gameStatistics.guessesLeft;
// Listen for keys. This is how the game works. (Hopefully)
document.onkeyup = function(event) {
	if(gameStatistics.guessesLeft===0) {
		// Add button to restart game.
		var audioLoser = new Audio('assets/audio/loserAudio.mp3');
		audioLoser.play();
		if(gameStatistics.buttonCounter === 0) {
			gameStatistics.buttonCounter++;
			var restartButton = document.createElement("BUTTON");
			var buttonText = document.createTextNode("Restart Game");
			restartButton.setAttribute("class","btn");
			restartButton.appendChild(buttonText);
			restartButton.onclick = function() {
				gameStatistics.wins =0;
				gameStatistics.restartGame();};
			document.getElementById("textDiv").appendChild(restartButton);
		}
		return;
	}
	var userGuess = String.fromCharCode(event.keyCode).toLowerCase();

	for(var j=0; j<gameStatistics.guesses.length;j++) {
		if(userGuess===gameStatistics.guesses[j]) {
			return;
		}
	}

	if(gameStatistics.guesses.length===0) {
		gameStatistics.guesses.push(userGuess);
	}
	// Doesn't count as a guess if it's not a letter.
	if (!/[a-zA-Z]/.test(userGuess)) {
		return;
	}
	// Add input to list of guesses if it hasn't been gussed yet.
	gameStatistics.guesses.push(userGuess)
	// create boolean to check if the character was in first name. Will use later.
	var characterFoundInFirstName=false;
	for(var i=0;i<lowerCaseFirstName.length;i++) {
		if(userGuess===lowerCaseFirstName[i]) {
			indexOfUnderscoreToReplace=hangmanWord.nthOcurrence(underscoreFirstName, '_', i+1);
			replacedFirstName=hangmanWord.fillInBlanks(replacedFirstName, userGuess, indexOfUnderscoreToReplace);
			// replacedFirstName=hangmanWord.removeSpace(replacedFirstName, userGuess);
			// underscoreFirstName=hangmanWord.removeSpace(underscoreFirstName, '_');
			// if(i===0) {
			// 	hangmanWord.capitalizeCharacter(replacedFirstName[i]);
			// }
			document.getElementById("firstName").innerHTML = replacedFirstName;
			characterFoundInFirstName=true;
		} 
	}
	// Do the same thing for second name.
	var characterFoundInSecondName=false;
	for(var i=0;i<lowerCaseSecondName.length;i++) {
		if(userGuess===lowerCaseSecondName[i]) {
			indexOfUnderscoreToReplace=hangmanWord.nthOcurrence(underscoreSecondName, '_', i+1);
			replacedSecondName=hangmanWord.fillInBlanks(replacedSecondName, userGuess, indexOfUnderscoreToReplace);
			// replacedSecondName=hangmanWord.removeSpace(replacedSecondName, userGuess);
			// underscoreSecondName=hangmanWord.removeSpace(underscoreSecondName, '_');
			document.getElementById("secondName").innerHTML = replacedSecondName;
			characterFoundInSecondName=true;
		} 
	}
	// If character not found in either name. Minus one guess left. Also add to list of letters guessed incorrectly.
	
	if((characterFoundInFirstName===false) && (characterFoundInSecondName===false))
	{
		gameStatistics.guessesLeft--;
		document.getElementById("guessesLeft").innerHTML = gameStatistics.guessesLeft;
		if(gameStatistics.wrongGuesses.length === 0) {
			gameStatistics.wrongGuesses += userGuess;
		} else { 
			gameStatistics.wrongGuesses += ", " +userGuess;
		}
		document.getElementById("wrongGuessDiv").innerHTML = gameStatistics.wrongGuesses;
	}
	if((replacedFirstName.substr(0,replacedFirstName.length-1)===firstNameCheck) && (replacedSecondName.substr(0,replacedSecondName.length-1)===secondNameCheck)) {
		gameStatistics.wins++;
		var audioWinner = new Audio('assets/audio/winnerAudio.mp3');
		audioWinner.play();
		var sparklyName = document.createElement("div");
		sparklyName.innerHTML = chosenWord[0] + " " + chosenWord[1];
		sparklyName.id = "sparklyText";
		document.getElementById("replaceText").innerHTML = "You are correct! The answer was: ";
		document.getElementById("replaceText").appendChild(sparklyName);
		if(chosenWord[0] === "Kobe") {
			document.getElementById("lakersImages").setAttribute("src","assets/images/kobeBryant.jpg");
			if(gameStatistics.wins === 8 || gameStatistics.wins === 24) {
				document.getElementById("lakersImages").setAttribute("src","assets/images/kobeBryant.gif");
			}
		}
		if(chosenWord[0] === "Lou") {
			document.getElementById("lakersImages").setAttribute("src","assets/images/louWilliams.jpg");
			if(gameStatistics.wins === 23) {
				document.getElementById("lakersImages").setAttribute("src","assets/images/louWilliams.gif");
			}
		}
		if(chosenWord[0] === "Magic") {
			document.getElementById("lakersImages").setAttribute("src","assets/images/magicJohnson.jpg");
			if(gameStatistics.wins === 32) {
				document.getElementById("lakersImages").setAttribute("src","assets/images/magicJohnson.gif");
			}
		}
		if(chosenWord[0] === "Timofey") {
			document.getElementById("lakersImages").setAttribute("src","assets/images/timofeyMozgov.jpg");
			if(gameStatistics.wins === 20) {
				document.getElementById("lakersImages").setAttribute("src","assets/images/timofeyMozgov.gif");
			}
		}
		if(chosenWord[0] === "Smush") {
			document.getElementById("lakersImages").setAttribute("src","assets/images/smushParker.jpg");
			if(gameStatistics.wins === 1) {
				document.getElementById("lakersImages").setAttribute("src","assets/images/smushParker.gif");
			}
		}
		if(chosenWord[0] === "Julius") {
			document.getElementById("lakersImages").setAttribute("src","assets/images/juliusRandle.jpg");
			if(gameStatistics.wins === 30) {
				document.getElementById("lakersImages").setAttribute("src","assets/images/juliusRandle.gif");
			}
		}
		if(chosenWord[0] === "Robert") {
			document.getElementById("lakersImages").setAttribute("src","assets/images/robertHorry.jpg");
			if(gameStatistics.wins === 5) {
				document.getElementById("lakersImages").setAttribute("src","assets/images/robertHorry.gif");
			}
		}
		gameStatistics.restartGame();
		// Update number of wins in HTMl
		document.getElementById('wins').innerHTML = gameStatistics.wins;
	}
}
		