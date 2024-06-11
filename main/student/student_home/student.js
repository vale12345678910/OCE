document.addEventListener("DOMContentLoaded", function() {
    var menuItems = document.querySelectorAll('.menuItem h1');
    menuItems.forEach(function(item) {
        item.classList.add('show'); // Add the 'show' class to each h1 element
    });
});


document.getElementById("solve").addEventListener("click", function(){
    window.location.href = 'solve/solve.html'
})

document.getElementById("corrections").addEventListener("click", function(){
    window.location.href = 'corrections/corrections.html'
})

document.getElementById("grades").addEventListener("click", function(){
    window.location.href = 'grades/grades.html'
})

document.getElementById("correctionChange").addEventListener("click", function(){
    window.location.href = 'correctionChange/correctionChange.html'
})