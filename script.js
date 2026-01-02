// TODO: specify roadmap to progress development

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
    // TODO remove this console log
    console.table(gameboard);
    return true;
  }
  return { getBoard, updateBoard, gameboard };
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

  return { createPlayer, getPlayers, getPlayer1, getPlayer2 };
})();
// gamestate Module
const gamestateModule = (() => {
  const player1 = () => playersModule.getPlayer1();
  const player2 = () => playersModule.getPlayer2();
  const board = () => gameboardModule.getBoard();

  // stores gamestate variable values.
  const state = {
    currentPlayer: null,
    placedMarks: 0,
    winner: null,
  };

  // state proxy
  const stateProxy = new Proxy(state, {
    set(target, prop, value) {
      const oldValue = target[prop];
      // updates value
      target[prop] = value;
      const event = new CustomEvent("stateChange", {
        detail: { prop, oldValue, newValue: value },
      });
      window.dispatchEvent(event);
      return true;
    },
  });

  // methods
  // accepts player and gameboard position to place the players mark
  const placeMark = (player, spot) => {
    const mark = player.mark;
    const updateBoard = gameboardModule.updateBoard(spot, mark);
    // TODO remove this console.log
    console.log(`${player.name} placed a ${mark} at ${spot}`);
    return updateBoard;
    // call example:
    //  gamestateModule.placeMark(gamestateModule.player1(), 'a1');
  };
  // logs game over if `isWinnner()` has determined a winner
  const gameOver = () => {
    if (state.winner) {
      console.log(`GAME OVER: ${state.winner.name} wins!`);
    } else if (state.placedMarks === 9) {
      console.log(`GAME OVER: DRAW`);
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
      console.log(`${player.name} wins!`);
      stateProxy.winner = player;
    } else if (
      board().b1 === player.mark &&
      board().b2 === player.mark &&
      board().b3 === player.mark
    ) {
      console.log(`${player.name} wins!`);
      stateProxy.winner = player;
    } else if (
      board().c1 === player.mark &&
      board().c2 === player.mark &&
      board().c3 === player.mark
    ) {
      console.log(`${player.name} wins!`);
      stateProxy.winner = player;
    } else if (
      board().a1 === player.mark &&
      board().b1 === player.mark &&
      board().c1 === player.mark
    ) {
      console.log(`${player.name} wins!`);
      stateProxy.winner = player;
    } else if (
      board().a2 === player.mark &&
      board().b2 === player.mark &&
      board().c2 === player.mark
    ) {
      console.log(`${player.name} wins!`);
      stateProxy.winner = player;
    } else if (
      board().a3 === player.mark &&
      board().b3 === player.mark &&
      board().c3 === player.mark
    ) {
      console.log(`${player.name} wins!`);
      stateProxy.winner = player;
    } else if (
      board().a1 === player.mark &&
      board().b2 === player.mark &&
      board().c3 === player.mark
    ) {
      console.log(`${player.name} wins!`);
      stateProxy.winner = player;
    } else if (
      board().a3 === player.mark &&
      board().b2 === player.mark &&
      board().c1 === player.mark
    ) {
      console.log(`${player.name} wins!`);
      stateProxy.winner = player;
    } else {
      stateProxy.winner = null;
    }
    return state.winner;
  };
  // tracks active player
  const endTurn = () => {
    const marksPlaced = Object.values(board()).filter(
      (mark) => mark !== "",
    ).length;

    // checks marks on gameboard to determine currentPlayer
    if (marksPlaced > state.placedMarks) {
      stateProxy.placedMarks = marksPlaced;
      stateProxy.currentPlayer =
        state.currentPlayer === player1() ? player2() : player1();
      // TODO remove this console.log
      console.log(`Turn ended. Next player: ${state.currentPlayer.name}`);
      // error handling
    } else {
      // TODO remove this console log
      console.warn(`It is still ${state.currentPlayer.name}'s turn.`);
      throw new Error("No move made yet.");
    }

    return (state.currentPlayer, state.marksPlaced);
  };

  const playGame = () => {
    stateProxy.currentPlayer = player1();
    stateProxy.placedMarks = 0;
    stateProxy.winner = null;

    // TODO remove this console.log
    console.table("Value of board():", board());

    if (!state.currentPlayer) {
      // TODO remove this console log
      console.warn(
        "No players found. Please create players before starting the game.",
      );
      return;
    }

    return state;
  };

  // TODO remove 'player1' & 'player2' from return statement
  return {
    player1,
    player2,
    board,
    placeMark,
    playGame,
    endTurn,
    isWinning,
    gameOver,
    state,
    playGame,
    stateProxy,
  };
})();

const eventsModule = (() => {
  // modal
  // selectors
  const modal = document.querySelector(".playersModal");
  const addPlayers = document.querySelector(".addPlayersButton");
  const startGame = document.querySelector(".startGameButton");

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

    // player turn events
    // player turn indicator
    //  player one
    getState("currentPlayer", playersModule.getPlayer1(), () => {
      const turnIndicator = document.createElement("p");
      console.log("Player One's turn");
      playerOneElement.classList.add("active");
      playerTwoElement.classList.remove("active");
      turnIndicator.textContent = "place your mark";
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
      const currentPlayer = gamestateModule.state.currentPlayer;
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
    // populate text from 'gameboardModule.gameboard'
    // properties to corelating cell
    //
  });
})();
