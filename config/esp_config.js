/**
 * Created by michal on 23.07.15.
 */

var EspConfig = {

    TcpMyBus: {
        /** Time between next send try */
        RESPONSE_TIMEOUT: 4 * 1000,
        /** This time is time span between failure and next send try  */
        WAIT_AFTER_FAILURE: 60 * 1000,
        /** Number of send try, after reach te number te device come to fail state
         * This value should be great then or equal to 2 */
        NUM_OF_SEND_TRY: 5
    },
    AutoReconnect: {
        /** Connection timeout. If esp not send a msg while this time then the connection wil be closed */
        CONNECTION_TIMEOUT: 3.8 * 1000,
        /** When connection cant be closed while this time then the connection wil be forced to close */
        CONNECTION_DISCONNECTING_TIMEOUT: 3.6 * 1000
    },
    KeepAlive: {
        /** If no communication on esp device while this time then will be send keep alive msg */
        TIME: 2 * 1000
    },
    EspTempSensorsDevice: {
        /** If any problem occur while initiation and initiation failed then wait this time and retry  */
        TIME_TO_NEXT_INIT: 1000 * 60
    }



};

module.exports = EspConfig;
