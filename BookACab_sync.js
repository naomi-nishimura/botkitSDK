var botId = "st-b3692e16-b2d6-5ec5-b808-710eef289ac0";
var botName = "技術検証用ボット";
var sdk            = require("./lib/sdk");
var Promise        = sdk.Promise;
var config         = require("./config");
var mockServiceUrl = config.examples.mockServicesHost + '/cabbot';
var { makeHttpCall } = require("./makeHttpCall");


/*
 * This example is the sync version of 'BookACab.js'. Both the webhook calls in this are responding syncly
 */
function findCabs(/*userLoc*/) {
    return new Promise(function(resolve, reject) {
        makeHttpCall(
            'get',
            mockServiceUrl + '/findcabs'
        )
        .then(function(res) {
            resolve(res);
        })
        .catch(function(err){
            return reject(err);
        })
    });
}

module.exports = {
    botId   : botId,
    botName : botName,

    on_user_message : function(requestId, data, callback) {
        sdk.sendBotMessage(data, callback);
    },
    on_bot_message  : function(requestId, data, callback) {
        sdk.sendUserMessage(data, callback);
    },
    on_webhook      : function(requestId, data, componentName, callback) {
        var context = data.context;

        if (componentName === 'FindNearbyCabs') {
            findCabs()
                .then(function(cabList) {
                    context.cabList = cabList;
                    callback(null, data);
                });
        } else if (componentName === 'BookTheCab') {
            sdk.saveData(requestId, data)
                .then(function() {
                    //Assuming the cab booking was successful. A mock service to book the cab can be called here.
                    data.successful = 'true';
                    data.bookedCab = context.entities.selectedCab || {};
                    callback(null, data);
                });
        }
    }
};
