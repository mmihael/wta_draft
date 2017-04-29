var http = require('http');

const hostname = 'localhost';
//const hostname = '46.101.176.121';
const port = 11111;

var data = {
    "ID": 12342,
    "Status": 65535,
    "WaterHardness": 100,
    "PH": 4.5,
    "Turbidity": 4000,
    "WaterTemperature": 24.3,
    "WaterColor": "FB3456",
    "ApplianceName": "Gardenpool",
    "MessageString": "PH value is outside the range 6.8 ~ 7,6",
    "CopperReleased": 0.87,
    "ContainerMLCapacity": 50,
    "ContainerCuLevel": 24,
    "CopperElectrodeMass": 320,
    "WaterFlow": 54.4,
    "WaterVolume": 56,
    "Key1": "DEADBEEF",
    "Key2": "ABCDEF01",
    "Key3": "ABCDEF02",
    "OnTime": 7734567,
    "StationSSID": "Cazonet",
    "StationPwd": "Password01!"
};

const server = http.createServer((req, res) => {
    console.log(req.method);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'GET') {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(data));
    } else {
        var size = parseInt(req.headers['content-length']);
        

        var reqBody = '';
        req.on('data', (d) => {
            var obj = JSON.parse(d.toString());
            var keys = Object.keys(obj);
            for (var i = 0; keys.length > i; i++) {
                data[keys[i]] = obj[keys[i]];
            }
        });
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end('');
    }
});

server.listen(port, hostname, () => {
  console.log('server running');
});