const express = require('express');
const bodyParser = require('body-parser');

const leardersRouter = express.Router();

leardersRouter.use(bodyParser.json());

leardersRouter.route('/')
.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req,res,next) => {
    res.end('Will send all the leaders to you!');
})
.post((req, res, next) => {
    res.end('Will add the leader: ' + req.body.name + 'with details:' + req.body.description);
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /leaders');
})
.delete((req, res, next) => {
    res.end('Deleting all leaders');
});

//For LeaderId routing functionality

leardersRouter.route('/:leaderId')
.get((req,res,next) => {
    res.end('Will send the deatils of the leader: '+ req.params.leaderId  + 'to you!');
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end('Post operation not supported on /leaders/' + req.params.leaderId);
})
.put((req, res, next) => {
    
    res.end('Updating the leader: ' + req.params.leaderId  + '</br>'+ 'Will updating the leader:' + req.body.name + 'with details:'+ req.body.description);
    
    
})
.delete((req, res, next) => {
    res.end('Deleting the leader:' + req.params.leaderId);
});

module.exports = leardersRouter;