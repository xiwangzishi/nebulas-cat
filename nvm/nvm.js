"use strict";
var fs = require("fs")
var extend = require('extend');
var native = require("./native");
var util = require('../util')

var funcRegex = new RegExp("^[a-zA-Z$][A-Za-z0-9_$]*$");

var NVM = function (block, transaction) {
    // extend(native.context.block, block);
    // extend(native.context.transaction, transaction);
    // console.log("block:", native.context.block);
    // console.log("tx:", native.context.transaction);
};

var contract = null

NVM.prototype = {
    deploy: function (contract_file, args) {
        console.log("require contract file：", contract_file)
        global.CanContractStorage = true

        var ContractCls = require(contract_file);
        contract = new ContractCls();

        var exists = fs.existsSync(".init")
        if (exists) {
            console.log("The contract has been deployed, redeploy / clear data / re-call the contract init method Please execute reset.sh in the project directory")
            return
        }

        try {
            var result = this.run("init", args)
            fs.writeFileSync(".init")
            return result
        } catch (error) {
            throw new Error(error)
        }
    },
    contractMethods: function () {
        if (!contract) {
            return []
        }
        var methods = Object.getOwnPropertyNames(Object.getPrototypeOf(contract));

        return methods.sort().filter(function (e, i, arr) {
            if (e[0] != "_" && e != "init" && e != arr[i + 1] && typeof contract[e] == 'function') return true;
        });
    },
    call: function (func, args, trans, block) {
        if (funcRegex.test(func)) {
            return this.run(func, args, trans, block);
        } else {
            throw new Error("invalid func");
        }
    },

    run: function (func, args, trans, block) {
        Blockchain.blockParse(JSON.stringify(block || util.makeBlock()));

        var trans = trans || native.context.transaction
        if (!trans.hash) {
            trans.hash = util.makeTxHash()
            // console.log('trans.hash?:', func, trans.hash)
        }
        // console.log('trans.hash:', func, trans.hash)

        Blockchain.transactionParse(JSON.stringify(trans));

        if (args === undefined || args.length === 0) {
            args = "[]";
        }

        if (contract[func] == undefined) {
            throw new Error("function not found");
        }

        var result = contract[func].apply(contract, JSON.parse(args));
        trans.hash = ""

        return result
    }
};

module.exports = NVM;