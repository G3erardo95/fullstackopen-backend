require('dotenv').config()
const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require('cors')

app.use(cors())
app.use(express.static('build'))
app.use(express.json());
morgan.token("body", (req) => JSON.stringify(req.body));
app.use(morgan("tiny"));

const Person = require('./models/person');

app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

// app.get("/api/info", (request, response) => {
//   response.send(`<p>Phonebook has info for ${persons.length} people</p>  
//     ${new Date()}`);
// });

app.get("/api/persons/:id", (request, response) => {
  Person.findById(request.params.id).then((person) => {
    if (person) {
      response.json(person);
    } else {
      response.status(404).end();
    }
  });
});

// app.delete("/api/persons/:id", (request, response) => {
//   const id = Number(request.params.id);
//   persons = persons.filter((person) => person.id !== id);

//   response.status(204).end();
// });

// const generateId = () => {
//   const maxId = persons.length > 0 ? Math.max(...persons.map((n) => n.id)) : 0;
//   return maxId + 1;
// };

app.post("/api/persons", morgan(":body"), (request, response) => {
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

  const person = new Person ({
    name: body.name,
    number: body.number,
    date: new Date()
  });

  // persons = persons.concat(person);
  
  person.save().then(savedPerson => {
    response.json(savedPerson)
  });
});

const PORT = process.env.PORT 
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
