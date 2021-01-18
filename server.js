const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const config = require('config')
const itemRoutes = require('./routes/api/itemRoutes')
const userRoutes = require('./routes/api/userRoutes')
const authRoutes = require('./routes/api/authRoutes')

const app = express()

//middleware
app.use(express.json())

//mongoDB connection
const dbKEY = config.get('mongoURI');
//options for the deprecations warning
mongoose.connect(dbKEY, {useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true, useUnifiedTopology: true})
    .then(() => console.log('Connected to mongoDB'))
    .catch((err) => console.log(err))

//Routes
app.use('/api/items', itemRoutes)
app.use('/api/users', userRoutes)
app.use('/api/auth', authRoutes)

//Serve static assets if we're on production
if (process.env.NODE_ENV === 'production') {
    //set static folder
    app.use(express.static('client/build'))

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}

const port = 5000 || process.env.PORT

app.listen(port, () => console.log(`Server started on ${port}`))

