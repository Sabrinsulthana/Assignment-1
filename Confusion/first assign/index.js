//Import File section
const express = require('express')
const http = require('http');
const morgan = require('morgan');
const dishRouter = require('./routes/dishRouter'); //dish router module
const promoRouter = require('./routes/promoRouter'); //promotions router module
const leardersRouter = require('./routes/leaderRouter'); //leaders router module

const hostname = 'localhost'; //localhsot 127.0.0.1
const port = 3000;
const app = express(); //app declaration



app.use(morgan('dev'));
app.use(express.static(__dirname + '/public'));
app.use('/dishes', dishRouter);
app.use('/promotions', promoRouter);
app.use('/leaders',leardersRouter);



app.use((req, res, next) => {
  console.log(req.headers);
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  res.end('<html><body><h1>This is an Express Server For Development</h1></body></html>');

});

const server = http.createServer(app);

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});