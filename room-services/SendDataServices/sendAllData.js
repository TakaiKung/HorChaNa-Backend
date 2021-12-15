const router = require('express').Router();
const { InvoiceModel } = require('../Models/InvoiceModel');
const UnitModel = require('../Models/MeterUnitModel');
const RoomModel = require('../Models/roomModel');

router.get('/all', async (req, res, next) => {
    const room = await RoomModel.aggregate([{
                $lookup: {
                    from : 'HorChana_meterUnit',
                    localField : "roomId",
                    foreignField: "roomId",
                    as: "meterUnit"
                }

    },
    { $unwind : { 'path' : `$meterUnit`, "preserveNullAndEmptyArrays": true}},
    {
        $project : {
            roomId : `$roomId`,
            name : '$resident_info.name',
            electric_meter : `$electric_meterId`,
            water_meter : `$water_meterId`,
            electric_unit : {$slice :['$meterUnit.unit.electric.sum', -1]},
            water_unit : { $slice : ['$meterUnit.unit.water.sum', -1] },
            electric_price : `$meterUnit.unit.electric.electric_price`,
            water_price : `$meterUnit.unit.water.water_price`
        },
        
    }
    ,{ $unwind : { 'path' : `$electric_price`, "preserveNullAndEmptyArrays": true}},
    { $unwind : { 'path' : `$water_price`, "preserveNullAndEmptyArrays": true}},
    { $unwind : { 'path' : `$electric_unit`, "preserveNullAndEmptyArrays": true}},
    { $unwind : { 'path' : `$water_unit`, "preserveNullAndEmptyArrays": true}},
    ]).exec((err, room) => {
        if (err) {
            console.log(err)
        }
        res.send(room);
    })
        
})

module.exports = router;