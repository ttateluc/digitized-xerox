import mongoose from 'mongoose';

const connectDB = (url) => { // Takes a URL for the MongoDB database to connect to
  mongoose.set('strictQuery', true); // Throws an error when a query is made with a field that is not defined in the schema
  mongoose.connect(url) // Connects to the MongoDB database specified by the url parameter
    .then(() => console.log('connected to mongo')) // If the connection is successful, this logs a message to the console
    .catch((err) => { // If the connection fails, this logs an error message and the error object to the console
      console.error('failed to connect with mongo');
      console.error(err);
    });
};

export default connectDB;
