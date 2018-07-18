// Chrys Ngouma
// CIS 170
// 2016

// Tic Tac Toe game

#include <stdio.h>
#include <stdlib.h>
#include <time.h>

void displayInstructions();
void displayBoard(char [3][3]);
int setCPLevel();
int selectLocation(int , char [3][3], char , int* , int);
int getAILocation(char , int , char [3][3], int*);
int checkLocation(int* , int );
void setTurn(int, int, char [3][3]);
char checkForWin(char [3][3]);

char initArr[3][3] = {{'1', '2', '3'},{'4', '5', '6'},{'7', '8', '9'}}; // used to reset board

int main(){
	char boardArr[3][3];
	char winner, gameType, choice;
	int i, j;
	int turn, location, cpLevel = 1;
	int usedLocation[9];
	// boardArr holds the data on the board
	// winner holds either 'X','O', or 't'. used to define the winner. If 'O', P1 wins; if 'X', P2 or CP wins; if 't', cats game.
	// turn used to verify what user is playing. When turn is odd, it is the P1 turn to play; when turn even it is P2 or CP turn to play.
	// choice used when asking if the user wants to play again.
	// usedLocation holds all the location already used to prevent the user to overwrite on the board
		
	while(1){
		
		MENU:
		displayInstructions();
		
		while(1){ // Ask user for game type (P1 vs P2, or P1 Vs CP) or to quit
			
			printf("\nSelect a game type:\n\t1-P1 Vs P2\n\t2-P1 Vs CP\n");
			printf("\nPress Q to quit\nPress C to set CP level\n");
			scanf("\n%c", &gameType); // gameType can also take 'Q' (or 'q') to quit
			
			BEGIN: // Start again the same game type
			
			// Reset data
			for(i = 0; i < 3; ++i){
				for(j = 0; j < 3; ++j){
				boardArr[i][j] = initArr[i][j];
				}
			}
			
			for(i = 0; i < 9; ++i){
				usedLocation[i] = 0;
			}
			
			turn = 0;
			
			
			// Data validation for gameType
			if((gameType == '1') || (gameType == '2')) {
				break;
			}
			else if((gameType == 'Q') || (gameType == 'q')){
				printf("Thank you for playing!");
				exit(0);
			}
			else if((gameType == 'C') || (gameType == 'c')){
				cpLevel = setCPLevel();
				goto MENU;
			}
			else{
				printf("invalid selection..Please try again\n");
			continue;	
			}	
		}
	
	
		while(1){

			++turn;
		
			displayBoard(boardArr);
		
			location = selectLocation(turn, boardArr, gameType, usedLocation, cpLevel);
	
			setTurn(location, turn, boardArr);
		
			winner = checkForWin(boardArr);
		
			if((winner == 'X') || (winner == 'O') || (winner == 't')){
				break;
			}
		}
	
		displayBoard(boardArr);
	
		// display winner
		if(winner == 'X'){
			printf("Player 1 won!\n");
		}
		else if(winner == 'O'){
			if(gameType == '2'){
				printf("CP won!\n");
			}
			else{
				printf("Player 2 won!\n");
			}
		}
		else{
			printf("Cat game\n");
		}
	
		// Asks user whether to play again or not
		while(1){
			printf("\nWould you like to play again? (Y/N)\n");
			scanf("\n%c", &choice);
			if(choice == 'Y' || choice == 'y'){
				goto BEGIN;
			}
			else if(choice == 'N' || choice == 'n'){
				break;
			}
			else{
				printf("Invalid selection..Please, try again\n");
			}	
		}
	}
	
	return 0;
}

// Instructions:
void displayInstructions(){
	printf("\nINSTRUCTIONS:\n");
	printf("The object of Tic Tac Toe is to get three in a row. You play on a\n");
	printf("three by three game board. The first player is known as X and the\n");
	printf("second is O. Players alternate placing Xs and Os on the game     \n");
	printf("board until either oppent has three in a row or all nine squares \n");
	printf("are filled. X always goes first, and in the event that no one has\n");
	printf("three in a row, the stalemate is called a cat game.\n");
}

// set CP level

int setCPLevel(){
	int cpLevel;
	
	do{
		printf("Choose CP Level:\n\t1.Level 1\n\t2.Level 2\n");
		scanf("%d", &cpLevel);
	}while((cpLevel < 1) || (cpLevel > 2));
	
	
	return cpLevel;
}

