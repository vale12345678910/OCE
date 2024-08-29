
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
    const userName = "dummyLP";
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


//FUNCTION COMES HERE
async function displayTestList(testFiles) {
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

        // Create and append the "Send" button
        let sendButton = document.createElement('div');
        sendButton.textContent = 'Send';
        sendButton.className = 'commit';
        listItem.appendChild(sendButton);

        // Create the "Choose Config. File" button
        let chooseFile = document.createElement('div');
        chooseFile.textContent = 'Choose Config. File';
        chooseFile.className = 'chooseButton';

        // Create the hidden file input
        let fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.style.display = 'none'; // Hide the file input

        // Create the container for displaying the selected file
        let fileList = document.createElement('div');
        fileList.className = 'fileList';

        // Event listener for the chooseFile button
        chooseFile.addEventListener('click', function() {
            fileInput.click(); // Trigger the file input click
        });

        // Event listener for when a file is selected
        fileInput.addEventListener('change', function() {
            const file = fileInput.files[0]; // Only get the first file
    //end

            fileList.innerHTML = '';

            if (file) {
                fileVar = file
                console.log("file:", file)
                // Append the selected file name to the fileList div
                const fileItem = document.createElement('div');
                fileItem.textContent = `Selected File: ${file.name}`;
                fileList.appendChild(fileItem);
            }
        });

        // Create the container for test details (initially hidden)
        let detailsContainer = document.createElement('div');
        detailsContainer.className = 'test-details';
        detailsContainer.style.display = 'none';
        listItem.appendChild(detailsContainer);

        // Event listener for list item click (except the send button)
        listItem.addEventListener('click', async (event) => {
            if (event.target !== sendButton) {
                if (detailsContainer.style.display === 'none') {
                    await loadTestDetails(fileName, detailsContainer); // Assuming this function loads details
                }
                detailsContainer.style.display = detailsContainer.style.display === 'none' ? 'block' : 'none';
            }
        });

        // Event listener for the send button click
        sendButton.addEventListener('click', async () => {
            const testData = await fetchTestData(fileName); // Retrieve the test data
            console.log("filename at input:")
            saveTest(testData); // Pass the test data to saveTest (or commitTest, depending on your function)
        });

        // Append everything to the list item
        listItem.appendChild(chooseFile);
        listItem.appendChild(fileInput);
        listItem.appendChild(fileList);

        // Append the list item to the list
        list.appendChild(listItem);
    });

    // Append the list to the container
    container.appendChild(list);
}








async function fetchTestData(fileName) {
    const userName = 'dummyLP';
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
    userName = 'dummyLP'
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
    await saveFile()
    const testValues = {
        testname: "demotest",
        exercices: [/* your exercises data */],
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
    } catch (error) {
        console.error('Error saving test:', error);
    }
}



// Main script execution
document.addEventListener('DOMContentLoaded', () => {
    // Initial load of test list
    loadTestList();
});










//test





async function saveFile() {
    try {
        const formData = new FormData();
        formData.append('file', fileVar);  // Ensure 'file' is the field name used on the server

        const response = await fetch('http://127.0.0.1:3000/upload', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error: ${response.statusText}. Server Response: ${errorText}`);
        }

        const data = await response.json();
        console.log('File uploaded:', data.filePath);
    } catch (error) {
        console.error('Error:', error);
    }
}


