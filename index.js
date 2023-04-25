const { request, response } = require('express')

// express backend
const express = require('express')
const app = express()
const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:', request.path)
    console.log('Body:', request.body)
    console.log('---')
    next()
}
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

// allow cors
const cors = require('cors')
app.use(express.json())
app.use(requestLogger)
app.use(cors())
app.use(express.static('build'))

// config mongo db
const mongoose = require('mongoose')
const url = `mongodb+srv://sece1024:sece@cluster0.5mrpqe5.mongodb.net/noteApp?retryWrites=true&w=majority`
mongoose.connect(url)
const noteSchema = new mongoose.Schema({
    content: String,
    date: Date,
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

const generateId = () => {
    const maxId = notes.length > 0 ? Math.max(...notes.map(n => n.id)) : 0
    return maxId + 1
}

// define API
app.post('/api/notes', (request, response) => {
    const body = request.body

    if (!body.content) {
        return response.status(400).json({
            error: 'content missing'
        })
    }

    const note = {
        content: body.content,
        important: body.important || false,
        date: new Date(),
        id: generateId(),
    }

    notes = notes.concat(note)

    response.json(note)
})

app.get('/', (request, response) => {
    response.send('<h1>Hello World</h1>')
})

app.get('/api/notes', (request, response) => {
    Note.find({}).then(notes => {
        console.log(notes)
        response.json(notes)
    })
})
app.get('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    const note = notes.find(note => note.id === id)

    if (note) {
        response.json(note)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    notes = notes.filter(n => n.id !== id)

    response.status(204).end()
})

app.use(unknownEndpoint)
const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})