const notesRouter = require('express').Router()
const User = require('../models/user')
const Note = require('../models/note')

// define API
notesRouter.post('/', async (request, response) => {
    const body = request.body

    const user = await User.findById(body.userId)

    const note = new Note({
        content: body.content,
        important: body.important || false,
        date: new Date(),
        user: user._id
    })

    const savedNote = await note.save()
    user.notes = user.notes.concat(savedNote._id)
    await user.save()

    response.status(201).json(savedNote)

})
notesRouter.get('/', async (request, response) => {
    const notes = await Note
        .find({}).populate('user', { username: 1, name: 1 })
    response.json(notes)
})
notesRouter.get('/:id', async (request, response) => {
    const note = await Note
        .findById(request.params.id)
        .populate('user', { username: 1, name: 1 })
    if(note){
        response.json(note)
    } else {
        response.status(404).end()
    }
})
notesRouter.delete('/:id', async (request, response) => {
    await Note.findByIdAndRemove(request.params.id)
    response.status(204).end()
})
notesRouter.put('/:id', async (request, response) => {
    const body = request.body

    const note = {
        content: body.content,
        important: body.important,
    }

    const updatedNote = await Note.findByIdAndUpdate(
        request.params.id,
        note,
        { new: true, runValidators: true, context: 'query' }
    )

    response.json(updatedNote)
})


module.exports = notesRouter