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

  const updateBoard = (spot, mark) => (gameboard[spot] = mark);
  return { gameboard, getBoard, updateBoard };
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
    return newPlayer;
  };

  // FIX: Use a function to get the current state of players
  const getPlayers = () => players;
  const getPlayer1 = () => players[0];
  const getPlayer2 = () => players[1];

  return { createPlayer, getPlayers, getPlayer1, getPlayer2 };
})();

const gamestateModule = (() => {
  const player1 = () => playersModule.getPlayer1();
  const player2 = () => playersModule.getPlayer2();

  // placeMark()
  // accepts player and gameboard position to place the players mark
  // 1.get player object
  // 2.get mark from player object
  // 3.get players board position to place mark
  // 4.get gameboard object
  // 5.construct new value for gameboard object
  // 6. RETUTN: update to specified gameboard property value
  return { player1, player2 };
})();
