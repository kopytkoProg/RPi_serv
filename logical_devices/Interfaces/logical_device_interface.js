/**
 * Created by michal on 25.06.15.
 */
var DuckTypingInterface = require('./../../esp_utils/duck_typing_interface');



var ILogicalDeviceInterface = new DuckTypingInterface('ILogicalDeviceInterface',
    [
        'getName',
        'getDescription',
    ]
);


module.exports = ILogicalDeviceInterface;