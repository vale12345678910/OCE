//HANDLE MENU
let exCount = 0;
let testCount = 1;
let test = document.createElement("div")
test.className = "test"
test.id = "test"+testCount

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
    var exCount = 0; // Assuming exCount is defined somewhere in your code
    var testCount = 0;
    // Append each value to the div with id 'testValuesContainer'
    testValues.forEach(function(value, index) {
      exCount++; // Increment exCount for each test value
      var div = document.createElement('div');
      div.id = "exercise" + exCount;
      div.className = "exercise"
      
      div.innerHTML = `
          <h2>${value.title}</h2>
          <p>${value.description}</p>
          
      `;

      document.getElementById('testValuesContainer').appendChild(div); 

      if (exCount >= 1) {
        removeDefaultText();
      }

      if (value.optionstatus == 1) {
        var p = document.createElement('p');
        p.id = "code";
        p.textContent = value.editorContent;
        document.getElementById("exercise"+exCount).appendChild(p);
        console.log("value: 0");
      } else {
        console.log("value: 1");
      }

      test.appendChild(div)
    });


    const listContainer = document.querySelector(".listContainer")
    listContainer.appendChild(test)
    testCount++;
    // Clear the testValues from Local Storage to avoid redundant appends
    localStorage.removeItem('testValues');
  }
}


function removeDefaultText(){
  const alertWrapper = document.querySelector(".alertWrapper")
  alertWrapper.style.display = "none"
  console.log("Wrapper Removed")
}