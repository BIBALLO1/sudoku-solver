var boardDiv = document.getElementById("board");
var boardCells = new Array(9);

function setup() {
	for (let i = 0; i < 9; ++i) {
		boardCells[i] = new Array(9);
		for (let j = 0; j < 9; ++j) {
			boardCells[i][j] = document.createElement("input");
			boardCells[i][j].type = "text";
			boardCells[i][j].classList.add("cell");
			boardCells[i][j].classList.add("roboto");
			boardCells[i][j].maxLength = 1;
			boardCells[i][j].value = "";
			boardCells[i][j].addEventListener("keydown", function(e) {
				if (e.key == "ArrowDown") {
					boardCells[(i+1+9) % 9][j].focus();
				}
				if (e.key == "ArrowUp") {
					boardCells[(i-1+9) % 9][j].focus();
				}
				if (e.key == "ArrowLeft") {
					boardCells[i][(j-1+9) % 9].focus();
				}
				if (e.key == "ArrowRight") {
					boardCells[i][(j+1+9) % 9].focus();
				}
			});
			boardCells[i][j].addEventListener("beforeinput", function(e) {
				const nextVal = 
					e.target.value.substring(0, e.target.selectionStart) +
						(e.data ?? '') +
						e.target.value.substring(e.target.selectionEnd)
				;
				if(!/^[0-9]*$/.test(nextVal)) {
					e.preventDefault();
				}
				return;
			});
			boardDiv.appendChild(boardCells[i][j]);
		}
	}
}

function reset() {
	for (let i = 0; i < 9; ++i) {
		for (let j = 0; j < 9; ++j) {
			boardCells[i][j].value = "";
		}
	}
	let board = getBoardData();
	render(board);
}

function copyBoard(oldBoard) {
	let newBoard = new Array(9);
	for (let i = 0; i < 9; ++i) {
		newBoard[i] = new Array(9);
		for (let j = 0; j < 9; ++j) {
			newBoard[i][j] = oldBoard[i][j];
		}
	}
	return newBoard;
}

function getBoardData() {
	let newBoard = new Array(9);
	for (let i = 0; i < 9; ++i) {
		newBoard[i] = new Array(9);
		for (let j = 0; j < 9; ++j) {
			if (boardCells[i][j].value == "") {
				newBoard[i][j] = 0;
			} else {
				newBoard[i][j] = boardCells[i][j].value;
			}
		}
	}
	return newBoard;
}

function backtrackClicked() {
	let board = getBoardData();
	let result = backtrack(board, 0, 0);
	if (result == false) {
		console.log("no solution found");
	} else {
		render(result)
	}
}

function checkBoard(board, i, j) {
	let val = board[i][j];
	for (let row = 0; row < 9; ++row) {
		if (board[row][j] == val && row != i) {
			return false;
		}
	}
	for (let col = 0; col < 9; ++col) {
		if (board[i][col] == val && col != j) {
			return false;
		}
	}
	let sqi = Math.floor(i / 3) * 3;
	let sqj = Math.floor(j / 3) * 3;
	for (let sqii = sqi; sqii < sqi + 3; ++sqii) {
		for (let sqji = sqj; sqji < sqj + 3; ++sqji) {
			if (board[sqii][sqji] == val && !(sqii == i && sqji == j))
				return false;
		}
	}
	return true;
}

async function backtrack(board, i, j) {
	await new Promise(resolve => setTimeout(resolve, 5));
	render(board);
	let nexti = i + 1;
	let nextj = j;
	if (nexti == 9) {
		nexti = 0;
		nextj = j + 1;
	}

	if (board[i][j] != 0) {
		if (checkBoard(board, i, j) == false)
			return false;
		return await backtrack(board, nexti, nextj);
	} else {
		for (let newval = 1; newval <= 9; ++newval) {
			let newboard = copyBoard(board);
			newboard[i][j] = newval;
			if (checkBoard(newboard, i, j)) {
				let result = await backtrack(newboard, nexti, nextj);
				if (result != false)
					return result;
			}
		}
	}
	if (nextj == 9 && checkBoard(board, i, j) == true) {
		return board;
	}
	return false;
}

function render(board) {
	for (let i = 0; i < 9; ++i) {
		for (let j = 0; j < 9; ++j) {
			if (board[i][j] == 0)
				boardCells[i][j].value = "";
			else
				boardCells[i][j].value = board[i][j];
		}
	}
}

setup();
