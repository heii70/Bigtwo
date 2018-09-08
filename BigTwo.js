var BigTwo = (function() {

	var CARDRANKING = [
		"3D", "3C", "3H", "3S", 
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

	var POKERHANDRANKING = {
		"straight": 0,
		"flush": 1,
		"fullHouse": 2,
		"bomb": 3,
		"straightFlush": 4
	};

	var STRAIGHTRANKING = [
		["3", "4", "5", "A", "2"],
		["3", "4", "5", "6", "2"],
		["3", "4", "5", "6", "7"],
		["4", "5", "6", "7", "8"],
		["5", "6", "7", "8", "9"],
		["6", "7", "8", "9", "10"],
		["7", "8", "9", "10", "J"],
		["8", "9", "10", "J", "Q"],
		["9", "10", "J", "Q", "K"],
		["10", "J", "Q", "K", "A"]
	];


	function getRandomInt(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	function indexToCards(inputIndices, player1Hand) {
		var inputCards = [];

		for(var i = 0; i < inputIndices.length; i++) {
			inputCards[i] = player1Hand[inputIndices[i]];
		}
		return inputCards;
	}

	// Constructor
	function BigTwo(numOfPlayers) {

		if(numOfPlayers < 2 || numOfPlayers > 4)
			return false;

		var deck = CARDRANKING.slice();
		var playersHand = Array.from( new Array(numOfPlayers), function() { 
				return []; 
			} 
		);
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
					playersHand[0].push(card);
					break;
				case 2:
					playersHand[1].push(card);
					break;
				case 3:
					playersHand[2].push(card);
					break;
				case 4:
					playersHand[3].push(card);
					break;
			}
		}

		function dealHands() {

			if(numOfPlayers === 2) {
				for(var i = 0; i < 13; i++) {
					dealToPlayer(1);
					dealToPlayer(2);
				}
				this.sortByValue(playersHand[0]);
				this.sortByValue(playersHand[1]);
			}
			else if (numOfPlayers === 3) {
				var lastCard = deck.splice(-1, 1)[0];
				var targetCard = "3D";
				var getsLastCard;

				if(lastCard === targetCard) // If 3D is the last card, look for player with 2nd lowest card 3C
					targetCard = "3C";

				for(var i = 0; i < 17; i++) {
					dealToPlayer(1);
					dealToPlayer(2);
					dealToPlayer(3);
				}
				this.sortByValue(playersHand[0]);
				this.sortByValue(playersHand[1]);
				this.sortByValue(playersHand[2]);

				if(playersHand[0][0] === targetCard)
					playersHand[0].push(lastCard);
				else if(playersHand[1][0] === targetCard)
					playersHand[1].push(lastCard);
				else if(playersHand[2][0] === targetCard)
					playersHand[2].push(lastCard);

			}
			else if(numOfPlayers === 4) {
				for(var i = 0; i < 13; i++) {
					dealToPlayer(1);
					dealToPlayer(2);
					dealToPlayer(3);
					dealToPlayer(4);
				}
				this.sortByValue(playersHand[0]);
				this.sortByValue(playersHand[1]);
				this.sortByValue(playersHand[2]);
				this.sortByValue(playersHand[3]);
			}
		}

		function findFirstTurn() {
		// Determine who goes first

			var playersLowestCard = new Array(numOfPlayers);

			for(var i = 0; i < numOfPlayers; i++) {
				playersLowestCard[i] = playersHand[i].slice()[0];
				//this.sortByValue(playersHandCopy[i]);

				if(playersLowestCard[i] === "3D")
					goesFirst = i+1;
			}

			if(numOfPlayers === 2 && goesFirst === undefined) {
				var player1LowestCard = playersLowestCard[0];
				var player2LowestCard = playersLowestCard[1];
				var player1LowestCardRank;
				var player2LowestCardRank;

				for(var i = 0; i < CARDRANKING.length; i++) {
					if(CARDRANKING[i] === player1LowestCard)
						player1LowestCardRank = i;

					if(CARDRANKING[i] === player2LowestCard)
						player2LowestCardRank = i;
				}

				goesFirst = (player1LowestCardRank > player2LowestCardRank ? 2 : 1);
			}
		}

		function isDouble(inputCards=input) {
			return inputCards[0].slice(0, -1) === inputCards[1].slice(0, -1); // both cards must have the same card value
		}

		function isTriple(inputCards=input) {
			var inputValues = [inputCards[0].slice(0, -1), inputCards[1].slice(0, -1), inputCards[2].slice(0, -1)].toString();
			var expectedValues = new Array(3).fill(inputCards[0].slice(0, -1)).toString();
			return inputValues === expectedValues;
		}

		function isStraight() {

			var inputValues = [input[0].slice(0, -1), input[1].slice(0, -1), input[2].slice(0, -1), input[3].slice(0, -1), input[4].slice(0, -1)].toString();
			for(var i = 0; i < STRAIGHTRANKING.length; i++) {
				if(inputValues === STRAIGHTRANKING[i].toString())
					return true;
			}
			return false;
		}

		function isFlush() {
			var inputSuits = [input[0].slice(-1), input[1].slice(-1), input[2].slice(-1), input[3].slice(-1), input[4].slice(-1)].toString();
			var expectedSuits = new Array(5).fill(input[0].slice(-1)).toString();
			return inputSuits === expectedSuits;
		}

		function isFullHouse() {
			return (isTriple(input.slice(0, 3)) && isDouble(input.slice(3))) || (isTriple(input.slice(2)) && isDouble(input.slice(0, 2)));
		}

		function isBomb(input) {
			var inputValues = [input[0].slice(0, -1), input[1].slice(0, -1), input[2].slice(0, -1), input[3].slice(0, -1), input[4].slice(0, -1)];
			var expectedValues = new Array(4).fill(input[2].slice(0, -1)).toString();
			return inputValues.slice(0, -1).toString() === expectedValues || inputValues.slice(1).toString() === expectedValues;
		}

		function isStraightFlush() {
			return isStraight() && isFlush();
		}

		function isLegitPlay() {
			// Check if play is legit
			
			// Legit plays can only be 1, 2, 3, or 5 cards
			if(input.length < 1 || input.length === 4 || input.length > 5)
				return false;
			
			// Singles - All single cards are legit plays; no check needed
			
			if(input.length === 2) // Doubles
				return isDouble();
			else if(input.length === 3) // Triples
				return isTriple();
			else if(input.length === 5) { // 5 card combos
				return isStraight() || isFlush() || isFullHouse() || isBomb() || isStraightFlush();
			}
		}

		function isLegalPlay() {
			// Check if play is legal

			// If field is empty, all legit plays are legal plays (unless it's the first turn)
			if(field.length === 0 && !isFirstTurn)
				return true;
		}

		function isPlayable() {

			this.sortByValue(input); // Sort input

			// Check first turn play requirement
			if(isFirstTurn && input[0] !== "3D")
				return false;

			if(!isLegitPlay())
				return false;

			if(!isLegalPlay())
				return false;
		} 

		function play() {
			var player1Card = player1Hand.splice(0,1)[0];
			var player2Card = player2Hand.splice(0,1)[0];
			var player1CardRank;
			var player2CardRank;

			for(var i = 0; i < CARDRANKING.length; i++) {
				if(CARDRANKING[i] === player1Card)
					player1CardRank = i;

				if(CARDRANKING[i] === player2Card)
					player2CardRank = i;
			}

			return (player1CardRank > player2CardRank ? player1Card : player2Card);
		}

		this.player1Hand = playersHand[0];
		this.player2Hand = playersHand[1];
		this.player3Hand = playersHand[2];
		this.player4Hand = playersHand[3];
		this.dealHands = dealHands;
		this.shuffleDeck = shuffleDeck;
		this.isPlayable = isPlayable;
		
	}

	BigTwo.prototype.sortByValue = function(cards) {
		for(var i = 0; i < CARDRANKING.length; i++) {
			var targetCard = CARDRANKING[i];

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

		//(i*4)+k != SINGLESRANKING.length
		while(true) {
			var targetCard = CARDRANKING[(i*4)+k];

			for(var j = 0; j < cards.length; j++) {
				if(cards[j] === targetCard) {
					cards.push(cards.splice(j,1)[0]);
				}
			}

			if((i*4)+k === CARDRANKING.length-1)
				break;

			if(((i+1)*4)+k >= CARDRANKING.length) {
				i = 0;
				k++;
			}
			else
				i++;
		}
	};

	return BigTwo;
})();

// var game = new BigTwo(4);
// game.shuffleDeck();
// game.dealHands();

// console.log(game.player1Hand.join(" "));
// console.log(game.player2Hand.join(" "));
// console.log(game.player3Hand.join(" "));
// console.log(game.player4Hand.join(" "));

var input = ["3D", "3C"];
var input1 = ["3C", "4C"];
var input2 = ["4C", "4H"];

function isDouble(inputCards=input) {
	return inputCards[0].slice(0, -1) === inputCards[1].slice(0, -1); // both cards must have the same card value
}

console.log(isDouble());
console.log(isDouble(input1));
console.log(isDouble(input2));