//OBJECT MODEL

let model = {
	boardSize: 7,
	numShips: 3,
	shipLength: 3,
	shipsSunk: 0,
	
	ships: [
		{ locations: [0, 0, 0], hits: ["", "", ""] },
		{ locations: [0, 0, 0], hits: ["", "", ""] },
		{ locations: [0, 0, 0], hits: ["", "", ""] }
	],
	
	fire: function(guess) {
		for (let i = 0; i < this.numShips; i++) { // check all ships
			let ship = this.ships[i];
			let index = ship.locations.indexOf(guess); //// check there is the received index in the array of coordinates of the ship (output: index or -1)
			if (index !== -1) {
				ship.hits[index] = "hit"; //if find a match mark cell as "hit"
				view.displayHit(guess);
				view.displayMessage("Ура! Попадание!");
				 if (this.isSunk(ship)) {
					 view.displayMessage("Браво, капитан! Вы потопили целый корабль!");
					 this.shipsSunk++;
				 }
				return true;
			}
			
		}
		view.displayMiss(guess); //mark cell as "miss"
		view.displayMessage("Увы, мимо...");
		return false; //if sorted through all ships and didn't find a match
	},
	
	isSunk: function(ship) {
		for (let i = 0; i < this.shipLength; i++) {
			if (ship.hits[i] !== "hit") {
				return false;
			}
		}
		return true;
	},
	
	generateShipLocations: function() {
		let locations;
		for (let i = 0; i < this.numShips; i++) { //for each ship generate a position
			do {
				locations = this.generateShip();
			} while (this.collision(locations)); //check collision
			this.ships[i].locations = locations; //save position without collision
		}
	},
	
	generateShip: function() {
		let direction = Math.floor(Math.random() * 2);
		let row;
		let col;
		
		if (direction === 1) { // horizontal
			row = Math.floor(Math.random() * this.boardSize);
			col = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1));
		} else { // vertical
			row = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1));
			col = Math.floor(Math.random() * this.boardSize);
		}
		
		let newShipLocations = [];
		for (let i = 0; i < this.shipLength; i++) {
			if (direction === 1) {
				newShipLocations.push(row + "" + (col + i));
			} else {
				newShipLocations.push((row + i) + "" + col);
			}
		}
		return newShipLocations;
	},
	
	collision: function(locations) {
		for (let i = 0; i < this.numShips; i++) {
			let ship = this.ships[i];
			for (let j = 0; j < locations.length; j++) {
				if (ship.locations.indexOf(locations[j]) >= 0) {
					return true;
				}
			}
		}
		return false;
	}
};


// OBJECT RESPONSIBLE FOR DISPLAYING MESSAGES AND UPDATING IMAGES

let view = {
	
	displayMessage: function(msg) {
				let messageArea = document.getElementById("messageArea");
		messageArea.innerHTML = msg;
	},
	
	displayHit: function(location) {
		let cell = document.getElementById(location);
		cell.setAttribute("class", "hit");
	},
	
	displayMiss: function(location) {
		let cell = document.getElementById(location);
		cell.setAttribute("class", "miss");
	}
};


//OBJECT CONTROLLER

let controller = {
	guesses: 0,

	processGuess: function(guess) { //receive user's coordinates in format "A0"
	  let location = parseGuess(guess);
	  if (location) {
		  this.guesses++;
		  let hit = model.fire(location);
		  if (hit && model.shipsSunk === model.numShips) {
			  view.displayMessage("Капитан, вы потопили все вражеские корабли! Попыток: " + this.guesses);

			  let novision = document.getElementById("inputForm");
			  novision.setAttribute("class", "viewnone");
		  }
	  }
	}
}

function parseGuess(guess) { //check user's coordinates
	let alphabet = ["A", "B", "C", "D", "E", "F", "G"];

	if (guess === null || guess.length !== 2) {
		view.displayMessage("Введите корректные данные выстрела");
	}
	else {
		let firstChar = guess.charAt(0);
		let row = alphabet.indexOf(firstChar);
		let column = guess.charAt(1);
		
		if (isNaN(row) || isNaN(column)) {
			view.displayMessage("Упс, таких координат нет на поле битвы");
		}
		else if (row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize) {
			view.displayMessage("Упс, таких координат нет на поле битвы");
		} else {
			return row + column;
		}
	}
	return null;
}


function handleHitButton() {
	let hitInput = document.getElementById("hitInput");
	let guess = hitInput.value.toUpperCase();

	controller.processGuess(guess);

	hitInput.value = ""; //make input is empty
}

function handleKeyPress (e) {
	let hitButton = document.getElementById("hitButton");

	if (e.keyCode === 13) {
		hitButton.click();
		return false;
	}
}

window.onload = init;

//GET DATE FROM USER

function init() {
	let hitButton = document.getElementById("hitButton");
	hitButton.onclick = handleHitButton;

	let hitInput = document.getElementById("hitInput");
	hitInput.onkeypress = handleKeyPress;

	// place the ships on the game board
	model.generateShipLocations();
}

