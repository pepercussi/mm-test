var storage = require('node-persist');

exports.getValueByKey = async function(req, res, next) {
    try {
        if(req.query.key){
            var key = req.query.key;
            await storage.init();
            var value = await storage.getItem(key);
            var data = {
                value: value
            }
            if(!value){
                data.value = "";
            }
            res.send(data);
        }
    } catch (error) {
        res.send({status: "error", error: error});
    }
};

exports.getAllKeys = async function(req, res, next) {
    try {
        await storage.init();
        var data = {
            status: 'empty',
            arrayData: []
        }
        var arrKeys = await storage.keys();
        if(arrKeys.length > 0){
            data.status = 'ok';
            data.arrayData = arrKeys;
        }
        res.send(data);
    } catch (error) {
        res.send({status: "error", error: error});
    }

};

exports.deleteAllKeys = async function(req, res, next) {
    try {
        await storage.init();
        await storage.clear();
        res.send({status: "ok"});
    } catch (error) {
        res.send({status: "error", error: error});
    }
};