// gameboard module
gameboardModule = (() => {
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
    console.log(`${name} is Player ${id}!`);
    return newPlayer;
  };

  const getPlayers = () => players;
  const getPlayer1 = () => players[0];
  const getPlayer2 = () => players[1];

  return { createPlayer, getPlayers, getPlayer1, getPlayer2 };
})();

const gamestateModule = (() => {
  const player1 = () => playersModule.getPlayer1();
  const player2 = () => playersModule.getPlayer2();
  const board = () => gameboardModule.getBoard();

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
  playGame = () => {
    const winner = null;
    let placedMarks = 0;
    let currentPlayer = player1();

    console.log("Value of board():", board());

    if (!currentPlayer) {
      console.warn(
        "No players found. Please create players before starting the game.",
      );
      return;
    }

    const countMarks = Object.values(board()).filter(
      (mark) => mark === currentPlayer.mark,
    );

    //
    endTurn = () => {
      if (countMarks.length > placedMarks) {
        placedMarks++;
        currentPlayer = currentPlayer === player1() ? player2() : player1();
      }
      return currentPlayer;
    };
    return {
      endTurn,
      countMarks,
      currentPlayer,
      endTurn,
    };
  };
  // TODO remove 'player1' & 'player2' from return statement
  const currentPlayer = () => playGame().currentPlayer;
  return {
    currentPlayer,
    player1,
    player2,
    board,
    placeMark,
    playGame,
  };
})();

// FIX THIS: gamestateModule.currentPlayer() is not loging the expected value.
// tests
playersModule.createPlayer("dad");
playersModule.createPlayer("felix");
gamestateModule.placeMark(gamestateModule.player1(), "a1");
console.log(gamestateModule.currentPlayer());
console.log(gamestateModule.playGame().endTurn());
console.log(gamestateModule.currentPlayer());
