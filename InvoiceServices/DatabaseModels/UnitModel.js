const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MeterUnitSchema = new Schema({
    roomId : {type : String, unique:true },
    unit : {
        electric : { type : Array },
        water  : { type : Array }
    }
}, { collection : 'HorChana_meterUnit'});

const UnitModel = mongoose.model('UnitModel', MeterUnitSchema);
module.exports = UnitModel;
