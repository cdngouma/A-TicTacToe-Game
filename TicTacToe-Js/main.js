/**	by Chrys Ngouma
/*	A Tic Tac Toe game
/*	2018
**/

const ROW_SIZE = 3;
var board = [];
var turn = '';
var round = 0;
var score = {
		'X':0,
		'tie':0,
		'O':0
	};
var moves = 0;
var map = '';			// string representation of board
var gameMode = 0;		// 0: P vs P 	1: P vs CP

var player1 = 'X';
var player2 = 'O';

var playing = false;

function init(){
	for(let r=0; r < ROW_SIZE; r++){
		var row = document.createElement('div');
		$(row).addClass('row');
		$('#board').append(row);

		for(let c=0; c < ROW_SIZE; c++){
			var cell = document.createElement('div');
			$(cell).addClass('cell');
			$(cell).addClass('col-4-md');
			$(cell).addClass('col-4-sm');
			$(cell).addClass('col-4-xs');
			$(cell).attr('id', 'cell-' + (r*3 + c + 1));
			$(row).append(cell);
			board.push(cell);
		}
	}

	// initialize game with mode P vs CP
	gameMode = 1;
	$('#_pvscp-btn').css('opacity', '1');

	updateScores();
	newGame();
}

function resetStats(){
	score['X'] = 0;
	score['O'] = 0;
	score['tie'] = 0;
	round = 0;
	turn = '';
	updateScores();
}

function updateScores(){
	document.getElementById('score-p1').innerHTML = score['X'];
	document.getElementById('score-ties').innerHTML = score['tie'];
	document.getElementById('score-p2').innerHTML = score['O'];
}

function updateNotif(str){
	document.getElementById('notif-bar').innerHTML = str;
}

function clearBoard(){
	for(let i=0; i<ROW_SIZE*ROW_SIZE; i++){
		$(board[i]).empty();
		$(board[i]).removeClass('O-tile X-tile used');
	}
	newGame();
}

function newGame(){
	map = '         ';		// 9 spaces for 9 cells
	moves = 0;
	round++;

	$('#'+player1+'-stats').addClass('selected');

	turn = round % 2 == 0 ? 'O' : 'X';
	updateNotif(turn + "  turn");

	playing = true;

	// CP start
	if(gameMode === 1 && turn === player2){
		setTimeout(function() {aiMoves();}, 400);
	}
}

function aiMoves(){
	if(turn === player2){
		// AI tries to win
		let loc = 0;
		loc = getAILocation(player2);
		// AI prevent player to win
		if(loc === 0)
			loc = getAILocation(player1);
		// AI make random move
		while(loc === 0){
			loc = Math.floor(Math.random()*9)+1;
			loc = checkLocation(loc);
		}
		setCell(player2, loc);
		turn = turn === player2 ? player1 : player2;
		updateNotif(turn+"  turn");

		if(checkWins())
			setWinner();
	}
}

function compareCells(stat, i, tile){
	if(board[i].innerHTML === tile)
		return -1;

	if(board[i].innerHTML === '')
		stat.emp++;

	else
		stat.opp++;

	if(stat.emp > 1 || stat.opp > 0)
		return 0;
	
	return i+1;
}

function getAILocation(tile){
	var loc = -1;
	var stat = {opp: 0, emp: 0};	// # oponent pieces, # empty spot
	// rows
	for(let i=0; i<ROW_SIZE*ROW_SIZE; i += 3){
		stat.opp = 0, stat.emp = 0;
		for(let j=0; j<ROW_SIZE; j++){
			let k = compareCells(stat, i+j, tile);
			loc = k >= 0 ? k : loc;
			if(loc === 0)
				break;
		}
		
		if(loc > 0)
			return loc;
		loc = -1;
	}
	// columns
	for(let i=0; i<ROW_SIZE; i++){
		stat.opp = 0, stat.emp = 0;
		for(let j=0; j<ROW_SIZE*ROW_SIZE; j += 3){
			let k = compareCells(stat, i+j, tile);
			loc = k >= 0 ? k : loc;
			if(loc === 0)
				break;
		}

		if(loc > 0)
			return loc;
		loc = -1;
	}
	// diagonals to the bottom
	stat.opp = 0, stat.emp = 0;
	for(let i=0; i<ROW_SIZE*ROW_SIZE; i += 4){
		let k = compareCells(stat, i, tile);
		loc = k >= 0 ? k : loc;
		if(loc === 0)
			break;
	}

	if(loc > 0)
		return loc;
	loc = -1;
	// diagonals to the top
	stat.opp = 0, stat.emp = 0;
	for(let i=ROW_SIZE*ROW_SIZE-3; i>=2; i -= 2){
		let k = compareCells(stat, i, tile);
		loc = k >= 0 ? k : loc;
		if(loc === 0)
			break;
	}

	return loc >= 0 ? loc : 0;
}

