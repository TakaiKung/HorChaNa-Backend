const express = require('express');
const app = express();
const MongoCon = require('./Configs/MongoCon');
/**
 * * Initialize server app
 */
require('dotenv').config();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
/**
 * * Connect to Database
 */
MongoCon();
/**
 * ! Service Routes Area
 */
app.use('/api/invoice', require('./InvoiceServices/createInvoice'), require('./InvoiceServices/sendEachInvoice'), require('./InvoiceServices/uploadSlip'));
app.use('/api', require('./LoginServices/loginService'));

app.get('/', async(req, res) => {
    res.send('dw');
})

app.listen(process.env.PORT, () => console.log(`run on port 3002`));
