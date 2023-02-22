const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();
mongoose.set('strictQuery', false);

const { MONGO_DB_URI, MONGO_DB_URI_TEST, NODE_ENV } = process.env;

const connectionString = NODE_ENV === 'test' ? MONGO_DB_URI_TEST : MONGO_DB_URI;
const connectToDatabase = async () => {
  if (!connectionString) {
    throw new Error('Please add the MONGO_DB_URI environment variable');
  }

  try {
    mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }, (err) => {
      if (err) throw err;
    });
  } catch (error) {
    console.error('Failed to connect to database:', error);
  }
};

const db = mongoose.connection;

db.on('error', console.error.bind(console, '❌ mongodb connection error'));

db.once('open', () => {
  console.log('✅ mongodb connected successfully!');
  db.collection('gateways').createIndex(
    { 'peripheralDevices.uid': 1 },
    { unique: true, partialFilterExpression: { 'peripheralDevices.uid': { $exists: true } } },
  );
});

mongoose.Promise = Promise;

module.exports = {
  connectToDatabase,
  db,
};
