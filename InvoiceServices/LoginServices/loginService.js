const { RoomModel } = require('../DatabaseModels/InvoiceModel');

const router = require('express').Router();

router.post('/login', async (req, res) => {
    const data = req.body
    const session = await RoomModel.startSession();
    try {
        session.startTransaction();
        const acc = await RoomModel.findOne({ 'resident_info.name' : data.name, 'resident_info.password' : data.password})
        if (acc) {
            res.json({ status : true, data : acc });
        }
        else {
            res.json({ status : false });
        }
    }
    catch (err) {
        res.send('Have an error');
        console.log(err);
    }
});

module.exports = router;