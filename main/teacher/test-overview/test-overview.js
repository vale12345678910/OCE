
let exCount = 0;
let testCount = 1;
let test = document.createElement("div");
let i = 1;
let configFileInput = undefined
const teachersName = sessionStorage.getItem('userName')



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
    userName = sessionStorage.getItem('userName')
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

        let configFileInput = document.createElement('input');
        configFileInput.type = 'file'
        configFileInput.accept = '.seb'
        configFileInput.placeholder = 'Upload Configuration file (.seb)'
        configFileInput.id = 'configFileInput'
        listItem.appendChild(configFileInput)

        configFileInput.addEventListener('input', (event) => {
            configFileInput = event.target.value
            console.log(configFileInput)
        }) 
        

        // Create the container for test details (initially hidden)
        const detailsContainer = document.createElement('div');
        detailsContainer.className = 'test-details';
        detailsContainer.style.display = 'none';
        listItem.appendChild(detailsContainer);

        // Event listener for list item click (except the send button)
        listItem.addEventListener('click', async (event) => {
            if (event.target !== sendButton && event.target !== configFileInput) {
                if (detailsContainer.style.display === 'none') {
                    await loadTestDetails(fileName, detailsContainer); // Assuming this function loads details
                }
                detailsContainer.style.display = detailsContainer.style.display === 'none' ? 'block' : 'none';
            }
        });

        sendButton.addEventListener('click', async (event) => {
            event.stopPropagation(); // Prevent the list item click event

            await saveTest(testData); // Pass the test data to saveTest (or commitTest, depending on your function)
            
            await uploadFile()
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
            <div class="exerciseDiv">
                <p id='title' class='titleEx'>${ex.title}</p>
                <p class='descEx'>${ex.description}</p>
                <p id='points'>Points: ${ex.ponits}</p>
                <pre><code>Code:<br>${ex.editorContent}</code></pre>
                
                <div id='line'></div>
            </div>
        `).join('')}

        
    `;
}


async function saveTest() {
    detailsContainer = document.createElement('div')
    await loadTestDetails(fileNameVar, detailsContainer)
    console.log("testData:", testData, testData.exercices)
    console.log("testname:", testData.testname)
    const testValues = {
        teachersName: teachersName,
        testname: testData.testname,
        exercices: testData.exercices,
        configFileInput: configFileInput
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
        testId = data.testId;

        // Share this testId with the student
        alert(`Test saved successfully. Share this ID with the students: ${testId}`);
        // sessionStorage.setItem('testId', testId)
    } catch (error) {
        console.error('Error saving test:', error);
    }
}


async function uploadFile() {

    const fileInput = document.getElementById('configFileInput');

    if (fileInput.files.length === 0) {
        alert('no file selected!')
        return;
    }

    const file = fileInput.files[0];

    // Ensure it's a .seb file
    if (file.name.split('.').pop() !== 'seb') {
        alert('invalid file type!')
        return;
    }

    const formData = new FormData();
    formData.append('sebFile', file);
    formData.append('testId', testId)

    try {
        const response = await fetch('/upload-seb', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (result.success) {
            console.log('uploadStatus: succsessfull')
        } else {
            console.location('uploadStatus: failed')
        }
    } catch (error) {
        console.error("Error:", error);
    }
}





document.addEventListener('DOMContentLoaded', () => {
    loadTestList();
});




