var fs = require("fs");
var path = require("path");

var Koa = require('koa');
var Router = require('koa-router');
var cors = require('koa-cors');
var bodyParser = require('koa-bodyparser');

var util = require('./util')

var jsDate = Date;
global.jsMath = Math
global.jsDate = jsDate
global.jsMathRandom = Math.random
global.BASE_PATH = __dirname

var app = new Koa();
// var block = {
//     timestamp: 0,
//     height: 1
// };

var transaction = {
    hash: "",
    from: "n1Et8GL1cszLkzRUxPe14pRcdo5hbpZpCrP",
    to: "n1Et8GL1cszLkzRUxPe14pRcdo5hbpZpCrP",
    value: "0",
    nonce: 1,
    timestamp: 1527077193,
    gasPrice: "1000000",
    gasLimit: "20000"
};

// path.join(__dirname, "./bbs.js");
if (!fs.existsSync("./data/contract_path")) {
    fs.writeFileSync("./data/contract_path","")
}
var contract_file = fs.readFileSync("./data/contract_path").toString()

if (!fs.existsSync(contract_file)) {
    contract_file = path.join(__dirname, "./smartContract/nebulas-cat.js");
}
console.log("加载的合约文件：", contract_file)
var NVM = require('./nvm/nvm')

Blockchain.blockParse(JSON.stringify(util.makeBlock()));

var nvm = new NVM();

var deploy = nvm.deploy(contract_file, "[]");

// var result = nvm.call("setAds", JSON.stringify([
//     [{
//         "img": "https://wx2.sinaimg.cn/mw690/5065f17agy1frdaxosc2aj20dw08c40i.jpg",
//         "title": "星云DAPP商品",
//         "url": "http://nebulas.cool/?from=forfunapp"
//     }, {
//         "img": "https://wx3.sinaimg.cn/mw690/5065f17agy1frz3k10hgcj20jg05kwei.jpg",
//         "title": "应用分发",
//         "url": "http://nas.yuxizhe.top"
//     }, {
//         "img": "https://wx1.sinaimg.cn/mw690/5065f17agy1frvz9nj8wlj20b405kdgj.jpg",
//         "title": "http://dpark.cc/",
//         "url": "http://dpark.cc/"
//     }, {
//         "img": "https://wx4.sinaimg.cn/mw690/5065f17agy1frne7vnydvj20b405kjr8.jpg",
//         "title": "NAS水龙头",
//         "url": "https://nas.biyouduo.com"
//     }]
// ]), transaction);

// nvm.call("setAds", JSON.stringify([[]]))

var nebulas = require("nebulas")

var Account = nebulas.Account,
    Transaction = nebulas.Transaction;


app.use(cors())
app.use(bodyParser());

var router = new Router();

router.get('/v1/user/nebstate', (ctx, next) => {
    ctx.body = {
        "result": {
            "chain_id": 100,
            "tail": "2d3e61a43661107643f6b86dacc413dcc21d5cc13eea717d4c596a3a56b56129",
            "lib": "406759076f50028a681efa75403430ffa671f47bcf53e7e693cf11bcb4ad2c99",
            "height": "390801",
            "protocol_version": "/neb/1.0.0",
            "synchronized": false,
            "version": "1.0.1"
        }
    }
})

router.post('/v1/user/call', (ctx, next) => {
    // {
    // 	"from":"n1X5tQyqNtWNZzXA5WzrbBAZktmGYE3jduj",
    // 	"to":"n1jWpKadorv27XgSbo4WRZvsyCdAajkEP4B",
    // 	"value":"0",
    // 	"gasPrice":"1000000",
    // 	"gasLimit":"2000000",
    // 	"contract":{"function":"topicList","args":"[30,-1]"}}
    // }
    var reqBody = ctx.request.body

    // Blockchain.blockParse(JSON.stringify(native.context.block));
    var trans = {
        hash: "",
        from: reqBody.from,
        to: reqBody.to,
        value: reqBody.value,
        nonce: 1,
        timestamp: parseInt((new jsDate()).getTime() / 1000),
        gasPrice: reqBody.gasPrice,
        gasLimit: reqBody.gasLimit
    }
    var block = util.makeBlock()

    var result = {
        "result": '""',
        "execute_err": "",
        "estimate_gas": ""
    }

    try {
        var call_result = nvm.call(reqBody.contract.function, reqBody.contract.args, trans, block)
        result.result = call_result == undefined ? '""' : JSON.stringify(result)
    } catch (e) {
        // {"result":"Error: 403","execute_err":"Call: Error: 403","estimate_gas":"20378"}
        result.execute_err = "Call: Error: " + e.message
        result.result = "Error: " + e.message
    }

    ctx.body = {
        "result": result
    }
})


