const router = require('express').Router();
const RoomModel = require('../Models/roomModel');

// http:/api/meter/reg/:roomid/electric/:meterid
router.get('/reg/:roomid/electric/:meterid', async (req, res, next) => {
    const roomId = req.params.roomid;
    const meterId = req.params.meterid;
    const session = await RoomModel.startSession();
    try {
        session.startTransaction();
        const checkMeter = await RoomModel.findOne({ roomId : roomId });
        if (!!checkMeter.electric_meterId) {
            res.json({ status : false, msg : "Already regis !!" })
            throw new Error("This room already has electic meter !");
        }
        else {
            await RoomModel.findOneAndUpdate({ roomId : roomId }, { electric_meterId : meterId })
            await session.commitTransaction();
            session.endSession();
            res.json({ status : true });
        }
    }
    catch (err) {
        await session.abortTransaction();
        session.endSession();
        next(err);
    }
})


router.get('/reg/:roomid/water/:meterid', async (req, res, next) => {
    const roomId = req.params.roomid;
    const meterId = req.params.meterid;
    const session = await RoomModel.startSession();
    try {
        session.startTransaction();
        const checkMeter = await RoomModel.findOne({ roomId : roomId });
        if (!!checkMeter.water_meterId) {
            res.json({ status : false, msg : "Already regis !!" })
            throw new Error("This room already has electic meter !");
        }
        else {
            await RoomModel.findOneAndUpdate({ roomId : roomId }, { water_meterId : meterId })
            await session.commitTransaction();
            session.endSession();
            res.json({ status : true });
        }
    }
    catch (err) {
        await session.abortTransaction();
        session.endSession();
        next(err);
    }
});

module.exports = router;