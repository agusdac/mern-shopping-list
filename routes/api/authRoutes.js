const express = require('express')
const router = express.Router();
const bcrypt = require('bcryptjs')
const config = require('config')
const jwt = require('jsonwebtoken')

const User = require('../../models/User');
const auth = require('../../middleware/auth');

//@route POST api/auth
//@desc Login
//@access Public
router.post('/', (req, res) => {
    const {email, password} = req.body

    //validation
    if (!email || !password) {
        return res.status(400).send({message: 'Please enter all fields'})
    }

    //Check for existing user
    User.findOne({email}).then(user => {
       if(!user) return res.status(400).send({message: 'User does not exist'})

        //Validate password
        bcrypt.compare(password, user.password).then(isMatch => {
            if (!isMatch) return res.status(400).send({message: 'Wrong password'})

            jwt.sign({id: user.id}, config.get('jwtSecret'), {expiresIn: 3600}, (err, token) => {
                if(err) throw err;
                res.send({
                    token,
                    user: {
                    id: user.id,
                    name: user.name,
                    email: user.email
                }})
            })
        })
        
    }).catch(err => res.status(500).send(err))

})

//@route GET api/auth/user
//@desc Login
//@access Private
router.get('/user', auth, (req, res) => {
    User.findById(req.user.id).select('-password').then(user => {
        res.send(user)
    }).catch(err => res.status(500).send(err))
})

module.exports = router