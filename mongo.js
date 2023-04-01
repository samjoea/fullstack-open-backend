import mongoose from 'mongoose';

const argumentLength = process.argv.length;
console.log(argumentLength);
if (argumentLength < 3) {
  console.log('give password as argument');
  process.exit(1);
}

if(argumentLength > 5) {
  console.log('enclosed name in quotes');
  process.exit(1);
}
const password = process.argv[2];
const name = process.argv[3];
const phoneNumber = process.argv[4];

const url = `mongodb+srv://fullStackOpen:${password}@cluster0.q4prcr2.mongodb.net/phonebook?retryWrites=true&w=majority`;

mongoose.set('strictQuery', false);
mongoose.connect(url);

const phoneBookSchema = new mongoose.Schema({
  name: String,
  phoneNumber: String,
});
const User = mongoose.model('phonebook', phoneBookSchema);

if(name && phoneNumber) {
  const details = new User({
    name,
    phoneNumber,
  });

  details.save().then((results) => {
    const { name, phoneNumber } = results;
    console.log(`added ${name} number ${phoneNumber} to ${results.db.name}`);
    mongoose.connection.close();
  });
} else {
  User.find({}).then(results => {
    console.log('phonebook:');
    results.forEach(contacts => console.log(`${contacts.name} ${contacts.phoneNumber}`));
    mongoose.connection.close();
  });
}