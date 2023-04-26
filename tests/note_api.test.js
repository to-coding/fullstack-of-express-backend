const mongoose = require('mongoose')
const helper = require('./test_helper')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Note = require('../models/note')


beforeEach(async () => {
    await Note.deleteMany({})

    const noteObjs = helper.initialNotes.map(note => new Note(note))
    const promiseArray = noteObjs.map(note => note.save())

    await Promise.all(promiseArray)
}, 100000)

test('note are returned as json', async () => {
    await api
        .get('/api/notes')
        .expect(200)
        .expect('Content-Type', /application\/json/)
}, 100000)

test('all notes are returned', async () => {
    const reponse = await api.get('/api/notes')

    expect(reponse.body).toHaveLength(helper.initialNotes.length)
})

test('a specific note is within the returned notes', async () => {
    const response = await api.get('/api/notes')

    const contents = response.body.map(r => r.content)
    expect(contents).toContain('Browser can execute only Javascript')
})

test('a valid note can be added', async () => {
    const newNote = {
        content: 'async/await simplifies making async calls',
        important: true,
    }

    await api
        .post('/api/notes')
        .send(newNote)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const notesAtEnd = await helper.notesInDb()
    expect(notesAtEnd).toHaveLength(helper.initialNotes.length + 1)

    const contents = notesAtEnd.map(r => r.content)
    expect(contents).toContain('async/await simplifies making async calls')
}, 100000)

test('note without content is not added', async () => {
    const newNote = {
        important: true
    }

    await api
        .post('/api/notes')
        .send(newNote)
        .expect(400)

    const notesAtEnd = await helper.notesInDb()

    expect(notesAtEnd).toHaveLength(helper.initialNotes.length)
})

test('a specific note can be viewed', async () => {
    const notesAtStart = await helper.notesInDb()
    const noteToView = notesAtStart[0]

    const resultNote = await api
        .get(`/api/notes/${noteToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

    const processdNoteToView = JSON.parse(JSON.stringify(noteToView))
    expect(resultNote.body).toEqual(processdNoteToView)
})

test('a note can be deleted', async () => {
    const notesAtStart = await helper.notesInDb()
    const noteToDelete = notesAtStart[0]

    await api
        .delete(`/api/notes/${noteToDelete.id}`)
        .expect(204)

    const notesAtEnd = await helper.notesInDb()
    expect(notesAtEnd).toHaveLength(helper.initialNotes.length - 1)

    const contents = notesAtEnd.map(r => r.content)
    expect(contents).not.toContain(noteToDelete.content)
})

test('a note can be update', async () => {
    const notesAtStart = await helper.notesInDb()
    const noteToUpdate = notesAtStart[1]
    const newNote = {
        content: 'this note had been changed',
        important: false
    }

    await api
        .put(`/api/notes/${noteToUpdate.id}`)
        .send(newNote)
        .expect(200)

    const notesAtEnd = await helper.notesInDb()
    expect(noteToUpdate.content).not.toEqual('this note had been changed')
    expect(notesAtEnd).toHaveLength(helper.initialNotes.length)
    expect(notesAtEnd[1].id).toEqual(noteToUpdate.id)
    expect(notesAtEnd[1].content).toEqual('this note had been changed')
})

afterAll(() => {
    mongoose.connection.close()
})