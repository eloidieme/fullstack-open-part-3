require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Entry = require("./models/entry");
const app = express();

morgan.token("person-data", (request, response) => {
  return JSON.stringify(request.body);
});

app.use(express.json());
app.use(cors());
app.use(express.static("dist"));
app.use(
  morgan((tokens, request, response) => {
    return [
      tokens.method(request, response),
      tokens.url(request, response),
      tokens.status(request, response),
      tokens.res(request, response, "content-length"),
      "-",
      tokens["response-time"](request, response),
      "ms",
      tokens["person-data"](request, response),
    ].join(" ");
  })
);

app.get("/info", (request, response) => {
  Entry.find({}).then((entries) => {
    current_date = new Date();
    response.send(
      `<p>
                Phonebook has info for ${entries.length} people
            </p>
            <p>
                ${current_date}
            </p>`
    );
  });
});

app.get("/api/persons", (request, response) => {
  Entry.find({}).then((entries) => {
    response.json(entries);
  });
});

app.get("/api/persons/:id", (request, response, next) => {
  Entry.findById(request.params.id)
    .then((entry) => {
      if (entry) {
        response.json(entry);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (request, response, next) => {
  Entry.findByIdAndDelete(request.params.id)
    .then((entry) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body;

  const entry = {
    name: body.name,
    number: body.number,
  };

  Entry.findByIdAndUpdate(request.params.id, entry, {
    new: true,
    runValidators: true,
    context: "query",
  })
    .then((updatedEntry) => {
      response.json(updatedEntry);
    })
    .catch((error) => next(error));
});

app.post("/api/persons/", (request, response, next) => {
  const body = request.body;

  const person = new Entry({
    name: body.name,
    number: body.number,
  });

  person
    .save()
    .then((returnedPerson) => {
      response.json(returnedPerson);
    })
    .catch((error) => next(error));
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.log(error.message);

  if (error.name === "CastError") {
    response.status(400).send({ error: "id is malformed" });
  } else if (error.name === "ValidationError") {
    response.status(400).json({ error: error.message });
  }

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}.`);
});
