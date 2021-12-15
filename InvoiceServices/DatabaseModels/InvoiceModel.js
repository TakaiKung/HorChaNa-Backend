const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * ! Room Shcema is Here
 */
const RoomSchema = new Schema ({
    roomId : {
        type : String,
        unique : true,
        required : true
    },
    electric_meterId : {
        type   : String,
        unique : true,
        required : true
    },
    water_meterId : {
        type   : String,
        unique : true,
        required : true
    },
    room_price : {
        type   : Number,
    },
    resident_info : {
        name : { type : String },
        password : { type : String },
        tel : { type : String },
        entrance_date : { type : Date },
        entrance_code : { type : String } 
    },
}, { collection : 'HorChana_Room' });


/**
 * ! Invoice Schema is here
 */
const InvoiceSchema = new Schema ({
    roomId : { type : String },
    resident_info : { type: Object },
    invoice_date : { type : Date },
    invoice_month : { type : String},
    price : {
        water : { type:Number },
        electricity : { type:Number },
        room : { type:Number }
    },
    slip : { type: String },
    status : { type : String, enum : ['wait', 'uncheck', 'confirm'], default : 'Hold' }
}, { collection : 'HorChana_Invoice' });

/**
 * ! Make a model
 */
const RoomModel = mongoose.model('RoomModel', RoomSchema);
const InvoiceModel = mongoose.model('InvoiceModel', InvoiceSchema);

module.exports.InvoiceModel = InvoiceModel;
module.exports.RoomModel = RoomModel;

