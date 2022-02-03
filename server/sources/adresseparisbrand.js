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

  return $('ul.product_list.grid.row').find('div.right-block')
    .map((i, element) => {
      const name = $(element)
        .find('h5.product-name-container.versionpc')
        .find('a.product-name')
        .attr('title');

      const link = $(element)
        .find('h5.product-name-container.versionpc')
        .find('a.product-name')
        .attr('href');

      const price = parseInt(
        $(element)
          .find('div.prixright')
          .find('span.price.product-price')
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