function checkLocation(loc){
	return $(board[loc-1]).hasClass('used') ? 0 : loc;
}

function setCell(tile, loc){
	var i = loc-1;

	$(board[i]).addClass('used');
	$(board[i]).addClass(tile+'-tile');
	board[i].innerHTML = tile;
	map = replaceCharAt(map, i, tile);
	moves++;
}

function replaceCharAt(str, i, ch){
	var arr = str.split('')
	arr[i] = ch;
	return arr.join('');
}

function checkWins(){
	if(moves >=5 && moves <= ROW_SIZE*ROW_SIZE){		// one player made at least 3 moves
		let reg_x = RegExp('^XXX|^[OX ]{3}XXX[OX ]{3}$|XXX$|X[OX ]{2}X[OX ]{2}X|X[OX ]{3}X[OX ]{3}X|^[OX ]{2}X[OX ]X[OX ]X', 'g');
		let reg_o = RegExp('^OOO|^[OX ]{3}OOO[OX ]{3}$|OOO$|O[OX ]{2}O[OX ]{2}O|O[OX ]{3}O[OX ]{3}O|^[OX ]{2}O[OX ]O[OX ]O', 'g');
		let btn = document.getElementById('restart-btn');

		if(map.match(reg_o)){
			updateNotif('O is winner!');
			score['O']++;
			btn.innerHTML = "Continue";
			playing = false;
		}else if(map.match(reg_x)){
			updateNotif('X is winner!');
			score['X']++;
			btn.innerHTML = "Continue";
			playing = false;
		}else if(moves >= ROW_SIZE*ROW_SIZE){
			updateNotif("Draw!");
			score['tie']++;
			btn.innerHTML = "Continue";
			playing = false;
		}
	}
}

//---------- beginning ----------//
init();

// player events
$('.cell').click(function(){

	if(turn === player1 && playing){
		playerMoves($(this), player1);
	}

	if(turn === player2 && playing){
		if(gameMode === 0){
			playerMoves($(this), player2);
		}else{
			setTimeout(function() { aiMoves()}, 400);
		}
	}
});

function playerMoves(obj, player) {
	var loc = parseInt((obj.attr('id')).replace('cell-',''));

	if(checkLocation(loc) > 0){
		setCell(turn, loc);

		turn = player === player1 ? player2 : player1;
		updateNotif(turn+"  turn");

		if(checkWins()){
			setWinner();
		}
	}
}
// end of player events

// chnage symbol(X or O)
$('#X-stats').click(function(){
	if(!$(this).hasClass('selected')){
		$(this).addClass('selected');
		$('#O-stats').removeClass('selected');
		resetStats();
		player1 = "X";
		player2 = "O";
		clearBoard();		
	}
});

$('#O-stats').click(function(){
	if(!$(this).hasClass('selected')){
		$(this).addClass('selected');
		$('#X-stats').removeClass('selected');
		resetStats();
		player1 = "O";
		player2 = "X";
		clearBoard();		
	}
});

// change game type
$('#_pvsp-btn').click(function(){
	if($(this).css('opacity') != 1){
		$(this).css('opacity', '1');
		$('#_pvscp-btn').css('opacity', '0.2');
		console.log($('#_pvscp-btn').css('opacity'));
		gameMode = 0;
		resetStats();
		clearBoard();
	}
});

$('#_pvscp-btn').click(function(){
	if($(this).css('opacity') != 1){
		$(this).css('opacity', '1');
		$('#_pvsp-btn').css('opacity', '0.2');
		gameMode = 1;
		resetStats();
		clearBoard();
	}
});

$('#restart-btn').click(function(){
	if(this.innerHTML === "Continue"){
		updateScores();
		this.innerHTML = "New Game";
	}else{
		resetStats();
	}
	clearBoard();
});