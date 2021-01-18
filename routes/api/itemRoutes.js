const express = require('express');
const auth = require('../../middleware/auth');
const router = express.Router();

const Item = require('../../models/Item')

//@route GET api/items
//@desc Get all posts
//@access Public
router.get('/', (req, res) => {
    Item.find().sort('-date').then(result => {
        res.send(result)
    }).catch(err => res.send(err))
})

//@route POST api/items
//@desc Create a post
//@access Public
router.post('/', auth, (req, res) => {
    const item = new Item({name: req.body.name})
    item.save().then(result => {
        res.send(result)
    }).catch(err => res.send(err))
})

//@route Delete api/items/:id
//@desc Delete a post
//@access Public
router.delete('/:id', auth, (req, res) => {
    Item.findByIdAndDelete(req.params.id).then(result => {
        if (result) {
            res.send({success: true})
        } else {
            res.status(404).send({success: false})
        }
    }).catch(err => res.status(404).send({success: false, error: err}))
})

module.exports = router