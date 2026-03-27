import { navbar, footer } from "../components/navbar.js";
import { Base_Url } from "./config.js";

let navbarContainer = document.getElementById("navbar");
let footerContainer = document.getElementById("footer");

navbarContainer.innerHTML = navbar();
footerContainer.innerHTML = footer();

// home redirect
let logo = document.getElementById("logo");
if (logo) {
  logo.addEventListener("click", () => {
    window.location.href = "index.html";
  });
}

// signup page redirect
let create_account = document.getElementById("create-account");
if (create_account) {
  create_account.addEventListener("click", () => {
    window.location.href = "signup.html";
  });
}

const AUTH_TOKEN_KEY = "auth_token";

const extractToken = (payload) => {
  if (!payload || typeof payload !== "object") return null;
  return (
    payload.token ??
    payload.accessToken ??
    payload.access_token ??
    payload.jwt ??
    payload.data?.token ??
    payload.data?.accessToken ??
    null
  );
};

const extractUser = (payload) => {
  if (!payload || typeof payload !== "object") return null;
  // If the backend returns a wrapped response (e.g. { user, token }) use user,
  // otherwise treat the payload itself as the user object.
  return payload.user ?? payload.data?.user ?? payload.data ?? payload;
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
  return normalizeUser(extractUser(payload));
};

//cart item count
let cart_items = JSON.parse(localStorage.getItem("cart_items")) || [];
let loginUser = JSON.parse(localStorage.getItem("loginUser")) || null;
let authToken = localStorage.getItem("auth_token");
let isLoggedIn = !!(loginUser || authToken);
let sumCount = 0;

let displayCartCount = () => {
  sumCount = 0;
  let total_cart_item = document.getElementById("total-cart-item");
  if (loginUser == null) {
    total_cart_item.innerText = sumCount;
  } else {
    if (cart_items.length > 0) {
      let elements = cart_items.filter((ele) => {
        if (loginUser.email == ele.email) return ele;
      });

      for (let i = 0; i < elements.length; i++) {
        let x = elements[i].cartItems;
        for (let j = 0; j < x.length; j++) {
          sumCount += x[j].count;
        }
      }
      total_cart_item.innerText = sumCount;
    } else {
      total_cart_item.innerText = sumCount;
    }
  }
};
displayCartCount();

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
if (isLoggedIn) {
  login_status.innerHTML = "Logout";
} else {
  login_status.innerHTML = "Login";
}

// login function (API)
let loginForm = document.querySelector("form");
loginForm?.addEventListener("submit", async (e) => {
  e.preventDefault();

  let email = document.querySelector("#email")?.value?.trim();
  let password = document.querySelector("#password")?.value;

  if (!email) {
    alert("Please enter a email");
    return;
  }

  if (!password) {
    alert("Please enter a password");
    return;
  }

  try {
    let res = await fetch(`${Base_Url}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    let payload = null;
    try {
      payload = await res.json();
    } catch {
      // ignore json parsing errors
    }

    if (!res.ok) {
      const msg = payload?.message ?? payload?.error ?? "Login failed!";
      alert(msg);
      return;
    }

    const token = extractToken(payload);
    if (!token) {
      alert("Login successful but auth token was not returned.");
      return;
    }

    let user = extractUser(payload);
    if (!user || !user.email) user = await fetchMe(token);

    localStorage.setItem(AUTH_TOKEN_KEY, token);
    localStorage.setItem("loginUser", JSON.stringify(normalizeUser(user)));
    window.location.href = "index.html";
  } catch (err) {
    console.error(err);
    alert("Something went wrong while logging in.");
  }
});
