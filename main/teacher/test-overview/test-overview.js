
let exCount = 0;
let testCount = 1;
let test = document.createElement("div");
let i = 1;

test.className = "test";
test.id = "test" + testCount;

// Event listeners for navigation buttons
document.getElementById("testsCreator").addEventListener("click", function() {
    window.location.href = '../test-creator/test-creator.html';
});

document.getElementById("createTest").addEventListener("click", function() {
    window.location.href = '../test-creator/test-creator.html';
});

document.getElementById("Recieve").addEventListener("click", function() {
    window.location.href = '../recieve/recieve.html';
});

document.getElementById("Correct").addEventListener("click", function() {
    window.location.href = '../correct/correct.html';
});

// Function to remove default text
function removeDefaultText() {
    const alertWrapper = document.querySelector(".alertWrapper");
    if (alertWrapper) {
        alertWrapper.style.display = "none";
        console.log("Wrapper Removed");
    }
}

// Function to load and display the list of tests
async function loadTestList() {
    const userName = "adrian.lüthi";
    console.log("userName", userName);

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

// Function to display the list of tests
function displayTestList(testFiles) {
    const container = document.getElementById('testValuesContainer');
    container.innerHTML = '';

    if (testFiles.length === 0) {
        container.innerHTML = '<p>No tests available.</p>';
        return;
    }

    const list = document.createElement('ul');
    testFiles.forEach(fileName => {
        const listItem = document.createElement('li');
        listItem.textContent = fileName.replace('.json', '');

        let sendButton = document.createElement('div');
        sendButton.setAttribute('onclick', 'commitTest()')
        sendButton.textContent = 'Send'
        sendButton.className = 'commit'

        listItem.appendChild(sendButton)
        // Create a container for the test details
        let detailsContainer = document.createElement('div');
        detailsContainer.className = 'test-details';
        detailsContainer.style.display = 'none'; // Initially hidden

        
        listItem.appendChild(detailsContainer);

        // Add click event to unroll and load test details
        listItem.addEventListener('click', (event) => {
          // Check if the clicked target is not the Send button
          if (event.target !== sendButton) {
              if (detailsContainer.style.display === 'none') {
                  loadTestDetails(fileName, detailsContainer);
              }
              detailsContainer.style.display = detailsContainer.style.display === 'none' ? 'block' : 'none';
          }
      });

        list.appendChild(listItem);
    });

    container.appendChild(list);
}

// Function to load test details when a test is clicked
async function loadTestDetails(fileName, detailsContainer) {
    const userName = localStorage.getItem('userName');

    try {
        const response = await fetch(`/api/loadTest?userName=${encodeURIComponent(userName)}&fileName=${encodeURIComponent(fileName)}`);
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }
        const testData = await response.json();
        displayTestDetails(testData, detailsContainer);
    } catch (error) {
        console.error('Error loading test details:', error);
    }
}

// Function to display test details within the specific test's div
function displayTestDetails(testData, detailsContainer) {
    if (!testData) {
        detailsContainer.innerHTML = '<p>No details available.</p>';
        return;
    }

    detailsContainer.innerHTML = `
        ${testData.exercices.map(ex => `
            <div class="exercise-header">
                <p id='title'>${ex.title}</p>
            </div>
            <p>${ex.description}</p>
            <p id='content'>${ex.editorContent}</p>
            <p id='points'>Points: ${ex.ponits}</p>
            <div id='line'></div>
        `).join('')}

        
    `;
}


function commitTest() {
    const userName = "adrian.lüthi";
    const fileName = 'demotest.json'; // Example file

    fetch('/api/commitTest', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            userName: userName,
            fileName: fileName,
            targetUrl: 'http://127.0.0.1:3000/api/solve_overview' // Updated to the new endpoint
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Failed to commit file to server: ${response.status} ${response.statusText}`);
        }
        return response.text();
    })
    .then(result => console.log('File committed successfully:', result))
    .catch(error => {
        console.error('Error:', error.message);
        console.error('Details:', error);
    });
}

  


// Main script execution
document.addEventListener('DOMContentLoaded', () => {
    // Initial load of test list
    loadTestList();
});






