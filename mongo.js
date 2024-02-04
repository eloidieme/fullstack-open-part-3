const mongoose = require('mongoose')

if (process.argv.length < 5) {
    console.log('Not enough parameters provided. Specify password, name and number to add')
    process.exit(1)
}

const password = process.argv[2]
const newName = process.argv[3]
const newNumber = process.argv[4]

const url = `mongodb+srv://eloidieme:${password}@cluster0.1ski45l.mongodb.net/phoneApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const entrySchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Entry = mongoose.model('Entry', entrySchema)

const entry = new Entry({
    name: newName,
    number: newNumber,
})

entry.save().then(result => {
    console.log('entry saved')
    mongoose.connection.close()
})