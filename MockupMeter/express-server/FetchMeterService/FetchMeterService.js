const router = require('express').Router();
const axios = require('axios').default;

router.get('/get/meterlist', async (req, res) => {
    try {
        const meterlist = await axios.get('https://horchana-room-services.herokuapp.com/api/room/get/allroomsdata');
        res.send(meterlist.data);
    }
    catch (err) {
        console.log(`Has en error ${ err }`);
        res.send(err);
    }
});

module.exports = router;