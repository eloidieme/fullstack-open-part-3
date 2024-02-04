require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Entry = require('./models/entry')
const app = express()

morgan.token('person-data', (request, response) => {
    return JSON.stringify(request.body)
})

app.use(express.json())
app.use(cors())
app.use(express.static('dist'))
app.use(morgan((tokens, request, response) => {
    return [
        tokens.method(request, response),
        tokens.url(request, response),
        tokens.status(request, response),
        tokens.res(request, response, 'content-length'), '-',
        tokens['response-time'](request, response), 'ms',
        tokens['person-data'](request, response),
    ].join(' ')
}))

app.get('/info', (request, response) => {
    Entry.find({}).then(entries => {
        current_date = new Date()
        response.send(
            `<p>
                Phonebook has info for ${entries.length} people
            </p>
            <p>
                ${current_date}
            </p>`
        )
    })
})

app.get('/api/persons', (request, response) => {
    Entry.find({}).then(entries => {
        response.json(entries)
    })
})

app.get('/api/persons/:id', (request, response) => {
    Entry.findById(request.params.id).then(entry => {
        response.json(entry)
    })
})

app.delete('/api/persons/:id', (request, response) => {
    Entry.findByIdAndDelete(request.params.id).then(entry => {
        response.status(204).end()
    })
})

app.post('/api/persons/', (request, response) => {
    const body = request.body

    if (!body.name) {
        return response.status(400).json({
            "error": "name is missing"
        })
    }
    if (!body.number) {
        return response.status(400).json({
            "error": 'number is missing'
        })
    }
    //if (persons.find(p => p.name === body.name)) {
    //    return response.status(400).json({
    //        "error": "name must be unique"
    //    })
    //}

    const person = new Entry({
        name: body.name,
        number: body.number,
    })

    person.save().then(returnedPerson => {
        response.json(returnedPerson)
    })
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: "unknown endpoint"})
}

app.use(unknownEndpoint)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}.`)
})