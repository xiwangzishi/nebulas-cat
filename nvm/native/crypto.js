"use strict";

var nebulas = require("nebulas"),
    CryptoUtils = nebulas.CryptoUtils;

var Buffer = require('safe-buffer').Buffer,
    jsSHA = require('jssha');

var sha256 = function (str) {
    var shaObj = new jsSHA("SHA-256", "HEX");
    for (var i = 0; i < arguments.length; i++) {
        var v = CryptoUtils.toBuffer(arguments[i]);
        shaObj.update(v.toString("hex"));
    }
    return shaObj.getHash("HEX");
};

var sha3256 = function (str) {
    return CryptoUtils.sha3(str).toString('hex')
};

var ripemd160 = function(str) {
    return CryptoUtils.ripemd160(str).toString('hex')
}

var md5 = function(str) {
    return CryptoUtils.md5(str).toString('hex')
}

var base64 = function(str) {
    return CryptoUtils.base64(str).toString('hex')
}

var recoverAddress = function(alg, hash, sign) {
    return ""
}


module.exports = {
    sha256:sha256,
    sha3256:sha3256,
    ripemd160:ripemd160,
    md5:md5,
    base64:base64,
    recoverAddress:recoverAddress
};