import { navbar, footer } from "../components/navbar.js";
let navbarContainer = document.getElementById("navbar");
let footerContainer = document.getElementById("footer");

navbarContainer.innerHTML = navbar();
footerContainer.innerHTML = footer();

// home redirect
let logo = document.getElementById("logo");
logo.addEventListener("click", () => {
  window.location.href = "index.html";
});

// signup page redirect
let create_account = document.getElementById("create-account");
create_account.addEventListener("click", () => {
  window.location.href = "signup.html";
});

//cart item count
let cart_items = JSON.parse(localStorage.getItem("cart_items")) || [];
let loginUser = JSON.parse(localStorage.getItem("loginUser")) || null;
let sumCount = 0;

let displayCartCount = () => {
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
login_icon.addEventListener("click", () => {
  if (loginUser) {
    window.location.href = "account.html";
  } else {
    window.location.href = "login.html";
  }
});

let loginFunction = (event) => {
  event.preventDefault();
  let email = document.querySelector("#email").value;
  let pass = document.querySelector("#inpass").value;

  let logindetails = {
    email,
    pass,
  };

  fetch("http://localhost:3000/users/login", {
    method: "POST",
    body: JSON.stringify(logindetails),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then(
      (data) => {console.log(data);
      alert("Login Successfull");
      localStorage.setItem("loginUser", JSON.stringify(logindetails));
      (window.location.href = "../index.html");
      })
    .catch((err) => console.log(err));
};

let signupData = JSON.parse(localStorage.getItem("signupData")) || [];
document.querySelector("form").addEventListener("submit", (e) => {
  loginFunction(signupData, e);
});
