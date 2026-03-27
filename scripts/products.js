import { navbar, footer } from "../components/navbar.js";
import { Base_Url } from "./config.js";

const PRODUCT_CATEGORIES = [
  "Wedding Dresses",
  "Prom Dresses",
  "Bridesmaid Gifts",
  "Tuxedos & Suits",
  "Accessories",
  "Shoes",
];

const LEGACY_CATEGORY_MAP = {
  "Wedding Dresses": "wedding dress",
  "Prom Dresses": "all prom dresses",
  "Bridesmaid Gifts": "bridesmaid gifts",
  "Tuxedos & Suits": "tuxedos & suits",
  Accessories: "accessories",
  Shoes: "shoes",
};

const SORT_QUERY_MAP = {
  "A-Z": { sortBy: "head", sortOrder: "asc" },
  "Z-A": { sortBy: "head", sortOrder: "desc" },
  "low-to-high": { sortBy: "price", sortOrder: "asc" },
  "high-to-low": { sortBy: "price", sortOrder: "desc" },
  "old-new": { sortBy: "date", sortOrder: "asc" },
  "new-old": { sortBy: "date", sortOrder: "desc" },
  Bestselling: { sortBy: "tag", sortOrder: "desc" },
  Featured: null,
};

const state = {
  category: "Wedding Dresses",
  page: 1,
  limit: 10,
  sortValue: "Featured",
};

document.getElementById("navbar").innerHTML = navbar();
document.getElementById("footer").innerHTML = footer();

const logo = document.getElementById("logo");
if (logo) {
  logo.addEventListener("click", () => {
    window.location.href = "index.html";
  });
}

const cartItems = JSON.parse(localStorage.getItem("cart_items")) || [];
const loginUser = JSON.parse(localStorage.getItem("loginUser")) || null;
const authToken = localStorage.getItem("auth_token");
const isLoggedIn = !!(loginUser || authToken);

const loginIcon = document.getElementById("login-icon");
if (loginIcon) {
  loginIcon.addEventListener("click", () => {
    if (isLoggedIn) {
      window.location.href = "account.html";
      return;
    }
    window.location.href = "login.html";
  });
}

const loginStatus = document.getElementById("login-status");
if (loginStatus) {
  loginStatus.innerHTML = isLoggedIn ? "Logout" : "Login";
}

function displayCartCount() {
  const totalCartItem = document.getElementById("total-cart-item");
  if (!totalCartItem) return;

  let sumCount = 0;
  if (loginUser && cartItems.length > 0) {
    const elements = cartItems.filter((ele) => loginUser.email === ele.email);
    for (let i = 0; i < elements.length; i += 1) {
      const x = elements[i].cartItems || [];
      for (let j = 0; j < x.length; j += 1) {
        sumCount += x[j].count || 0;
      }
    }
  }
  totalCartItem.innerText = sumCount;
}

function getSortQuery(sortValue) {
  return SORT_QUERY_MAP[sortValue] || null;
}

function getUrlState() {
  const params = new URLSearchParams(window.location.search);
  const categoryFromQuery = params.get("category");
  if (categoryFromQuery && PRODUCT_CATEGORIES.includes(categoryFromQuery)) {
    state.category = categoryFromQuery;
  }

  const pageFromQuery = Number(params.get("page"));
  if (Number.isFinite(pageFromQuery) && pageFromQuery > 0) {
    state.page = pageFromQuery;
  }

  const sortFromQuery = params.get("sort");
  if (sortFromQuery && SORT_QUERY_MAP[sortFromQuery] !== undefined) {
    state.sortValue = sortFromQuery;
  }
}

function updateUrl() {
  const params = new URLSearchParams();
  params.set("category", state.category);
  params.set("page", String(state.page));
  params.set("limit", String(state.limit));
  params.set("sort", state.sortValue);
  window.history.replaceState({}, "", `products.html?${params.toString()}`);
}

function updateHeading() {
  const categoryTitle = document.getElementById("category-title");
  if (categoryTitle) categoryTitle.textContent = state.category;
  document.title = `${state.category} | Glam Bridal`;
}

function normalizeProductsResponse(result) {
  if (Array.isArray(result)) {
    return {
      page: 1,
      limit: result.length,
      total: result.length,
      totalPages: 1,
      items: result,
    };
  }
  return {
    page: result.page || state.page,
    limit: result.limit || state.limit,
    total: result.total || 0,
    totalPages: result.totalPages || 1,
    items: result.items || [],
  };
}

