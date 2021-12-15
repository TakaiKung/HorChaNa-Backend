const express = require('express');
const server = express();
const cors = require('cors');
const connectToDB = require('./Config/connectToDB');
const http = require('http');
const serverSocket = http.createServer(server);
const { Server } = require("socket.io");
const UnitModel = require('./Models/MeterUnitModel');
const io = new Server(serverSocket, {
    cors : {
        origin : '*',
        methods : ["GET", "POST"]
    }
});


server.use(cors());
server.use(express.json());
server.use(express.urlencoded({ extended: true}));

require('dotenv').config();
connectToDB();

server.use('/api/meter', require('./FetchMeterService/FetchMeterService'), require('./QrCodeService/QrCodeService'));

server.get('/', (req, res) => {
    res.send('This is a meter server run on PORT 3001');
});

/**
 * ! This is genUnit section---
 */
const e = 3;
const w = 2;

io.on('connection', (socket) => {
    let electric = [];
    let electricCount = 1;
    let waterCount = 1;
    let water = [];
    console.log(`user ${ socket.handshake.query['roomId'] } connected`);
    socket.on('runUnitElectric', async (msg) => {
        electric.push(msg.unit);
        if (electric.length === 10){
            const session = await UnitModel.startSession();
            try {
                session.startTransaction();
                const sum = electric.reduce((a, b) => a+b)
                await UnitModel.findOneAndUpdate({ roomId : msg.roomId },{$addToSet: { [`unit.electric`] : {
                    [`monthly_use`] : electric, sum : sum, electric_price : sum * e}
                }}, { upsert : true });
                await session.commitTransaction();
                session.endSession();
                electric = [];
                electricCount += 1;
            }
            catch (err) {
                await session.abortTransaction();
                session.endSession();
            }
            
        }
    })
    socket.on('runUnitWater', async (msg) => {
        console.log(`water : ${ msg.unit }`);
        water.push(msg.unit);
        if (water.length === 10) {
            const session = await UnitModel.startSession();
            const sum = water.reduce((a, b) => a+b)
            try {
                session.startTransaction();
                await UnitModel.findOneAndUpdate({ roomId : msg.roomId },{$addToSet: { [`unit.water`] : {[`monthly_use`] : water, sum : sum, water_price : sum * w} }}, { upsert : true });
                await session.commitTransaction();
                session.endSession();
                water = [];
                waterCount += 1;
            }
            catch (err) {
                await session.abortTransaction();
                session.endSession();
            }
        }
    })
    socket.on('disconnect' , async () => {
        console.log(`user ${ socket.handshake.query['roomId'] } disconnect`);
    });
});

serverSocket.listen(process.env.PORT, () => console.log(`service run on ${ process.env.PORT }`));


// await UnitModel.findOneAndUpdate({ meterId : msg.meterId },{$set: {'unit.month_1': electric}});

// if (electric.length === 5 && electricCount === 1){
//    await UnitModel.findOneAndUpdate({ roomId : msg.roomId },{$set: {'unit.electric.month_1': electric}},{ upsert : true });
//    electric = [];
//    electricCount += 1;
// }
// if (electric.length === 5 && electricCount === 2) {
//     await UnitModel.findOneAndUpdate({ roomId : msg.roomId },{$set: {'unit.electric.month_2': electric}},{ upsert : true });
//     electric=[];
//     electricCount +=1;
// }
// if (electric.length === 5 && electricCount === 3) {
//     await UnitModel.findOneAndUpdate({ roomId : msg.roomId },{$set: {'unit.electric.month_2': electric}},{ upsert : true });
//     electric=[];
//     electricCount = 1;
// }