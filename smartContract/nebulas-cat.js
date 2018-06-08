var SimpleListStorage = function (context, name, descriptor) {
    this.numsField = name + "Nums"
    this.incrField = name + "Incr"
    this.indexField = name + "Index"

    this.context = context

    if (descriptor == undefined) {
        descriptor = null
    }

    LocalContractStorage.defineMapProperty(context, name, descriptor);
    LocalContractStorage.defineProperty(context, this.numsField);
    LocalContractStorage.defineProperty(context, this.incrField);
    LocalContractStorage.defineMapProperty(context, this.indexField);

    if (!context[this.numsField]) {
        context[this.numsField] = 0
    }
    if (!context[this.incrField]) {
        context[this.incrField] = 0
    }

    this.obj = context[name]
    this.indexMap = context[this.indexField]
}

SimpleListStorage.prototype = {
    total: function () {
        return this.context[this.numsField]
    },
    incrId: function () {
        return this.context[this.incrField]
    },
    add: function (key, value) {
        this.obj.set(key, value)

        var nums = this.total(),
            incrId = this.incrId();

        this.indexMap.set(incrId, key)

        this.context[this.numsField] += 1
        this.context[this.incrField] += 1
    },
    set: function (key, value) {
        this.obj.set(key, value)
    },
    get: function (key) {
        return this.obj.get(key)
    },
    del: function (key, softDel) {
        if (softDel) {
            var obj = this.obj.get(key)
            obj._del = true
            this.obj.set(key, obj)
        } else {
            this.obj.del(key)
        }
        this.context[this.numsField] -= 1
    },
    all: function (skipDel, callback) {
        return this.page({
            offset: -1,
            limit: this.incrId(),
            skipDel: skipDel,
            callback: callback
        })
    },
    page: function (args) {
        //args: {"offset":0, "limit":3, "order":"desc|asc"}
        var result = {
            total: 0,
            nextId: 0,
            items: []
        }
        var total = this.total()
        if (!total) {
            return result
        }

        result.total = total

        var offset = args.offset,
            limit = args.limit || 10,
            order = args.order || 'desc',
            isdesc = order == 'desc',
            skipDel = args.skipDel == undefined ? true : args.skipDel,
            callback = args.callback;

        var incrId = this.incrId()

        if (offset == -1) {
            offset = isdesc ? incrId : -1
        }

        var index = offset

        for (var i = 0; result.items.length < limit; i++) {

            index = isdesc ? index - 1 : index + 1;

            if (index < 0 || index > incrId) {
                break
            }

            var key = this.indexMap.get(index),
                item = this.obj.get(key);

            if (callback) {
                callback(item)
            }

            if (!item) {
                continue
            }

            if (skipDel && item._del) {
                continue
            }

            result.items.push(item)
        }

        if (index > incrId || index < 0) {
            result.noMore = true
        }

        result.nextId = index
        return result
    }
}


var NebulasCatContract = function () {

    this.donateStore = new SimpleListStorage(this, 'donate')

    LocalContractStorage.defineProperty(this, 'totalDonateNas');
    LocalContractStorage.defineMapProperty(this, 'activationMap');

    this.adminAddress = "n1MexizSHjeabihXad9CYCRZ9z438gHJziV"
}

NebulasCatContract.prototype = {
    init: function () {
        this.totalDonateNas = 0
    },
    stat: function () {
        var result = {
            donateNums: this.donateStore.total(),
            totalDonateNas: this.totalDonateNas
        }
        return result
    },
    // 激活
    activation: function () {
        var fromUser = Blockchain.transaction.from,
            ts = Blockchain.transaction.timestamp;

        this.activationMap.set(fromUser, {
            ts: ts,
            fromUser: fromUser
        })
    },
    checkActivation: function (user) {
        var fromUser = user || Blockchain.transaction.from;
        return this.activationMap.get(fromUser)
    },
    donateNAS: function (info) {
        // {"name":"","url":"","content":""}
        var fromUser = Blockchain.transaction.from,
            hash = Blockchain.transaction.hash,
            ts = Blockchain.transaction.timestamp,
            value = Blockchain.transaction.value;
        if (!value.toNumber()) {
            throw new Error("10000")
        }

        this.donateStore.add(hash, {
            fromUser: fromUser,
            hash: hash,
            created: ts,
            value: value,
            name: info.name,
            url: info.url,
            content: info.content
        })

        this.totalDonateNas += value.toNumber()
    },
    donatePage: function (args) {
        return this.donateStore.page(args)
    },
    withdraw: function (address, value) {
        var fromUser = Blockchain.transaction.from
        if (fromUser != this.adminAddress) {
            throw new Error("403")
        }
        var address = address || this.adminAddress

        var amount = new BigNumber(value * 1000000000000000000)
        var result = Blockchain.transfer(address, amount)
        return result
    },
}


module.exports = NebulasCatContract;