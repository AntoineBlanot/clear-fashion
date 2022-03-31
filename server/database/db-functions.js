const adresseparis = require('../products/products-adresseparis');
const montlimard = require('../products/products-montlimard');
const dedicatedbrand = require('../products/products-dedicatedbrand');

const { MongoClient, ServerApiVersion } = require('mongodb');

const URI = "mongodb+srv://user1:TpuZmxHYE0QeV8IK@clear-fashion.j8y68.mongodb.net/products?retryWrites=true&w=majority";
const  DATABASE_NAME = "clear-fashion";
const client = new MongoClient(URI, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function runTest() {
  try {
    await client.connect();

    const COLLECTION_NAME = "products";
    const collection = client.db(DATABASE_NAME).collection(COLLECTION_NAME);

    // create a document to insert
    const doc = {
      title: "Record of a Shriveled Datum",
      content: "No bytes, no problem. Just insert a document, in MongoDB",
    }
    const result = await collection.insertOne(doc);

    console.log(`A document was inserted with the _id: ${result.insertedId}`);
  } finally {
    await client.close();
  }
}

async function cleanCollection() {
  try {
    await client.connect();

    const COLLECTION_NAME = "products";
    const collection = client.db(DATABASE_NAME).collection(COLLECTION_NAME);

    const result = await collection.deleteMany({});

    console.log(`In ${DATABASE_NAME}/${COLLECTION_NAME} collection : all documents deleted ${result}`);
  } finally {
    await client.close();
  }
}

async function insertAdresseparisProducts() {

  const products = await adresseparis.getProducts;

  try {
    await client.connect();

    const COLLECTION_NAME = "products";
    const collection = client.db(DATABASE_NAME).collection(COLLECTION_NAME);

    const result = await collection.insertMany(products);

    console.log(`Documents added to the ${DATABASE_NAME}/${COLLECTION_NAME} collection : ${result.insertedIds}`);
  } finally {
    await client.close();
  }
}

async function insertMontlimardProducts() {

  const products = await montlimard.getProducts;

  try {
    await client.connect();

    const COLLECTION_NAME = "products";
    const collection = client.db(DATABASE_NAME).collection(COLLECTION_NAME);

    const result = await collection.insertMany(products);

    console.log(`Documents added to the ${DATABASE_NAME}/${COLLECTION_NAME} collection : ${result.insertedIds}`);
  } finally {
    await client.close();
  }
}

async function insertDedicatedbrandProducts() {
  const products = await dedicatedbrand.getProducts;
  console.log(products);

  try {
    await client.connect();

    const COLLECTION_NAME = "products";
    const collection = client.db(DATABASE_NAME).collection(COLLECTION_NAME);

    const result = await collection.insertMany(products);

    console.log(`Documents added to the ${DATABASE_NAME}/${COLLECTION_NAME} collection : ${result.insertedIds}`);
  } finally {
    await client.close();
  }
}
// cleanCollection();

// insertAdresseparisProducts().catch(console.dir);
// insertMontlimardProducts().catch(console.dir);
// insertDedicatedbrandProducts().catch(console.dir);