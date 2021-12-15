const router = require('express').Router();
const generateCode = require('password-generator');
const RoomModel = require('../Models/roomModel');
const addResidentValidator = require('../Middleware/Validation/addResidentVali');

router.post('/addperson/:roomid', async (req, res, next) => {
    const data = req.body;
    const validate = await addResidentValidator(data);
    const isRoomAvaliable = await RoomModel.findOne({ roomId : req.params.roomid });
    const session = await RoomModel.startSession();
    if (validate === true && isRoomAvaliable.resident_info.name === null && isRoomAvaliable.resident_info.password === null) {
        try {
            session.startTransaction();
            const personInfo = {
                resident_info : {
                    name : data.resident_info.name,
                    password : data.resident_info.password,
                    tel : data.resident_info.tel,
                    entrance_date : Date.now(),
                }
            }

            await RoomModel.updateOne({ roomId : req.params.roomid }, {
                resident_info : personInfo.resident_info
            });
            await session.commitTransaction();

            session.endSession();
            console.log(`${ req.params.roomid } has add person to room now`);
            res.json({ msg : true, sendingData : personInfo });
        }
        catch (err) {
            console.log(`Has an error in add person to room: ${err}`);
            session.endSession();
            next(err);
        }
    }
    else if (typeof(validate) === 'object') {
        console.log(validate);
        res.json({ msg : `Data not pass in Validation` });
    }
    else {
        res.json({ msg : `Fail...This room already have resident` });
    }
});

router.delete('/removeperson/:roomid', async (req, res, next) => {
    const roomid = req.params.roomid;
    const session = await RoomModel.startSession();
    try {
        session.startTransaction();
        const isHaveInDB = await RoomModel.findOne({ roomId : roomid });
        if (isHaveInDB) {
            await RoomModel.findOneAndUpdate({ roomId : roomid }, { resident_info : 
                {
                    name : null,
                    password : null,
                    tel : null,
                    entrance_date : null,
                    entrance_code : generateCode(12, false)
                }
            });
            await session.commitTransaction();
            session.endSession();
            console.log(`Resident ${ roomid } has remove from database now`);
            res.json({ msg : true });
        }
        else {
            throw new Error(`Not have room ${ roomid }`)
        }
    }
    catch (err) {
        await session.abortTransaction();
        console.log(`Has an error in remove person to room -> ${err}`);
        session.endSession();
        next(err);
    }
})

module.exports = router;