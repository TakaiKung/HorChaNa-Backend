const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RoomSchema = new Schema ({
    roomId : {
        type : String,
        unique : true,
        // required : true
    },
    electric_meterId : {
        type   : String,
    },
    water_meterId : {
        type   : String,
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

const RoomModel = mongoose.model('RoomModel', RoomSchema);

module.exports = RoomModel;