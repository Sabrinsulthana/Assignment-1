const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate=require('../authenticate');

//const Dishes = require('../models/dishes');
const Promos = require('../models/promos')


const promosRouter = express.Router();

promosRouter.use(bodyParser.json());

promosRouter.route('/')
.get((req,res,next) => {
    Promos.find({})
    .then((dish) =>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promos);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser,(req, res, next) => {
    Promos.create(req.body)
    .then((dish) =>{
        console.log('Dish Created ', dish);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promos);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(authenticate.verifyUser,(req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /promos');
})
.delete(authenticate.verifyUser,(req, res, next) => {
    Promos.remove({})
    .then((resp) =>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);   
    }, (err) => next(err))
    .catch((err) => next(err)); 
})
promosRouter.route('/:promosId')
.get((req,res,next) =>{
    Promos.findById(req.params.promosId)
    .then((dish) =>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promos);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser,(req,res,next) =>{
    res.statusCode = 403;
    res.end('POST operation not supported on /promos/ '
            +req.params.promosId);
})
.put(authenticate.verifyUser,(req,res,next) =>{
    Promos.findByIdAndUpdate(req.params.promosId, {
        $set: req.body
    }, { new: true})
    .then((dish) =>{
        console.log('Dish Created ', dish);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promos);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(authenticate.verifyUser,(req,res,next) =>{
    Promos.findByIdAndRemove(req.params.promosId)
    .then((dish) =>{
        console.log('Dish Created ', dish);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promos);
    }, (err) => next(err))
    .catch((err) => next(err));
});

promosRouter.route('/:promosId/comments')
.get((req,res,next) => {
    Promos.findById(req.params.promosId)
    .then((dish) =>{
        if (dish != null){
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish.comments);
        }
        else {
            err = new Error('Dish ' + req.params.promosId + 'not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser,(req, res, next) => {
    Promos.findById(req.params.promosId)
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
                err = new Error('Dish ' + req.params.promosId + 'not found');
                err.status = 404;
                return next(err);
            }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(authenticate.verifyUser,(req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /promos'
        + req.params.promosId + '/comments');
})
.delete(authenticate.verifyUser,(req, res, next) => {
    Promos.findById(req.params.promosId)
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
                err = new Error('Dish ' + req.params.promosId + 'not found');
                err.status = 404;
                return next(err);
            }
    }, (err) => next(err))
    .catch((err) => next(err)); 
})
promosRouter.route('/:promosId/comments/:commentId')
.get((req,res,next) =>{
    Promos.findById(req.params.promosId)
    .then((dish) =>{
        if (dish != null && dish.comments.id(req.params.commentId) !=null){
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(dish.comments.id(req.params.commentId));
            }
            else if (dish == null) {
                err = new Error('Dish ' + req.params.promosId + 'not found');
                err.status = 404;
                return next(err);
            }
            else{
                err = new Error('Comment ' + req.params.promosId + ' not found');
                err.status = 404;
                return next(err);       
            }    
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser,(req,res,next) => { 
    res.statusCode = 403;
    res.end('POST operation not supported on /promos/ '
            +req.params.promosId + '/comments/' +  req.params.commentId);
})
.put(authenticate.verifyUser,(req,res,next) => {
    Promos.findById(req.params.promosId)
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
                err = new Error('Dish ' + req.params.promosId + 'not found');
                err.status = 404;
                return next(err);
            }
            else{
                err = new Error('Comment ' + req.params.promosId + ' not found');
                err.status = 404;
                return next(err);       
            }    
    }, (err) => next(err))
})
.delete(authenticate.verifyUser,(req,res,next) =>{
    Promos.findById(req.params.promosId)
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
            err = new Error('Dish ' + req.params.promosId + 'not found');
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

module.exports = promosRouter;