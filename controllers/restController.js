var storage = require('node-persist');
const Joi = require('joi');

const schema = Joi.object({
  key: Joi.string()
  .alphanum()
  .min(3)
  .max(30)
  .required(),
});

exports.getValueByKey = async function(req, res, next) {
    try {
        const { error, input} = await schema.validate({ key: req.query.key });
        console.log(error);
        console.log(input);
        if(!error){
            if(req.query.key){
                var key = req.query.key;
                await storage.init();
                var value = await storage.getItem(key);
                var data = {
                    status: "ok",
                    value: value
                }
                if(!value){
                    data.value = "";
                }
                res.send(data);
            }
        }else{
            res.send({status: "error", error: error});
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