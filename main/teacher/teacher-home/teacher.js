//! Structured Code

import { logout } from "https://dev.gymburgdorf.ch/auth/Authhelpers-min.js";


document.addEventListener("DOMContentLoaded", function() {
    var menuItems = document.querySelectorAll('.menuItem h1');
    menuItems.forEach(function(item) {
        item.classList.add('show'); // Show menu items
    });
});

const title = document.getElementById('title');

// Adding a slight delay to animate the title
setTimeout(() => {
    title.classList.add('showclass'); // Add showclass to title
}, 50);

const menuItems = document.querySelectorAll('.menuItem h1');
menuItems.forEach(function(item) {
    setTimeout(() => {
        item.classList.add('show'); // Animate showing each menu item
    }, 50);
});

const userPic = sessionStorage.getItem('userPic');
const userName = sessionStorage.getItem('userName');

const userNameTitle = document.querySelector(".userNameTitle");
const userContainer = document.getElementById('userContainer');

// Display user data if available
if (userPic && userName) {
    userContainer.innerHTML = `<img id="userImg" src="${userPic}"> <p id="userName">${userName}</p> <div id="signOut">Sign Out</div>`;
    userNameTitle.textContent = userName; // Set user email in userNameTitle
} else {
    userContainer.innerHTML = '<div>No user data available</div>'; // Handle missing user data
}

const modal = document.querySelector(".modal");

// Show modal when user container is clicked
userContainer.addEventListener("click", function() {
    modal.showModal();
});

// Navigation event listeners for different sections
document.getElementById("TestCreator").addEventListener("click", function() {
    window.location.href = 'test-creator/test-creator.html';
});

document.getElementById("TestsOverview").addEventListener("click", function() {
    window.location.href = 'test-overview/test-overview.html';
});

document.getElementById("Recieve").addEventListener("click", function() {
    window.location.href = 'recieve/recieve.html';
});

document.getElementById("Correct").addEventListener("click", function() {
    window.location.href = 'correct/correct.html';
});

function signOut() {
    logout('http://127.0.0.1:3000/');
    console.log("cookies deleted");
    sessionStorage.removeItem('userPic');
    sessionStorage.removeItem('userName');
    // window.location.href = '../../login.html';
}

window.signOut = signOut;










//! Original Code for backup

// document.addEventListener("DOMContentLoaded", function() {
//     var menuItems = document.querySelectorAll('.menuItem h1');
//     menuItems.forEach(function(item) {
//         item.classList.add('show'); 
//     });
// });

// const title = document.getElementById('title');
// const menuItems = document.querySelectorAll('.menuItem h1');

// setTimeout(() => {
//     title.classList.add('showclass');
// }, 50);

// menuItems.forEach(function(item) {
//     setTimeout(() => {
//         item.classList.add('show');
//     }, 50);
// });





// const userPic = sessionStorage.getItem('userPic');
// const userName = sessionStorage.getItem('userName');

// const userNameTitle = document.querySelector(".userNameTitle");


// const userContainer = document.getElementById('userContainer');
// if (userPic && userName) {
//     userContainer.innerHTML = `<img id="userImg" src="${userPic}"> <p id="userName">${userName}</p> <div id="signOut">Sign Out</div>`;
//     userNameTitle.textContent = userName; 
//     console.log("logged in")
// } else {
//     userContainer.innerHTML = '<div>No user data available</div>';
// }


// const modal = document.querySelector(".modal");

// userContainer.addEventListener("click", function(){
//     console.log("dropdown");
//     modal.showModal();
// });


// document.getElementById("TestCreator").addEventListener("click", function(){
//     window.location.href = 'test-creator/test-creator.html'
// })

// document.getElementById("TestsOverview").addEventListener("click", function(){
//     window.location.href = 'test-overview/test-overview.html'
// })

// document.getElementById("Recieve").addEventListener("click", function(){
//     window.location.href = 'recieve/recieve.html'
// })

// document.getElementById("Correct").addEventListener("click", function(){
//     window.location.href = 'correct/correct.html'
// })

// function signOut(){
//     sessionStorage.removeItem('userName')
//     sessionStorage.removeItem('userPic')
//     window.location.href = `../../login.html`
// }



