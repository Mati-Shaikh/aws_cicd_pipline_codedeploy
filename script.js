
const cells = document.querySelectorAll(".cell");
const selectionX = document.getElementById("selection-x");
const selectionO = document.getElementById("selection-o");
const ticTacGrid = document.getElementById("tic-tac-grid");
const newRoundButton = document.getElementById("new-round");
const playerTurn = document.getElementById("player-turn");
const playerXButton = document.getElementById("player-x-button");
const playerOButton = document.getElementById("player-o-button");

selectionX.draggable = true;
selectionO.draggable = true;

let currentPlayer = null;
let isGameOver = false;
let isDraw = false;
let winner = "";

let piecesPlacedX = 0;
let piecesPlacedO = 0;

const winningCombinations = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Horizontal
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Vertical
  [0, 4, 8], [2, 4, 6], // Diagonal
];

const setPlayerTurn = (player) => {
  currentPlayer = player;
  playerTurn.textContent = `Player ${currentPlayer}'s Turn`;
};

const checkForWinner = () => {
  winningCombinations.forEach((combination) => {
    const [a, b, c] = combination;
    if (
      cells[a].innerHTML === cells[b].innerHTML &&
      cells[b].innerHTML === cells[c].innerHTML &&
      cells[a].innerHTML !== ""
    ) {
      isGameOver = true;
      winner = cells[a].innerHTML;
      draggableOff();
      cells[a].classList.add("winner");
      cells[b].classList.add("winner");
      cells[c].classList.add("winner");
      playerTurn.textContent = `Player ${winner} Wins!`;
    }
  });
};

const checkForDraw = () => {
  return Array.from(cells).every((cell) => cell.innerHTML !== "");
};

const placePiece = (cell) => {
  if (isGameOver || cell.innerHTML !== "" || currentPlayer === null) return;

  if ((currentPlayer === "X" && piecesPlacedX < 6) || (currentPlayer === "O" && piecesPlacedO < 6)) {
    cell.innerHTML = currentPlayer;
    currentPlayer === "X" ? piecesPlacedX++ : piecesPlacedO++;
    checkForWinner();
    isDraw = checkForDraw();

    if (isDraw && !isGameOver) {
      playerTurn.textContent = "It's a draw!";
      isGameOver = true;
    }

    if (!isGameOver) {
      currentPlayer = null;
      playerTurn.textContent = "Click a player button to continue";
    }

    if (piecesPlacedX === 3 && piecesPlacedO === 3) {
      allowDraggable();
    }
  }
};

cells.forEach((cell) => {
  cell.addEventListener("click", () => placePiece(cell));
});

const resetGame = () => {
  cells.forEach((cell) => {
    cell.innerHTML = "";
    cell.classList.remove("winner");
  });

  isGameOver = false;
  isDraw = false;
  winner = "";
  currentPlayer = null;
  piecesPlacedX = 0;
  piecesPlacedO = 0;
  draggableOff();
  playerTurn.textContent = "Click a player button to start";
};

newRoundButton.addEventListener("click", resetGame);

playerXButton.addEventListener("click", () => {
  if (!isGameOver && currentPlayer !== "X") {
    setPlayerTurn("X");
  }
});

playerOButton.addEventListener("click", () => {
  if (!isGameOver && currentPlayer !== "O") {
    setPlayerTurn("O");
  }
});

function allowDraggable() {
  cells.forEach((cell) => {
    cell.setAttribute("draggable", "true");
    cell.addEventListener("dragstart", handleDragStart);
    cell.addEventListener("dragover", handleDragOver);
    cell.addEventListener("drop", handleDrop);
  });
}

function draggableOff() {
  cells.forEach((cell) => {
    cell.setAttribute("draggable", "false");
    cell.removeEventListener("dragstart", handleDragStart);
    cell.removeEventListener("dragover", handleDragOver);
    cell.removeEventListener("drop", handleDrop);
  });
}

function handleDragStart(e) {
  if (e.target.innerHTML === currentPlayer) {
    e.dataTransfer.setData("text/plain", e.target.id);
  } else {
    e.preventDefault();
  }
}

function handleDragOver(e) {
  e.preventDefault();
}

function handleDrop(e) {
  e.preventDefault();
  const draggedCellId = e.dataTransfer.getData("text/plain");
  const draggedCellElement = document.getElementById(draggedCellId);
  const dropTarget = e.target;

  if (
    dropTarget.classList.contains("cell") &&
    dropTarget.innerHTML === "" &&
    isMoveValid(parseInt(draggedCellId), parseInt(dropTarget.id))
  ) {
    dropTarget.innerHTML = draggedCellElement.innerHTML;
    draggedCellElement.innerHTML = "";
    checkForWinner();
    if (!isGameOver) {
      currentPlayer = null;
      playerTurn.textContent = "Click a player button to continue";
    }
  }
}

function isMoveValid(fromId, toId) {
  const validMoves = {
    4: [0, 1, 2, 3, 5, 6, 7, 8],
    0: [1, 3, 4],
    1: [0, 2, 4],
    2: [1, 4, 5],
    3: [0, 4, 6],
    5: [2, 4, 8],
    6: [3, 4, 7],
    7: [4, 6, 8],
    8: [4, 5, 7],
  };
  return validMoves[fromId].includes(toId);
}

resetGame();
