var mqtt = require('mqtt')
var fs = require('fs');
require('log-timestamp');

var KEY = fs.readFileSync('./certs/FILE.key');
var CERT = fs.readFileSync('./certs/FILE.crt');
var CAfile = [fs.readFileSync('./certs/FILE.pem')];

var options = {
    host: 'HOST',
    port: 8883,
    protocol: 'mqtts',
    protocolId: 'MQIsdp',
    ca: CAfile,
    key: KEY,
    cert: CERT,
    protocolVersion: 3,
    rejectUnauthorized: false
};

var client = mqtt.connect(options);

client.on('connect', function (p) {
    console.log("connected");
    client.subscribe('TOPIC', function (err) {
        if (err) console.log(err);
        else {
            client.publish('TOPIC', JSON.stringify(test.json), (errpub, a) => {
                if (errpub) console.log(errpub);
            })
        }
    })
})

client.on('message', function (topic, message) {
    var js = JSON.parse(message.toString());
    console.log('message received:', js, 'from:', topic);
    //client.end()
})

client.on('disconnect', (err) => {
    console.log("disconnect:", err);
});

client.on('close', (err) => {
    console.log("close:", err);
});

client.on('error', function (err) {
    console.log("error:", err);
})