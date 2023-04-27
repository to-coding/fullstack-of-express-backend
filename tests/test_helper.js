const Note = require('../models/note')
const User = require('../models/user')
const bcrypt = require('bcrypt')

const initialNotes = [
    {
        content: 'HTML is easy',
        date: new Date(),
        important: false,
    },
    {
        content: 'Browser can execute only Javascript',
        date: new Date(),
        important: true,
    },
]

const nonExistingId = async () => {
    const note = new Note({ content: 'willremovethissoon', date: new Date() })
    const noteSaved = await note.save()
    await Note.deleteOne(noteSaved)

    return note._id.toString()
}

const notesInDb = async () => {
    const notes = await Note.find({})
    return notes.map(note => note.toJSON())
}

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(u => u.toJSON())
}

const addUserInDb = async (username, name, password) => {
    await User.deleteMany({})
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
        username,
        name,
        passwordHash,
    })
    const userSaved = await user.save()

    return userSaved
}

module.exports = {
    initialNotes,
    nonExistingId,
    notesInDb,
    usersInDb,
    addUserInDb
}