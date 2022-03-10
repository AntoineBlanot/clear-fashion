const cors = require('cors');
const express = require('express');
const helmet = require('helmet');

const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require("mongodb").ObjectID;

const URI = "mongodb+srv://user1:TpuZmxHYE0QeV8IK@clear-fashion.j8y68.mongodb.net/products?retryWrites=true&w=majority";
const  DATABASE_NAME = "clear-fashion";
const client = new MongoClient(URI, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const PORT = 8092;

const app = express();
var database, collection;

module.exports = app;

app.use(require('body-parser').json());
app.use(cors());
app.use(helmet());

app.options('*', cors());

app.get('/', (request, response) => {
  response.send({'ack': true});
});

app.get('/products/:id', (request, response) => {
  collection.findOne({ "_id": request.params.id}, (error, result) => {
      if(error) {
          return response.status(500).send(error);
      }
      response.send(result);
  });
});

app.get('/products', (request, response) => {
  collection.find({ }).toArray((error, result) => {
      if(error) {
          return response.status(500).send(error);
      }
      response.send(result);
  });
});

app.get('/products/search', (request, response) => {
  console.log("In search");
  var limit, brand, price;
  if(req.query){
    limit = req.query.limit;
    brand = req.query.brand;
    price = req.query.price;
  }
  console.log(limit);
  console.log(brand);
  console.log(price);

  collection.find({ "brand": brand, "price": price}).sort({ price: 1 }).limit(limit).toArray((error, result) => {
      if(error) {
          return response.status(500).send(error);
      }
      response.send(result);
  });
});

app.listen(PORT, () => {
  client.connect((error, client) => {
    if(error) {
        throw error;
    }
    database = client.db(DATABASE_NAME);
    collection = database.collection("products");
    console.log("Connected to `" + DATABASE_NAME + "`!");
  });
});

console.log(`📡 Running on port ${PORT}`);
