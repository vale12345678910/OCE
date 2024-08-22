
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
    console.log("userName at loadTestList", userName);

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
        sendButton.textContent = 'Send';
        sendButton.className = 'commit';

        listItem.appendChild(sendButton);

        let detailsContainer = document.createElement('div');
        detailsContainer.className = 'test-details';
        detailsContainer.style.display = 'none';

        listItem.appendChild(detailsContainer);

        listItem.addEventListener('click', async (event) => {
            if (event.target !== sendButton) {
                if (detailsContainer.style.display === 'none') {
                    await loadTestDetails(fileName, detailsContainer);
                }
                detailsContainer.style.display = detailsContainer.style.display === 'none' ? 'block' : 'none';
            }
        });

        sendButton.addEventListener('click', async () => {
            const testData = await fetchTestData(fileName); // Retrieve the test data
            saveTest(testData); // Pass the test data to commitTest
        });

        list.appendChild(listItem);
    });

    container.appendChild(list);
}

async function fetchTestData(fileName) {
    const userName = 'adrian.lüthi';
    try {
        const response = await fetch(`/api/loadTest?userName=${encodeURIComponent(userName)}&fileName=${encodeURIComponent(fileName)}`);
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error loading test data:', error);
        return null;
    }
}

//END



async function loadTestDetails(fileName, detailsContainer) {
    
    // const userName = sessionStorage.getItem('userName')
    userName = 'adrian.lüthi'
    console.log("userName at loadTestDetails", userName)

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


async function saveTest() {
    const testValues = {
        testname: "demotest",
        exercices: [/* your exercises data */]
    };

    try {
        const response = await fetch('/api/saveTest', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testValues)
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        const testId = data.testId;

        // Share this testId with the student
        console.log(`Test saved successfully. Share this ID with the student: ${testId}`);
    } catch (error) {
        console.error('Error saving test:', error);
    }
}


// Main script execution
document.addEventListener('DOMContentLoaded', () => {
    // Initial load of test list
    loadTestList();
});




