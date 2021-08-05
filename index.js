const Websocket = require('ws')

const sampleResponse = [{
    "channelId": "5e9553e1e8af891488ff52ab"
}];

const wss = new Websocket.Server({ port: 8080 }, () => {
    console.log('Server Started');
})

wss.on('connection', function connection(ws) {

    // setInterval(() => {
    //     let jsonResponse = JSON.parse(sampleResponse);
    //     console.log(jsonResponse);
    //     // ws.send(arrayObject[index]);
    // }, 10000);

    ws.on('message', (data) => {
        console.log(`${data} is received`);
        let jsonResponse = JSON.parse(JSON.stringify(sampleResponse));
        console.log(jsonResponse);
        ws.send(JSON.stringify(sampleResponse));
        // ws.send(["Red", "Red", "Red", "White"].toString());
    })
})

wss.on('listening', () => {
    console.log('Listening to 8080');
})