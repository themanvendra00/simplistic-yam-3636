import { navbar, footer } from "../components/navbar.js";
import { Base_Url } from "./config.js";

let navbarContainer = document.getElementById("navbar");
let footerContainer = document.getElementById("footer");

navbarContainer.innerHTML = navbar();
footerContainer.innerHTML = footer();

const AUTH_TOKEN_KEY = "auth_token";

const getToken = () => localStorage.getItem(AUTH_TOKEN_KEY);

const clearAuth = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem("loginUser");
};

const normalizeUser = (user) => {
  if (!user || typeof user !== "object") return user;
  return {
    ...user,
    first_name: user.first_name ?? user.firstName ?? user.givenName ?? "",
    last_name: user.last_name ?? user.lastName ?? user.familyName ?? "",
    email: user.email ?? user.emailAddress ?? user.email_address ?? "",
  };
};

const fetchMe = async (token) => {
  const res = await fetch(`${Base_Url}/users/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    let msg = "Failed to load profile.";
    try {
      const payload = await res.json();
      msg = payload?.message ?? payload?.error ?? msg;
    } catch {
      // ignore json parsing errors
    }
    throw new Error(msg);
  }

  const payload = await res.json();
  return normalizeUser(payload?.user ?? payload?.data?.user ?? payload);
};

// home redirect
let logo = document.getElementById("logo");
if (logo) {
  logo.addEventListener("click", () => {
    window.location.href = "index.html";
  });
}

// cart item count
let cart_items = JSON.parse(localStorage.getItem("cart_items")) || [];
let loginUser = JSON.parse(localStorage.getItem("loginUser")) || null;
let authToken = localStorage.getItem("auth_token");
let isLoggedIn = !!(loginUser || authToken);
let sumCount = 0;

let displayCartCount = () => {
  sumCount = 0;
  let total_cart_item = document.getElementById("total-cart-item");
  if (!total_cart_item) return;

  if (loginUser == null) {
    total_cart_item.innerText = sumCount;
    return;
  }

  if (cart_items.length > 0) {
    let elements = cart_items.filter((ele) => ele.email === loginUser.email);

    for (let i = 0; i < elements.length; i++) {
      let x = elements[i].cartItems;
      for (let j = 0; j < x.length; j++) {
        sumCount += x[j].count;
      }
    }
  }

  total_cart_item.innerText = sumCount;
};

// redirect to account/login
let login_icon = document.getElementById("login-icon");
if (login_icon) {
  login_icon.addEventListener("click", () => {
    if (isLoggedIn) {
      window.location.href = "account.html";
    } else {
      window.location.href = "login.html";
    }
  });
}

// login status
let login_status = document.getElementById("login-status");
if (login_status) {
  login_status.innerHTML = isLoggedIn ? "Logout" : "Login";
}

// logout function
let logoutFunction = () => {
  clearAuth();
  window.location.href = "login.html";
};

let logout_btn = document.getElementById("logout");
logout_btn?.addEventListener("click", () => {
  let res = confirm("Are you sure?");
  if (res) logoutFunction();
});

// display login user name
let displayLoginUserDetails = (data) => {
  if (!data) return;
  let name = document.getElementById("name-display");
  let emailEl = document.getElementById("email-display");
  const first = data.first_name ?? data.firstName ?? data.givenName ?? "";
  const last = data.last_name ?? data.lastName ?? data.familyName ?? "";
  const email = data.email ?? data.emailAddress ?? data.email_address ?? "";

  if (name) name.innerText = `Hi, ${first} ${last}`;
  if (emailEl) emailEl.innerText = email;

  // Fill profile inputs (if present)
  let firstEl = document.getElementById("first_name");
  let lastEl = document.getElementById("last_name");
  let profileEmailEl = document.getElementById("profile-email");
  if (firstEl) firstEl.value = first;
  if (lastEl) lastEl.value = last;
  if (profileEmailEl) profileEmailEl.value = email;
};

// display orders of login user (legacy localStorage)
let displayOrders = (orders, user) => {
  if (!orders || !user) return;
  let below_table = document.getElementById("below-table");
  if (!below_table) return;

  // Keep the original placeholders if there are no orders
  let userOrders = orders.filter((ele) => ele.email === user.email);
  if (userOrders.length === 0) return;

  below_table.innerHTML = "";

  userOrders.forEach((element) => {
    let orderNumber = document.createElement("p");
    orderNumber.innerHTML = `Order ID: <strong>#${element.order_id}</strong>`;
    orderNumber.setAttribute("id", "order-number");

    let products_list = document.createElement("div");
    products_list.setAttribute("id", "products-list");

    let items = element.orderItems;
    let totalOrderAmount = 0;

    items.forEach((item) => {
      let row = document.createElement("div");
      row.setAttribute("id", "row");

      // img-secc
      let img_box = document.createElement("div");
      img_box.setAttribute("id", "img-secc");

      let img = document.createElement("img");
      img.src = item.img;

      let prod_description = document.createElement("div");
      prod_description.setAttribute("id", "prod_description");

      let title = document.createElement("p");
      title.innerText = item.head;
      title.setAttribute("id", "prod-title");

      let price = document.createElement("p");
      price.innerText = `$${item.price.toFixed(2)}`;
      price.setAttribute("id", "prod-price");

      prod_description.append(title, price);
      img_box.append(img, prod_description);

      // btn-action
      let btn_action = document.createElement("div");
      btn_action.setAttribute("id", "btn-action");

      let qty = document.createElement("p");
      qty.innerText = `${item.count} piece`;
      qty.setAttribute("id", "count-num");

      btn_action.append(qty);

      // row-price-display
      let row_price_display = document.createElement("div");
      row_price_display.setAttribute("id", "row-price-display");

      let totalRowPrice = item.count * item.price;
      totalOrderAmount += totalRowPrice;
      let totalPrice = `$${totalRowPrice.toFixed(2)}`;
      row_price_display.append(totalPrice);

      row.append(img_box, btn_action, row_price_display);
      products_list.append(row);
    });

    let hr_bar = document.createElement("hr");
    hr_bar.setAttribute("class", "hr-bar");

    let sub_total_price = document.createElement("div");
    sub_total_price.setAttribute("id", "sub-total-price");

    let totalText = document.createElement("p");
    totalText.innerText = "Total";

    let subTotalPrice = document.createElement("p");
    subTotalPrice.innerText = `$${totalOrderAmount.toFixed(2)}`;

    sub_total_price.append(totalText, subTotalPrice);
    below_table.append(orderNumber, products_list, hr_bar, sub_total_price);
  });
};