function renderProducts(items) {
  const products = document.getElementById("product-list");
  if (!products) return;
  products.innerHTML = "";

  if (!items || items.length === 0) {
    const empty = document.createElement("p");
    empty.innerText = "No products available.";
    empty.style.textAlign = "center";
    empty.style.marginTop = "24px";
    products.append(empty);
    return;
  }

  items.forEach((el) => {
    const card = document.createElement("div");
    card.setAttribute("class", "card");
    card.addEventListener("click", () => {
      localStorage.setItem("productDetails", JSON.stringify(el));
      window.location.href = "product-details.html";
    });

    const loveBtn = document.createElement("button");
    loveBtn.setAttribute("class", "heart-back");
    loveBtn.innerHTML = `<i class="fa fa-heart-o" aria-hidden="true"></i>`;
    loveBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      loveBtn.innerHTML = `<i class="fa fa-heart" aria-hidden="true"></i>`;
    });

    const imgBox = document.createElement("div");
    imgBox.setAttribute("class", "img-box");
    const img = document.createElement("img");
    img.src = el.image;
    img.loading = "lazy";
    imgBox.append(img);

    const title = document.createElement("a");
    title.innerText = el.head;
    title.setAttribute("class", "prod-title");

    card.addEventListener("mouseover", () => {
      if (el.hovimage) img.src = el.hovimage;
    });
    card.addEventListener("mouseout", () => {
      img.src = el.image;
      title.style.borderBottom = "1px solid transparent";
    });

    const price = document.createElement("p");
    const safePrice = Number(el.price) || 0;
    price.innerText = `$${safePrice.toFixed(2)}`;
    price.setAttribute("class", "prod-price");

    card.append(loveBtn, imgBox, title, price);
    products.append(card);
  });
}

function renderProductCount(total) {
  const leftS = document.getElementById("left-s");
  if (!leftS) return;
  leftS.innerHTML = "";
  const p = document.createElement("p");
  p.innerText = `${total} products`;
  leftS.append(p);
}

function renderPagination(totalPages) {
  const pages = document.getElementById("pages");
  if (!pages) return;
  pages.innerHTML = "";

  if (!totalPages || totalPages <= 1) return;

  for (let i = 1; i <= totalPages; i += 1) {
    const anchor = document.createElement("a");
    anchor.href = "javascript:void(0)";
    anchor.className = "page";
    anchor.textContent = String(i);
    if (i === state.page) {
      anchor.style.fontWeight = "700";
      anchor.style.textDecoration = "underline";
    }
    anchor.addEventListener("click", () => {
      state.page = i;
      updateUrl();
      fetchProducts();
    });
    pages.append(anchor);
  }
}

async function fetchProducts() {
  const products = document.getElementById("product-list");
  if (products) {
    products.innerHTML = "<p style=\"text-align:center; margin-top:24px;\">Loading products...</p>";
  }

  const sortQuery = getSortQuery(state.sortValue);
  const params = new URLSearchParams();
  params.set("category", state.category);
  params.set("page", String(state.page));
  params.set("limit", String(state.limit));
  if (sortQuery) {
    params.set("sortBy", sortQuery.sortBy);
    params.set("sortOrder", sortQuery.sortOrder);
  }

  const primaryUrl = `${Base_Url}/products?${params.toString()}`;
  let response;
  let result;
  try {
    response = await fetch(primaryUrl);
    result = await response.json();
  } catch (e) {
    // Network/API error - keep UI usable
    renderProductCount(0);
    renderProducts([]);
    renderPagination(0);
    // eslint-disable-next-line no-alert
    alert("Failed to load products.");
    return;
  }
  let normalized = normalizeProductsResponse(result);

  if (!normalized.items.length && LEGACY_CATEGORY_MAP[state.category]) {
    params.set("category", LEGACY_CATEGORY_MAP[state.category]);
    response = await fetch(`${Base_Url}/products?${params.toString()}`);
    result = await response.json();
    normalized = normalizeProductsResponse(result);
  }

  renderProductCount(normalized.total);
  renderProducts(normalized.items);
  renderPagination(normalized.totalPages);
}

function bindSortControl() {
  const selector = document.getElementById("selector");
  if (!selector) return;
  selector.value = state.sortValue;
  selector.addEventListener("change", (event) => {
    state.sortValue = event.target.value;
    state.page = 1;
    updateUrl();
    fetchProducts();
  });
}

displayCartCount();
getUrlState();
updateHeading();
updateUrl();
bindSortControl();
fetchProducts();

const btn = $("#button");
$(window).scroll(() => {
  if ($(window).scrollTop() > 300) {
    btn.addClass("show");
  } else {
    btn.removeClass("show");
  }
});
btn.on("click", (e) => {
  e.preventDefault();
  $("html, body").animate({ scrollTop: 0 }, "300");
});
