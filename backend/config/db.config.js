const mongoose = require('mongoose');

const DB_URI = process.env.MONGODB_URI;

const connectDb = async () => {
  try {
    const connect = await mongoose.connect(DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(
      `MongoDB Connected: ${connect.connection.host}:${connect.connection.port}/${connect.connection.name}`
    );
  } catch (err) {
    console.log(`Error: ${err.message}`);
    process.exit(1);
  }
};

module.exports = { connectDb };
