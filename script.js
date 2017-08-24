var through = new Array();
var current = new Array();
var losers = new Array();
var player;
var winner = false;
var defaultLives = 3;
var drawCount = 0;

var rulesOpen = false;

$(document).ready(function() {
	$("#curDraw").hide();
	$("#addPlayer").on("submit",function(e) {
    e.preventDefault(); // cancel the actual submit
		addPlayer();
  });

	$("#rules").hide();

	$("#rulesTitle").click(function(e) {
    e.preventDefault();
		$("#rules").toggle();
		if (rulesOpen) {
			$("#rulesTitle").empty();
			$("#rulesTitle").append("(expand)");
			rulesOpen = false;
		} else {
			$("#rulesTitle").empty();
			$("#rulesTitle").append("(collapse)");
			rulesOpen = true;
		}
	});
});

//Re-render the page
function reload() {
	$("#players").empty();

	$("#players").append("<h3>To Be Drawn: " + current.length + "</h3><table>")
	current.sort();
	for (var i = 0; i < current.length; i++) {
		$("#players").append("<tr><td><div class=\"player\">" + current[i] + "</td><td><button class=\"putThrough btn btn-default\" id=\"" + i + "\">Put Through</button><button class=\"currentCross btn btn-default\" id=\"" + i + "\">X</button></div></td></tr>");
	}

	$("#players").append("</table><h3>Through: " + through.length + "</h3><table>")
	through.sort();


	for (var i = 0; i < through.length; i++) {
		$("#players").append("<tr><td><div class=\"player\">" + through[i] + "</td><td><button class=\"demote btn btn-default\" id=\"" + i + "\">Demote</button><button class=\"throughCross btn btn-default\" id=\"" + i + "\">X</button></div></td></tr>");
	}

	$("#players").append("</table>");

	$("#player").fadeOut(400, "swing", function () {
		if (!winner) {
			$("#player").empty();
			$("#player").append(player);
		} else {
			$("#player").empty();
			$("#player").append("The winner is: " + winner);
		}
		if (drawCount > 0) {
			$("#player").fadeIn();
		}
	});

	$(".throughCross").click(function (event) {
		through.splice(event.target.id, 1);
		reload();
	});

	$(".currentCross").click(function (event) {
		current.splice(event.target.id, 1);
		reload();
	});

	$(".putThrough").click(function (event) {
		through.push(current[event.target.id])
		current.splice(event.target.id, 1);
		reload();
	});

	$(".demote").click(function (event) {
		current.push(through[event.target.id])
		through.splice(event.target.id, 1);
		reload();
	});

	drawCount++;
}

//Add a player to the game
function addPlayer() {
	var p = $("#add").val();
	if (p) {
		//add the player to the array
		for (var i = 0; i < $("#noLives").val(); i++) {
				current.push(p);
		}
		//clear the text field
		$("#add").val("");
		//realod the list of players
		reload();
	} else {
		alert("The player field is required");
	}
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
	winner = determineWinner();

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
	$("#start").fadeOut();
	$("#curDraw").fadeIn();
	defaultLives = 1;
	started = true;
	draw();
}

//Determine if there is a winner
function determineWinner() {
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
