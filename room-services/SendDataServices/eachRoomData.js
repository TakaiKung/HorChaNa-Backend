const RoomModel = require('../Models/roomModel');

const router = require('express').Router();

router.get('/:roomid', async (req, res, next) => {
    const roomid = req.params.roomid;
    const session = await RoomModel.startSession();
    try {
            session.startTransaction();
            const isExit = await RoomModel.findOne({ roomId : roomid });
            console.log(isExit)
            if (isExit !== null) {
                const room = await RoomModel.aggregate([
                    {
                        $lookup: {
                            from : 'HorChana_meterUnit',
                            localField : "roomId",
                            foreignField: "roomId",
                            as: "meterUnit"
                    }
            
                },
                { $match : { roomId : roomid } },
                { $unwind : { 'path' : `$meterUnit`, "preserveNullAndEmptyArrays": true}},
                {
                    
                    $project : {
                        roomId : '$roomId',
                        name : '$resident_info.name',
                        password : '$resident_info.password',
                        tel : '$resident_info.tel',
                        electric_meter : `$electric_meterId`,
                        water_meter : `$water_meterId`,
                        electric_unit : {$slice :['$meterUnit.unit.electric.sum', -1]},
                        water_unit : { $slice : ['$meterUnit.unit.water.sum', -1] },
                        electric_price : { $cond: { if: `$meterUnit.unit.electric.electric_price`, then: `$meterUnit.unit.electric.electric_price`, else: null } },
                        water_price : { $cond: {if:`$meterUnit.unit.water.water_price`,then: `$meterUnit.unit.water.water_price`, else:null}}
                        
                    },
                }
                ,{ $unwind : { 'path' : `$electric_price`, "preserveNullAndEmptyArrays": true}},
                { $unwind : { 'path' : `$water_price`, "preserveNullAndEmptyArrays": true}},
                { $unwind : { 'path' : `$electric_unit`, "preserveNullAndEmptyArrays": true}},
                { $unwind : { 'path' : `$water_unit`, "preserveNullAndEmptyArrays": true}},
                ]).exec((err, room) => {
                    if (err) {
                        res.send('Not have infomation in Database or Have an error in read process');
                    }
                    else {
                        res.send(room);
                    }
                })
                await session.commitTransaction();
                session.endSession();
            }
            else {
                res.send('Not have infomation in Database or Have an error in read process')
                throw new Error('Not have infomation in Database or Have an error in read process');
            }
    }
    catch (err) {
        await session.abortTransaction();
        session.endSession();
        console.log(err);
    }
});

module.exports = router;