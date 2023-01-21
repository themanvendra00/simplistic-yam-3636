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


let signupFunction = (data, event) => {
  event.preventDefault();
  let fullname = document.querySelector("#fname").value;
  let email = document.querySelector("#eMail").value;
  let pass = document.querySelector("#Pass").value;

  if (fullname == "") {
    alert("Please enter your fullname");
  } else if (email == "") {
    alert("Please enter your email address");
  } else if (pass == "") {
    alert("Please enter your password");
  } else {
    let registerDetails = {
      fullname,
      email,
      pass,
    };

    fetch("http://localhost:3000/users/register", {
      method: "POST",
      body: JSON.stringify(registerDetails),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then(
        (data) => console.log(data),
        alert("Registered Successfull"),
        (window.location.href = "../signin.html")
      )
      .catch((err) => {
        console.log(err);
      });
  }
};

document.querySelector("form").addEventListener("submit", (e) => {
  signupFunction(signupData, e);
});
