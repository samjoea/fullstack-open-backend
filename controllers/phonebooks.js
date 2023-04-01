import { Router } from 'express';
import { User } from '../model/phonebook.js';
import { errorLog, infoLog } from '../utils/logger.js';

const phoneBookRouter = Router();

phoneBookRouter.get('/', async (req, res) => {
  try {
    let result = await User.find({});
    res.json(result);
  } catch (error) {
    errorLog(error.message);
  }
});

phoneBookRouter.get('/info', async (req, res) => {
  try {
    let result = await User.find({});
    const info = {
      entries: result.length,
      date: new Date().toString()
    };
    res.send(
      `<p>Phonebook has info for ${info.entries} people</p>
        <p>${info.date}</p>
       `
    );
  } catch (error) {
    errorLog(error.message);
  }
});

phoneBookRouter.get('/:id', async (req, res, next) => {
  const id = req.params.id;
  // const personInfo = data.find(person => person.id === id);
  // personInfo ? res.json(personInfo) : res.status(404).end();
  try {
    let result = await User.findById(id);
    if(result) {
      res.json(result);
    } else {
      res.status(404).end();
    }
  } catch (error) {
    next(error);
  }
});

phoneBookRouter.put('/:id', async (req, res, next) => {
  const content = req.body;
  // if (!content) {
  //    return res.status(404)
  //       .json({ error: 'Content missing'});
  // };

  const id = req.params.id;
  try {
    await User.findByIdAndUpdate(id, content, {
      new: true,
      runValidators: true,
      context: 'query'
    });

    let result = await User.find({});
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

phoneBookRouter.delete('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const results = await User.findByIdAndRemove(id);
    res.json(results);
  } catch (error) {
    errorLog(error.message);
  }
  // const personInfo = data.filter(person => person.id !== id);
  // personInfo.length ? res.status(204).end() : res.status(404).end()
});

phoneBookRouter.post('/persons', async (req, res, next) => {
  const content = req.body;

  // if (!content) {
  //    return res.status(404)
  //    .json({ error: 'Content missing'});
  // };

  const persons = new User({
    name: content?.name,
    number: content?.number,
  });

  try {
    const newPerson = await persons.save();
    infoLog(newPerson);
    let result = await User.find({});
    res.json(result);

  } catch (error) {
    next(error);
  }
});

export { phoneBookRouter };