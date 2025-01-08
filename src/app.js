require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const routes = require('./routes');

console.log('Initializing application...');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/api', routes);

console.log('Middleware configured.');

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
