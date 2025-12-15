// gameboard module

// players module
const playersModule = (() => {
  let playerCount = 0;
  const players = [];

  const createPlayer = (playerNameString) => {
    playerCount++;
    const id = playerCount;
    const mark = playerCount === 1 ? "X" : "O";
    const name = playerNameString;
    const newPlayer = { id: id, name: name, mark: mark };

    players.push(newPlayer);
    return newPlayer;
  };

  // FIX: Use a function to get the current state of players
  const getPlayers = () => players;
  const getPlayer1 = () => players[0];
  const getPlayer2 = () => players[1];

  return { createPlayer, getPlayers, getPlayer1, getPlayer2 };
})();

// Now this works!

console.log(playersModule.createPlayer("felix"));
console.log(playersModule.createPlayer("jane"));
