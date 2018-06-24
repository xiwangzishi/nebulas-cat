var path = require("path")

global;

if (typeof window !== "undefined") {
    global = window;
}

if (typeof localStorage === "undefined" || localStorage === null) {
    var path = require("path");
    //var storageFile = path.join(__dirname, "./.storage");
    var storageFile = path.join(BASE_PATH, "data/storage");
    
    var LocalStorage = require('node-localstorage').LocalStorage;
    global.localStorage = new LocalStorage(storageFile);
}

global.context = require("./context");
global._native_blockchain = require("./native/blockchain");
global._native_log = require("./native/log");
global._native_event_trigger = require("./native/event");
global._native_storage_handlers = require("./native/storage").handlers;
global._native_crypto = require("./native/crypto")


global.NativeStorage = require("./native/storage").NativeStorage;

global.nativeConsole = global.console;
global.console = require("./libs/console");
global.ContractStorage = require("./libs/storage");
global.LocalContractStorage = global.ContractStorage.lcs;
// global.GlobalContractStorage = ContractStorage.gcs;
global.BigNumber = require("bignumber.js");
global.Blockchain = require("./libs/blockchain");
global.Event = require("./libs/event");

global.Date = require('./libs/date');
global.Math.random = require('./libs/random');
global.BigNumber.random = global.Math.random;

global.Uint = require("./libs/uint");

module.paths.push(path.resolve(__dirname+'/libs/'))

// var crypto = require('crypto.js');
// var str='Nebulas is a next generation public blockchain, aiming for a continuously improving ecosystem.';
// console.log(crypto.sha256(str))
// // console.log(crypto.sha3256(str))
// // console.log(crypto.ripemd160(str))
// alg = 1
// hash = '564733f9f3e139b925cfb1e7e50ba8581e9107b13e4213f2e4708d9c284be75b'
// sign = 'd80e282d165f8c05d8581133df7af3c7c41d51ec7cd8470c18b84a31b9af6a9d1da876ab28a88b0226707744679d4e180691aca6bdef5827622396751a0670c101'

// console.log(crypto.recoverAddress(alg, hash, sign))

module.exports = {
    context: global.context
};

