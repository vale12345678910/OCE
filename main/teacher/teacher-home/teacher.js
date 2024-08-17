//Animation

document.addEventListener("DOMContentLoaded", function() {
    var menuItems = document.querySelectorAll('.menuItem h1');
    menuItems.forEach(function(item) {
        item.classList.add('show'); // Add the 'show' class to each h1 element
    });
});

const title = document.getElementById('title');
const menuItems = document.querySelectorAll('.menuItem h1');

setTimeout(() => {
    title.classList.add('showclass');
}, 50);

menuItems.forEach(function(item) {
    setTimeout(() => {
        item.classList.add('show');
    }, 50);
});


//Script


const userPic = sessionStorage.getItem('userPic');
const userName = sessionStorage.getItem('userName');

const userNameTitle = document.querySelector(".userNameTitle");

// Display user data if available
const userContainer = document.getElementById('userContainer');
if (userPic && userName) {
    userContainer.innerHTML = `<img id="userImg" src="${userPic}"> <p id="userName">${userName}</p> <div id="signOut">Sign Out</div>`;
    userNameTitle.textContent = userName; // Set user email in userNameTitle
    console.log("logged in")
} else {
    userContainer.innerHTML = '<div>No user data available</div>';
}

// Modal functionality
const modal = document.querySelector(".modal");

userContainer.addEventListener("click", function(){
    console.log("dropdown");
    modal.showModal();
});


document.getElementById("TestCreator").addEventListener("click", function(){
    window.location.href = 'test-creator/test-creator.html'
})

document.getElementById("TestsOverview").addEventListener("click", function(){
    window.location.href = 'test-overview/test-overview.html'
})

document.getElementById("Recieve").addEventListener("click", function(){
    window.location.href = 'recieve/recieve.html'
})

document.getElementById("Correct").addEventListener("click", function(){
    window.location.href = 'correct/correct.html'
})

function signOut(){
    console.log("signed out")
    sessionStorage.removeItem('userName')
    sessionStorage.removeItem('userPic')
    window.location.href = `../../login.html`
}

//copy

