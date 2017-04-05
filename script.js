var through = new Array();
var current = new Array();
var losers = new Array();
var player;
var winner = false;
var defaultLives = 3;

$(document).ready(function() {
	$("#curDraw").hide();
});

//Re-render the page
function reload() {
	$("#players").empty();

	$("#players").append("<h3>To Be Drawn</h3>")
	current.sort();
	current.forEach(function(player) {
		$("#players").append("<div class=\"player\">" + player + "</div>");
	});

	$("#players").append("<h3>Through</h3>")
	through.sort();
	through.forEach(function(player) {
		$("#players").append("<div class=\"player\">" + player + "</div>");
	});

	if (!winner) {
		$("#player").empty();
		$("#player").append(player);
	} else {
		$("#player").empty();
		$("#player").append("The winner is: " + winner);
	}
}

//Add a player to the game
function addPlayer() {
	var p = $("#add").val();
	//add the player to the array
	for (var i = 0; i < defaultLives; i++) {
		current.push(p);
	}
	//clear the text field
	$("#add").val("");
	//realod the list of players
	reload();
}

//Remove a life from the current array
function removeFromCurrent(player) {
	var index = current.indexOf(player);    // <-- Not supported in <IE9
	if (index !== -1) {
	    current.splice(index, 1);
	}
}

//Redraw the cards
function redraw() {
	alert("Re-drawing");
	current = through;
	through = new Array();
	losers = new Array();
}

//Draw a new player
function draw() {
	winner = datermineWinner();

	if (!winner) {
		if (current.length > 0) {
			player = current[Math.floor(Math.random()*current.length)];
		} else if (through.length > 0) {
			redraw();
			draw();
		} else {
			//No one is through
			current = losers;
			losers = new Array();
			draw();
		}
	}
	reload();
}

//The player missed
function miss() {
	if (!winner) {
		removeFromCurrent(player);
		losers.push(player);
		draw();
	}
}

//The player potted
function pot() {
	if (!winner) {
		removeFromCurrent(player);
		through.push(player);
		draw();
	}
}


//Add Lives
function addLives() {
	if (!winner) {
		var lives = parseInt($("#lives").val())
		for (var i = 0; i < lives; i++) {
			through.push(player);
		}
		pot();
		reload();
	}
}

function replace() {
	draw();
}

//Start the game
function start() {
	$("#start").hide();
	$("#curDraw").show();
	defaultLives = 1;
	draw();
}

//Determine if there is a winner
function datermineWinner() {
	var winner = null;

	through.forEach(function(player) {
		if (winner == null) {
			winner = player;
		} else if (winner != player) {
			winner = false;
			return winner;
		}
	});

	var singlePlayer = true;
	var previousPlayer = null;
	current.forEach(function(player) {
		if (previousPlayer != winner) {
			singlePlayer = false;
		}
		previousPlayer = player;
	});

	if (winner && singlePlayer) {
		return winner;
	} else {
		return false;
	}
}
