const serverless = require('serverless-http');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept',
  );
  next();
});

app.get('/', (req, res) => {
  res.send('Hello');
});

app.post('/register', (req, res) => {
  const { body } = req;
  console.log(body);
  res.send('Hello');
});

const port = '8080';
app.listen(port, () => {
  console.log(`app start listening on port ${port}`);
});

module.exports.handler = serverless(app);
