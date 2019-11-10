
const express = require('express');
const app = express();

//checking if the app is starting and running
app.get('/', (req,res)=> {
    //sendinng the respose 
    res.send('Api is started and running!');
})

//selecting and proving the port for the run time
const PORT = process.env.PORT || 5000;

///listening to the port 
app.listen (PORT, ()=> {
    //sending port number to the console 
    console.log('server has started on port no ' + PORT)
})