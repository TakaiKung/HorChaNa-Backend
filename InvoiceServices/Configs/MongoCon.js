const mongoose = require('mongoose');

const MongoCon = () => {
    mongoose.connect(process.env.DBURL, {
        connectTimeoutMS : 10000,
        maxPoolSize : 150,
        minPoolSize : 50,
        useNewUrlParser : true,
        useUnifiedTopology: true
    })
    .then(()=>{
       console.log( 'Databse has connected');
    })
    .catch ( err => console.log(`Has problem ${ err }`));
}

module.exports = MongoCon;