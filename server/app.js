require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const PORT = process.env.PORT || 3030;

// Configuration

const connectionString = process.env.CONNECTION_STRING;

mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Mongo connection error: '));

// Start server

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
})