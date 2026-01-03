

// gameboard module
let gameboardModule = (() => {
  const gameboard = {
    a1: "",
    a2: "",
    a3: "",
    b1: "",
    b2: "",
    b3: "",
    c1: "",
    c2: "",
    c3: "",
  };

  // methods
  const getBoard = () => gameboard;

  function updateBoard(spot, mark) {
    gameboard[spot] = mark;
    return true;
  }

  function resetBoard() {
    Object.keys(gameboard).forEach((key) => {
      gameboard[key] = "";
    });
  }

  return { getBoard, updateBoard, gameboard, resetBoard };
})();

// players module
const playersModule = (() => {
  let playerCount = 0;
  const players = [];

  // creates newPlayer objects
  const createPlayer = (playerNameString) => {
    // increments newPlayer id
    playerCount++;
    if (playerCount > 2) {
      throw new Error("this is a two player Game");
    }
    //  defines newPlayer object properties
    const id = playerCount;
    const mark = playerCount === 1 ? "X" : "O";
    const name = playerNameString;
    const newPlayer = { id: id, name: name, mark: mark };

    // adds newPlayer object to players array
    players.push(newPlayer);
    // TODO remove this console log
    console.log(`${name} is Player ${id}!`);
    return newPlayer;
  };

  const getPlayers = () => players;
  const getPlayer1 = () => players[0];
  const getPlayer2 = () => players[1];

  const resetPlayers = () => {
    playerCount = 0;
    players.length = 0;
  };

  return { createPlayer, getPlayers, getPlayer1, getPlayer2, resetPlayers };
})();

