document.querySelector("form").addEventListener("submit", signup);

function signup(event) {
  event.preventDefault();
  let fullname = document.querySelector("#fname").value;
  let email = document.querySelector("#eMail").value;
  let pass = document.querySelector("#Pass").value;

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
    .catch((err) => console.log(err));
}
