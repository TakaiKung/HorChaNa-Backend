const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MeterUnitSchema = new Schema({
    roomId : {type : String },
    unit : {
        electric : { type : Array },
        water  : { type : Array }
    }
    // meterId : {
    //     type : String,
    //     unique : true
    // },
    // unit : {
    //     month_1 : { type : Array },
    //     month_2 : { type : Array },
    //     month_3 : { type : Array }
    // }
}, { collection : 'HorChana_meterUnit'});

const UnitModel = mongoose.model('UnitModel', MeterUnitSchema);
module.exports = UnitModel;

