import express from "express";
import morgan from "morgan";
import data from "./data.js";
import cors from "cors";

// const requestLogger = (request, response, next) => {
//    console.log('Method:', request.method)
//    console.log('Path:  ', request.path)
//    console.log('Body:  ', request.body)
//    console.log('---')
//    next();
//  }

const app = express();
const port = process.env.PORT || 3001;


app.use(express.json());
morgan.token('data',(req, res) => { return JSON.stringify(req.body)})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))
app.use(cors());
app.use(express.static('build'));

app.get('/api/persons', (req, res) => {
   res.json(data);
});

app.get('/info', (req, res) => {
  const info = {
   entries: data.length,
   date: new Date().toString()
  }
   res.send(
      `<p>Phonebook has info for ${info.entries} people</p>
      <p>${info.date}</p>
      `
   );
});

app.get('/api/persons/:id', (req, res) => {
   const id = Number(req.params.id);
   const personInfo = data.find(person => person.id === id);
   
   personInfo ? res.json(personInfo) : res.status(404).end()
});

app.put('/api/persons/:id', (req, res) => {
   const content = req.body;
   // console.log(content);
   if (!content) {
      return res.status(404)
         .json({ error: 'Content missing'});
   };

   const id = Number(req.params.id);
   const personInfo = data.filter(person => person.id !== id);
   const oldPerson = data.find(person => {

      // console.log('person', person.id)
      return person.id === id
   });

   // console.log('OldPerson: ', oldPerson)
   // console.log('Id: ',id)

   res.json(personInfo.concat({...oldPerson, ...content}));
});

app.delete('/api/persons/:id', (req, res) => {
   const id = Number(req.params.id);
   const personInfo = data.filter(person => person.id !== id);
   personInfo.length ? res.status(204).end() : res.status(404).end()
});

app.post('/api/persons', (req, res) => {
   const content = req.body;
   // console.log(content);
   if (!content) {
      return res.status(404)
         .json({ error: 'Content missing'});
   }

   const newPerson = {
      id: Math.floor(1 + Math.random()*20),
      name: content?.name,
      number: content?.number,
   }
   res.json(data.concat(newPerson));
});

app.listen(port);
console.log(`listening on ${port}`);