// Display board:

void displayBoard(char board[3][3]){
	int i, j;
	
	for(i = 0; i < 3; i++){
		printf("\n\t");
		for(j = 0; j < 3; j++){
				printf(" %c ", board[i][j]);
			if(j < 2){
			printf("|");
			}
		}
		if(i < 2){
			printf("\n\t___|___|___\n");
		}
	}
	printf("\n\n");
}


// Select location:

int selectLocation(int turn, char boardArr[3][3], char gameType, int* usedLocation, int cpLevel){
	int location, i, j, temp;
	char letter;
	// leter used in getAILocation function to generate a location for AI following a logic
	// letter either holds X or O
	// temp: temporary variable used to swap data while sorting usedLocation[]
	
	while(1){
		
		// Player 1 enter location
		if(turn % 2 != 0){
			printf("Player 1, enter your move: ");
			scanf("\n%d", &location); // Player 1 enter a location
		}
		
		// Player 2 enter location:
		else{
			
			// Case P1 vs P2:
			if(gameType == '1'){
				printf("Player 2, enter your move: ");
				scanf("\n%d", &location); // user2 enter a location
			}
			
			// Case P1 Vs CP:
			else{
				
				location = 0;
				
				if(cpLevel == 1){
					
					// AI tries to win
					if(location == 0){
						letter = 'O';
						location = getAILocation(letter, location , boardArr, usedLocation);
					}
				
					// place 'O' on a random box
					if(location == 0){
						srand((int)time(0));
						location = ((rand() % 9) + 1);
					}	
				}
				
				else if(cpLevel == 2){
					
					// AI tries to win
					if(location == 0){
						letter = 'O';
						location = getAILocation(letter, location , boardArr, usedLocation);
					}
				
					// AI tries to prevent user to win
					if(location == 0){
						letter = 'X';
						location = getAILocation(letter, location , boardArr, usedLocation);
					}
				
					// place 'O' on a random box
					if(location == 0){
						srand((int)time(0));
						location = ((rand() % 9) + 1);
					}
				}
					
			}
		}
			
		// Sort usedLocation[]:	
		for(i = 0; i < 9; ++i){
			for(j = 0; j < 9; ++j){
				if(usedLocation[i] > usedLocation[j]){
					temp = usedLocation[i];
					usedLocation[i] = usedLocation[j];
					usedLocation[j] = temp;
				}
			}		
		}
		
		// Data validation:
		
		if((location < 1) || (location > 9)){
			printf("Invalid location..Please choose a location between 1 and 9\n");
			continue;
		}
		
		else{
			
			// Load usedLocation Array:
			for(i = 0; i < 9; ++i){
				
				if(location == usedLocation[i]){
					break;
				}
				
				if((usedLocation[i] == 0)){
					usedLocation[i] = location;
					break;
				}
			}
			
			// Check if location is already used:
			
			if((boardArr[(location - 1)/3][(location - 1) % 3] == 'O') || (boardArr[(location - 1)/3][(location - 1) % 3] == 'X')){
			
				// Case P1 vs CP
				if((gameType == '2') && (turn % 2 == 0)){
					continue;
				}
				else{
					
				// Case P1 vs P2
					printf("This location is already used..Please try another one\n");
					continue;
				}		
			}		
		}
		
		break;
		
	}			
	
	if((gameType == '2') && (turn % 2 == 0)){
		printf("CP..\n");
	}
	
	return location;
}


// get location for AI:

