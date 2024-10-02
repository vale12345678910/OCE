
let exCount = 0;
let testCount = 1;
let test = document.createElement("div");
let i = 1;
let configFileInput = undefined
const teachersName = sessionStorage.getItem('userName')



test.className = "test";
test.id = "test" + testCount;

// Event listeners for navigation buttons
document.querySelectorAll('.createTestPage').forEach((button) => {
    button.addEventListener('click', () => {
        window.location.href = '../test-creator/test-creator.html'
    })
})

document.getElementById("Recieve").addEventListener("click", function() {
    window.location.href = '../recieve/recieve.html';
});

document.getElementById("Correct").addEventListener("click", function() {
    window.location.href = '../correct/correct.html';
});

// Function to remove default text
function removeDefaultText() {
    const alertWrapper = document.querySelector(".alertWrapper");
    const testDataWrapper = document.querySelector('.testDataWrapper')
    const listContainer = document.querySelector('.listContainer')
    if (alertWrapper) {
        alertWrapper.style.display = "none";
        testDataWrapper.style.display = 'flex'
        listContainer.style.justifyContent = 'left'
        listContainer.style.alignItems = 'top'
        
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

        if(testData.length === 0){
            return
        } else{
            removeDefaultText();
            displayTestList(testData);
        }
    } catch (error) {
        console.error('Error loading test list:', error);
    }
}


async function displayTestList(testData) {
    const container = document.getElementById('testValuesContainer');
    container.innerHTML = '';

    const list = document.createElement('ul');
    testData.forEach(fileName => {
        const listItem = document.createElement('li');
        listItem.textContent = fileName.replace('.json', '');

        let sendButton = document.createElement('div');
        sendButton.textContent = 'Send';
        sendButton.className = 'commit';
        listItem.appendChild(sendButton);

        let configFileInput = document.createElement('input');
        configFileInput.type = 'file';
        configFileInput.accept = '.seb';
        configFileInput.placeholder = 'Upload Configuration file (.seb)';
        listItem.appendChild(configFileInput);

        // Create the container for test details (initially hidden)
        const detailsContainer = document.createElement('div');
        detailsContainer.className = 'test-details';
        detailsContainer.style.display = 'none';
        listItem.appendChild(detailsContainer);

        // Event listener for list item click (except the send button)
        listItem.addEventListener('click', async (event) => {
            if (event.target !== sendButton && event.target !== configFileInput) {
                if (detailsContainer.style.display === 'none') {
                    await loadTestDetails(fileName, detailsContainer); // Load details for the clicked test
                }
                detailsContainer.style.display = detailsContainer.style.display === 'none' ? 'block' : 'none';
            }
        });

        sendButton.addEventListener('click', async (event) => {
            event.stopPropagation(); // Prevent the list item click event

            // Send the current test data and the selected config file
            await saveTest(fileName, configFileInput.files[0]); 
        });

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


async function saveTest(fileName, configFile) {
    // Load test details based on the specific clicked test
    const detailsContainer = document.createElement('div');
    await loadTestDetails(fileName, detailsContainer);

    const testValues = {
        teachersName: teachersName,
        testname: testData.testname,
        exercices: testData.exercices,
        configFileInput: configFile ? configFile.name : null // Handle the selected file
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

        console.log('testdata', testValues)
        const data = await response.json();
        testId = data.testId;

        // Share this testId with the student
        alert(`Test saved successfully. Share this ID with the students: ${testId}`);
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




