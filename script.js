var through = new Array();
var current = new Array();
var losers = new Array();
var player;
var winner = false;
var defaultLives = 3;
var started = false;

$(document).ready(function() {
	$("#curDraw").hide();
	$("#addPlayer").on("submit",function(e) {
    e.preventDefault(); // cancel the actual submit
		addPlayer();
  });
});

//Re-render the page
function reload() {
	$("#players").empty();

	$("#players").append("<h3>To Be Drawn</h3><table>")
	current.sort();
	for (var i = 0; i < current.length; i++) {
		$("#players").append("<tr><th><div class=\"player\">" + current[i] + "</th><th><button class=\"putThrough\" id=\"" + i + "\">Put Through</button><button class=\"currentCross\" id=\"" + i + "\">X</button></div></th></tr>");
	}

	$("#players").append("</table><h3>Through</h3><table>")
	through.sort();


	for (var i = 0; i < through.length; i++) {
		$("#players").append("<tr><th><div class=\"player\">" + through[i] + "</th><th><button class=\"demote\" id=\"" + i + "\">Demote</button><button class=\"throughCross\" id=\"" + i + "\">X</button></div></th></tr>");
	}

	$("#players").append("</table>")
	if (!winner) {
		$("#player").empty();
		$("#player").append(player);
	} else {
		$("#player").empty();
		$("#player").append("The winner is: " + winner);
	}

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
}

//Add a player to the game
function addPlayer() {
	var p = $("#add").val();
	//add the player to the array
	for (var i = 0; i < defaultLives; i++) {
		if (started) {
			through.push(p);
		} else {
			current.push(p);
		}
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
	started = true;
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
