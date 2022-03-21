"use strict";

// Import the dependency.
const clientPromise = require('./mongodb-client');
const ObjectId = require("mongodb").ObjectID;
const express = require('express');
const app = express();

const { calculateLimitAndOffset, paginate } = require('paginate-info');

const  DATABASE_NAME = "clear-fashion";
var collection, client;


app.get('/', async (request, response) => {
    client = await clientPromise;
    collection = await client.db(DATABASE_NAME).collection("products");
    console.log("Connected to `" + DATABASE_NAME + "`!");
    response.send({'ack': true, 'dbConnection' : true, 'dbName': client.db().databaseName});
});

app.get('/products/search', async (request, response) => {
    var filters = {};
    var brand, price;
    const size = parseInt(request.query.size, 10) || 12;
    const page = parseInt(request.query.page, 10) || 1;
  
    if(request.query.brand !== undefined){
      brand = request.query.brand,
      filters["brand"] = brand;
    }
    if(request.query.price !== undefined){
      price = parseInt(request.query.price, 10);
      filters["price"] = {$lte: price};
    }

    const { limit, offset } = calculateLimitAndOffset(page, size);
    const count = await collection.count();

    await collection.find(filters).sort({ price: 1 }).skip(offset).limit(limit).toArray((error, result) => {
        if(error) {
            return response.status(500).send(error);
        }
        response.send({"results": result, "meta": paginate(page, count, result, limit)});
      });
});

app.get('/products/:id', async (request, response) => {
    await collection.findOne({ "_id": new ObjectId(request.params.id)}, (error, result) => {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result);
    });
  });

app.get('/products', async (request, response) => {
    console.log(client.db().databaseName);
    await collection.find({ }).toArray((error, result) => {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result);
    });
});

module.exports = app;