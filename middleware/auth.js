const config = require('config')
const jwt = require('jsonwebtoken')

const auth = (req, res, next) => {
    const token = req.header('x-auth-token')
    if(!token) return res.status(401).send({message: "User is unauthorized"})

    //verify token
    try {
        const decoded = jwt.verify(token, config.get('jwtSecret'))
        //add user from payload
        req.user = decoded
        next()
    } catch(e) {
        res.status(400).send({message: "Token is not valid"})
    }
}

module.exports = auth