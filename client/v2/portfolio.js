// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
'use strict';

// current products on the page
let currentProducts = [];
let currentPagination = {};
let favoriteProducts = [];
let currentBrand = "Select a brand to filter";
let recentOnly = false;
let cheapOnly = false;

// instantiate the selectors
const selectSize = document.querySelector('#show-select');
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
const inputFavorite = document.querySelector("#fav-product");


/**
 * Set global value
 * @param {Array} result - products to display
 * @param {Object} meta - pagination meta info
 */
const setCurrentProducts = ({result, meta}) => {
  currentProducts = result.sort((p1, p2) => p1.price - p2.price);
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

    // const response = await fetch(
    //   `https://server-chi-gray.vercel.app/products/search?page=${page}&size=${size}`, 
    //   { headers: {origin: null} }
    // );

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
        <input type="checkbox" id="fav-product">fav</input>
        <span>${product.brand}</span>
        <a href="${product.link}" target="_blank">${product.name}</a>
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
    
  const pageCount = pagination.pageCount;
  const currentPage = pagination.currentPage;

  const options = Array.from(
    {'length': pageCount},
    (value, index) => `<option value="${index + 1}">${index + 1}</option>`
  ).join('');

  selectPage.innerHTML = options;
  selectPage.selectedIndex = currentPage - 1;
};

/**
 * Render indicators
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
 * Render brand filter selector
 * @param  {Array} products
 */
const renderBrandFilter = (products, defaultBrand="Select a brand to filter") => {
  var brands_name = [defaultBrand];
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
  const idx = brands_name.indexOf(currentBrand)
  selectBrand.selectedIndex = idx;
}


/**
 * Render the entire page
 */
const renderAll = () => {
  renderProducts(currentProducts);
  renderPagination(currentPagination);
  renderIndicators(currentPagination);
  renderBrandFilter(currentProducts);
};

/**
 * Declaration of all Listeners
 */


 document.addEventListener('DOMContentLoaded', async () => {
    const products = await fetchProducts();
  
    setCurrentProducts(products);
    renderAll(currentProducts, currentPagination);
  });

/**
 * Select the number of products (size/show) to display
 */
selectSize.addEventListener('change', async (event) => {
    if (currentPagination.currentPage * parseInt(event.target.value) >= currentPagination.count){
        fetchProducts(1, parseInt(event.target.value))
        .then(setCurrentProducts)
        .then(() => renderAll())
    }
    else {
        fetchProducts(currentPagination.currentPage, parseInt(event.target.value))
        .then(setCurrentProducts)
        .then(() => renderAll())
    }
});

/**
 * Select the page number to display
 */
selectPage.addEventListener('change', event => {
  fetchProducts(parseInt(event.target.value), currentPagination.pageSize)
    .then(setCurrentProducts)
    .then(() => renderAll(currentProducts, currentPagination))
});

/**
 * Select the brand to filter products by
 */
selectBrand.addEventListener('change', event => {
    currentBrand = event.target.value;
    if (currentBrand !== "Select a brand to filter") {
        currentProducts = currentProducts.filter(product => product.brand === currentBrand);
        renderAll(currentProducts, currentPagination);
    }
    else {
        fetchProducts(currentPagination.currentPage, currentPagination.pageSize)
        .then(setCurrentProducts)
        .then(() => renderAll(currentProducts, currentPagination));
    }
});

/**
 * Select the sorting method for displaying products
 */
selectSort.addEventListener('change', event => {
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

    renderAll(currentProducts, currentPagination);
});

/**
 * Select the filter to show only recent products
 */
inputRecentFilter.addEventListener('click', event => {
    recentOnly = inputRecentFilter.checked
    if (recentOnly) {
        // products that has been released in less than 14 days 
        currentProducts = currentProducts.filter(product => (Date.now() - new Date(product.released)) / (1000 * 60 * 60 * 24) <= 14);
        renderAll(currentProducts, currentPagination);
    }
    else {
        fetchProducts(currentPagination.currentPage, currentPagination.pageSize)
        .then(setCurrentProducts)
        .then(() => renderAll(currentProducts, currentPagination));
    }
});

/**
 * Select the filter to show only products below a given price
 */
inputPriceFilter.addEventListener('click', event => {
    cheapOnly = inputPriceFilter.checked
    if (cheapOnly) {
        // products that costs less than 50
        currentProducts = currentProducts.filter(product => product.price < 50);
        renderAll(currentProducts, currentPagination);
    }
    else {
        fetchProducts(currentPagination.currentPage, currentPagination.pageSize)
        .then(setCurrentProducts)
        .then(() => renderAll(currentProducts, currentPagination));
    }
});
