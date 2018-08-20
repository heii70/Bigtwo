var BigTwo = (function() {

	var SINGLESRANKING = ["3D", "3C", "3H", "3S", 
				   	      "4D", "4C", "4H", "4S",
				   	      "5D", "5C", "5H", "5S",
				   	      "6D", "6C", "6H", "6S",
				   	      "7D", "7C", "7H", "7S",
				   	      "8D", "8C", "8H", "8S",
				   	      "9D", "9C", "9H", "9S",
				   	      "10D", "10C", "10H", "10S",
				   	      "JD", "JC", "JH", "JS",
				   	      "QD", "QC", "QH", "QS",
				   	      "KD", "KC", "KH", "KS",
				   	      "AD", "AC", "AH", "AS",
				   	      "2D", "2C", "2H", "2S"
				   		];

	function getRandomInt(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	function indexToCards(input, player1Hand) {
		for(var i = 0; i < input.length; i++) {
			input[i] = player1Hand[input[i]];
		}
	}

	// Constructor
	function BigTwo(numOfPlayers) {

		var deck = SINGLESRANKING.slice();
		var player1Hand = [];
		var player2Hand = [];
		var player3Hand = [];
		var player4Hand = [];
		var field = [];
		var play = [];

		var input = [];
		var isFirstTurn = true;
		var goesFirst;

		function shuffleDeck() {
			// Move a random card in the deck to the top and repeat several times
			for(var i = 0; i < getRandomInt(100, 150); i++) {
				var card = deck.splice(getRandomInt(0,51), 1)[0];
				deck.unshift(card);
			}
		}

		function dealToPlayer(player) {

			var card = deck.splice(0,1)[0];
			
			switch(player) { // Determine player to deal to
				case 1:
					player1Hand.push(card);
					break;
				case 2:
					player2Hand.push(card);
					break;
				case 3:
					player3Hand.push(card);
					break;
				case 4:
					player4Hand.push(card);
					break;
			}
			return card;
		}

		function dealHands() {

			if(numOfPlayers === 2) {
				for(var i = 0; i < 13; i++) {
					dealToPlayer(1);
					dealToPlayer(2);
				}
			}
			else if(numOfPlayers === 4) {
				for(var i = 0; i < 13; i++) {
					dealToPlayer(1);
					dealToPlayer(2);
					dealToPlayer(3);
					dealToPlayer(4);
				}
			}
			else if(numOfPlayers === 3) {
				var drawnCards = ["", "", ""];
				var lastCard = deck.splice(-1, 1)[0];
				var targetCard = "3D";
				var getsLastCard;
				
				if(lastCard === targetCard) // If 3D is the last card, look for player with 2nd lowest card 3C
					targetCard = "3C";

				for(var i = 0; i < 17; i++) {
					drawnCards[0] = dealToPlayer(1);
					drawnCards[1] = dealToPlayer(2);
					drawnCards[2] = dealToPlayer(3);

					if(getsLastCard === undefined) {
						if(drawnCards[0] === targetCard)
							getsLastCard = 1;
						else if(drawnCards[1] === targetCard)
							getsLastCard = 2;
						else if(drawnCards[2] === targetCard)
							getsLastCard = 3;
					}
				}

				// Give player with the target card the last card
				if(getsLastCard === 1)
					player1Hand.push(lastCard);
				else if(getsLastCard === 2)
					player2Hand.push(lastCard);
				else if(getsLastCard === 3)
					player3Hand.push(lastCard);
			}
		}

		function isPlayable(input) {

			this.sortByValue(input); // Sort input

		// Check if combination is legal
			
			// Legal combinations can only be 1, 2, 3, or 5 cards
			if(input.length < 1 || input.length === 4 || input.length > 5)
				return false;

			// Singles - All single cards are legal combinations; no check needed

			// Doubles

			if(input.length === 2) {

			}

		// Check if play is legal

			if(isFirstTurn) {

				var requiredCard;

				if(numOfPlayers === 2) {
					var player1HandCopy = player1Hand.slice();
					var player2HandCopy = player2Hand.slice();
				}
				input.forEach(function(index) {
					if(player1Hand[index] === "3D") {
						isFirstTurn = false;
						return true;
					}
					return false;
				});
			}
			// If field is empty, all legal combination are legal plays (unless it's the first turn)
			if(field.length === 0 && !isFirstTurn)
				return true;
			
		} 

		function play() {
			console.log();
			var player1Card = player1Hand.splice(0,1)[0];
			var player2Card = player2Hand.splice(0,1)[0];
			var player1CardRank;
			var player2CardRank;

			for(var i = 0; i < SINGLESRANKING.length; i++) {
				if(SINGLESRANKING[i] === player1Card)
					player1CardRank = i;

				if(SINGLESRANKING[i] === player2Card)
					player2CardRank = i;
			}

			return (player1CardRank > player2CardRank ? player1Card : player2Card);
		}

		this.Player1Hand = player1Hand;
		this.player2Hand = player2Hand;
		this.player3Hand = player3Hand;
		this.player4Hand = player4Hand;
		this.dealHands = dealHands;
		this.shuffleDeck = shuffleDeck;
		this.isPlayable = isPlayable;
		
	}

	BigTwo.prototype.sortByValue = function(cards) {
		for(var i = 0; i < SINGLESRANKING.length; i++) {
			var targetCard = SINGLESRANKING[i];

			for(var j = 0; j < cards.length; j++) {
				if(cards[j] === targetCard) {
					cards.push(cards.splice(j,1)[0]);
				}
			}
		}
	};

	BigTwo.prototype.sortBySuit = function(cards) {

		var i = 0;
		var k = 0;

		while((i*4)+k != SINGLESRANKING.length-1) {
			var targetCard = SINGLESRANKING[(i*4)+k];

			for(var j = 0; j < cards.length; j++) {
				if(cards[j] === targetCard) {
					cards.push(cards.splice(j,1)[0]);
				}
			}

			if(((i+1)*4)+k >= SINGLESRANKING.length) {
				i = 0;
				k++;
			}
			else
				i++;
		}
		return sortedCards;
	};

	return BigTwo;
})();

var game = new BigTwo(2);
game.shuffleDeck();
game.dealHands();

console.log(game.Player1Hand.join(" "));
game.sortByValue(game.Player1Hand);
console.log(game.Player1Hand.join(" "));


//console.log(game.player2Hand.join(" "));
//console.log(game.player3Hand.join(" "));
//console.log(game.player4Hand.join(" "));
//console.log(game.play());