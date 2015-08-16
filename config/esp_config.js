/**
 * Created by michal on 23.07.15.
 */

var EspConfig = {

    // ========================== tcp_my_bus.js ==========================
    TcpMyBus: {
        /** Time between next send try */
        RESPONSE_TIMEOUT: 3 * 1000,
        /** This time is time span between failure and next send try  */
        WAIT_AFTER_FAILURE: 60 * 1000,
        /** Number of send try, after reach te number te device come to fail state
         * This value should be great then or equal to 2 */
        NUM_OF_SEND_TRY: 5
    },
    AutoReconnect: {
        /** Connection timeout. If esp not send a msg while this time then the connection wil be closed */
        CONNECTION_TIMEOUT: 2 * 1000,
        /** When connection cant be closed while this time then the connection wil be forced to close */
        CONNECTION_DISCONNECTING_TIMEOUT: 1.5 * 1000
    },
    KeepAlive: {
        /** If no communication on esp device while this time then will be send keep alive msg */
        TIME: 2 * 1000
    }
};

module.exports = EspConfig;