int getAILocation(char letter, int location, char boardArr[3][3], int* usedLocation){
	int i, j;
	// When letter = O, check if CP has 2 Os aligned then place a 'O' on the next box; if CP has 2 Os on each extremities then place a 'O' on the middle box
	// When letter = X, check if P1 has 2 Xs aligned then place a 'O' on the next box; if P1 has 2 Os on each extremities then place a 'O' on the middle box
	
	for(i = 0; i < 3; ++i){
		if(location == 0){
			
			// Row:
			if((boardArr[i][0] == boardArr[i][1]) && (boardArr[i][1] == letter)){ // first two boxes
				location = (i * 3) + 3;
				location = checkLocation(usedLocation, location);
			}
			else if((boardArr[i][1] == boardArr[i][2]) && (boardArr[i][2] == letter)){ // last two boxes
				location = (i * 3) + 1;
				location = checkLocation(usedLocation, location);
			}
			
			// row extremities:
			else if((boardArr[i][0] == boardArr[i][2]) && (boardArr[i][2] == letter)){
				location = (i * 3) + 2;
				location = checkLocation(usedLocation, location);
			}
			
			// Column:
			else if((boardArr[0][i] == boardArr[1][i]) && (boardArr[1][i] == letter)){ // first two boxes
				location = i + 7;
				location = checkLocation(usedLocation, location);
			}
			else if((boardArr[1][i] == boardArr[2][i]) && (boardArr[2][i] == letter)){ // last two boxes
				location = i + 1;
				location = checkLocation(usedLocation, location);
			}
			
			// column extremities:
			else if((boardArr[0][i] == boardArr[2][i]) && (boardArr[2][i] == letter)){
				location = i + 4;
				location = checkLocation(usedLocation, location);
			}
			
		}
		else{
			break;
		}
	}

	for(i = 0; i < 2; ++i){
		if(location == 0){
			
			// Diagonals:
			if((boardArr[i][i] == boardArr[i + 1][i + 1]) && (boardArr[i + 1][i + 1] == letter)){ // to the right
				location = 9 - (i * 8);
				location = checkLocation(usedLocation, location);
			}
			if((boardArr[2 - i][i] == boardArr[1 - i][1 + i]) && (boardArr[1 - i][1 + i] == letter)){ // to the left
				location = 3 + (i * 4);
				location = checkLocation(usedLocation, location);
			}
			
			// diagonal extremities:
			if((boardArr[0][i * 2] == boardArr[2][(1 - i) * 2]) && (boardArr[2][(1 - i) * 2] == letter)){
				location = 5;
				location = checkLocation(usedLocation, location);
			}
		}
		else{
			break;
		}
	}
							
	return location;
}

// Check if location is already used:
int checkLocation(int* usedLocation, int location){
	int i, test = 0;
	// while test = 0, the location is empty
	
	for(i = 0; i < 9; ++i){
		if(location == usedLocation[i]){
			test = 1;
			break;
		}
	}
	
	if(test == 1){
		location = 0;
	}
	
	return location;
}


// Set X or O on the board:

void setTurn(int loc, int turn, char boardArr[3][3]){
	int i, j;
	
	for(i = 0; i < 3; ++i){
		for(j = 0; j <3; ++j){
				
			if(loc + 48 == boardArr[i][j]){ // loc + 48 to get the ASCII value of loc as a char
					
				if(turn % 2 != 0){
					boardArr[i][j] = 'X';
				}
				else{
					boardArr[i][j] = 'O';
				}
				goto FIN; // exit all loops
			}
		}
	}
	FIN:;
	
}


// Check for wins:

char checkForWin(char boardArr[3][3]){
	char winner;
	int x, i, j;
	// x used to count the number of boxes changed into X or O
	// if x = 9 => all boxes were changed
	// if x != 9 the game will continue.. if x = 9, the game stops and shows the winner
	
	x = 0;
	winner = '\0';
	
	// Check if user has aligned 3 'O' on a line, row, or diagonal.
	// Comparing 3 elements in boardArr[][] following the board format
	
	for(i = 0; i < 3; ++i){
		
		if(winner == '\0'){
			
			if((boardArr[i][0] == boardArr[i][1]) && (boardArr[i][1] == boardArr[i][2])){ // row
				winner = boardArr[i][0];
			}
			
			else if((boardArr[0][i] == boardArr[1][i]) && (boardArr[1][i] == boardArr[2][i])){ // column
				winner = boardArr[0][i];
			}
			
			else if((boardArr[0][0] == boardArr[1][1]) && (boardArr[1][1] == boardArr[2][2])){ // diagonal to the left
				winner = boardArr[0][0];
			}
			else if((boardArr[2][0] == boardArr[1][1]) && (boardArr[1][1] == boardArr[0][2])){ //diagonal to the right
				winner = boardArr[2][0];
			}
		}
		else{
			break;
		}	
	}
	
	// Case cat game:
	if(winner == '\0'){
		for(i = 0; i < 3; ++i){
			for(j = 0; j < 3; ++j){
				if(boardArr[i][j] != initArr[i][j]){
					++x;
				}
			}
		}
		
		if(x == 9){
			winner = 't';
		}	
	}
	
	return winner;
}