// gamestate Module
const gamestateModule = (() => {
  // defines methods to reuse from `playersModule` and `gamestateModule`
  const player1 = () => playersModule.getPlayer1();
  const player2 = () => playersModule.getPlayer2();
  const board = () => gameboardModule.getBoard();

  // stores gamestate variable values.
  const state = {
    // player trun
    currentPlayer: null,
    // used to determine a tie endgame condition &
    // player turn tracking support
    placedMarks: 0,
    // updated & checked by `isWinning()` & `gameOver()`
    winner: null,
    // stores winning condition
    // `isWinning()1` updates value if win condition is met
    // 'eventsModule` checks for event delegation
    winningCombination: null,
  };

  // state proxy
  // updates state values and dispatches a custom event
  // for `eventsModule`
  const stateProxy = new Proxy(state, {
    set(target, prop, value) {
      const oldValue = target[prop];
      // updates value
      target[prop] = value;
      const event = new CustomEvent("stateChange", {
        detail: { prop, oldValue, newValue: value },
      });
      // makes values available globally
      window.dispatchEvent(event);
      return true;
    },
  });

  // accepts player and gameboard position to place the players mark
  const placeMark = (player, spot) => {
    const mark = player.mark;
    const updateBoard = gameboardModule.updateBoard(spot, mark);
    return updateBoard;
    // call example:
    //  gamestateModule.placeMark(gamestateModule.player1(), 'a1');
  };

  // logs game over if `isWinnner()` has determined a winner
  const gameOver = () => {
    // checks if endgame conditins are met
    // by checking state.winner value
    // & makes value globally available
    if (stateProxy.winner !== null) {
      const event = new CustomEvent("gameover", {
        detail: { winner: state.winner },
      });
      // makes state variable available globally
      window.dispatchEvent(event);
      // checks `state.placedMarks` to determine a tie
    } else if (state.placedMarks === 9) {
      const event = new CustomEvent("gameover", {
        detail: { winner: null },
      });
      // makes state variable available globally
      window.dispatchEvent(event);
    }
  };

  // checks gameboard object for winning conditions
  // & updates state object if a winner is determined
  const isWinning = (player) => {
    if (
      board().a1 === player.mark &&
      board().a2 === player.mark &&
      board().a3 === player.mark
    ) {
      stateProxy.winner = player;
      stateProxy.winningCombination = ["a1", "a2", "a3"];
    } else if (
      board().b1 === player.mark &&
      board().b2 === player.mark &&
      board().b3 === player.mark
    ) {
      stateProxy.winner = player;
      stateProxy.winningCombination = ["b1", "b2", "b3"];
    } else if (
      board().c1 === player.mark &&
      board().c2 === player.mark &&
      board().c3 === player.mark
    ) {
      stateProxy.winner = player;
      stateProxy.winningCombination = ["c1", "c2", "c3"];
    } else if (
      board().a1 === player.mark &&
      board().b1 === player.mark &&
      board().c1 === player.mark
    ) {
      stateProxy.winner = player;
      stateProxy.winningCombination = ["a1", "b1", "c1"];
    } else if (
      board().a2 === player.mark &&
      board().b2 === player.mark &&
      board().c2 === player.mark
    ) {
      stateProxy.winner = player;
      stateProxy.winningCombination = ["a2", "b2", "c2"];
    } else if (
      board().a3 === player.mark &&
      board().b3 === player.mark &&
      board().c3 === player.mark
    ) {
      stateProxy.winner = player;
      stateProxy.winningCombination = ["a3", "b3", "c3"];
    } else if (
      board().a1 === player.mark &&
      board().b2 === player.mark &&
      board().c3 === player.mark
    ) {
      stateProxy.winner = player;
      stateProxy.winningCombination = ["a1", "b2", "c3"];
    } else if (
      board().a3 === player.mark &&
      board().b2 === player.mark &&
      board().c1 === player.mark
    ) {
      stateProxy.winner = player;
      stateProxy.winningCombination = ["a3", "b2", "c1"];
    } else {
      stateProxy.winner = null;
      stateProxy.winningCombination = null;
    }
    return state.winner;
  };
  // tracks active player
  const endTurn = () => {
    // gets values from gameboardModule.gameboard array
    // counts updated value & stores it
    const marksPlaced = Object.values(board()).filter(
      (mark) => mark !== "",
    ).length;

    // checks marks on gameboard to determine currentPlayer
    if (marksPlaced > state.placedMarks) {
      // updates state.placedMarks
      stateProxy.placedMarks = marksPlaced;
      // updates state.currentPlayer
      stateProxy.currentPlayer =
        state.currentPlayer === player1() ? player2() : player1();
      // error handling
    } else {
      throw new Error("No move made yet.");
    }

    return (state.currentPlayer, state.marksPlaced);
  };

  // inits state of game
  const playGame = () => {
    // sets initial state of game
    stateProxy.currentPlayer = player1();
    stateProxy.placedMarks = 0;
    stateProxy.winner = null;

    if (!state.currentPlayer) {
      throw new Error(
        "No players found. Please create players before starting the game.",
      );
    }
  };

  // resets state values
  const resetGame = () => {
    gameboardModule.resetBoard();
    stateProxy.currentPlayer = player1();
    stateProxy.placedMarks = 0;
    stateProxy.winner = null;
    stateProxy.winningCombination = null;
  };

  // TODO remove 'player1' & 'player2' from return statement
  return {
    placeMark,
    playGame,
    endTurn,
    isWinning,
    gameOver,
    state,
    stateProxy,
    resetGame,
  };
})();

