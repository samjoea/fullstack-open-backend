import mongoose from 'mongoose';

mongoose.set('strictQuery', false);


const phoneBookSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    require: [true, 'User name required'],
  },
  number: {
    type: String,
    validate: {
      validator: function(v) {
        return /\d{3}-\d{3}-\d{4}/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    },
    required: [true, 'User phone number required']
  }
});


phoneBookSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

const User = mongoose.model('phonebook', phoneBookSchema);

export { User };