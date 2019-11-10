const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const  config = require('config');

//for the validation
const { check , validationResult } = require('express-validator');

//loading user model 
const User = require('../../models/User');

//@route POST api/users
//@desc  REGISTERING USER
//access PUBLIC
router.post('/', [
    //validation to ensure name is inserted and not empty
    check('name' , 'Name is required')
        .not()
        .isEmpty(),
    //validation to ensure valid email is placed
    check('email', 'Please include a valid email')
        .isEmail(),
    //check password is of given length
    check('password', 'Please enter aleast 6 character long password')
        .isLength({
            min: 6
        })
], 
async (req,res) => {
    //storing the errors
    const errors = validationResult(req);

    //if there are errors
    if (!errors.isEmpty()) {
        //return errors on json 
        return res.status(400).json({
            errors: errors.array()
        });
    }
    //pulling out contents from req.body 
    const {name, email, password} = req.body;
    try {
    //find user email
        let user = await User.findOne({ email });

        //if the user email exists sends an error message
        if (user) {
            res.status(400).json({
                errors: [{msg: 'User already exists'}]
            });
        } 
        //get the user gravators from user email
        const avator = gravatar.url(email, {
            s: '200',
            r: 'pg',
            d:'mm' //if no gravatar set to default
        }) 


        //if no user exist create new user 
        user = new User({
            name,
            email,
            avator,
            password
        });

        //encrypt password with 10 rounds
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password,salt);

        //saving to database
        await user.save();

        //return jsonwebtoken
        const payload = {
            user: {
                id: user.id,

            }
        };

        jwt.sign(
            payload,
            config.get('jwtSecret'),
            {
                expiresIn: 360000 },
                (err,token) => {
                    if (err) throw err;
                    res.json({ token });
                });
    } catch(error) {
        console.error(error.message);
        res.status(500).send('server error');

    }

    



})

module.exports = router;