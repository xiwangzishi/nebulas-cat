"use strict";

var trigger = function (topic, data) {
    var event = {
        topic: "chain.contract." + topic,
        data: data
    };
    var key = "topic." + Blockchain.transaction.hash;
    var events = localStorage.getItem(key);
    // if (typeof events === "undefined") {
    //     events = new Array();
    // }
    if (!Array.isArray(events)) {
        events = new Array()
    }
    events.push(event);
    localStorage.setItem(key, JSON.stringify(events));
};

module.exports = trigger;