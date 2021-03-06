const express = require('express');
const request = require ('request');
const config = require ('config');
const auth = require ('../../middleware/auth');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const Profile = require('../../models/Profile');
const User = require('../../models/User');
//const Post = require('../../models/Post');

//@route GET api/profile/me
//@desc  getting current user profile
//@access Private

router.get('/me', auth, async (req,res) => {
    try {
        //searching profile in databse from user id 
        const profile = await Profile.findOne({
            user: req.user.id
        }).populate(
            'user',
            [
                'name',
                'avatar'
            ]
        )

        //checking if profile exists or not
        if (!profile) {
            return res.status(400).json(
                {
                    msg: 'There is no profile for the given user'
                }
            ); 
        }
        //sending the profile details 
        res.json(profile);
        
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

//@route POST api/profile/
//@desc  Create or Update user Profile
//@access Private
router.post ('/', auth ,[
    //checking if the required field are placed by user
    check('courses', 'Courses are required')
        .not().isEmpty(),
    check('major', 'Major is required')
        .not().isEmpty()
],
async (req, res) => {
    const errors = validationResult(req);
    //if there are  errors 
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }

    //passing data from req.body to variables
    const {
        major,
        website,
        location,
        courses,
        languages,
        bio,
        githubusername,
        youtube,
        facebook,
        twitter,
        instagram,
        linkedin

    } = req.body;

    //building profile object
    const profileFields = {};
    profileFields.user =req.user.id;
    if(major) profileFields.major = major;
    if(website) profileFields.website = website;
    if(location) profileFields.location = location;
    if (bio) profileFields.bio =bio;
    if (githubusername) profileFields.githubusername = githubusername;
    if (courses)
        profileFields.courses = courses.split(',').map(
            courses => courses.trim()
        );
    if (languages)
        profileFields.languages = languages.split(',' ).map(
            languages => languages.trim()
        );
    
    //building social obkect 
    profileFields.social = {}
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;
    
    try {
        // Using upsert option ,if no match is found creates new profile

        let profile = await Profile.findOneAndUpdate(
            { user: req.user.id},
            { $set: profileFields},
            {new: true, upsert: true}
        );
        res.json(profile);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server Error');     
    }
}
);

//@route GET api/profile/
//@desc  Getting all user profile
//@access public

router.get ('/', async (req, res) => {
    try {
        //geting profiles from MongoDB
        const profiles = await Profile.find().populate(
            'user',
            ['name', 'avatar']
        );

        res.json(profiles);    
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

// @route    GET api/profile/user/:user_id
// @desc     Get profile by user ID
// @access   Public
router.get('/user/:user_id', async (req, res) => {
    try {
        //finding profile for user id 
        const profile = await Profile.findOne({
            user: req.params.user_id
        }).populate(
            'user',
            ['name', 'avatar']
        );
        
        //if no profile exists 
        if (!profile) return res.status(400).json({
            msg: 'Profile not found'
        });
        res.json(profile);
        
    } catch (err) {
        if (err.kind == 'ObjectId') {
            return res.status(400).json({ msg: 'Profile not found' });
          }
          res.status(500).send('Server Error');
        
    }
});

// @route    DELETE api/profile
// @desc     Deletes profile ,user and post
// @access   Private

router.delete('/', auth, async (req, res) => {
    try {
        //removing post is yet to be implemented

        //removing profile 
        await Profile.findOneAndRemove({
            user: req.user.id
        });

        //removing user 
        await User.findOneAndRemove({
            _id: req.user.id
        });

        res.json({
            msg: 'User Deleted'
        });

        
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');        
    }
});

// @route    GET api/profile/github/:username
// @desc     Get user repos from Github
// @access   Public

router.get('/github/:username', (req, res) => {
    try {
        const options = {
            uri:encodeURI(`https://api.github.com/users/${
                req.params.username
            }/repos?per_page=5&sort=created:asc&client_id=${config.get(
                'githubClientID'
            )}&client_secret=${config.get(
                'githubClientSecret'
            )}`),
            method: 'GET',
            headers: { 'user-agent': 'node.js' }
        };
        request(options, (error, response, body) => {
            if (error) console.error(error);
      
            if (response.statusCode !== 200) {
              return res.status(404).json({ msg: 'No Github profile found' });
            }
      
            res.json(JSON.parse(body));
          });
    } catch (error) {
        console.error(err.message);
        res.status(500).send('Server Error');       
    }
});

module.exports = router;