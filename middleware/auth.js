const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = async function (req, res, next) {
    //getting token from header
    const token = req.header('x-auth-token');

    //check if there is token
    if (!token) {
        return res.status(401).json({
            msg: 'No token, authorization denied'
        });
    }

    //verifying the token 
    try {
        await jwt.verify(token, config.get('jwtSecret'), (error, decoded) => {

            //if error 
            if (error) {
                res.status(401).json({
                    msg: 'Token is not valid'
                });
            }
            else {
                req.user = decoded.user;
                next();
            }
        });
    } catch (err) {
        console.error('there is something wrong with auth middleware');
        res.status(500).json({ msg: 'Server Error' });

    }
};