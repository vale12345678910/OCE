
    
import { tryToGetUser, login, logout } from "https://dev.gymburgdorf.ch/auth/Authhelpers-min.js";

document.addEventListener("DOMContentLoaded", async function() {
  const mainContainer = document.querySelector('.mainContainer');
  mainContainer.classList.add("show");

  let user = sessionStorage.getItem('user') || await tryToGetUser();
  const userContainer = document.querySelector(".connect");

  if (user && user !== "null") {
    localStorage.setItem('userPic', user.pic);
    localStorage.setItem('userEmail', user.email);
    console.log("User signed in.");
  } else {
    console.log(user, "else");
    userContainer.innerHTML = `<div class="connect">Connect Google Account</div>`;
    userContainer.addEventListener("click", () => login(location.href));
    console.log("signed out");
    sessionStorage.removeItem('user');
    user = null;
  }

  // Event listener for the connect button
  document.querySelector('.connect').addEventListener('click', async function() {
    if (!user || user === "null") {
      console.log("User not signed in.");
      return;
    }

    const userName = user.email;
    const userData = { userName };

    try {
      let response = await fetchPost("/api/checkDirectory", userData);
      let check = await response.json();

      if (check.directoryExists) {
        console.log("User directory exists. Redirecting...");
        window.location.href = 'main/teacher/teacher.html'; // Redirect to teacher page
      } else {
        console.log("User directory does not exist. Creating...");
        await fetchPost("/api/createDirectory", userData);
        console.log("User directory created. Redirecting...");
        window.location.href = 'main/teacher/teacher.html'; // Redirect to teacher page
      }
    } catch (error) {
      console.error('Error:', error);
    }
  });
});

function fetchPost(url, data) {
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  };

  return fetch(url, options);
}
