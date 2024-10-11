//! STRUCTURED CODE

document.addEventListener("DOMContentLoaded", function() {
    // Code to animate title and menu items
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

    // Extract user data from session Storage.
    const userPic = sessionStorage.getItem('userPic');
    const userName = sessionStorage.getItem('userName');

    const userNameTitle = document.querySelector(".userNameTitle");

    // Display user data if available
    const userContainer = document.getElementById('userContainer');
    if (userPic && userName) {
        userContainer.innerHTML = `<img id="userImg" src="${userPic}"> <p id="userName">${userName}</p> <div id="signOut">Sign Out</div>`;
        userNameTitle.textContent = userName; // Set user email in userNameTitle
    } else {
        userContainer.innerHTML = '<div>No user data available</div>';
    }

    // Modal functionality
    const modal = document.querySelector(".modal");

    userContainer.addEventListener("click", function() {
        modal.showModal();
    });

    // Navigation event listeners
    document.getElementById("solve_overview").addEventListener("click", function() {
        window.location.href = 'solve_overview/solve_overview.html';
    });

    document.getElementById("corrections").addEventListener("click", function() {
        window.location.href = 'corrections/corrections.html';
    });

    document.getElementById("grades").addEventListener("click", function() {
        window.location.href = 'grades/grades.html';
    });

    document.getElementById("correctionChange").addEventListener("click", function() {
        window.location.href = 'correctionChange/correctionChange.html';
    });
});

//! Function to handle sign-out
function signOut() {
    sessionStorage.removeItem('userPic');
    sessionStorage.removeItem('userName');
    window.location.href = `../../login.html`;
}






// // document.addEventListener("DOMContentLoaded", function() {
// //     Code to animate title and menu items
// //     const title = document.getElementById('title');
// //     const menuItems = document.querySelectorAll('.menuItem h1');

// //     setTimeout(() => {
// //         title.classList.add('showclass');
// //     }, 50);

// //     menuItems.forEach(function(item) {
// //         setTimeout(() => {
// //             item.classList.add('show');
// //         }, 50);
// //     });



// //     Extract user data from URL parameters
// //     const userPic = sessionStorage.getItem('userPic');
// //     const userName = sessionStorage.getItem('userName');

// //     const userNameTitle = document.querySelector(".userNameTitle");

// //     Display user data if available
// //     const userContainer = document.getElementById('userContainer');
// //     if (userPic && userName) {
// //         userContainer.innerHTML = `<img id="userImg" src="${userPic}"> <p id="userName">${userName}</p> <div id="signOut">Sign Out</div>`;
// //         userNameTitle.textContent = userName; // Set user email in userNameTitle
// //     } else {
// //         userContainer.innerHTML = '<div>No user data available</div>';
// //     }

// //     Modal functionality
// //     const modal = document.querySelector(".modal");

// //     userContainer.addEventListener("click", function(){
// //         modal.showModal();
// //     });

// //     Navigation event listeners
// //     document.getElementById("solve_overview").addEventListener("click", function(){
// //         window.location.href = 'solve_overview/solve_overview.html';
// //     });

// //     document.getElementById("corrections").addEventListener("click", function(){
// //         window.location.href = 'corrections/corrections.html';
// //     });

// //     document.getElementById("grades").addEventListener("click", function(){
// //         window.location.href = 'grades/grades.html';
// //     });

// //     document.getElementById("correctionChange").addEventListener("click", function(){
// //         window.location.href = 'correctionChange/correctionChange.html';
// //     });
// // });

// // function signOut(){
// //     console.log("signed out")
// //     sessionStorage.removeItem('userPic')
// //     sessionStorage.removeItem('userName')
// //     window.location.href = `../../login.html`
    
// // }