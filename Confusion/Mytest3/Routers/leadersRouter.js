const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate=require('../authenticate');

//const Dishes = require('../models/dishes');
const Leaders = require('../models/leaders');


const leadersRouter = express.Router();

leadersRouter.use(bodyParser.json());

leadersRouter.route('/')
.get((req,res,next) => {
    Leaders.find({})
    .then((dish) =>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leaders);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUIser,(req, res, next) => {
    Leaders.create(req.body)
    .then((dish) =>{
        console.log('Dish Created ', dish);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leaders);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(authenticate.verifyUIser,(req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /leaders');
})
.delete(authenticate.verifyUIser,(req, res, next) => {
    Leaders.remove({})
    .then((resp) =>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);   
    }, (err) => next(err))
    .catch((err) => next(err)); 
})
leadersRouter.route('/:leadersId')
.get((req,res,next) =>{
    Leaders.findById(req.params.leadersId)
    .then((dish) =>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leaders);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUIser,(req,res,next) =>{
    res.statusCode = 403;
    res.end('POST operation not supported on /leaders/ '
            +req.params.dishId);
})
.put(authenticate.verifyUIser,(req,res,next) =>{
    Leaders.findByIdAndUpdate(req.params.leadersId, {
        $set: req.body
    }, { new: true})
    .then((dish) =>{
        console.log('Dish Created ', dish);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leaders);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(authenticate.verifyUIser,(req,res,next) =>{
    Leaders.findByIdAndRemove(req.params.leadersId)
    .then((dish) =>{
        console.log('Dish Created ', dish);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leaders);
    }, (err) => next(err))
    .catch((err) => next(err));
});

leadersRouter.route('/:leadersId/comments')
.get((req,res,next) => {
    Leaders.findById(req.params.leadersId)
    .then((dish) =>{
        if (dish != null){
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish.comments);
        }
        else {
            err = new Error('Dish ' + req.params.leadersId + 'not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUIser,(req, res, next) => {
    Leaders.findById(req.params.leadersId)
    .then((dish) =>{
        if (dish != null){
            dish.comments.push(req.body);
            dish.save()
            .then((dish) =>{
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);
            }, (err) => next(err));
        }
            else {
                err = new Error('Dish ' + req.params.leadersId + 'not found');
                err.status = 404;
                return next(err);
            }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(authenticate.verifyUIser,(req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /leaders'
        + req.params.dishId + '/comments');
})
.delete(authenticate.verifyUIser,(req, res, next) => {
    Leaders.findById(req.params.leadersId)
    .then((dish) =>{
        if (dish != null){
           for (var i = (dish.comments.length-1); i >=0; i--){
               dish.comments.id(dish.comments[i]._id).remove();
           }
           dish.save()
           .then((dish) =>{
               res.statusCode = 200;
               res.setHeader('Content-Type', 'application/json');
               res.json(dish);
           }, (err) => next(err));
        }
        else {
                err = new Error('Dish ' + req.params.leadersId + 'not found');
                err.status = 404;
                return next(err);
            }
    }, (err) => next(err))
    .catch((err) => next(err)); 
})
leadersRouter.route('/:leadersId/comments/:commentId')
.get((req,res,next) =>{
    Leaders.findById(req.params.leadersId)
    .then((dish) =>{
        if (dish != null && dish.comments.id(req.params.commentId) !=null){
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(dish.comments.id(req.params.commentId));
            }
            else if (dish == null) {
                err = new Error('Dish ' + req.params.dishId + 'not found');
                err.status = 404;
                return next(err);
            }
            else{
                err = new Error('Comment ' + req.params.commentId + ' not found');
                err.status = 404;
                return next(err);       
            }    
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUIser,(req,res,next) => { 
    res.statusCode = 403;
    res.end('POST operation not supported on /leaders/ '
            +req.params.dishId + '/comments/' +  req.params.commentId);
})
.put(authenticate.verifyUIser,(req,res,next) => {
    Leaders.findById(req.params.leadersId)
    .then((dish) =>{
        if (dish != null && dish.comments.id(req.params.commentId) !=null){
            if(req.body.rating) {
                dish.comments.id(req.params.commentId).rating = req.body.rating;
            }
            if (dish.body.comment) {
                dish.comments.id(req.params.commentId).comment = req.body.comment;
            }
            dish.save()
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);
            }, (err) => next(err));
            }
            else if (dish == null) {
                err = new Error('Dish ' + req.params.leadersId + 'not found');
                err.status = 404;
                return next(err);
            }
            else{
                err = new Error('Comment ' + req.params.commentId + ' not found');
                err.status = 404;
                return next(err);       
            }    
    }, (err) => next(err))
})
.delete(authenticate.verifyUIser,(req,res,next) =>{
    Leaders.findById(req.params.leadersId)
    .then((dish) =>{
        if (dish != null  && dish.comments.id(req.params.commentId) !=null){
            dish.comments.id(req.params.commentId).remove();
            dish.save()
           .then((dish) =>{
               res.statusCode = 200;
               res.setHeader('Content-Type', 'application/json');
               res.json(dish);
           }, (err) => next(err));
        }
        else if (dish == null) {
            err = new Error('Dish ' + req.params.leadersId + 'not found');
            err.status = 404;
            return next(err);
        }
        else{
            err = new Error('Comment ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err);       
        } 
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = leadersRouter;