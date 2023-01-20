// signup function
let signupData = JSON.parse(localStorage.getItem("signupData")) || [];

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
        localStorage.setItem("signupData", JSON.stringify(data)),
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
