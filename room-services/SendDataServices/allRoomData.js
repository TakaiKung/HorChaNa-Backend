const router = require('express').Router();
const RoomModel = require('../Models/roomModel');

router.get('/allroomsdata', async (req, res, next) => {
    const session = await RoomModel.startSession();
    try {
        session.startTransaction();
        const roomsData = await RoomModel.find();
        session.commitTransaction();
        session.endSession();
        console.log(`Send all rooms data complete`)
        res.json({ roomsData : roomsData });
    }
    catch (err) {
        session.abortTransaction();
        console.log(`Send all room data incomplete has error ${ err }`);
        session.endSession();
        res.send(err);
    }
});

module.exports = router;