

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
        configKey = testData.configKey
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





// async function openSeb() {

//     console.log("configKey before checking for configkey:", configKey)
//     if(!configKey){
//         configKey = '5b1a30fac20047d3af42b3cdbddb86be836fe0988411a28618f1e6b6b6be8914'
//     }
//     console.log("configKey opening with:", configKey)
//     window.location.href = `seb://config=${configKey}`
// }


async function openSeb() {
    console.log("configKey before checking for configKey:", configKey);
    if (!configKey) {
        configKey = '5b1a30fac20047d3af42b3cdbddb86be836fe0988411a28618f1e6b6b6be8914';
    }
    console.log("configKey opening with:", configKey);
    
    // Fetch the student name from session storage
    const studentName = sessionStorage.getItem('userName');



    // Prepare the data to send
    const data = {
        testId: testId,
        studentName: studentName
    };

    // Send the data to the server
    await appendStudentNameToJson(data);
    
    // Open SEB with the config key
    window.location.href = `seb://config=${configKey}`;
}

async function appendStudentNameToJson(data) {
    try {
        const response = await fetch('/api/replace-student-name', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Failed to replace student name');
        }
        
        console.log('Student name replace successfully');
    } catch (error) {
        console.error('Error:', error);
    }
}



//! STORAGE
//! STORAGE
//! STORAGE
