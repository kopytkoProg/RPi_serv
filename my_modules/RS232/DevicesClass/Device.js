/**
 * Created by michal on 2014-12-21.
 */


var Device = {

    /**
     *
     * @type {MyBusController}
     */
    MyBusController: null,
    Address: null,
    Description: null,
    AvailableCommands: {},
    isInstanceOfDevice: function (classToCheck)
    {
        var o = this;
        while (o)
        {
            if (o.constructor == classToCheck)  return true;
            o = o.__proto__;
        }
        return false
    }

};

module.exports = Device;