// profile + account API integration
(async () => {
  const token = getToken();
  if (!token) {
    window.location.href = "login.html";
    return;
  }

  // Display any cached user data quickly (will be refreshed after /users/me)
  displayCartCount();
  displayLoginUserDetails(loginUser);

  try {
    let profile = await fetchMe(token);
    loginUser = profile;
    localStorage.setItem("loginUser", JSON.stringify(profile));

    if (login_status) login_status.innerHTML = "Logout";
    displayCartCount();
    displayLoginUserDetails(profile);

    // Load legacy orders if any
    let ordersLS = JSON.parse(localStorage.getItem("orders")) || null;
    displayOrders(ordersLS, loginUser);
  } catch (err) {
    console.error(err);
    clearAuth();
    window.location.href = "login.html";
    return;
  }

  const profileForm = document.getElementById("profile-form");
  const deleteBtn = document.getElementById("delete-account-btn");
  const statusEl = document.getElementById("profile-status");

  if (profileForm) {
    profileForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const firstName = document.getElementById("first_name")?.value?.trim();
      const lastName = document.getElementById("last_name")?.value?.trim();
      const email = document.getElementById("profile-email")?.value?.trim();
      const password = document.getElementById("profile-password")?.value;

      if (!firstName) return alert("First name is required.");
      if (!lastName) return alert("Last name is required.");
      if (!email) return alert("Email is required.");

      let body = { firstName, lastName, email };
      if (password && password.trim().length > 0) body.password = password;

      try {
        statusEl && (statusEl.innerText = "Updating...");
        let res = await fetch(`${Base_Url}/users`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });

        let payload = null;
        try {
          payload = await res.json();
        } catch {
          // ignore
        }

        if (!res.ok) {
          const msg = payload?.message ?? payload?.error ?? "Update failed.";
          throw new Error(msg);
        }

        // Clear new-password field after successful update
        let passwordEl = document.getElementById("profile-password");
        if (passwordEl) passwordEl.value = "";

        let updated = await fetchMe(token);
        loginUser = updated;
        localStorage.setItem("loginUser", JSON.stringify(updated));

        displayLoginUserDetails(updated);
        statusEl && (statusEl.innerText = "Profile updated successfully.");
      } catch (err) {
        console.error(err);
        statusEl && (statusEl.innerText = err?.message ?? "Update failed.");
        alert(err?.message ?? "Update failed.");
      }
    });
  }

  if (deleteBtn) {
    deleteBtn.addEventListener("click", async () => {
      const res = confirm("Are you sure you want to delete your account?");
      if (!res) return;

      try {
        statusEl && (statusEl.innerText = "Deleting account...");
        const delRes = await fetch(`${Base_Url}/users`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        let payload = null;
        try {
          payload = await delRes.json();
        } catch {
          // ignore
        }

        if (!delRes.ok) {
          const msg = payload?.message ?? payload?.error ?? "Delete failed.";
          throw new Error(msg);
        }

        clearAuth();
        window.location.href = "login.html";
      } catch (err) {
        console.error(err);
        alert(err?.message ?? "Delete failed.");
        statusEl && (statusEl.innerText = err?.message ?? "Delete failed.");
      }
    });
  }
})();
