/**
 * Created by michal on 22.07.15.
 */
var esp_temp_sensors_device = require("./esp_temp_sensors_device");


var EspDevices = [
    {
        description: 'Tem sensor device',
        dev: new esp_temp_sensors_device({ip: '192.168.1.170', port: 300})
    }
];


module.exports = EspDevices;