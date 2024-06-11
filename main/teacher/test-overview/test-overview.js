//HANDLE MENU
document.getElementById("testsCreator").addEventListener("click", function(){
  window.location.href = '../test-creator/test-creator.html'
})

document.getElementById("createTest").addEventListener("click", function(){
  window.location.href = '../test-creator/test-creator.html'
})


document.getElementById("Recieve").addEventListener("click", function(){
  window.location.href = '../recieve/recieve.html'
})

document.getElementById("Correct").addEventListener("click", function(){
  window.location.href = '../correct/correct.html'
})

//test
window.onload = function() {
  // Retrieve the test values from Local Storage
  var testValues = localStorage.getItem('testValues');
  if (testValues) {
    testValues = JSON.parse(testValues);

    // Append each value to the div with id 'testValuesContainer'
    testValues.forEach(function(value, index) {
      var div = document.createElement('div');
      div.innerHTML = `
        <h2>${value.title}</h2>
        <p>${value.description}</p>
        <p>${value.optionstatus}</p>
        <p>${value.editorContent}</p>
      `;
      document.getElementById('testValuesContainer').appendChild(div);
    });

    // Clear the testValues from Local Storage to avoid redundant appends
    localStorage.removeItem('testValues');
  }
}
