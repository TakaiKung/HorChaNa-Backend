const router = require('express').Router();
const generateCode = require('password-generator');
const RoomModel = require('../Models/roomModel');
const { createRoomValidator } = require('../Middleware/Validation/createRoomVali');

router.post('/create', async (req, res, next) => {
    const data = req.body;
    const validate = await createRoomValidator(data);
    const session = await RoomModel.startSession();
    console.log(data);
    // console.log(validate)
    if (validate) {
        try {
            session.startTransaction();
            const roomInfo = {
                roomId : data.roomId,
                electric_meterId : data.electric_meterId,
                water_meterId : data.water_meterId,
                room_price : data.room_price,
                resident_info : {
                    name : data.resident_info.name,
                    password : data.resident_info.password,
                    tel : data.resident_info.tel,
                    entrance_date : null,
                    entrance_code : generateCode(12, false)   
                }
            }

            await RoomModel.create([data], { session : session });
            await session.commitTransaction();

            session.endSession();
            console.log(`${ roomInfo.roomId } has regis to database now`)
            res.json({ msg : true , sendingData : roomInfo });
        }
        catch (err) {
            await session.abortTransaction();
            console.log(`Has an error in create room: ${err}`);
            session.endSession();
            next(err)
        }
    }
    else if (typeof(validate) === 'object') {
        res.json({ msg : `Data not pass in Validation` });
    }
    else {
        res.json({ msg : `Something Went Wrong ToT... Pls wait for debug` });
    }
});

router.delete('/removeroom/:roomid', async (req, res, next) => {
    const roomid = req.params.roomid;
    const session = await RoomModel.startSession();
    try {
        session.startTransaction();
        const isHave = await RoomModel.findOne({ roomId : roomid });
        if (isHave) {
            await RoomModel.findOneAndRemove({roomId : roomid})
            await session.commitTransaction();
            session.endSession();
            res.json({ msg : true });
        }
        else {
            throw new Error(`room ${ roomid } not have in database`);
        }
    }
    catch (err) {
        await session.abortTransaction();
        console.log(err);
        session.endSession();
        res.json({ msg : `Something Went Wrong ToT... Pls wait for debug` });
        next(err);
    }
});

module.exports = router;