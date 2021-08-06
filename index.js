const Websocket = require('ws')

const sampleResponse = {
    "status_string": "roundEnded",
    "data_string": "a",
    "data_num_array": [1, 2, 3, 4],
    "data_str_array": [],
    "data_int": 0,
    "data_decimal": 222.2222,
};

const pendingResponse = {
    "status_string": "roundPending",
    "data_string": "a",
    "data_num_array": [1, 2, 3, 4],
    "data_str_array": [],
    "data_int": 0,
    "data_decimal": 222.2222,
};

var playerAcc = {
    "playerID": "123456789",
    "totalBetValue": 0,
    "betType": [{
            "type": "ODD",
            "value": 0,
        },
        {
            "type": "EVEN",
            "value": 0,
        },
        {
            "type": "SMALL",
            "value": 0,
        },
        {
            "type": "BIG",
            "value": 0,
        }
    ],
    "betTransactions": [],
}

const wss = new Websocket.Server({ port: 8080 }, () => {
    console.log('Server Started');

})

wss.on('connection', function connection(ws) {

    ws.on('message', (data) => {
        console.log(`${data} is received `);

        let receivedInput = JSON.parse(data.toString());

        if (receivedInput.betDetails == "roundDetails") {
            switch (receivedInput.betType) {
                case "ODD":
                    playerAcc.betType[0].value += receivedInput.betValue;
                    break;

                case "EVEN":
                    playerAcc.betType[1].value += receivedInput.betValue;
                    break;

                case "SMALL":
                    playerAcc.betType[2].value += receivedInput.betValue;
                    break;

                case "BIG":
                    playerAcc.betType[3].value += receivedInput.betValue;
                    break;
            }
            playerAcc.betTransactions.push({ "type": receivedInput.betType, "value": receivedInput.betValue });
            playerAcc.totalBetValue += receivedInput.betValue;
            pendingResponse.data_int = playerAcc.totalBetValue;
            sampleResponse.data_int = playerAcc.totalBetValue;
        }

        if (receivedInput.betDetails == "undoPrevious") {
            if (playerAcc.betTransactions.length > 0) {
                let lastTrans = playerAcc.betTransactions[playerAcc.betTransactions.length - 1];
                switch (lastTrans.type) {
                    case "ODD":
                        playerAcc.betType[0].value -= lastTrans.value;
                        break;

                    case "EVEN":
                        playerAcc.betType[1].value -= lastTrans.value;
                        break;

                    case "SMALL":
                        playerAcc.betType[2].value -= lastTrans.value;
                        break;

                    case "BIG":
                        playerAcc.betType[3].value -= lastTrans.value;
                        break;
                }
                playerAcc.totalBetValue -= lastTrans.value;
                pendingResponse.data_int = playerAcc.totalBetValue;
                sampleResponse.data_int = playerAcc.totalBetValue;
                playerAcc.betTransactions.pop();
            }
        }


        let output = receivedInput.betDetails == "RoundEnded" ? sampleResponse : pendingResponse;
        let resultArr = [];
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
            console.log(resultArr);
            console.log(playerAcc);
        }

        sampleResponse.data_str_array = resultArr;
        ws.send(JSON.stringify(output));
    })
})

wss.on('listening', () => {
    console.log('Listening to 8080');
})