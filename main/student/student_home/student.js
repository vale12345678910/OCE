// // document.addEventListener("DOMContentLoaded", function() {
// //     var menuItems = document.querySelectorAll('.menuItem h1');
// //     var title = document.getElementById('title');
// //     title.className = "showclass"
// //     menuItems.forEach(function(item) {
// //         item.classList.add('show'); // Add the 'show' class to each h1 element
// //     });
// // });



// // document.getElementById("solve_overview").addEventListener("click", function(){
// //     window.location.href = 'solve_overview/solve_overview.html'
// // })

// // document.getElementById("corrections").addEventListener("click", function(){
// //     window.location.href = 'corrections/corrections.html'
// // })

// // document.getElementById("grades").addEventListener("click", function(){
// //     window.location.href = 'grades/grades.html'
// // })

// // document.getElementById("correctionChange").addEventListener("click", function(){
// //     window.location.href = 'correctionChange/correctionChange.html'
// // })

// // const colorswitch = document.getElementById("colorswitch")

// // colorswitch.addEventListener("click", function(){
// //     document.body.classList.toggle('invert-colors')
// // })
// // Function to get URL parameters


// document.addEventListener("DOMContentLoaded", function() {
    
    
//     const title = document.getElementById('title');
//     const menuItems = document.querySelectorAll('.menuItem h1');

//     setTimeout(() => {
//         title.classList.add('showclass');
//     }, 50);

//     menuItems.forEach(function(item) {
//         setTimeout(() => {
//             item.classList.add('show');
//         }, 50);
//     });

//     function getUrlParameter(name) {
//         name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
//         const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
//         const results = regex.exec(location.search);
//         return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
//     }
    
//     // Extract user data from URL parameters
//     const userPic = getUrlParameter('pic');
//     const userEmail = getUrlParameter('email');

//     const userNameTitle = document.querySelector(".userNameTitle")
    
//     // Display user data
//     const userContainer = document.getElementById('userContainer');
//     if (userPic && userEmail) {
//         userContainer.innerHTML = `<img id="userImg" src="${userPic}"> <p id="userName">${userEmail}</p> <div id="signOut">Sign Out</div>`;
//     } else {
//         userContainer.innerHTML = '<div>No user data available</div>';
//     }
    



//     document.getElementById("solve_overview").addEventListener("click", function(){
//         window.location.href = 'solve_overview/solve_overview.html';
//     });

//     document.getElementById("corrections").addEventListener("click", function(){
//         window.location.href = 'corrections/corrections.html';
//     });

//     document.getElementById("grades").addEventListener("click", function(){
//         window.location.href = 'grades/grades.html';
//     });

//     document.getElementById("correctionChange").addEventListener("click", function(){
//         window.location.href = 'correctionChange/correctionChange.html';
//     });
// });



// const modal = document.querySelector(".modal")


// userNameTitle.textContent = userEmail

// userContainer.addEventListener("click", function(){
//      console.log("dropdown")
//      modal.showModal();
// })

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



    // Extract user data from URL parameters
    const userPic = localStorage.getItem('userPic');
    const userEmail = localStorage.getItem('userEmail');

    localStorage.removeItem("userPic")
    localStorage.removeItem("userEmail")

    const userNameTitle = document.querySelector(".userNameTitle");

    // Display user data if available
    const userContainer = document.getElementById('userContainer');
    if (userPic && userEmail) {
        userContainer.innerHTML = `<img id="userImg" src="${userPic}"> <p id="userName">${userEmail}</p> <div id="signOut">Sign Out</div>`;
        userNameTitle.textContent = userEmail; // Set user email in userNameTitle
    } else {
        userContainer.innerHTML = '<div>No user data available</div>';
    }

    // Modal functionality
    const modal = document.querySelector(".modal");

    userContainer.addEventListener("click", function(){
        console.log("dropdown");
        modal.showModal();
    });

    // Navigation event listeners
    document.getElementById("solve_overview").addEventListener("click", function(){
        window.location.href = 'solve_overview/solve_overview.html';
    });

    document.getElementById("corrections").addEventListener("click", function(){
        window.location.href = 'corrections/corrections.html';
    });

    document.getElementById("grades").addEventListener("click", function(){
        window.location.href = 'grades/grades.html';
    });

    document.getElementById("correctionChange").addEventListener("click", function(){
        window.location.href = 'correctionChange/correctionChange.html';
    });
});

function signOut(){
    console.log("signed out")
    sessionStorage.setItem('user', "null")
    window.location.href = `../../login.html`
    
}