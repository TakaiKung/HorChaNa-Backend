const router = require('express').Router();
const { InvoiceModel } = require('../DatabaseModels/InvoiceModel');


router.post('/upload/:roomid', async(req, res, next) => {
    const img = req.body.img;
    const month = req.body.month;
    const session = await InvoiceModel.startSession();
    try {
        session.startTransaction();        
        await InvoiceModel.findOneAndUpdate({ roomId : req.params.roomid, invoice_month : month }, { slip : img }, { status : 'uncheck' });
        await session.commitTransaction();
        session.endSession();
        res.send(true);
    }
    catch (err) {
        await session.abortTransaction();
        session.endSession();
        console.log(err);
        res.send(false);
    }
});

router.post('/uncheck', async(req, res, next) => {
    const data = req.body;
    const session = await InvoiceModel.startSession();
    try {
        session.startTransaction(); 
        await InvoiceModel.findOneAndUpdate({ roomId : data.roomId, invoice_month : data.invoice_month }, {status : 'uncheck' });
        await session.commitTransaction();
        session.endSession();
        res.send(true);
    }
    catch (err) {
        await session.abortTransaction();
        session.endSession();
        console.log(err);
        res.send(false);
    }
})

router.post('/wait', async(req, res, next) => {
    const data = req.body;
    const session = await InvoiceModel.startSession();
    try {
        session.startTransaction(); 
        await InvoiceModel.findOneAndUpdate({ roomId : data.roomId, invoice_month : data.invoice_month }, {status : "wait" },  {
          });
        await session.commitTransaction();
        session.endSession();
        res.send(true);
    }
    catch (err) {
        await session.abortTransaction();
        session.endSession();
        console.log(err);
        res.send(false);
    }
})

router.post('/confirm', async(req, res, next) => {
    const data = req.body;
    const session = await InvoiceModel.startSession();
    try {
        session.startTransaction(); 
        await InvoiceModel.findOneAndUpdate({ roomId : data.roomId, invoice_month : data.invoice_month }, {status : "confirm" },  {
          });
        await session.commitTransaction();
        session.endSession();
        res.send(true);
    }
    catch (err) {
        await session.abortTransaction();
        session.endSession();
        console.log(err);
        res.send(false);
    }
})

module.exports = router;