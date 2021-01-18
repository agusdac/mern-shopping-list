const express = require('express')
const router = express.Router();
const bcrypt = require('bcryptjs')
const config = require('config')
const jwt = require('jsonwebtoken')

const User = require('../../models/User')

//@route GET api/users
//@desc Register
//@access Public
router.post('/', (req, res) => {
    const {name, email, password} = req.body

    //validation
    if (!name || !email || !password) {
        return res.status(400).send({message: 'Please enter all fields'})
    }

    //Check for existing user
    User.findOne({email}).then(user => {
       if(user) return res.status(400).send({message: 'User already exists'})

        const newUser = new User({name, email, password})

        //Create salt & hash
        bcrypt.hash(newUser.password, 10, (err, hash) => {
            if(err) throw err;
            newUser.password = hash
            newUser.save().then(user => {

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
        })
    }).catch(err => res.status(500).send(err))

})

module.exports = router