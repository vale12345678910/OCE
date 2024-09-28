  let configKey = undefined
  

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

        teachersName = testData.teachersName
        displayTestDetails(testData);
        if(testData.configKey){
          configKey = testData.configKey
        }
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

function openSeb() {
  console.log("opening SEB")

  if(!configKey){
    console.log("no config key -> (changing)")
    configKey = '80547f33d9b5e04ec37d0e8eb7a908ab9c1b330c7307ccf0610c0f3a71acb9b6'
    }
    console.log(configKey)
    window.location.href = `seb://config=${configKey}?testId=${testId}`
  }
  









//! STORAGE
//! STORAGE
//! STORAGE


