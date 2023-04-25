// config env variable
require('dotenv').config();
const Note = require('./models/note')
const PORT = process.env.PORT

// express backend
const { request, response } = require('express')
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
app.use(express.json())
app.use(requestLogger)
app.use(express.static('build'))

// allow cors
const cors = require('cors')
app.use(cors())

// error handlers
const errorHandler = (error, request, response, next) => {
    console.log(error.message)

    if(error.name === 'CastError'){
        return response.status(400).send({ error: 'malformatted id' })
    }

    next(error)

}

// define API
app.post('/api/notes', (request, response) => {
    const body = request.body

    if (body.content === undefined) {
        return response.status(400).json({
            error: 'content missing'
        })
    }

    const note = new Note({
        content: body.content,
        important: body.important || false,
        date: new Date(),
    })

    note.save().then(savedNote => {
        console.log('savedNote', savedNote)
        response.json(savedNote)
    })
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
app.get('/api/notes/:id', (request, response, next) => {
    Note.findById(request.params.id)
        .then(note => {
            if (note) {
                response.json(note)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})
app.delete('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    notes = notes.filter(n => n.id !== id)

    response.status(204).end()
})

// middleware for unknown url
app.use(unknownEndpoint)
// this has to be the last loaded middleware.
app.use(errorHandler)



app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})