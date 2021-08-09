const Websocket = require('ws')
const { playerJoin, getPlayer } = require('./function')
const { matchResponse, playerRound, playerDetails } = require('./model');

// let outputResult = undefined;
let playerMatchRound = playerRound;
let playerAccountDetails = playerDetails;
let resultArr = [];

//Create new Websocket server
const wss = new Websocket.Server({ port: 8080 }, () => {
    console.log('Server Started');
})

//Client connected to server
wss.on('connection', function connection(ws, req) {

    ws.on('message', (data) => {
        console.log(`${data} is received`);
        let receivedInput = JSON.parse(data.toString());

        //Setup the account details
        if (receivedInput.betDetails == "AccountSetup") {
            let playerID = req.headers['sec-websocket-key'];
            if (!getPlayer(playerID))
                playerMatchRound = playerJoin(playerID, receivedInput.playerName);

            playerAccountDetails = getPlayer(playerID);
        }

        //Check the bets of user
        if (receivedInput.betDetails == "roundDetails") {
            switch (receivedInput.betType) {
                case "ODD":
                    playerMatchRound.betType[0].value += receivedInput.betValue;
                    break;

                case "EVEN":
                    playerMatchRound.betType[1].value += receivedInput.betValue;
                    break;

                case "SMALL":
                    playerMatchRound.betType[2].value += receivedInput.betValue;
                    break;

                case "BIG":
                    playerMatchRound.betType[3].value += receivedInput.betValue;
                    break;

                case "2R2W":
                    playerMatchRound.betType[4].value += receivedInput.betValue;
                    break;

                case "4R":
                    playerMatchRound.betType[5].value += receivedInput.betValue;
                    break;

                case "3R1W":
                    playerMatchRound.betType[6].value += receivedInput.betValue;
                    break;

                case "3W1R":
                    playerMatchRound.betType[7].value += receivedInput.betValue;
                    break;

                case "4W":
                    playerMatchRound.betType[8].value += receivedInput.betValue;
                    break;
            }
            playerMatchRound.betTransactions.push({ "type": receivedInput.betType, "value": receivedInput.betValue });
            playerAccountDetails.totalBetValue += receivedInput.betValue;
            playerAccountDetails.playerBalance -= receivedInput.betValue;
            matchResponse.status = "Pending";
        }

        //Undo the previous bet of user
        if (receivedInput.betDetails == "undoPrevious") {
            if (playerMatchRound.betTransactions.length > 0) {
                let lastTrans = playerMatchRound.betTransactions[playerMatchRound.betTransactions.length - 1];
                switch (lastTrans.type) {
                    case "ODD":
                        playerMatchRound.betType[0].value -= lastTrans.value;
                        break;

                    case "EVEN":
                        playerMatchRound.betType[1].value -= lastTrans.value;
                        break;

                    case "SMALL":
                        playerMatchRound.betType[2].value -= lastTrans.value;
                        break;

                    case "BIG":
                        playerMatchRound.betType[3].value -= lastTrans.value;
                        break;

                    case "2R2W":
                        playerMatchRound.betType[4].value -= receivedInput.betValue;
                        break;

                    case "4R":
                        playerMatchRound.betType[5].value -= receivedInput.betValue;
                        break;

                    case "3R1W":
                        playerMatchRound.betType[6].value -= receivedInput.betValue;
                        break;

                    case "3W1R":
                        playerMatchRound.betType[7].value -= receivedInput.betValue;
                        break;

                    case "4W":
                        playerMatchRound.betType[8].value -= receivedInput.betValue;
                        break;
                }
                playerAccountDetails.totalBetValue -= lastTrans.value;
                playerAccountDetails.playerBalance += lastTrans.value;
                matchResponse.status = "Pending";
                playerMatchRound.betTransactions.pop();
            }
        }

        //The round is ended with timer
        if (receivedInput.betDetails == "RoundEnded") {
            let redResult = Math.floor(Math.random() * 4);
            let whiteResult = 4 - redResult;

            while (true) {
                if (redResult != 0) {
                    resultArr.push("red");
                    redResult--;
                }
                if (whiteResult != 0) {
                    resultArr.push("white");
                    whiteResult--;
                }
                if (resultArr.length == 4)
                    break;
            }
            matchResponse.status = "Completed";
            matchResponse.matchResult = resultArr;
        }

        if (receivedInput.betDetails == "AccountSetup")
            ws.send("0" + JSON.stringify(playerAccountDetails));
        else {
            ws.send("1" + JSON.stringify(matchResponse));
            ws.send("0" + JSON.stringify(playerAccountDetails));
            console.log(playerAccountDetails);
        }
    })
})

wss.on('listening', () => {
    console.log('Listening to 8080');
})