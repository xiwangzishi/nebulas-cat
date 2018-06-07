"use strict";

var Account = require("../../account");
var fs = require("fs")

var transfer = function(to, value) {
    var toAddressFile = BASE_PATH+'/data/balance/' + to
    var contractFile = BASE_PATH+'/data/balance/contract'
    var value = parseInt(value)
    if (!value) {
        return true
    }
    
    // 合约账户减去value
    var content = fs.readFileSync(contractFile)
    var account = JSON.parse(content)

    // console.log('transfer value:', value, account.balance)
    
    if (value > account.balance) {//转出金额大于合约余额
        console.log("Blockchain.transfer failed: contract insufficient balance")
        return false
    }

    account.balance -= value
    fs.writeFileSync(contractFile, JSON.stringify(account))
    
    //目的账户增加余额
    if (!fs.existsSync(toAddressFile)) {
        content = '{"balance":0,"nonce":0,"type":87}'
    } else {
        content = fs.readFileSync(toAddressFile)    
    }

    // console.log("to account:",content)
    
    var account = JSON.parse(content)
    account.balance += value
    fs.writeFileSync(toAddressFile, JSON.stringify(account))

    return true;
};

var verifyAddress = function(address) {
    return Account.isValidAddress(address);
};

module.exports = {
    transfer: transfer,
    verifyAddress: verifyAddress
};