router.post('/v1/user/accountstate', (ctx, next) => {
    var reqBody = ctx.request.body,
        address = reqBody.address,
        addressFile = './data/balance/' + address;
    var content = '';

    if (!fs.existsSync(addressFile)) {
        content = JSON.stringify({
            balance: 1000000000000000000000,
            nonce: 0,
            type: 87 //type The type of address, 87 stands for normal address and 88 stands for contract address
        })
        fs.writeFileSync(addressFile, content)
    } else {
        content = fs.readFileSync(addressFile)
    }
    var account = JSON.parse(content)

    ctx.body = {
        result: account
    }
})

router.post('/v1/user/rawtransaction', (ctx, next) => {
    var tx = new Transaction({
        chainID: 100,
        from: "n1Et8GL1cszLkzRUxPe14pRcdo5hbpZpCrP",
        to: "n1Et8GL1cszLkzRUxPe14pRcdo5hbpZpCrP",
        value: 0,
        nonce: 0,
        gasPrice: 1000000,
        gasLimit: 2000000
    });

    var txinfo = tx.fromProto(ctx.request.body.data),
        payload = JSON.parse(new Buffer(txinfo.data.payload)),
        txhash = util.makeTxHash(),
        date = new jsDate(),
        ts = parseInt(date.getTime() / 1000),
        from = txinfo.from.getAddressString(),
        to = txinfo.to.getAddressString();

    var trans = {
        hash: txhash,
        from: from,
        to: to,
        value: txinfo.value,
        nonce: txinfo.nonce,
        timestamp: ts,
        gasPrice: txinfo.gasPrice,
        gasLimit: txinfo.gasLimit
    }

    var block = util.makeBlock()
    // console.log('txinfo.value:',txinfo.value.toString(10))

    // 保存交易信息以供 getTransactionReceipt 和 queryPayInfo API 查询
    var transactionReceipt = {
        "hash": txhash,
        "chainId": 100,
        "from": from,
        "to": to,
        "value": txinfo.value.toNumber(),
        "nonce": txinfo.nonce,
        "timestamp": ts,
        "type": "binary",
        "data": txinfo.data.payload || null,
        "gasPrice": txinfo.gasPrice,
        "gasLimit": txinfo.gasLimit,
        "contract_address": "",
        "status": 2, // 交易状态结果： 0 failed失败, 1 success成功, 2 pending确认中.
        "gas_used": "20000",
        "execute_error": "",
        "execute_result":'""'
    }
    try {

        if (txinfo.value) {
            // 需要减去账户余额
            var txinfo_number = txinfo.value.toNumber()

            var accountFile = './data/balance/' + from
            var content = fs.readFileSync(accountFile)
            var account = JSON.parse(content)
            if (txinfo.value.gt(account.balance)) {
                throw new Error("insufficient balance")
            }
            account.balance -= txinfo_number
            fs.writeFileSync(accountFile, JSON.stringify(account))

            // 如果合约没报错还需要把发送过来的value + 到合约的余额里面去
            var contractFile = './data/balance/contract'
            var content = fs.readFileSync(contractFile)
            var account = JSON.parse(content)
            account.balance += txinfo_number

            fs.writeFileSync(contractFile, JSON.stringify(account))
        }

        // 这里还需要拦截部署合约

        var result = nvm.call(payload.Function, payload.Args, trans, block)
        transactionReceipt.status = 1
        transactionReceipt.execute_result = result == undefined ? '""' : JSON.stringify(result)

    } catch (error) {
        transactionReceipt.status = 0
        transactionReceipt.execute_error = "Call: Error: " + error.message
        transactionReceipt.execute_result = "Error: " + error.message
        // execute_error:"Call: Error: 10000"
        // execute_result:"Error: 10000"
    }

    fs.writeFileSync("./data/transaction/" + txhash, JSON.stringify(transactionReceipt))

    ctx.body = {
        "result": {
            "txhash": txhash
        }
    }
})
router.post('/v1/user/getTransactionReceipt', (ctx, next) => {
    var reqBody = ctx.request.body
    var transactionFile = "./data/transaction/" + reqBody.hash
    ctx.body = {
        "result": JSON.parse(fs.readFileSync(transactionFile))
    }
})

