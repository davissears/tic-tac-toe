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
  
  // stores gamestate variable values.
  let state = {
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

    return state.currentPlayer;
  };
  
  // 
  // 
  // FIX TODO: isWinning() / gameOver()
  // isWinning()
  //  if player meets win conditions: 
  //    (any of 8 possible win conditions are met)
  //    {update state
  //    call gameOver()}
  //  if draw: 
  //    (9 total marksPlaced)
  //    {call GameOver()}
  // 
  // gameOver()
  //  if winner === a player
  //    (player1 || player2)
  //    {player[id] wins}
  //  if winner is null
  //    (winner === null)
  //    {draw: the game wins?}
  //  
  //  
  const playGame = () => {
    state.currentPlayer = player1();
    state.placedMarks = 0;
    state.winner = null;

    // TODO remove this console.log
    console.log("Value of board():", board());

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
  };
})();

// tests
// playersModule.createPlayer("dad");
// playersModule.createPlayer("felix");
// gamestateModule.playGame();
// gamestateModule.placeMark(gamestateModule.player1(), "a1");
// console.log(gamestateModule.currentPlayer());
// console.log(gamestateModule.playGame().endTurn());
// console.log(gamestateModule.currentPlayer());
