var through = new Array();
var current = new Array();
var player;
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

	$("#player").empty();
	$("#player").append(player);
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
	current = through;
	through = new Array();
}

//Draw a new player
function draw() {
	if (current.length > 0) {
		player = current[Math.floor(Math.random()*current.length)];
	} else if (through.length > 0) {
		redraw();
		draw();
	}
	reload();
}

//The player missed
function miss() {
	removeFromCurrent(player);
	draw();
}

//The player potted
function pot() {
	removeFromCurrent(player);
	through.push(player);
	draw();
}


//Add Lives
function addLives() {
	var lives = parseInt($("#lives").val())
	for (var i = 0; i < lives; i++) {
		through.push(player);
	}
	pot();
	reload();
}

//Start the game
function start() {
	$("#start").hide();
	$("#curDraw").show();
	draw();
}