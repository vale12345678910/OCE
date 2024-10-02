 let configFile;
  

  document.getElementById("corrections").addEventListener("click", function(){
    window.location.href = '../corrections/corrections.html'
  })
  
  
  document.getElementById("grades").addEventListener("click", function(){
    window.location.href = '../grades/grades.html'
  })
  
  document.getElementById("correctionChange").addEventListener("click", function(){
    window.location.href = '../correctionChange/correctionChange.html'
  })


  document.addEventListener('DOMContentLoaded', () => {
    testId = prompt("Enter the test ID provided by your teacher:");

    if (testId) {
        loadTestById(testId);
    } else {
        alert("Test ID is required!");
    }
});

async function loadTestById(testId) {
    try {
        const response = await fetch(`/api/getTestById?testId=${encodeURIComponent(testId)}`);
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }
        const testData = await response.json();

        teacherName = testData.teachersName
        configFile = testData.configFileInput
        displayTestDetails(testData);
        
    } catch (error) {
        console.error('Error loading test data:', error);
    }
}

function displayTestDetails(testData) {
    removeDefaultText()
    const detailsContainer = document.getElementById('testDetailsContainer');

    console.log("testContainer and data", detailsContainer, testData)

    if (!testData || !testData.exercices) {
        detailsContainer.innerHTML = '<p>No test data available.</p>';
        return;
    }

    detailsContainer.innerHTML = `${testData.testname}`
    sebButton = document.createElement('div')
    sebButton.id = `sebButton${1}`
    sebButton.className = 'sebButton'
    sebButton.textContent = 'Open SEB'
    sebButton.setAttribute('onclick', 'openSeb()')
    detailsContainer.appendChild(sebButton)
}

function removeDefaultText(){
  const alertWrapper = document.querySelector('.alertWrapper')
  const listContainer = document.querySelector('.listContainer')
  alertWrapper.style.display = 'none'
  listContainer.style.alignItems = 'center'

}


async function openSeb() {
  console.log("opening SEB");

  // Get parameters from your HTML elements

  // const studentName = sessionStorage.getItem('userName')
  const studentName = 'student'

  // Construct the request body
  const requestBody = {
      configFile: configFile,
      teacherName: teacherName,
      studentName: studentName,
      testId: testId
  };

  try {
      // Send POST request to modify the SEB file
      const response = await fetch('/solve-test', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody)
      });

      if (response.ok) {
          // If the request is successful, construct the SEB file URL
          const sebFileUrl = `seb://${testId}.seb?testId=${testId}&teacherName=${encodeURIComponent(teacherName)}&studentName=${encodeURIComponent(studentName)}`;

          // Open the SEB file
          console.log(`Navigating to: ${sebFileUrl}`);
          window.location.href = sebFileUrl;
      } else {
          console.error("Failed to modify SEB file:", response.statusText);
      }
  } catch (error) {
      console.error("Error during fetch:", error);
  }
}

  









//! STORAGE
//! STORAGE
//! STORAGE


