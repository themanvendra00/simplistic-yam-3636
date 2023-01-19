document.querySelector("form").addEventListener("submit", signin);

function signin(event) {
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
      (data) => console.log(data),
      alert("Login Successfull"),
      (window.location.href = "../index.html")
    )
    .catch((err) => console.log(err));
}
