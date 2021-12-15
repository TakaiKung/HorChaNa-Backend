const mongoose = require('mongoose');

const connectToDB = () => {
    mongoose.connect(process.env.DBURL, {
        connectTimeoutMS : 10000,
        maxPoolSize : 150,
        minPoolSize : 50,
        useNewUrlParser : true,
        useUnifiedTopology: true
    })
    .then(()=>{
       console.log( process.env.DBURL +' connected')
    })
    .catch ( err => console.log(`Has problem ${ err }`));
}

module.exports = connectToDB;