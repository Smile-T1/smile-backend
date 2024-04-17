const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
    // useCreateIndex: true
});

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB!');
})

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());

function loadRoutes(directory) {
    fs.readdirSync(directory).forEach((file) => {
      const filePath = path.join(directory, file);
      const route = require(filePath);
      app.use('/', route);
    });
}
  
  
// Load routes from the 'routes' directory
const routesDirectory = path.join(__dirname, 'routes');
loadRoutes(routesDirectory);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
module.exports = app;