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