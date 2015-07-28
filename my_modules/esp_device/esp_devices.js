/**
 * Created by michal on 22.07.15.
 */
var esp_temp_sensors_device = require("./esp_temp_sensors_device");

/**
 *
 * @type {EspDevices~deviceAndDescription[]}
 */
var EspDevices = [

    {
        description: 'Temp sensor device in boiler room',
        name: 'Boiler room',
        dev: new esp_temp_sensors_device({
            ip: '192.168.1.170',
            port: 300,
            description: 'Temp sensor device in boiler room',
            name: 'Boiler room'
        })
    }
];


module.exports = EspDevices;

/**
 * @typedef {Object} EspDevices~deviceAndDescription
 * @property {string} description
 * @property {string} name
 * @property {EspDevice} dev
 */