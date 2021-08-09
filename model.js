    const playerDetails = {
        "playerID": "",
        "playerName": "Benjamin",
        "playerBalance": 12000,
        "totalBetValue": 0,
    };

    const playerRound = {
        "playerID": "",
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
            },
            {
                "type": "2R2W",
                "value": 0,
            },
            {
                "type": "4R",
                "value": 0,
            },
            {
                "type": "3R1W",
                "value": 0,
            },
            {
                "type": "3W1R",
                "value": 0,
            },
            {
                "type": "4W",
                "value": 0,
            }
        ],
        "betTransactions": []
    }

    const matchResponse = {
        "status": "",
        "matchResult": [],
    };


    module.exports = { playerRound, playerDetails, matchResponse }