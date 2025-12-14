// gameboard module
// const gameboard = (function() {
//   function inner(argument) {

//   }
// })
// players module
const playersModule = (function () {
  let playerCount = 0;

  const createPlayer = function (playerNameString) {
    playerCount++;
    const id = playerCount;
    const mark = playerCount === 1 ? "X" : "O";

    // Return the single player object
    return { id, name: playerNameString, mark };
  };

  return { createPlayer };
})();

console.log(playersModule.createPlayer("john"));
console.log(playersModule.createPlayer("jane"));
