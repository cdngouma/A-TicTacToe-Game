/**	by Chrys Ngouma
/*	A Tic Tac Toe game
/*	2018
**/
var ROW_SIZE = 3,
	board = [],
	turn = '',
	round = 0;
	score = {
		'player1':0,
		'tie':0,
		'player2':0
	};
	moves = 0;
	map = '';			// string representation of board
	gameMode = 0;		// 0: P vs P 	1: P vs CP

function init(){
	console.log("initializing..");
	for(let r=0; r<ROW_SIZE; r++){
		var row = document.createElement('div');
		$(row).addClass('row');
		$('#board').append(row);

		for(let c=0; c<ROW_SIZE; c++){
			var cell = document.createElement('div');
			$(cell).addClass('cell');
			$(cell).addClass('col-4-md');
			$(cell).addClass('col-4-sm');
			$(cell).addClass('col-4-xs');
			$(cell).attr('id', 'cell-'+(r*3 +c + 1));
			$(row).append(cell);
			board.push(cell);
		}
	}
	updateScores();
	console.log("...completed");
	newGame();
}

function updateScores(){
	document.getElementById('score-p1').innerHTML = score['player1'];
	document.getElementById('score-ties').innerHTML = score['tie'];
	document.getElementById('score-p2').innerHTML = score['player2'];
}

function clearBoard(){
	for(let i=0; i<ROW_SIZE*ROW_SIZE; i++){
		$(board[i]).empty();
		$(board[i]).removeClass('used');
		$(board[i]).removeClass('_round-tile _cross-tile');
		$(board[i]).removeAttr('tile');
	}
	newGame();
}

function newGame(){
	console.log('starting new game...');
	map = '         ';		// 9 spaces
	moves = 0;
	round++;
	turn = round % 2 == 0 ? 'x' : 'o';
	listenToMoves();
}

function listenToMoves(){
	if(gameMode == 1 && round % 2 == 0){
		aiMoves();
	}
}

function aiMoves(){
	// TODO:implements Ai
}

function setCell(t, tile, loc){
	var i = loc-1;
	var img = document.createElement('img');
	$(img).attr('src', 'res/'+t+'-tile'+(Math.floor(Math.random()*3))+'.png');
	$(board[i]).addClass('used');
	$(board[i]).addClass('_'+tile+'-tile');
	$(board[i]).attr('tile', tile);
	$(board[i]).append(img);
	map = replaceCharAt(map, i, t);
	moves++;
}

function replaceCharAt(str, i, ch){
	var arr = str.split('')
	arr[i] = ch;
	return arr.join('');
}

function checkWins(){
	if(moves >= 9){
		alert(gameMode == 0 ? "It\'s a draw!" : 'Not loser but not a winner either');
		score['tie']++;
		updateScores();
		clearBoard();
	}
	else if(moves >=5){		// one player made at least 3 moves
		let reg_x = RegExp('^xxx|^[ox ]{3}xxx[ox ]{3}$|xxx$|x[ox ]{2}x[ox ]{2}x|x[ox ]{3}x[ox ]{3}x|^[ox ]{2}x[ox ]x[ox ]x', 'g');
		let reg_o = RegExp('^ooo|^[ox ]{3}ooo[ox ]{3}$|ooo$|o[ox ]{2}o[ox ]{2}o|o[ox ]{3}o[ox ]{3}o|^[ox ]{2}o[ox ]o[ox ]o', 'g');

		if(map.match(reg_o)){
			alert(gameMode == 0 ? 'Player 1 won this round!': 'Congratulation! You won this round.');
			score['player1']++;
			updateScores();
			clearBoard();
		}else if(map.match(reg_x)){
			alert(gameMode == 0 ? 'Player 2 won this round': 'A computer beat you! Try again.');
			score['player2']++;
			updateScores();
			clearBoard();
		}
	}
}

function checkLocation(loc){
	return $(board[loc-1]).hasClass('used') ? 0 : loc;
}
// beginning
init();
// player inputs
$('.cell').click(function(){
	if(gameMode == 1 && turn != 'o'){console.log('not your turn ['+turn+']');}
	else{
		var loc = parseInt(($(this).attr('id')).replace('cell-',''));
		if(checkLocation(loc) > 0){
			let tile = turn === 'o'?'round':'cross';
			setCell(turn, tile, loc);
			turn = turn === 'o'?'x':'o';

			if(checkWins())
				setWinner();
			else if(gameMode == 1)
				setTimeout(function() {aiMoves()}, 400);
		}else{
			console.log("choose empty location");
		}
	}
});