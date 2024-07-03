

import { tryToGetUser, login, logout } from "https://dev.gymburgdorf.ch/auth/Authhelpers-min.js";

document.addEventListener("DOMContentLoaded", async function() {
    const mainContainer = document.querySelector('.mainContainer');
    mainContainer.classList.add("show");

    var user = sessionStorage.getItem('user') || await tryToGetUser();

    const userContainer = document.querySelector(".connect");

    if (user != "null" && user) {
        localStorage.setItem('userPic', user.pic)
        localStorage.setItem('userEmail', user.email)
        window.location.href = `main/student/student.html`;
        // userContainer.addEventListener("click", () => logout(location.href));
        console.log(location.href)
        console.log("signed in")

        
    } else {
        console.log(user, "else")
        userContainer.innerHTML = `<div class="connect">Connect Google Account</div>`;
        userContainer.addEventListener("click", () => login(location.href));
        console.log("singed out")
        sessionStorage.removeItem('user')
        
    }
})



