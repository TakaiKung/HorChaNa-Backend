const express = require('express');
const server = express();

server.use(express.json({limit: '16mb', extended: true}));
server.use(express.urlencoded({limit: '16mb', extended: true}));

/**
 * * For declare modules amd use it
 */
require('dotenv').config();

/**
 * * Connect to database
 */
const databaseConnection = require('./Config/mongoConfig');
const { testCreateRoomValidator } = require('./Middleware/Validation/createRoomVali');
databaseConnection();

/**
 * * Services Route 
 */
server.use('/api/room', require('./CreateRoomService/createRoom'),require('./AddResidentServices/addResident'));
server.use('/api/room/get', require('./SendDataServices/allRoomIdList'), require('./SendDataServices/allRoomData') ,require('./SendDataServices/eachRoomData'));
server.use('/api/meter', require('./AddMeterServices/addMeterService')) 
server.use('/api', require('./SendDataServices/sendAllData'));
/**
 * * This is server sections
 */
server.get('/', (req, res, next) => {
    // testCreateRoomValidator();
    res.json({ msg : "Room Services is here" });
});


server.listen( process.env.PORT, () => console.log(`Room Service run on http://localhost:${ process.env.PORT }`) );

