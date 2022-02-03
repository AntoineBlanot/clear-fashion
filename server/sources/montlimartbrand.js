const fetch = require('node-fetch');
const cheerio = require('cheerio');

// toute-la-collection.html
// pour naviguer entre les pages
// https://www.montlimart.com/toute-la-collection.html?p=2

/**
 * Parse webpage e-shop
 * @param  {String} data - html response
 * @return {Array} products
 */
const parse = data => {
  const $ = cheerio.load(data);

  return $('.category-products').find('li.item')
    .map((i, element) => {
      const name = $(element)
        .find('h2.product-name')
        .text()
        .trim()
        .replace(/\s/g, ' ');

      const link = $(element)
        .find('h2.product-name')
        .find('a')
        .attr('href');

      const price = parseInt(
        $(element)
          .find('div.price-box')
          .find('span.price')
          .text()
      );

      return {name, price, link};
    })
    .get();
};

/**
 * Scrape all the products for a given url page
 * @param  {[type]}  url
 * @return {Array|null}
 */
module.exports.scrape = async url => {
  try {
    const response = await fetch(url);

    if (response.ok) {
      const body = await response.text();

      return parse(body);
    }

    console.error(response);

    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
};
