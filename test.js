var fs = require('fs');

var json = {
    "ID": "EFA23B56",
    "Status": Math.ceil(Math.random() * 232353253),
    "WaterHardness": Math.ceil(Math.random() * 300),
    "PH": (Math.random() * 14),
    "Turbidity": Math.ceil(Math.random() * 5000),
    "WaterTemperature": 24.3,
    "WaterColor": "FB3456",
    "ApplianceName": "Gardenpool",
    "MessageString": "PH value is outside the range 6.8 ~ 7,6",
    "CopperReleased": 0.87,
    "ContainerMLCapacity": 50,
    "ContainerCuLevel": Math.ceil(Math.random() * 50),
    "CopperElectrodeMass": 320,
    "WaterFlow": 54.4,
    "WaterVolume": 56,
    "Key1": "DEADBEEF",
    "Key2": "ABCDEF01",
    "Key3": "ABCDEF02",
    "OnTime": 1500000000,
    "StationSSID": "Cazonet",
    "StationPwd": "Password01!"
};

//console.log(JSON.stringify(json));
//console.log(__dirname);
var loop = function () {
    fs.writeFile('test.json', JSON.stringify(json));
    setTimeout(loop, 3000);
};