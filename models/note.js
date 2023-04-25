// config mongo db
const mongoose = require('mongoose')
const url = process.env.MONGODB_URI //`mongodb+srv://sece1024:sece@cluster0.5mrpqe5.mongodb.net/noteApp?retryWrites=true&w=majority`

console.log('connecting to', url)

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    minLength: 3,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  important: Boolean,
})
// hide id & v
noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})
const Note = mongoose.model('Note', noteSchema)

module.exports = mongoose.model('Note', noteSchema)