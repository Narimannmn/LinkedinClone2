const mongoose = require('mongoose')

const connectionString = 'mongodb://localhost:27017/linkedin'

mongoose.connect(connectionString, {

})

const db = mongoose.connection

db.on('error', console.error.bind(console, 'MongoDB connection error:'))
db.once('open', () => {
    console.log('Connected to MongoDB')
})
