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


function removeDefaultText(){
  const alertWrapper = document.querySelector(".alertWrapper")
  alertWrapper.style.display = "none"
  console.log("Wrapper Removed")
}


//TEST CHATGPT
// Function to fetch test details
document.addEventListener('DOMContentLoaded', () => {
  const userName = localStorage.getItem('userName')
  console.log("userName", userName)

  // Load and display the list of tests
  async function loadTestList() {
    try {
        const response = await fetch(`/api/listTests?userName=${encodeURIComponent(userName)}`);
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }
        const testFiles = await response.json();
        removeDefaultText();
        displayTestList(testFiles);
    } catch (error) {
        console.error('Error loading test list:', error);
    }
}




  // Display the list of tests
  function displayTestList(testFiles) {
      const container = document.getElementById('testValuesContainer');
      container.innerHTML = ''; // Clear previous content

      if (testFiles.length === 0) {
          container.innerHTML = '<p>No tests available.</p>';
          return;
      }

      const list = document.createElement('ul');
      testFiles.forEach(fileName => {
          const listItem = document.createElement('li');
          listItem.textContent = fileName;
          listItem.addEventListener('click', () => loadTestDetails(fileName));
          list.appendChild(listItem);
      });

      container.appendChild(list);
  }

  // Load test details when a test is clicked
  async function loadTestDetails(fileName) {
    try {
        const response = await fetch(`/api/loadTest?userName=${encodeURIComponent(userName)}&fileName=${encodeURIComponent(fileName)}`);
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }
        const testData = await response.json();
        displayTestDetails(testData);
    } catch (error) {
        console.error('Error loading test details:', error);
    }
}


  // Display test details
  function displayTestDetails(testData) {
      const container = document.getElementById('testDetailsContainer');
      container.innerHTML = ''; // Clear previous content

      if (!testData) {
          container.textContent = '<p>No details available.</p>';
          return;
      }

      const details = document.createElement('div');
      details.textContent = `
          <h2>${testData.testname}</h2>
          <p>User: ${testData.user}</p>
          <h3>Exercises:</h3>
          <ul>
              ${testData.exercices.map(ex => `
                  <li>
                      <h4>${ex.title}</h4>
                      <p>${ex.description}</p>
                      <p>Status: ${ex.optionstatus}</p>
                      <p>Content: ${ex.editorContent}</p>
                      <p>Points: ${ex.ponits}</p>
                  </li>
              `).join('')}
          </ul>
      `;

      container.appendChild(details);
  }

  // Initial load of test list
  loadTestList();
});


//end







//test
// window.onload = function() {
//   // Retrieve the test values from Local Storage
//   var testValues = localStorage.getItem('testValues');
//   if (testValues) {
//     testValues = JSON.parse(testValues);
//     var exCount = 0; // Assuming exCount is defined somewhere in your code
//     var testCount = 0;
//     // Append each value to the div with id 'testValuesContainer'
//     testValues.forEach(function(value, index) {
//       exCount++; // Increment exCount for each test value
//       var div = document.createElement('div');
//       div.id = "exercise" + exCount;
//       div.className = "exercise"
      
//       div.innerHTML = `
//           <h2>${value.title}</h2>
//           <p>${value.description}</p>
          
//       `;

//       document.getElementById('testValuesContainer').appendChild(div); 

//       if (exCount >= 1) {
//         removeDefaultText();
//       }

//       if (value.optionstatus == 1) {
//         var p = document.createElement('p');
//         p.id = "code";
//         p.textContent = value.editorContent;
//         document.getElementById("exercise"+exCount).appendChild(p);
//         console.log("value: 0");
//       } else {
//         console.log("value: 1");
//       }

//       test.appendChild(div)
//     });


//     const listContainer = document.querySelector(".listContainer")
//     listContainer.appendChild(test)
//     testCount++;
//     // Clear the testValues from Local Storage to avoid redundant appends
//     localStorage.removeItem('testValues');
//   }
// }