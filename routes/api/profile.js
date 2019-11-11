const express = require('express');
const request = require ('request');
const config = require ('config');
const auth = require ('../../middleware/auth');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');

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
})

module.exports = router;