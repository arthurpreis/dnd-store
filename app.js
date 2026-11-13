let products = [];
let filteredProducts = [];
const productsBody = document.getElementById("products-body");
const detailsPanel = document.getElementById("details-panel");
const detailsContent = document.getElementById("details-content");
const body = document.getElementById("body");
const searchForm = document.getElementById("search");
const searchButton = document.getElementById("search-button");
const productCount = document.getElementById("product-count");
let productCountNumber = 20;
let result = {};
let page = 1;

async function downloadItems() {
  // https://api.open5e.com/v2/creatures/?limit=10
  const response = await fetch(
    `https://api.open5e.com/v2/items/?limit=20&page=${page}`,
  );
  result = await response.json();
  console.log(result);
  products = result.results;
}

async function submitQuery() {
  let searchUrl = "https://api.open5e.com/v2/items/?name__icontains=";
  searchUrl += String(searchForm.value).toLowerCase().trim();
  const response = await fetch(searchUrl);
  result = await response.json();
  console.log(result);
  page = 1;
  products = result.results;

}

function renderPageCounter() {
  productCount.replaceChildren();
  if (page > 1) {
    const prevPage = document.createElement("button");
    prevPage.textContent = "<";
    prevPage.addEventListener("click", () => {
      if (page > 1) {
        page -= 1;
      }
      downloadItems().then(renderPageCounter).then(render);
    });
    productCount.appendChild(prevPage);
  }

  const currentPage = document.createElement("p");
  currentPage.textContent = `Page ${page} of ${Math.ceil(result.count / 20)}`;
  productCount.appendChild(currentPage);

  if (page < Math.ceil(result.count / 20)) {
    const nextPage = document.createElement("button");
    nextPage.textContent = ">";
    nextPage.addEventListener("click", () => {
      if (page < Math.ceil(result.count / 20)) {
        page += 1;
      }
      downloadItems().then(renderPageCounter).then(render);
    });
    productCount.appendChild(nextPage);
  }
}

function render() {
  renderPageCounter();
  productsBody.replaceChildren();


  products.forEach((p) => {
    console.log(p);
    const tableRow = document.createElement("tr");

    const cellProduct = document.createElement("td");
    const cellCategory = document.createElement("td");
    const cellPrice = document.createElement("td");

    const cellAction = document.createElement("td");

    cellProduct.textContent = p.name;
    cellCategory.textContent = p.category.name;

    cellPrice.textContent = p.cost;
    cellAction.textContent = "View details";

    tableRow.appendChild(cellProduct);
    tableRow.appendChild(cellCategory);
    tableRow.appendChild(cellPrice);
    tableRow.appendChild(cellAction);
    productsBody.appendChild(tableRow);

    cellAction.addEventListener("click", (event) => {
      console.log(p.name);
      detailsPanel.removeAttribute("hidden");
      detailsContent.innerHTML = `${p.desc}
    <hr>
    <p> Weight: ${Number(p.weight).toFixed(1) + p.weight_unit} </p>
    <p> Size: ${p.size.name} </p>
    `;
    });
    cellAction.dataset.action = true;
  });
}

window.addEventListener("click", (event) => {
  if (!event.target.dataset?.action == true) {
    detailsPanel.setAttribute("hidden", true);
  }
});

searchButton.addEventListener("click", (event) => {
  submitQuery().then(render);
});

downloadItems().then(render);
