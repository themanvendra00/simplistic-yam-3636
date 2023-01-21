let url = "http://localhost:3000/products";

  async function getData() {
    try {
      let res = await fetch(url, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      let out = await res.json();
      displayData(out);
    } catch (error) {
      alert(error);
    }
  }

  getData();

  function displayData(beautyData) {
    document.getElementById("main").innerHTML = "";

    beautyData.forEach((data) => {
      let divcart = document.createElement("div");
      divcart.classList.add("divpointer");

      let image = document.createElement("img");
      image.src = data.img;

      let title = document.createElement("h6");
      title.innerText = data.title.substring(0, 55);

      let reviews = document.createElement("p");
      reviews.innerText = data.review;

      let cost = document.createElement("h5");
      cost.innerText = data.price;

      let btn = document.createElement("button");
      btn.innerText = "Delete";
      btn.classList.add("details-btn");
      btn.addEventListener("click", function () {
        setData(data);
        deleteusers();
        // document.location.href = "allProd.html";
      });

      divcart.append(image, title, reviews, cost, btn);
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