$(document).ready(function() {
    const gameSize = 4;
    let board = [];
    let score = 0;
    let bestScore = localStorage.getItem('bestScore') || 0;
    let previousBoard = [];
    let previousScore = 0;
  
    $("#best-score").text(bestScore);
  
    function initBoard() {
      for (let i = 0; i < gameSize; i++) {
        board[i] = [];
        for (let j = 0; j < gameSize; j++) {
          board[i][j] = 0;
        }
      }
      addRandomTile();
      addRandomTile();
      renderBoard();
    }
  
    function addRandomTile() {
      let emptyTiles = [];
      for (let i = 0; i < gameSize; i++) {
        for (let j = 0; j < gameSize; j++) {
          if (board[i][j] === 0) {
            emptyTiles.push({ x: i, y: j });
          }
        }
      }
      if (emptyTiles.length === 0) return;
      let { x, y } = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
      board[x][y] = Math.random() < 0.9 ? 2 : 4;
    }
  
    function renderBoard() {
      let $board = $("#game-board");
      $board.empty();
      for (let i = 0; i < gameSize; i++) {
        for (let j = 0; j < gameSize; j++) {
          let tileValue = board[i][j];
          let $tile = $('<div class="tile"></div>');
          if (tileValue !== 0) {
            $tile.text(tileValue);
            $tile.attr("data-value", tileValue);
          }
          $board.append($tile);
        }
      }
      $("#score").text(score);
      if (score > bestScore) {
        bestScore = score;
        localStorage.setItem('bestScore', bestScore);
        $("#best-score").text(bestScore);
      }
    }
  
    function move(direction) {
      saveState();
      let moved = false;
      if (direction === "up") {
        for (let j = 0; j < gameSize; j++) {
          for (let i = 1; i < gameSize; i++) {
            if (board[i][j] !== 0) {
              let row = i;
              while (row > 0 && board[row - 1][j] === 0) {
                board[row - 1][j] = board[row][j];
                board[row][j] = 0;
                row--;
                moved = true;
              }
              if (row > 0 && board[row - 1][j] === board[row][j]) {
                board[row - 1][j] *= 2;
                score += board[row - 1][j];
                board[row][j] = 0;
                moved = true;
              }
            }
          }
        }
      } else if (direction === "down") {
        for (let j = 0; j < gameSize; j++) {
          for (let i = gameSize - 2; i >= 0; i--) {
            if (board[i][j] !== 0) {
              let row = i;
              while (row < gameSize - 1 && board[row + 1][j] === 0) {
                board[row + 1][j] = board[row][j];
                board[row][j] = 0;
                row++;
                moved = true;
              }
              if (row < gameSize - 1 && board[row + 1][j] === board[row][j]) {
                board[row + 1][j] *= 2;
                score += board[row + 1][j];
                board[row][j] = 0;
                moved = true;
              }
            }
          }
        }
      } else if (direction === "left") {
        for (let i = 0; i < gameSize; i++) {
          for (let j = 1; j < gameSize; j++) {
            if (board[i][j] !== 0) {
              let col = j;
              while (col > 0 && board[i][col - 1] === 0) {
                board[i][col - 1] = board[i][col];
                board[i][col] = 0;
                col--;
                moved = true;
              }
              if (col > 0 && board[i][col - 1] === board[i][col]) {
                board[i][col - 1] *= 2;
                score += board[i][col - 1];
                board[i][col] = 0;
                moved = true;
              }
            }
          }
        }
      } else if (direction === "right") {
        for (let i = 0; i < gameSize; i++) {
          for (let j = gameSize - 2; j >= 0; j--) {
            if (board[i][j] !== 0) {
              let col = j;
              while (col < gameSize - 1 && board[i][col + 1] === 0) {
                board[i][col + 1] = board[i][col];
                board[i][col] = 0;
                col++;
                moved = true;
              }
              if (col < gameSize - 1 && board[i][col + 1] === board[i][col]) {
                board[i][col + 1] *= 2;
                score += board[i][col + 1];
                board[i][col] = 0;
                moved = true;
              }
            }
          }
        }
      }
      if (moved) {
        addRandomTile();
        renderBoard();
        if (isGameOver()) {
          $("#game-message").text("Game Over!");
        }
      }
    }
  
    function isGameOver() {
      for (let i = 0; i < gameSize; i++) {
        for (let j = 0; j < gameSize; j++) {
          if (board[i][j] === 0) return false;
          if (i > 0 && board[i][j] === board[i - 1][j]) return false;
          if (i < gameSize - 1 && board[i][j] === board[i + 1][j]) return false;
          if (j > 0 && board[i][j] === board[i][j - 1]) return false;
          if (j < gameSize - 1 && board[i][j] === board[i][j + 1]) return false;
        }
      }
      return true;
    }
  
    function saveState() {
      previousBoard = board.map(row => row.slice());
      previousScore = score;
    }
  
    function undoMove() {
      if (previousBoard.length > 0) {
        board = previousBoard.map(row => row.slice());
        score = previousScore;
        renderBoard();
        $("#game-message").text("");
      }
    }
  
    $(document).keydown(function(e) {
      switch (e.key) {
        case "ArrowUp": move("up"); break;
        case "ArrowDown": move("down"); break;
        case "ArrowLeft": move("left"); break;
        case "ArrowRight": move("right"); break;
      }
    });
  
    $("#restart").click(function() {
      score = 0;
      $("#game-message").text("");
      initBoard();
    });
  
    $("#undo").click(function() {
      undoMove();
    });
  
    initBoard();
  });
  