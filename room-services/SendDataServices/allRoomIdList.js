const RoomModel = require('../Models/roomModel');

const router = require('express').Router();

router.get('/roomidlist', async(req, res, next) => {
    const session = await RoomModel.startSession();
    try {
        session.startTransaction();
        await RoomModel.find().select('roomId -_id')
        .exec((err, roomList) => {
            if (err) {
                throw err
            }
            else {
                res.send( roomList );
            }
        });
        await session.commitTransaction();
        await session.endSession();
    }
    catch (err) {
        await session.abortTransaction();
        session.endSession();
        res.json({ msg : `Something went wrong ${ err }` })
    }
});

module.exports = router;