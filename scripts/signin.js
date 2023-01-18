document.querySelector("form").addEventListener("submit", signin);
let inArr = [];
function signin(event) {
  event.preventDefault();
  let inemail = document.querySelector("#email").value;
  let inpass = document.querySelector("#inpass").value;
  let inObj = {
    inemail,
    inpass,
  };
  inArr.push(inObj);
  localStorage.getItem("userdetails");
  let json = JSON.parse(localStorage.getItem("userdetails"));
  for (i = 0; i < json.length; i++) {
    if (json[i]["upemail"] == inemail) {
      if (json[i]["uppass"] == inpass) {
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener("mouseenter", Swal.stopTimer);
            toast.addEventListener("mouseleave", Swal.resumeTimer);
          },
        });

        Toast.fire({
          icon: "success",
          title: "Login successful",
        });
        setTimeout(function () {
          window.location.href = "index.html";
        }, 2500);

        break;
      } else {
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener("mouseenter", Swal.stopTimer);
            toast.addEventListener("mouseleave", Swal.resumeTimer);
          },
        });

        Toast.fire({
          icon: "error",
          title: "Wrong password",
        });
        break;
      }
    } else {
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener("mouseenter", Swal.stopTimer);
          toast.addEventListener("mouseleave", Swal.resumeTimer);
        },
      });

      Toast.fire({
        icon: "error",
        title: "Wrong email"+"\n"+"create an account first!",
      });
      break;
    }
  }
}
