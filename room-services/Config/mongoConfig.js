const mongoose = require('mongoose');

/**
 * * Database Connection functions
 */

const databaseConnection = () => {
    mongoose.connect(process.env.DBURL, {
        connectTimeoutMS : 5000,
        maxPoolSize : 150,
        minPoolSize : 50,
        useNewUrlParser : true,
        useUnifiedTopology: true
    })
    .then(
        () => console.log(`Database has connected`)
    )
    .catch(err => console.log(`Found an error : ${ err }`))
}

module.exports = databaseConnection;