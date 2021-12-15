const router = require('express').Router();
const { InvoiceModel } = require('../DatabaseModels/InvoiceModel');


router.get('/get/room/:roomId', async (req, res, next) => {
    const roomid = req.params.roomId;
    let thisMonth =[];
    let lastMonth=[];
    let twoMonthAgo=[];
    const session = await InvoiceModel.startSession();
    try {
        session.startTransaction();        
        const invoice = await InvoiceModel.find({roomId : roomid});
        const maxValueOfMonth = Math.max(...invoice.map(o => o.invoice_month), 0);
        invoice.map(data => {
            if (data.invoice_month === String(maxValueOfMonth)) {
                thisMonth.push(data);
            }
            if (data.invoice_month === String(maxValueOfMonth-1)) {
                lastMonth.push(data);
            }
            if(data.invoice_month === String(maxValueOfMonth-2)) {
                twoMonthAgo.push(data);
            }
        })
        await session.commitTransaction();
        session.endSession();
        res.send([
            {
                month : "This Month",
                bills : thisMonth[0]
            },
            {
                month : "Last Month",
                bills : lastMonth[0]
            },
            {
                month : "2 Month Ago",
                bills : twoMonthAgo[0]
            }
        ])
    }
    catch (err) {
         await session.abortTransaction();
        session.endSession();
        console.log(err)
    }
    
})

router.get('/get/all', async (req, res, next) => {
    let thisMonth =[];
    let lastMonth=[];
    let twoMonthAgo=[];
    const session = await InvoiceModel.startSession();
    try {
        session.startTransaction();
        const allInvoice = await InvoiceModel.find({});
        const sorting = allInvoice.sort((a,b) => parseInt(a.invoice_month) - parseInt(b.invoice_month));
        const maxValueOfMonth = Math.max(...sorting.map(o => o.invoice_month), 0);
        allInvoice.map(data => {
            if (data.invoice_month === String(maxValueOfMonth)) {
                thisMonth.push(data);
            }
            if (data.invoice_month === String(maxValueOfMonth-1)) {
                lastMonth.push(data);
            }
            if(data.invoice_month === String(maxValueOfMonth-2)) {
                twoMonthAgo.push(data);
            }
        });
        res.send([
            {
                month : "This Month",
                bills : thisMonth
            },
            {
                month : "Last Month",
                bills : lastMonth
            },
            {
                month : "2 Month Ago",
                bills : twoMonthAgo
            }
        ])
        await session.commitTransaction();
        session.endSession();
    }
    catch (err) {
        await session.abortTransaction();
        session.endSession();
        console.log(err)
    }
});

module.exports = router;