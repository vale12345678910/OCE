document.addEventListener('DOMContentLoaded', () => {
    const userName = 'dummyLP'; // Use your session storage or user context as needed
    fetch(`/recieveTest?userName=${encodeURIComponent(userName)}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('data:', data);
            displayTests(data); // Pass the entire array of tests to displayTests
        })
        .catch(error => {
            console.error('Error fetching received tests:', error);
            const container = document.getElementById('testValuesContainer');
            container.innerHTML = '<p>Error loading tests. Please try again later.</p>';
        });
});

function displayTests(receivedTests) {
    const container = document.getElementById('testValuesContainer');
    container.innerHTML = ''; // Clear any existing content

    // Check if receivedTests is defined and is an object
    if (!receivedTests || !Array.isArray(receivedTests) || receivedTests.length === 0) {
        container.innerHTML = '<p>No tests received.</p>'; // Provide user feedback
        return;
    } else {
        removeDefaultText();
    }

    // Loop through each received test
    receivedTests.forEach(test => {
        // Create a div for each test
        const testDiv = document.createElement('div');
        testDiv.className = 'test';
        
        // Format test details
        testDiv.innerHTML = `
            <h3 id='testTitle'>Test: ${test.testId}</h3>
            <p><strong>Student Name:</strong> ${test.studentName} (handed in)</p>
            <hr style="margin-right: 1em;">

        `;

        // Append the test div to the container
        container.appendChild(testDiv);
    });
}

function removeDefaultText() {
    const alertWrapper = document.querySelector('.alertWrapper');
    if (alertWrapper) { // Ensure alertWrapper exists
        alertWrapper.remove();
    }
}



document.getElementById("testsOverview").addEventListener("click", function(){
    window.location.href = '../test-overview/test-overview.html'
  })
  
  
  document.getElementById("testsCreator").addEventListener("click", function(){
    window.location.href = '../test-creator/test-creator.html'
  })
  
  document.getElementById("Correct").addEventListener("click", function(){
    window.location.href = '../correct/correct.html'
  })