router.post('/api/pay', (ctx, next) => {
    // /api/pay?payId=AFER4jkpU5rkWRMpzlJzP7jH5Nh5vzM8&txHash=zvah2gszrj6hy2mszh2sw66vwo83s0rwhp2ws6ioldv6r422hurq2hk8stezw84w

    var query = ctx.request.query
    fs.writeFileSync("./data/pay/" + query.payId, query.txHash)
    ctx.body = {
        "code": 0,
        "data": {},
        "msg": "success"
    }
})

router.get('/api/pay/query', (ctx, next) => {
    // https://pay.nebulas.io/api/pay/query?payId=sNnKkzKEtzf3N76eMYAbjmplWeKWQAms
    var payId = ctx.request.query.payId,
        txhash = fs.readFileSync("./data/pay/" + payId);

    var transactionFile = "./data/transaction/" + txhash,
        data = JSON.parse(fs.readFileSync(transactionFile));

    ctx.body = {
        "code": 0,
        "data": data,
        "msg": "success"
    }
})

router.post('/v1/user/getEventsByHash', (ctx, next) => {
    var reqBody = ctx.request.body
    var eventsFile = "./data/storage/topic." + reqBody.hash
    ctx.body = {
        "result": {
            "events": JSON.parse(fs.readFileSync(eventsFile))
        }
    }
})

router.get('/_api/checkActivation', (ctx, next) => {
    if (!fs.existsSync("./data/.activated")) {
        ctx.body = {
            status_code: 404,
            msg: "inactivated"
        }
    } else {
        ctx.body = {
            status_code: 200,
            msg: "activated"
        }
    }
})

router.post('/_api/checkActivation', (ctx, next) => {
    fs.writeFileSync("./data/.activated", ctx.request.rawBody)
    ctx.body = {
        status_code: 200,
        msg: "success"
    }
})

router.post('/_api/contract/path', (ctx, next) => {
    var reqBody = ctx.request.body,
        contract_path = reqBody.path;
    var contract_abspath = path.resolve(contract_path)

    if (!fs.existsSync(contract_abspath)) {
        ctx.body = {
            status_code: 404,
            msg: "file not exists"
        }
        return
    }

    fs.writeFileSync("./data/contract_path", contract_abspath)
    // 删除缓存，重新部署一下
    delete require.cache[contract_abspath]

    if (reqBody.remove_data) {

        var storage_files = fs.readdirSync('./data/storage');
        storage_files.forEach(function (ele, index) {
            fs.unlinkSync("./data/storage/" + ele)
        })
        fs.unlinkSync(".init")

    }
    nvm.deploy(contract_abspath, reqBody.args);

    ctx.body = {
        status_code: 200,
        msg: "success"
    }
})

// app.use(async(ctx, next) => {
// console.log(ctx)

// ctx.response.set({
// 	"Access-Control-Allow-Origin" : "*",
// 	"Access-Control-Allow-Methods":"POST",
// 	"Access-Control-Allow-Headers":"Content-Type"
// })
// await next();
// });

app.use(router.routes())

app.listen(8685);