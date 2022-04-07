const storage = require('node-persist');

//Init storage
const storageOptions = {
    dir: './storage',
    stringify: JSON.stringify,
    parse: JSON.parse,
    encoding: 'utf8',
}



exports.getValueByKey = async function(req, res, next) {
    await storage.init( storageOptions );
    if(req.query.key){
        var key = req.query.key;
        var value = await storage.getItem(key);
        var data = {
            value: value
        }
        if(!value){
            data.value = "";
        }
        res.send(data);
    }
};

exports.getAllKeys = async function(req, res, next) {
    await storage.init( storageOptions );
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

};

exports.deleteAllKeys = async function(req, res, next) {
    await storage.init( storageOptions );
    try {
        await storage.clear();
        res.send({status: "ok"});
    } catch (error) {
        res.send({status: "error", error: error});
    }
};