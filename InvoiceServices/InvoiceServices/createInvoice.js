const router = require('express').Router();
const UnitModel = require('../DatabaseModels/UnitModel');
const { InvoiceModel, RoomModel } = require('../DatabaseModels/InvoiceModel');

router.post('/create', async (req, res, next) => {
    const e = 3;
    const w = 2;
    const secretCode = req.body.secretCode;
    const key = '123456';
    const session = await InvoiceModel.startSession();
    try {
        session.startTransaction();
        if (secretCode === key) {
            const allUnit = await UnitModel.find({}).select('unit roomId -_id');
            allUnit.map(async (data) => {
                const resident_info = await RoomModel.findOne({ roomId : data.roomId }).select('resident_info -_id');
                const electricUnit = data.unit.electric.reverse();
                const waterUnit = data.unit.water.reverse();
                const elect_price = electricUnit[0].electric_price;
                const water_price = waterUnit[0].water_price;
                const isHaveBill = await InvoiceModel.findOne({ roomId : data.roomId , invoice_month : electricUnit.length});
                if (resident_info.resident_info.name !== null && isHaveBill === null) {
                    await InvoiceModel.create({ 
                        roomId : data.roomId ,
                        invoice_date : Date.now(),
                        invoice_month : electricUnit.length,
                        resident_info : {
                            name : resident_info.resident_info.name,
                            tel : resident_info.resident_info.tel,
                            entrance_date : resident_info.resident_info.entrance_date
                        },
                        price : {
                            water : water_price,
                            electricity : elect_price,
                            room : 3500
                        },
                        slip : null,
                        status : "wait"
                    });
                }
                // else {
                //     res.send('Have an error')
                // }
                await session.commitTransaction();
                session.endSession();
                res.send(true);
            })
        }
        else {
            res.send('Unauthorize')
        }
    }
    catch (err) {
        await session.abortTransaction();
        session.endSession();
    }
});

module.exports = router;