require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");

app.use(cors());
app.use(express.static("build"));
app.use(express.json());
app.use(morgan("tiny"));
morgan.token("body", (req) => JSON.stringify(req.body));

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  switch (error.name) {
    case "CastError":
      return response.status(400).send({ error: "malformatted id" });
      break;
    case "ValidationError":
      return response.status(400).json({ error: error.message });
      break;
    case "ParallelSaveError":
      return response
        .status(409)
        .send({ error: "the instance of this document is already saving" });
      break;
    case "MongooseError":
      return response
        .status(500)
        .send({ error: "Mongoose generic error happened" });
    default:
      return response.status(500).send({ error: "generic error" });
  }

  next(error);
};

const Person = require("./models/person");

app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

app.get("/api/info", (request, response) => {
  Person.estimatedDocumentCount((err, count) => {
    response.send(`<p>Phonebook has info for ${count} people</p>  
    ${new Date()}`);
  });
});

app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.post("/api/persons", morgan(":body"), (request, response, next) => {
  const body = request.body;
  // const existingNames = persons.map((person) => (names = person.name));

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "name or number missing",
    });
    // } else if (existingNames.includes(body.name)) {
    //   return response.status(400).json({
    //     error: "name must be unique",
    //   });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
    date: new Date(),
  });

  // persons = persons.concat(person);

  person
    .save()
    .then((savedPerson) => {
      response.json(savedPerson);
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

// const generateId = () => {
//   const maxId = persons.length > 0 ? Math.max(...persons.map((n) => n.id)) : 0;
//   return maxId + 1;
// };

app.put("/api/persons/:id", (request, response, next) => {
  const { number } = request.body;

  Person.findByIdAndUpdate(
    request.params.id,
    { number },
    { new: true, runValidators: true, context: "query" }
  )
    .then((updatedPerson) => {
      response.json(updatedPerson);
    })
    .catch((error) => next(error));
});

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
