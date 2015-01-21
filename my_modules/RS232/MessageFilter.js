/**
 * Created by michal on 2015-01-20.
 */


var MessageFilter = null;

(function ()
{

    var disconnectedDevice = function (address)
    {
        this.address = address;
        this.lastFail = null;
        this.lastSuccess = null;
        this.nextProbeInterval = null;
    };

    /**
     *
     * @type {Array.<disconnectedDevice>}
     */
    var disconnectedDevices = [];

    /**
     *
     * @param address
     * @returns {disconnectedDevice}
     */
    var getByAddress = function (address)
    {
        return disconnectedDevices.reduce(function (acc, e)
        {
            if (e.address == address)return e;
            return acc;

        }, null);
    };


    /**
     * @param {number} address
     * @param {number} nextProbeInterval
     */
    var setAsDisconnected = function (address, nextProbeInterval)
    {
        var i = getByAddress(address);
        if (!i)
        {
            i = new disconnectedDevice(address);
            disconnectedDevices.push(i);
        }
        i.address = address;
        i.lastFail = new Date().getTime();
        i.nextProbeInterval = nextProbeInterval;
    };

    var isObsolete = function (e, now)
    {
        return !e.lastFail || !e.nextProbeInterval || e.lastFail + e.nextProbeInterval <= now
    };


    /**
     * Return false if any connection problem occurred and time between problem and probe is les then nextProbe
     * @param {number} address
     * */
    var canSendMessage = function (address)
    {

        var i = getByAddress(address);
        if (i) return isObsolete(i, new Date().getTime());
        else return true;



        //
        //return disconnectedDevices.reduce(
        //    function (acc, e)
        //    {
        //        return acc && (e.address != address || isObsolete(e, new Date().getTime()))
        //    }, true)
    };

    var setAsConnected = function (address)
    {
        var i = getByAddress(address);
        if (!i)
        {
            i = new disconnectedDevice(address);
            disconnectedDevices.push(i);
        }
        i.lastSuccess = new Date().getTime();
    };

    MessageFilter = {
        canSendMessage: canSendMessage,
        setAsDisconnected: setAsDisconnected,
        setAsConnected: setAsConnected,
        disconnectedDevices: disconnectedDevices,
        getByAddress: getByAddress
        //getDisconnectedDevice:
    };

})();


module.exports = MessageFilter;