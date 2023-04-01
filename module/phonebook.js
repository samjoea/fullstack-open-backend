import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();
mongoose.set('strictQuery', false);

// eslint-disable-next-line no-undef
const url = process.env.MONGODB_URI;

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

const User = mongoose.model('phonebook', phoneBookSchema);

phoneBookSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

const connectDB = async () => {
  try {
    await mongoose.connect(url);
    console.log('connected to MongoDB');
    return User;
  } catch (error) {
    console.log('error connecting to MongoDB: ', error.message);
  }
};
connectDB();

export { User };