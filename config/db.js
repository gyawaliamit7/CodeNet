/*
The file is responsible for connecting with Mongo Database
with the server
*/

const mongoose = require('mongoose');
const config   = require('config')
const db = config.get("mongoURI")

//connecting to mongo DB databases
const connectDB = async() => {
    try {
        //using mongoose to connect with mongo database
        await mongoose.connect(db, {
            useNewUrlParser: true,
            useFindAndModify: false,
            useCreateIndex: true,
            useUnifiedTopology: true 
        });
        //displaying success message 
        console.log("Mongo DB connected! ");
    //if the connnection is failed     
    }catch(err) {
        console.error(err.message);
        //exiting process with failure 
        process.exit(1);
    }
}

//exporting the connection
module.exports = connectDB;