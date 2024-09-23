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
    const testId = prompt("Enter the test ID provided by your teacher:");
    
  

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
        displayTestDetails(testData);
        console.log("testName:", testData.testname)
        console.log('cofigKey:', testData.configKey)
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
    console.log("creating element")
    sebButton = document.createElement('div')
    sebButton.id = `sebButton${1}`
    sebButton.className = 'sebButton'
    sebButton.textContent = 'Solve in SEB'
    sebButton.setAttribute('onclick', 'openSeb()')
    detailsContainer.appendChild(sebButton)
}

function removeDefaultText(){
  const alertWrapper = document.querySelector('.alertWrapper')
  const listContainer = document.querySelector('.listContainer')
  alertWrapper.style.display = 'none'
  listContainer.style.alignItems = 'flex-start'

}

function openSeb() {
  console.log("opening SEB")

  if(!configKey){
    console.log("no config key -> (changing)")
    configKey = 'b006c79091967e5000c1896ba2184ae884d34f534c93ba5b0473407de306339b'
    }
    console.log(configKey)
    window.location.href = `seb://config=${configKey}`
  }
  









//! STORAGE
//! STORAGE
//! STORAGE


