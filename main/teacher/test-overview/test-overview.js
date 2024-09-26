
let exCount = 0;
let testCount = 1;
let test = document.createElement("div");
let i = 1;
let configKey = undefined


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
    const userName = "dummyLP";
    console.log("userName at loadTestList", userName);

    try {
        const response = await fetch(`/api/listTests?userName=${encodeURIComponent(userName)}`);
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }
        testData = await response.json();
        removeDefaultText();
        displayTestList(testData);
    } catch (error) {
        console.error('Error loading test list:', error);
    }
}


async function displayTestList(testData) {
    const container = document.getElementById('testValuesContainer');
    container.innerHTML = '';

    if (testData.length === 0) {
        container.innerHTML = '<p>No tests available.</p>';
        return;
    }

    const list = document.createElement('ul');
    testData.forEach(fileName => {
        const listItem = document.createElement('li');
        listItem.textContent = fileName.replace('.json', '');
        
        fileNameVar = fileName

        let sendButton = document.createElement('div');
        sendButton.textContent = 'Send';
        sendButton.className = 'commit';
        listItem.appendChild(sendButton);

        let configKeyInput = document.createElement('input');
        configKeyInput.placeholder = 'Cofiguration Key (optional/no password)'
        configKeyInput.className = 'configKeyClass'
        listItem.appendChild(configKeyInput)

        configKeyInput.addEventListener('input', (event) => {
            configKey = event.target.value
            console.log(configKey)
        }) 
        

        // Create the container for test details (initially hidden)
        const detailsContainer = document.createElement('div');
        detailsContainer.className = 'test-details';
        detailsContainer.style.display = 'none';
        listItem.appendChild(detailsContainer);

        // Event listener for list item click (except the send button)
        listItem.addEventListener('click', async (event) => {
            if (event.target !== sendButton && event.target !== configKeyInput) {
                if (detailsContainer.style.display === 'none') {
                    await loadTestDetails(fileName, detailsContainer); // Assuming this function loads details
                }
                detailsContainer.style.display = detailsContainer.style.display === 'none' ? 'block' : 'none';
            }
        });

        sendButton.addEventListener('click', async (event) => {
            event.stopPropagation(); // Prevent the list item click event
            saveTest(testData); // Pass the test data to saveTest (or commitTest, depending on your function)
        });

        // Append everything to the list item
        listItem.appendChild(detailsContainer); // Append details container, if needed

        // Append the list item to the list
        list.appendChild(listItem);
    });

    // Append the list to the container
    container.appendChild(list);
}



async function loadTestDetails(fileName, detailsContainer) {
    
    // const userName = sessionStorage.getItem('userName')
    userName = 'dummyLP'

    try {
        const response = await fetch(`/api/loadTest?userName=${encodeURIComponent(userName)}&fileName=${encodeURIComponent(fileName)}`);
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }
        testData = await response.json();
        displayTestDetails(testData, detailsContainer);
        console.log('testData at load testDetails', testData)
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
            <pre><code>${ex.editorContent}</code></pre>
            <p id='points'>Points: ${ex.ponits}</p>
            <div id='line'></div>
        `).join('')}

        
    `;
}


async function saveTest() {
    detailsContainer = document.createElement('div')
    await loadTestDetails(fileNameVar, detailsContainer)
    console.log("testData:", testData, testData.exercices)
    const testValues = {
        testname: "demotest",
        exercices: testData.exercices,
        configKey: configKey
    }

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
        sessionStorage.setItem('testId', testId)
    } catch (error) {
        console.error('Error saving test:', error);
    }
}






document.addEventListener('DOMContentLoaded', () => {
    loadTestList();
});




