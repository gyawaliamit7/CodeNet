const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

const User = require('../../models/User');

//@route POST api/auth
//@desc  authenticating user and getting token
//access PUBLIC

router.post('/', 
[
    //validating the informations
    check('email', 'Please include a valid email address')
            .isEmail(),
    check('password', 'Password is required').exists()


],
async (req,res) => {
    //storing if there any any error messages
    const errors = validationResult(req);

    //if there is an error 
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        })
    }

    //getting email and password from json
    const {email ,password} = req.body;

    try {
        //finding the user from MongoDB
        let user = await User.findOne({email});
        //if user doesn't exist
        if (!user) {
            return res.status(400)
            .json(
                {
                    errors: [{
                        msg: 'Invalid Credentials'
                    }]
               });     
        }

        //comparing entered password with user password
        const isMatch = await bcrypt.compare(password,user.password);

        //if password doesn't match
        if (!isMatch) {
            return res.status(400)
            .json({
                errors: [{
                    msg: 'Invalid Credentials'
                }]
            });
        }

        //getting the token once the password is verified
        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(
            payload,
            config.get('jwtSecret'),
            {
                expiresIn: 360000
            },
            (err,token) => {
                if (err) throw err;
                res.json({token});
        });
  
    } catch (error) {
        console.error(error.message);
      res.status(500).send('Server error');
    }  
});

module.exports = router;