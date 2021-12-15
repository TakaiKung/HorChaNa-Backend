const router = require('express').Router();
const qr = require('qrcode');

router.post('/registeration', async (req, res) => {
    const data = req.body;
    const random = Math.floor(Math.random()*999999999);
    if (data.meterType === 'electricMeter') {
        const url = `https://horchana-room-services.herokuapp.com/api/meter/reg/${data.roomId}/electric/${random}`;
        qr.toDataURL(url, (err , src) => {
            if (err) {
                res.send('Error occured');
            }
            res.json({ src : src });
        });
    }
    if (data.meterType === 'waterMeter') {
        const url = `https://horchana-room-services.herokuapp.com/api/meter/reg/${data.roomId}/water/${random}`;;
        qr.toDataURL(url, (err , src) => {
            if (err) {
                res.send('Error occured');
            }
            res.json({ src : src });
        });
    }
});

module.exports = router;