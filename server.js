
const express = require('express');
const app = express();
//bringing database connection from config/db.js
const connectDB = require('./config/db');


//int middleware to use the body parser
app.use(express.json({
    extended: false
}  
));

//connects with the mongoDB Database
connectDB();
//checking if the app is starting and running
app.get('/', (req,res)=> {
    //sendinng the respose 
    res.send('Api is started and running!');
})


//defining all the routes  that we made on routes/api/..
app.use('/api/user', require('./routes/api/user'));
app.use('/api/posts', require('./routes/api/posts'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/auth', require('./routes/api/auth'));


//selecting and proving the port for the run time
const PORT = process.env.PORT || 5000;

///listening to the port 
app.listen (PORT, ()=> {
    //sending port number to the console 
    console.log('server has started on port no ' + PORT)
})