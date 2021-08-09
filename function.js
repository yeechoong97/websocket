const { playerDetails, playerRound } = require("./model");

playerArray = [];

const playerJoin = (id) => {
    let newPlayer = playerDetails;
    newPlayer.playerID = id;
    playerArray.push(newPlayer);
    playerRound.playerID = id;
    return playerRound;
}

const getPlayer = (id) => {
    return playerArray.find(player => player.playerID == id);
}

module.exports = { playerJoin, getPlayer };