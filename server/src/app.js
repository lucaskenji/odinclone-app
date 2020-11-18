require('dotenv').config({ path: '../.env' });
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const api = require('./routes/api');
const cors = require('cors');
const PORT = process.env.PORT || 3030;
const passport = require('passport');
const session = require('express-session');
const cookieParser = require('cookie-parser');

// Configuration
const connectionString = process.env.CONNECTION_STRING;

mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Mongo connection error: '));

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  exposedHeaders: 'csrf'
}));

app.use(cookieParser());

require('./config/passport.config.js');

app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.SESSION_SECRET
}));
app.use(passport.initialize());
app.use(passport.session());


app.use(express.json());
app.use('/api/', api);


// Start server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
})