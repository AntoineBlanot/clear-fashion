// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
'use strict';

console.log('🚀 This is it.');

const MY_FAVORITE_BRANDS = [{
  'name': 'Hopaal',
  'url': 'https://hopaal.com/'
}, {
  'name': 'Loom',
  'url': 'https://www.loom.fr'
}, {
  'name': 'ADRESSE',
  'url': 'https://adresse.paris/'
}];

console.table(MY_FAVORITE_BRANDS);
console.log(MY_FAVORITE_BRANDS[0]);



/**
 * 🌱
 * Let's go with a very very simple first todo
 * Keep pushing
 * 🌱
 */

// 🎯 TODO: The cheapest t-shirt
// 0. I have 3 favorite brands stored in MY_FAVORITE_BRANDS variable
// 1. Create a new variable and assign it the link of the cheapest t-shirt
// I can find on these e-shops
// 2. Log the variable

var cheapest_tshirt = "https://www.loom.fr/products/le-t-shirt";
console.log(`Cheapest t-shirt: ${cheapest_tshirt}`);


/**
 * 👕
 * Easy 😁?
 * Now we manipulate the variable `marketplace`
 * `marketplace` is a list of products from several brands e-shops
 * The variable is loaded by the file data.js
 * 👕
 */

// 🎯 TODO: Number of products
// 1. Create a variable and assign it the number of products
// 2. Log the variable

var marketplace_len = marketplace.length;
console.log(`Number of products : ${marketplace_len}`);


// 🎯 TODO: Brands name
// 1. Create a variable and assign it the list of brands name only
// 2. Log the variable
// 3. Log how many brands we have

var brands_name = [];
marketplace.forEach(place => {
  if (!brands_name.includes(place.brand)){
    brands_name.push(place.brand);
  }
});
console.log(`Brands names: ${brands_name}`);
console.log(`Number of brands: ${brands_name.length}`);


// 🎯 TODO: Sort by price
// 1. Create a function to sort the marketplace products by price
// 2. Create a variable and assign it the list of products by price from lowest to highest
// 3. Log the variable

function SortByPrice(array){
  return array.sort((x, y) => x.price - y.price);
}
var price_sorted_marketplace = SortByPrice(marketplace);
console.log(price_sorted_marketplace);


// 🎯 TODO: Sort by date
// 1. Create a function to sort the marketplace objects by products date
// 2. Create a variable and assign it the list of products by date from recent to old
// 3. Log the variable

function SortByDate(array){
  return array.sort((x, y) => Date.parse(y.date) - Date.parse(x.date));
}
var date_sorted_marketplace = SortByDate(marketplace);
console.log(date_sorted_marketplace);


// 🎯 TODO: Filter a specific price range
// 1. Filter the list of products between 50€ and 100€
// 2. Log the list

var price_range_filter = marketplace.filter(place => place.price >= 50 && place.price <= 100)
console.log(price_range_filter);


// 🎯 TODO: Average price
// 1. Determine the average price of the marketplace
// 2. Log the average

var average_marketplace = marketplace.map(place =>place.price).reduce((x, y) => x + y)/marketplace.length;
console.log(`Average basket of the marketplace: ${average_marketplace}`);


/**
 * 🏎
 * We are almost done with the `marketplace` variable
 * Keep pushing
 * 🏎
 */

// 🎯 TODO: Products by brands
// 1. Create an object called `brands` to manipulate products by brand name
// The key is the brand name
// The value is the array of products
//
// Example:
// const brands = {
//   'brand-name-1': [{...}, {...}, ..., {...}],
//   'brand-name-2': [{...}, {...}, ..., {...}],
//   ....
//   'brand-name-n': [{...}, {...}, ..., {...}],
// };
//
// 2. Log the variable
// 3. Log the number of products by brands

var brands_map = new Map();
marketplace.forEach(place => {
  if (brands_map.get(place.brand) == undefined) {
    brands_map.set(place.brand, [])
  }
  brands_map.get(place.brand).push(place);
})
var brands = Object.fromEntries(brands_map);
console.log(brands);


// 🎯 TODO: Sort by price for each brand
// 1. For each brand, sort the products by price, from highest to lowest
// 2. Log the sort

const brands_sort_price = Object.fromEntries(brands_map);
Object.values(brands_sort_price).forEach(product => product.sort((x, y) => y.price - x.price));
console.log(brands_sort_price);


// 🎯 TODO: Sort by date for each brand
// 1. For each brand, sort the products by date, from old to recent
// 2. Log the sort

// when I do the sort for this one, it changes the sort for the previous TODO, dont know why ?


/**
 * 💶
 * Let's talk about money now
 * Do some Maths
 * 💶
 */

// 🎯 TODO: Compute the p90 price value
// 1. Compute the p90 price value of each brand
// The p90 value (90th percentile) is the lower value expected to be exceeded in 90% of the products

const p90_values = {};
Object.keys(brands_sort_price).forEach(brand => {
  // retreive the p90 index in the list of product (since the products are already sorted higher price to lower price, it is equivalent to take its p10 index)
  var product_list = brands_sort_price[brand];
  var p90_index = Math.floor(product_list.length * (1 - 0.9));
  Object.defineProperty(p90_values, brand, { value: product_list[p90_index].price});
});

console.log(p90_values);


/**
 * 🧥
 * Cool for your effort.
 * It's almost done
 * Now we manipulate the variable `COTELE_PARIS`
 * `COTELE_PARIS` is a list of products from https://coteleparis.com/collections/tous-les-produits-cotele
 * 🧥
 */

