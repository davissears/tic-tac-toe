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
    if (state.winner === null) {
      return;
    } else if (state.winner.id === 1 || state.winner.id === 2) {
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
      state.winner = player;
    } else if (
      board().b1 === player.mark &&
      board().b2 === player.mark &&
      board().b3 === player.mark
    ) {
      console.log(`${player.name} wins!`);
      state.winner = player;
    } else if (
      board().c1 === player.mark &&
      board().c2 === player.mark &&
      board().c3 === player.mark
    ) {
      console.log(`${player.name} wins!`);
      state.winner = player;
    } else if (
      board().a1 === player.mark &&
      board().b1 === player.mark &&
      board().c1 === player.mark
    ) {
      console.log(`${player.name} wins!`);
      state.winner = player;
    } else if (
      board().a2 === player.mark &&
      board().b2 === player.mark &&
      board().c2 === player.mark
    ) {
      console.log(`${player.name} wins!`);
      state.winner = player;
    } else if (
      board().a3 === player.mark &&
      board().b3 === player.mark &&
      board().c3 === player.mark
    ) {
      console.log(`${player.name} wins!`);
      state.winner = player;
    } else if (
      board().a1 === player.mark &&
      board().b2 === player.mark &&
      board().c3 === player.mark
    ) {
      console.log(`${player.name} wins!`);
      state.winner = player;
    } else if (
      board().a3 === player.mark &&
      board().b2 === player.mark &&
      board().c1 === player.mark
    ) {
      console.log(`${player.name} wins!`);
      state.winner = player;
    } else {
      state.winner = null;
    }
    gameOver();
    return state.winner;
  };
  // tracks active player
  const endTurn = () => {
    const marksPlaced = Object.values(board()).filter(
      (mark) => mark !== "",
    ).length;

    // checks marks on gameboard to determine currentPlayer
    if (marksPlaced > state.placedMarks) {
      state.placedMarks = marksPlaced;
      state.currentPlayer =
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
    state.currentPlayer = player1();
    state.placedMarks = 0;
    state.winner = null;

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
  };
})();

const eventsModule = (() => {
  // modal
  // selectors
  const modal = document.querySelector(".playersModal");
  const addPlayers = document.querySelector(".addPlayersButton");
  const startGame = document.querySelector(".startGameButton");

  // opens Modal
  addPlayers.addEventListener("click", () => {
    modal.showModal();
  });

  // #TODO call `playGame()` one `startGame` click event
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

    // init game, call playGame();
    gamestateModule.playGame();

    // append player1 to left side of screen
    const playerOneElement = document.createElement("p");
    playerOneElement.textContent = playerOneName;
    document.querySelector(".playerOneDisplay").appendChild(playerOneElement);

    // append player2 to right side of screen
    const playerTwoElement = document.createElement("p");
    playerTwoElement.textContent = playerTwoName;
    document.querySelector(".playerTwoDisplay").appendChild(playerTwoElement);
  });
})();
