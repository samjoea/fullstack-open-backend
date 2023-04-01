import express from "express";
import morgan from "morgan";
import data from "./data.js";
import cors from "cors";
import { User as DBModel } from "./module/phonebook.js";

// const requestLogger = (request, response, next) => {
//    console.log('Method:', request.method)
//    console.log('Path:  ', request.path)
//    console.log('Body:  ', request.body)
//    console.log('---')
//    next();
//  }

const errorHandler = (error, request, response, next) => {
   console.error(error.message);
   console.log('Error: ', error.name)
      if(error.name === 'CastError') return response.status(400).send({ error: 'malFormatted id' });
      else if(error.name === 'ValidationError') return response.status(400).json({ error: error.message })

   next(error);
};
const unknownEndpoint = (request, response) => {
   response.status(404).send({ error: 'unknown endpoint' })
}


const app = express();
const port = process.env.PORT;

app.use(express.static('build'));
app.use(express.json());
app.use(cors());
morgan.token('data',(req, res) => { return JSON.stringify(req.body)})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

app.get('/api/persons', async (req, res) => {
   try {
      let result = await DBModel.find({});
      res.json(result);
   } catch (error) {
      console.log(error.message)
   }
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

app.get('/api/persons/:id', async (req, res, next) => {
   const id = req.params.id;
   // const personInfo = data.find(person => person.id === id);
   // personInfo ? res.json(personInfo) : res.status(404).end();
   try {
      let result = await DBModel.findById(id);
      if(result) {
         res.json(result);
      } else {
         res.status(404).end();
      }
   } catch (error) {
      next(error);
   }
});

app.put('/api/persons/:id', async (req, res, next) => {
   const content = req.body;
   // if (!content) {
   //    return res.status(404)
   //       .json({ error: 'Content missing'});
   // };

   const id = req.params.id;
   try {
      await DBModel.findByIdAndUpdate(id, content, {
         new: true,
         runValidators: true,
         context: 'query'
      });

      let result = await DBModel.find({});
      res.json(result);
   } catch (error) {
      return next(error);
   }
   // const personInfo = data.filter(person => person.id !== id);
   // const oldPerson = data.find(person => {
      
      //    // console.log('person', person.id)
   //    return person.id === id
   // });
   
   // // console.log('OldPerson: ', oldPerson)
   // // console.log('Id: ',id)
   
   // res.json(personInfo.concat({...oldPerson, ...content}));
});

app.delete('/api/persons/:id', async (req, res, next) => {
   const id = req.params.id;
   try {
      const results = await DBModel.findByIdAndRemove(id);
      res.json(results);
   } catch (error) {
      console.log(error.message);
   }
   // const personInfo = data.filter(person => person.id !== id);
   // personInfo.length ? res.status(204).end() : res.status(404).end()
});

app.post('/api/persons', async (req, res, next) => {
   const content = req.body;
   
   // if (!content) {
   //    return res.status(404)
   //    .json({ error: 'Content missing'});
   // };
   
   const persons = new DBModel({
      name: content?.name,
      number: content?.number,
   });

   try {
      const newPerson = await persons.save();
      console.log(newPerson);
      let result = await DBModel.find({});
      res.json(result);
      
   } catch (error) {
      next(error);
   }
});

app.use(unknownEndpoint);
app.use(errorHandler);

app.listen(port);
console.log(`listening on ${port}`);