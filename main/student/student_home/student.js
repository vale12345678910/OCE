// document.addEventListener("DOMContentLoaded", function() {
//     var menuItems = document.querySelectorAll('.menuItem h1');
//     var title = document.getElementById('title');
//     title.className = "showclass"
//     menuItems.forEach(function(item) {
//         item.classList.add('show'); // Add the 'show' class to each h1 element
//     });
// });



// document.getElementById("solve_overview").addEventListener("click", function(){
//     window.location.href = 'solve_overview/solve_overview.html'
// })

// document.getElementById("corrections").addEventListener("click", function(){
//     window.location.href = 'corrections/corrections.html'
// })

// document.getElementById("grades").addEventListener("click", function(){
//     window.location.href = 'grades/grades.html'
// })

// document.getElementById("correctionChange").addEventListener("click", function(){
//     window.location.href = 'correctionChange/correctionChange.html'
// })

// const colorswitch = document.getElementById("colorswitch")

// colorswitch.addEventListener("click", function(){
//     document.body.classList.toggle('invert-colors')
// })

document.addEventListener("DOMContentLoaded", function() {
    const darkModeToggle = document.getElementById('checkboxInput');
    const body = document.body;

    darkModeToggle.addEventListener('click', function() {
        if (body.classList.contains('invert-colors')) {
            body.classList.remove('invert-colors');
            body.style.backgroundColor = 'black';
        } else {
            body.classList.add('invert-colors');
            body.style.backgroundColor = 'white';
        }
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
