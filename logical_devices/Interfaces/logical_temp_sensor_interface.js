/**
 * Created by michal on 22.07.15.
 */
var DuckTypingInterface = require('./../../esp_utils/duck_typing_interface');



var ILogicalTempSensorInterface = new DuckTypingInterface('ILogicalTempSensorInterface',
    [
        'getId',
        'getTemp',
        'getTempAndDescription'
    ]
);


module.exports = ILogicalTempSensorInterface;