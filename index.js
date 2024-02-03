const express = require('express')
const app = express()

app.use(express.json())

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/info', (request, response) => {
    current_date = new Date()
    response.send(
        `<p>
            Phonebook has info for ${persons.length} people
        </p>
        <p>
            ${current_date}
        </p>`
    )
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(p => p.id === id)

    person ? response.json(person) : response.status(404).end()
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(p => p.id !== id)

    response.status(204).end()
})

const generateId = (maxValue) => {
    return Math.floor(Math.random() * maxValue)
}

app.post('/api/persons/', (request, response) => {
    const body = request.body
    const maxValue = 1e8

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
    if (persons.find(p => p.name === body.name)) {
        return response.status(400).json({
            "error": "name must be unique"
        })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: generateId(maxValue)
    }

    persons = persons.concat(person)

    response.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}.`)
})