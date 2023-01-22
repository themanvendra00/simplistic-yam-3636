// get function
let url = "https://kind-cyan-rooster-hem.cyclic.app/products";

async function getData() {
  try {
    let res = await fetch(url, {
      headers: {
        "content-type": "application/json",
      },
    });
    let out = await res.json();
    displayData(out);
  } catch (error) {
    alert(error);
  }
}

getData();

// Display to dashboard
function displayData(data) {
  document.getElementById("main").innerHTML = "";

  data.forEach((data) => {
    let divcart = document.createElement("div");
    divcart.classList.add("divpointer");

    let image = document.createElement("img");
    image.src = data.image;

    let title = document.createElement("h6");
    title.innerText = data.head;

    let cost = document.createElement("h5");
    cost.innerText = "$" + data.price;

    let btn = document.createElement("button");
    btn.innerText = "Delete";
    btn.classList.add("details-btn");
    btn.addEventListener("click", function () {
      setData(data);
      deleteusers();
      location.reload();
    });

    divcart.append(image, title, cost, btn);
    document.getElementById("main").append(divcart);
  });
}

function setData(el) {
  let productData = [];
  productData.push(el);
  localStorage.setItem("local_Key", JSON.stringify(productData));
  console.log(productData);
  console.log();
}

//delete product
function deleteusers() {
  let id = JSON.parse(localStorage.getItem("local_Key"));
  let URl = url + "/delete/" + id[0]._id;
  console.log(URl);

  try {
    let response = fetch(`${url}/delete/${id[0]._id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok == true) {
      getData();
    }
  } catch (err) {
    console.log(err);
  }
}

const d = new Date();

document.querySelector("#add").addEventListener("click", create);

function create(event) {
  event.preventDefault();

  let head = document.getElementById("product-title").value;
  let category = document.getElementById("product-category").value;
  let image = document.getElementById("product-image").value;
  let hovimage = document.getElementById("product-hovimage").value;
  let price = document.getElementById("product-price").value;
  let tag = "New";
  let date = d.getFullYear();
  let availability = true;

  let obj = {
    head,
    category,
    image,
    hovimage,
    price,
    tag,
    date,
    availability,
  };

  fetch("https://kind-cyan-rooster-hem.cyclic.app/products/create", {
    method: "POST",
    body: JSON.stringify(obj),
    headers: {
      "content-type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((out) => console.log(out))
    .catch((err) => console.log(err));

  location.reload();
}
