const init = () => {
  const postContentButton = document.getElementById("post-content-button");
  const postContentValue = document.getElementById("post-content-value");
  const searchBar = document.getElementById("profile-search-content");
  const searchButton = document.getElementById("profile-search-button");

  async function getCookies() {
    var requestOptions = {
      method: "GET",
    };
    const response = await fetch("/getCookies", requestOptions);
    const cookies = await response.json();
    return cookies;
  }

  const getProfile = async () => {
    const cookies = await getCookies();
    var requestOptions = {
      method: "GET",
    };
    fetch(`/posts/${cookies.login}`, requestOptions)
      .then((response) => response.json())
      .then((result) => renderProfileContent(result))
      .catch((error) => {
        throw error;
      });
  };

  const renderProfileContent = (data) => {
    const profileContents = document.getElementById("profile-contents");
    data.forEach((post) => {
      const li = document.createElement("li");
      li.innerHTML = post.content;
      profileContents.appendChild(li);
    });
  };

  if (postContentButton) {
    postContentButton.addEventListener("click", async (e) => {
      const cookies = await getCookies();
      e.preventDefault();
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

      var urlencoded = new URLSearchParams();
      urlencoded.append("content", postContentValue.value);

      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: urlencoded,
        redirect: "follow",
      };

      fetch(`/posts/${cookies.login}`, requestOptions)
        .then(() => {
          getProfile();
        })
        .catch((err) => {
          throw err;
        });
    });
  }

  if (searchButton) {
    searchButton.addEventListener("click", () => {
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
      var requestOptions = {
        method: "GET",
        headers: myHeaders,
      };
      fetch(`/posts/matiasfred/${searchBar.value}`, requestOptions)
        .then(() => {
          getProfile();
        })
        .catch((err) => {
          throw err;
        });
    });
  }
  getProfile();
};

window.onload = init;
