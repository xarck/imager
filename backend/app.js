const express = require('express');
const cors = require('cors');

require('dotenv').config();
require('./config/db.config').connectDb(); // connect db

const userRoutes = require('./routes/user.route');
const imageRoutes = require('./routes/image.route');

const PORT = process.env.PORT;
const ORIGIN = process.env.CLIENT_URL;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({ origin: ORIGIN })); // secure true

app.use('/api/user', userRoutes);
app.use('/api/image', imageRoutes);

app.get('/', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.listen(PORT, (err) => {
  if (err) {
    console.log(`Can't listen on port ${PORT}`);
  } else {
    console.log(`Listening on PORT ${PORT}`);
  }
});
