document.querySelector("form").addEventListener("submit", signup);
let upArr = JSON.parse(localStorage.getItem("userdetails")) || [];
function signup(event) {
  event.preventDefault();
  let fullname = document.querySelector("#fname").value;
  let upemail = document.querySelector("#eMail").value;
  let uppass = document.querySelector("#Pass").value;
  let upObj = {
    fullname,
    upemail,
    uppass,
  };
  let details = JSON.parse(localStorage.getItem("userdetails")) || [];
  if (details.length != 0) {
    for (i = 0; i < details.length; i++) {
      if (details[i]["upemail"] != upemail) {
        if (fullname.length != 0 && upemail.length != 0) {
          if (uppass.length >= 8) {
            upArr.push(upObj);
            localStorage.setItem("userdetails", JSON.stringify(upArr));
            window.location.href = "signin.html";
          } else {
            // alert("Password should contain altesat 8 characters");
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
              icon: "warning",
              title: "Password should contain altesat 8 characters",
            });
          }
        } else {
          // alert("Fill all details");
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
            icon: "question",
            title: "Fill all details",
          });
        }
      } else {
        // alert("Email already registered");
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
          title: "Email already registered",
        });
      }
    }
  } else {
    if (fullname.length != 0 && upemail.length != 0) {
      if (uppass.length >= 8) {
        upArr.push(upObj);
        localStorage.setItem("userdetails", JSON.stringify(upArr));
        // alert("Account created")
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
          title: "Account created",
        });
        // window.location.href = "signin.html";
        setTimeout(function () {
          window.location.href = "signin.html";
        }, 4500);
      } else {
        // alert("Password should contain altesat 8 characters");
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
          icon: "warning",
          title: "Password should contain altesat 8 characters",
        });
      }
    } else {
      // alert("Fill all details");
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
        icon: "question",
        title: "Fill all details",
      });
    }
  }
}
