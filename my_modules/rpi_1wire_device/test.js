/**
 * Created by michal on 23.07.15.
 */
var rpi_1wire = require('./rpi_1wire_temp');
var util = require('util');

rpi_1wire.tempRequest(function(){
    console.log(util.inspect(rpi_1wire, false, 3));
});