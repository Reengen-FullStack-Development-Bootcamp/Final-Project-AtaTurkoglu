const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const user = require('./router/user');
const dataTable = require('./router/dataTable');

dotenv.config();
const app = express();
app.use(
  cors({
    origin: '*',
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/user', user);
app.use('/dashboard/datatable', dataTable);

mongoose.connect(
  process.env.MONGODB_DATABASE,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log('Connected to MongoDB database');
    }
  }
);

app.listen(process.env.MONGODB_PORT, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log('Port: ' + process.env.MONGODB_PORT + ' listening...');
  }
});