const eventsModule = (() => {
  // modal
  // selectors
  const modal = document.querySelector(".playersModal");
  const addPlayers = document.querySelector(".addPlayersButton");
  const startGame = document.querySelector(".startGameButton");
  const gameStatusDisplay = document.querySelector(".gameStatusDisplay");
  const statusText = document.querySelector(".statusText");
  const resetButton = document.querySelector(".resetButton");
  const changePlayersButton = document.querySelector(".changePlayersButton");

  // get state proxy
  // listen for gamestateModule.stateProxy changes
  const getState = (targetProp, targetValue, callback) => {
    window.addEventListener("stateChange", (event) => {
      const { prop, newValue } = event.detail;
      if (prop === targetProp && newValue === targetValue) {
        callback(newValue);
      }
    });
  };

  // opens Modal
  addPlayers.addEventListener("click", () => {
    modal.showModal();
  });

  // kickoff game flow of events
  startGame.addEventListener("click", () => {
    addPlayers.style.display = "none";
    gameStatusDisplay.style.display = "block";

    // gets input value for player one
    const playerOneName = document.getElementById("playerOneString").value;
    // creates player one
    playersModule.createPlayer(playerOneName);
    // gets input vallue for player two
    const playerTwoName = document.getElementById("playerTwoString").value;
    // creates player two
    playersModule.createPlayer(playerTwoName);

    // append player1 to left side of screen
    const playerOneElement = document.createElement("p");
    playerOneElement.textContent = playerOneName;
    document.querySelector(".playerOneDisplay").appendChild(playerOneElement);
    playerOneElement.id = "playerOneNameDisplay";

    // append player2 to right side of screen
    const playerTwoElement = document.createElement("p");
    playerTwoElement.textContent = playerTwoName;
    document.querySelector(".playerTwoDisplay").appendChild(playerTwoElement);
    playerTwoElement.id = "playerTwoNameDisplay";

    // player turn indicator
    //  player one
    getState("currentPlayer", playersModule.getPlayer1(), () => {
      const turnIndicator = document.createElement("p");
      statusText.textContent = `${playersModule.getPlayer1().name}'s Turn`;
      // toggles player 1 to active
      playerOneElement.classList.add("active");
      // toggles player 2 to innactive
      playerTwoElement.classList.remove("active");
      // adds text
      turnIndicator.textContent = "place your mark";
      // appends element
      document.querySelector(".p1Indicator").appendChild(turnIndicator);
      // remove turnIndicator from player2 if present
      const p2Indicator = document.querySelector(".p2Indicator");
      if (p2Indicator.firstChild) {
        p2Indicator.removeChild(p2Indicator.firstChild);
      }
    });

    // player two
    getState("currentPlayer", playersModule.getPlayer2(), () => {
      console.log("Player Two's turn");
      statusText.textContent = `${playersModule.getPlayer2().name}'s Turn`;
      playerTwoElement.classList.add("active");
      playerOneElement.classList.remove("active");
      const turnIndicator = document.createElement("p");
      turnIndicator.textContent = "place your mark";
      document.querySelector(".p2Indicator").appendChild(turnIndicator);
      const p1Indicator = document.querySelector(".p1Indicator");
      // remove turnIndicator from player1 if present
      if (p1Indicator.firstChild) {
        p1Indicator.removeChild(p1Indicator.firstChild);
      }
    });

    // init game, call playGame();
    gamestateModule.playGame();
  });

  // event listener to call 'placeMark'
  document.addEventListener("click", (event) => {
    if (event.target.classList.contains("cell")) {
      const state = gamestateModule.state;
      // Check if game is already over
      if (state.winner || state.placedMarks === 9) {
        return;
      }

      const currentPlayer = state.currentPlayer;
      if (currentPlayer) {
        // call placeMark
        gamestateModule.placeMark(currentPlayer, event.target.id);
        // check for win
        gamestateModule.isWinning(currentPlayer);
        // end turn
        gamestateModule.endTurn();
        // check game over
        gamestateModule.gameOver();
      }
      // populate text from 'gameboardModule.gameboard'
      // properties to corelating cell
      //
      const board = gameboardModule.getBoard();
      Object.entries(board).forEach(([key, value]) => {
        const cell = document.getElementById(key);
        if (cell) {
          cell.textContent = value;
        }
      });
    }
  });

  // Listens for the event dispatched by `gamestateModule.gameOver()` to update the UI.
  window.addEventListener("gameover", (event) => {
    // gets winner
    const winner = event.detail.winner;
    // endgame message content for gameStatusDisplay
    const messageText = winner ? `Player ${winner.name} wins!` : "It's a tie!";
    // assigns gameStatusDisplay child as endgame message
    statusText.textContent = messageText;
    // declares message as an element
    const messageElement = document.createElement("p");
    // assigns gameStatusDisplay child text content as endgame message
    messageElement.textContent = messageText;
    // TODO: resume code review here!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    const p1Indicator = document.querySelector(".p1Indicator");
    const p2Indicator = document.querySelector(".p2Indicator");

    if (p1Indicator) p1Indicator.innerHTML = "";
    if (p2Indicator) p2Indicator.innerHTML = "";

    // remove active class from both players initially on game over
    const p1Display = document.getElementById("playerOneNameDisplay");
    const p2Display = document.getElementById("playerTwoNameDisplay");
    if (p1Display) p1Display.classList.remove("active");
    if (p2Display) p2Display.classList.remove("active");

    if (winner === playersModule.getPlayer1()) {
      if (p1Indicator) p1Indicator.appendChild(messageElement);
      if (p1Display) p1Display.classList.add("active");
    } else if (winner === playersModule.getPlayer2()) {
      if (p2Indicator) p2Indicator.appendChild(messageElement);
      if (p2Display) p2Display.classList.add("active");
    }

    // checks state.winningCombination to highlight winning cells
    const winningCombination = gamestateModule.state.winningCombination;
    if (winningCombination) {
      winningCombination.forEach((cellId) => {
        const cellElement = document.getElementById(cellId);
        if (cellElement) {
          cellElement.classList.add("winning-cell");
        }
      });
    }

    resetButton.style.display = "block";
    changePlayersButton.style.display = "block";
  });

  resetButton.addEventListener("click", () => {
    gamestateModule.resetGame();
    resetButton.style.display = "none";
    changePlayersButton.style.display = "none";

    // Clear board UI
    const cells = document.querySelectorAll(".cell");
    cells.forEach((cell) => {
      cell.textContent = "";
      cell.classList.remove("winning-cell");
    });

    // Reset player indicators
    const p1Indicator = document.querySelector(".p1Indicator");
    const p2Indicator = document.querySelector(".p2Indicator");
    if (p1Indicator) p1Indicator.innerHTML = "";
    if (p2Indicator) p2Indicator.innerHTML = "";

    const p1Display = document.getElementById("playerOneNameDisplay");
    const p2Display = document.getElementById("playerTwoNameDisplay");
    if (p1Display) p1Display.classList.add("active"); // Player 1 starts
    if (p2Display) p2Display.classList.remove("active");

    statusText.textContent = `${playersModule.getPlayer1().name}'s Turn`;

    const turnIndicator = document.createElement("p");
    turnIndicator.textContent = "place your mark";
    p1Indicator.appendChild(turnIndicator);
  });

  changePlayersButton.addEventListener("click", () => {
    gamestateModule.resetGame();
    playersModule.resetPlayers();
    resetButton.style.display = "none";
    changePlayersButton.style.display = "none";

    // Clears board UI
    const cells = document.querySelectorAll(".cell");
    cells.forEach((cell) => {
      cell.textContent = "";
      cell.classList.remove("winning-cell");
    });

    // Reset player indicators and Remove Player Names
    const p1Indicator = document.querySelector(".p1Indicator");
    const p2Indicator = document.querySelector(".p2Indicator");
    if (p1Indicator) p1Indicator.innerHTML = "";
    if (p2Indicator) p2Indicator.innerHTML = "";

    const p1Display = document.getElementById("playerOneNameDisplay");
    const p2Display = document.getElementById("playerTwoNameDisplay");
    if (p1Display) p1Display.remove();
    if (p2Display) p2Display.remove();

    // Reset Forms
    document.getElementById("playerOneString").value = "";
    document.getElementById("playerTwoString").value = "";

    // Hide Status, Show Add Players
    gameStatusDisplay.style.display = "none";
    addPlayers.style.display = "block";
  });
})();
