const init = () => {
  const submitButton = document.getElementById("login-button");
  const loginEmail = document.getElementById("login-email");
  const loginPassword = document.getElementById("login-password");
  const profileLink = document.getElementById("profile-link");

  async function getCookies() {
    var requestOptions = {
      method: "GET",
    };
    const response = await fetch(
      "http://localhost:3000/getCookies",
      requestOptions
    );
    const cookies = await response.json();
    return cookies;
  }

  const successHandler = (data) => {
    submitButton.classList.remove("error");
    submitButton.classList.add("success");
    submitButton.value = "Success!";
    profileLink.classList.remove("hidden");
    profileLink.classList.add("show");
  };

  const errorHandler = () => {
    submitButton.classList.remove("success");
    submitButton.classList.add("error");
    submitButton.value = "Error";
  };

  if (submitButton) {
    submitButton.addEventListener("click", async (e) => {
      e.preventDefault();
      submitButton.value = "Loading...";

      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

      var urlencoded = new URLSearchParams();
      urlencoded.append("email", loginEmail.value);
      urlencoded.append("password", loginPassword.value);

      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: urlencoded,
        redirect: "follow",
      };

      fetch("http://localhost:3000/login", requestOptions)
        .then((response) => response.json())
        .then((data) => {
          if (data.token != undefined) {
            successHandler();
          } else {
            errorHandler();
          }
        })
        .catch(() => {
          errorHandler();
        });
    });
  }
};

window.onload = init;
