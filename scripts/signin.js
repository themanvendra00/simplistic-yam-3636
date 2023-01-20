let loginFunction = (data, event) => {
  event.preventDefault();
  let email = document.querySelector("#email").value;
  let pass = document.querySelector("#inpass").value;

  if (email == "") {
    alert("Please enter a email address");
  } else if (pass == "") {
    alert("Please enter a password");
  } else {
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
        (data) => console.log(data),
        alert("Login Successfull"),
        localStorage.setItem("loginUser", JSON.stringify(logindetails)),
        (window.location.href = "../index.html")
      )
      .catch((err) => console.log(err));
  }
};

let signupData = JSON.parse(localStorage.getItem("signupData")) || [];
document.querySelector("form").addEventListener("submit", (e) => {
  loginFunction(signupData, e);
});
