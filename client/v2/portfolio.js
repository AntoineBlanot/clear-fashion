// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
'use strict';

// current products on the page
let currentProducts = [];
let currentPagination = {};

// instantiate the selectors
const selectShow = document.querySelector('#show-select');
const selectPage = document.querySelector('#page-select');
const selectBrand = document.querySelector('#brand-select');
const selectSort = document.querySelector('#sort-select');

const sectionProducts = document.querySelector('#products');

const spanNbProducts = document.querySelector('#nbProducts');
const spanNbNewProducts = document.querySelector('#nbNewProducts');
const spanp50 = document.querySelector("#p50");
const spanp90 = document.querySelector("#p90");
const spanp95 = document.querySelector("#p95");
const spanLastRelease = document.querySelector("#last-release");

const inputRecentFilter = document.querySelector('#recent-filter');
const inputPriceFilter = document.querySelector("#price-filter");

/**
 * Set global value
 * @param {Array} result - products to display
 * @param {Object} meta - pagination meta info
 */
const setCurrentProducts = ({result, meta}) => {
  currentProducts = result;
  currentPagination = meta;
};

/**
 * Fetch products from api
 * @param  {Number}  [page=1] - current page to fetch
 * @param  {Number}  [size=12] - size of the page
 * @return {Object}
 */
const fetchProducts = async (page = 1, size = 12) => {
  try {
    const response = await fetch(
      `https://clear-fashion-api.vercel.app?page=${page}&size=${size}`
    );
    const body = await response.json();

    if (body.success !== true) {
      console.error(body);
      return {currentProducts, currentPagination};
    }

    return body.data;
  } catch (error) {
    console.error(error);
    return {currentProducts, currentPagination};
  }
};

/**
 * Render list of products
 * @param  {Array} products
 */
const renderProducts = products => {
  const fragment = document.createDocumentFragment();
  const div = document.createElement('div');
  const template = products
    .map(product => {
      return `
      <div class="product" id=${product.uuid}>
        <span>${product.brand}</span>
        <a href="${product.link}">${product.name}</a>
        <span>${product.price}</span>
      </div>
    `;
    })
    .join('');

  div.innerHTML = template;
  fragment.appendChild(div);
  sectionProducts.innerHTML = '<h2>Products</h2>';
  sectionProducts.appendChild(fragment);
};

/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderPagination = pagination => {
  const {currentPage, pageCount} = pagination;
  const options = Array.from(
    {'length': pageCount},
    (value, index) => `<option value="${index + 1}">${index + 1}</option>`
  ).join('');

  selectPage.innerHTML = options;
  selectPage.selectedIndex = currentPage - 1;
};

/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderIndicators = pagination => {
  const {count} = pagination;

  spanNbProducts.innerHTML = count;
  spanNbNewProducts.innerHTML = currentProducts.filter(product => (Date.now() - new Date(product.released)) / (1000 * 60 * 60 * 24) <= 14).length;
  
  spanp50.innerHTML = currentProducts.sort((p1, p2) => p1.price - p2.price)[Math.floor(currentProducts.length * 0.5)].price;
  spanp90.innerHTML = currentProducts.sort((p1, p2) => p1.price - p2.price)[Math.floor(currentProducts.length * 0.9)].price;
  spanp95.innerHTML = currentProducts.sort((p1, p2) => p1.price - p2.price)[Math.floor(currentProducts.length * 0.95)].price;

  spanLastRelease.innerHTML = currentProducts.sort((p1, p2) => Date.parse(p2.released) - Date.parse(p1.released))[0].released;
};

/**
 * Render page selector
 * @param  {Array} products
 */
const renderBrandFilter = (products, brand = "all") => {
  var brands_name = ["all"];
  products.forEach(product => {
    if (!brands_name.includes(product.brand)){
      brands_name.push(product.brand);
  }
  });
  
  const options = Array.from(
    {'length': brands_name.length},
    (value, index) => `<option value="${brands_name[index]}">${brands_name[index]}</option>`)
    .join('')
    
  selectBrand.innerHTML = options;
  const idx = brands_name.indexOf(brand)
  selectBrand.selectedIndex = idx;
}

/**
 * Render page selector
 * @param  {boolean} isClicked
 */
const renderRecentFilter = (isClicked) => {
  inputRecentFilter.checked = isClicked;
}

/**
 * Render page selector
 * @param  {boolean} isClicked
 */
const renderPriceFilter = (isClicked) => {
  inputPriceFilter.checked = isClicked;
}


const render = (products, pagination, brand="all", recentFilter=false, priceFilter=false) => {
  renderProducts(products);
  renderPagination(pagination);
  renderIndicators(pagination);
  renderBrandFilter(products, brand);
  renderRecentFilter(recentFilter);
  renderPriceFilter(priceFilter);
};

/**
 * Declaration of all Listeners
 */

/**
 * Select the number of products to display
 * @type {[type]}
 */
selectShow.addEventListener('change', event => {
  fetchProducts(currentPagination.currentPage, parseInt(event.target.value))
    .then(setCurrentProducts)
    .then(() => render(currentProducts, currentPagination));
});

document.addEventListener('DOMContentLoaded', async () => {
  const products = await fetchProducts();

  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});

selectPage.addEventListener('change', event => {
  fetchProducts(parseInt(event.target.value), parseInt(selectShow.value))
    .then(setCurrentProducts)
    .then(() => render(currentProducts, currentPagination))
});

selectBrand.addEventListener('change', event => {
  fetchProducts(currentPagination.currentPage, currentPagination.currentPagination).then(setCurrentProducts);
  const brand = event.target.value;
  if (brand != "all")
    currentProducts = currentProducts.filter(product => product.brand === event.target.value);

  render(currentProducts, currentPagination, brand);
});

selectSort.addEventListener('change', event => {
  fetchProducts(currentPagination.currentPage, currentPagination.currentPagination).then(setCurrentProducts);
  const sort = event.target.value;
  switch (sort) {
    case "price-asc":
      currentProducts.sort((p1, p2) => p1.price - p2.price);
      break;
    case "price-desc":
      currentProducts.sort((p1, p2) => p2.price - p1.price);
      break;
    case "date-asc":
      currentProducts.sort((p1, p2) => Date.parse(p2.released) - Date.parse(p1.released));
      break;
    case "date-desc":
      currentProducts.sort((p1, p2) => Date.parse(p1.released) - Date.parse(p2.released));
      break;
  }
  render(currentProducts, currentPagination);
});

inputRecentFilter.addEventListener('click', event => {
  fetchProducts(currentPagination.currentPage, currentPagination.currentPagination).then(setCurrentProducts);
  const isChecked = inputRecentFilter.checked
  if (isChecked) {
    currentProducts = currentProducts.filter(product => (Date.now() - new Date(product.released)) / (1000 * 60 * 60 * 24) <= 14);
  }
  render(currentProducts, currentPagination);
  renderRecentFilter(isChecked);
});

inputPriceFilter.addEventListener('click', event => {
  fetchProducts(currentPagination.currentPage, currentPagination.currentPagination).then(setCurrentProducts);
  const isChecked = inputPriceFilter.checked
  if (isChecked) {
    currentProducts = currentProducts.filter(product => product.price < 50);
  }
  render(currentProducts, currentPagination);
  renderPriceFilter(isChecked);
});