const COTELE_PARIS = [
  {
    link: 'https://coteleparis.com//collections/tous-les-produits-cotele/products/la-baseball-cap-gris',
    price: 45,
    name: 'BASEBALL CAP - TAUPE',
    uuid: 'af07d5a4-778d-56ad-b3f5-7001bf7f2b7d',
    released: '2021-01-11'
  },
  {
    link: 'https://coteleparis.com//collections/tous-les-produits-cotele/products/la-chemise-milleraie-navy',
    price: 85,
    name: 'CHEMISE MILLERAIE MIXTE - NAVY',
    uuid: 'd62e3055-1eb2-5c09-b865-9d0438bcf075',
    released: '2020-12-21'
  },
  {
    link: 'https://coteleparis.com//collections/tous-les-produits-cotele/products/la-veste-fuchsia',
    price: 110,
    name: 'VESTE - FUCHSIA',
    uuid: 'da3858a2-95e3-53da-b92c-7f3d535a753d',
    released: '2020-11-17'
  },
  {
    link: 'https://coteleparis.com//collections/tous-les-produits-cotele/products/la-baseball-cap-camel',
    price: 45,
    name: 'BASEBALL CAP - CAMEL',
    uuid: 'b56c6d88-749a-5b4c-b571-e5b5c6483131',
    released: '2020-10-19'
  },
  {
    link: 'https://coteleparis.com//collections/tous-les-produits-cotele/products/la-chemise-milleraie-beige',
    price: 85,
    name: 'CHEMISE MILLERAIE MIXTE - BEIGE',
    uuid: 'f64727eb-215e-5229-b3f9-063b5354700d',
    released: '2021-01-11'
  },
  {
    link: 'https://coteleparis.com//collections/tous-les-produits-cotele/products/la-veste-rouge-vermeil',
    price: 110,
    name: 'VESTE - ROUGE VERMEIL',
    uuid: '4370637a-9e34-5d0f-9631-04d54a838a6e',
    released: '2020-12-21'
  },
  {
    link: 'https://coteleparis.com//collections/tous-les-produits-cotele/products/la-chemise-milleraie-bordeaux',
    price: 85,
    name: 'CHEMISE MILLERAIE MIXTE - BORDEAUX',
    uuid: '93d80d82-3fc3-55dd-a7ef-09a32053e36c',
    released: '2020-12-21'
  },
  {
    link: 'https://coteleparis.com//collections/tous-les-produits-cotele/products/le-bob-dylan-gris',
    price: 45,
    name: 'BOB DYLAN - TAUPE',
    uuid: 'f48810f1-a822-5ee3-b41a-be15e9a97e3f',
    released: '2020-12-21'
  }
]

// 🎯 TODO: New released products
// // 1. Log if we have new products only (true or false)
// // A new product is a product `released` less than 2 weeks.

var new_released = COTELE_PARIS.map(product => { 
  var days = (Date.now() - new Date(product.date)) / (1000 * 60 * 60 * 24);
  return days <= 14;
})
console.log(new_released.every(v => v == true));


// 🎯 TODO: Reasonable price
// // 1. Log if coteleparis is a reasonable price shop (true or false)
// // A reasonable price if all the products are less than 100€

var reasoable_price = COTELE_PARIS.map(product => product.price < 100);
console.log(reasoable_price.every(v => v === true));


// 🎯 TODO: Find a specific product
// 1. Find the product with the uuid `b56c6d88-749a-5b4c-b571-e5b5c6483131`
// 2. Log the product

var product = COTELE_PARIS.filter(p => p.uuid === 'b56c6d88-749a-5b4c-b571-e5b5c6483131')[0];
console.log(product);


// 🎯 TODO: Delete a specific product
// 1. Delete the product with the uuid `b56c6d88-749a-5b4c-b571-e5b5c6483131`
// 2. Log the new list of product

var new_COTELE_PARIS = COTELE_PARIS.filter(p => p.uuid !== 'b56c6d88-749a-5b4c-b571-e5b5c6483131');
console.log(new_COTELE_PARIS);


// 🎯 TODO: Save the favorite product
let blueJacket = {
  'link': 'https://coteleparis.com/collections/tous-les-produits-cotele/products/la-veste-bleu-roi',
  'price': 110,
  'uuid': 'b4b05398-fee0-4b31-90fe-a794d2ccfaaa'
};

// we make a copy of blueJacket to jacket
// and set a new property `favorite` to true
let jacket = blueJacket;

jacket.favorite = true;

// 1. Log `blueJacket` and `jacket` variables
// 2. What do you notice?

console.log(blueJacket);
console.log(jacket);

// we observe that blueJacket has also the new property 'favorite' even if it was only declared on 
// the jacket variable
// we can assume that jacket is not a deep copy of blueJacket but maybe just a pointer (reference) to blueJacket variable

blueJacket = {
  'link': 'https://coteleparis.com/collections/tous-les-produits-cotele/products/la-veste-bleu-roi',
  'price': 110,
  'uuid': 'b4b05398-fee0-4b31-90fe-a794d2ccfaaa'
};

// 3. Update `jacket` property with `favorite` to true WITHOUT changing blueJacket properties

jacket = JSON.parse(JSON.stringify(blueJacket)); 
jacket.favorite = true;

console.log(blueJacket);
console.log(jacket);
// now, blueJacket is not changed, because we made a deep copy of it


/**
 * 🎬
 * The End
 * 🎬
 */

// 🎯 TODO: Save in localStorage
// 1. Save MY_FAVORITE_BRANDS in the localStorage
// 2. log the localStorage

Object.assign(localStorage, {'fav brands' : MY_FAVORITE_BRANDS});
console.log(localStorage);
