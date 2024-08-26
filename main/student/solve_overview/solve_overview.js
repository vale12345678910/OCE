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
}






























//   document.addEventListener('DOMContentLoaded', () => {
//     const testName = 'demotest'; // You can dynamically set this based on the test you want to load
  

//     fetch(`/api/getStudentData?testName=${encodeURIComponent(testName)}`)
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error(`Failed to fetch student data: ${response.status} ${response.statusText}`);
//             }
//             return response.json();
//         })
//         .then(data => {
//           // Display the received data on the student page
//           const teacherName = data.userName
//           console.log("teacherName", teacherName)
//           const container = document.getElementById('testValuesContainer');
//           container.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`; // Removed extraneous $
      
//           // Create and append the sebLink div
//           const sebLink = document.createElement('div');
//           sebLink.textContent = 'solve'
//           sebLink.setAttribute('onclick', 'openSeb()')
//           sebLink.className = 'sebLink';
//           sebLink.id = `sebLink${i}`;
//           i++;
//           container.appendChild(sebLink);

//           const chooseCofigurationFile = document.createElement('div')
//         })
//         .catch(error => {
//             console.error('Error fetching student data:', error.message);
//         });
// });


// function openSeb(){

//   console.log("Attempting to open SEB");

//   // Define the URL that will be opened inside SEB
//   const sebUrl = "seb://C:\Users\valer\AppData\Roaming\SafeExamBrowser\CreateTestTry.seb";

//   // Attempt to open SEB with the specified URL
//   window.location.href = sebUrl;
// }