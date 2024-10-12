//! Structured Code

let exCount = 0;
let testCount = 1;
let test = document.createElement("div");
let i = 1;
let configKeyInput = undefined;
const teachersName = sessionStorage.getItem('userName');

test.className = "test";
test.id = "test" + testCount;

//! Event listeners for navigation buttons
document.querySelectorAll('.createTestPage').forEach((button) => {
    button.addEventListener('click', () => {
        window.location.href = '../test-creator/test-creator.html';
    });
});

document.getElementById("Recieve").addEventListener("click", function() {
    window.location.href = '../recieve/recieve.html';
});

document.getElementById("Correct").addEventListener("click", function() {
    window.location.href = '../correct/correct.html';
});

//! Function to remove default text
function removeDefaultText() {
    const alertWrapper = document.querySelector(".alertWrapper");
    const testDataWrapper = document.querySelector('.testDataWrapper');
    const listContainer = document.querySelector('.listContainer');
    if (alertWrapper) {
        alertWrapper.style.display = "none";
        testDataWrapper.style.display = 'flex';
        listContainer.style.justifyContent = 'left';
        listContainer.style.alignItems = 'top';
    }
}

//! Function to load and display the list of tests
async function loadTestList() {
    userName = sessionStorage.getItem('userName');

    try {
        const response = await fetch(`/api/listTests?userName=${encodeURIComponent(userName)}`);

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }
        testData = await response.json();

        if(testData.length === 0){
            return;
        } else{
            removeDefaultText();
            displayTestList(testData);
        }
    } catch (error) {
        console.error('Error loading test list:', error);
    }
}

//! Function to display the list of tests
async function displayTestList(testData) {
    const container = document.getElementById('testValuesContainer');
    container.innerHTML = '';

    const list = document.createElement('ul');
    testData.forEach(fileName => {
        const listItem = document.createElement('li');
        listItem.textContent = fileName.replace('.json', '');

        //! Create a button for sending test data
        let sendButton = document.createElement('div');
        sendButton.textContent = 'Send to students';
        sendButton.className = 'commit';
        listItem.appendChild(sendButton);

        //! Create a tooltip for configuration key information
        const tooltip_info = document.createElement('p');
        tooltip_info.className = 'tooltip';
        tooltip_info.textContent = "To get the configuration key, open or create a file in the SEB Configuration Tool. Under 'Exam,' check the box for 'Use Browser Exam Key and Configuration Key.' When left empty, the password for existing SEB won't be set.";

        const info = document.createElement('span');
        info.textContent = 'info';
        info.className = 'material-symbols-outlined';
        info.id = 'info';

        const tooltipContainer = document.createElement('div');
        tooltipContainer.className = 'tooltipContainer';

        tooltipContainer.appendChild(tooltip_info);
        tooltipContainer.appendChild(info);

        //! Create input for configuration key
        const configKeyInput = document.createElement('input');
        configKeyInput.type = 'text';
        configKeyInput.placeholder = 'Configuration Key';
        configKeyInput.className = 'configKeyClass';

        const infoContainer = document.createElement('div');
        infoContainer.className = 'infoContainer';
        infoContainer.appendChild(tooltipContainer);
        infoContainer.appendChild(configKeyInput);

        listItem.appendChild(infoContainer);

        configKeyInput.addEventListener('input', function() {
            configKey = configKeyInput.value;
        });

        //! Create the container for test details (initially hidden)
        const detailsContainer = document.createElement('div');
        detailsContainer.className = 'test-details';
        detailsContainer.style.display = 'none';
        listItem.appendChild(detailsContainer);

        //! Event listener for list item click (except the send button)
        listItem.addEventListener('click', async (event) => {
            if (event.target !== sendButton && event.target !== configKeyInput) {
                if (detailsContainer.style.display === 'none') {
                    await loadTestDetails(fileName, detailsContainer); // Load details for the clicked test
                }
                detailsContainer.style.display = detailsContainer.style.display === 'none' ? 'block' : 'none';
            }
        });

        sendButton.addEventListener('click', async (event) => {
            event.stopPropagation(); // Prevent the list item click event

            //! Get the current configuration key for this test
            configKey = configKeyInput.value || undefined;

            //! Send the current test data and the entered configuration details
            await saveTest(fileName, configKey); 
        });

        // Append the list item to the list
        list.appendChild(listItem);
    });

    // Append the list to the container
    container.appendChild(list);
}

//! Function to load test details for the specified test
async function loadTestDetails(fileName, detailsContainer) {
    try {
        const response = await fetch(`/api/loadTest?userName=${encodeURIComponent(userName)}&fileName=${encodeURIComponent(fileName)}`);
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }
        testData = await response.json();
        displayTestDetails(testData, detailsContainer);
    } catch (error) {
        console.error('Error loading test details:', error);
    }
}

//! Function to display test details within the specific test's div
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
                <p id='points'>Points: ${ex.points}</p>
                <pre><code>Code:<br>${ex.editorContent}</code></pre>
                <p id='testcase'>Testcase: ${ex.testcase}</p>
                
                <div id='line'></div>
            </div>
        `).join('')}
    `;
}

//! Function to save the test
async function saveTest(fileName, configFile) {
    // Load test details based on the specific clicked test
    const detailsContainer = document.createElement('div');
    await loadTestDetails(fileName, detailsContainer);

    const testValues = {
        teachersName: teachersName,
        testname: testData.testname,
        exercices: testData.exercices,
        configKey: configKey
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
        testId = data.testId;

        //! Share this testId with the student
        alert(`Test saved successfully. Share this ID with the students: ${testId}`);
    } catch (error) {
        console.error('Error saving test:', error);
    }
}

//! Initialize the page and load test list
document.addEventListener('DOMContentLoaded', () => {
    alert('VERY IMPORTANT!: When creating a SEB Configuration File make sure to set the starting URL the following: http://127.0.0.1:3000/main/student/solve/solve.html');
    loadTestList();
});


















//! Original Code for backup

// let exCount = 0;
// let testCount = 1;
// let test = document.createElement("div");
// let i = 1;
// let configKeyInput = undefined
// const teachersName = sessionStorage.getItem('userName')


// test.className = "test";
// test.id = "test" + testCount;

// // Event listeners for navigation buttons
// document.querySelectorAll('.createTestPage').forEach((button) => {
//     button.addEventListener('click', () => {
//         window.location.href = '../test-creator/test-creator.html'
//     })
// })

// document.getElementById("Recieve").addEventListener("click", function() {
//     window.location.href = '../recieve/recieve.html';
// });

// document.getElementById("Correct").addEventListener("click", function() {
//     window.location.href = '../correct/correct.html';
// });

// // Function to remove default text
// function removeDefaultText() {
//     const alertWrapper = document.querySelector(".alertWrapper");
//     const testDataWrapper = document.querySelector('.testDataWrapper')
//     const listContainer = document.querySelector('.listContainer')
//     if (alertWrapper) {
//         alertWrapper.style.display = "none";
//         testDataWrapper.style.display = 'flex'
//         listContainer.style.justifyContent = 'left'
//         listContainer.style.alignItems = 'top'
        
//         console.log("Wrapper Removed");
//     }
// }

// // Function to load and display the list of tests
// async function loadTestList() {
//     userName = sessionStorage.getItem('userName')
//     console.log("userName at loadTestList", userName);

//     try {
//         const response = await fetch(`/api/listTests?userName=${encodeURIComponent(userName)}`);

//         if (!response.ok) {
//             throw new Error(`Error: ${response.statusText}`);
//         }
//         testData = await response.json();

//         if(testData.length === 0){
//             return
//         } else{
//             removeDefaultText();
//             displayTestList(testData);
//         }
//     } catch (error) {
//         console.error('Error loading test list:', error);
//     }
// }


// async function displayTestList(testData) {
//     const container = document.getElementById('testValuesContainer');
//     container.innerHTML = '';

//     const list = document.createElement('ul');
//     testData.forEach(fileName => {
//         const listItem = document.createElement('li');
//         listItem.textContent = fileName.replace('.json', '');

//         // Create a button for sending test data
//         let sendButton = document.createElement('div');
//         sendButton.textContent = 'Send';
//         sendButton.className = 'commit';
//         listItem.appendChild(sendButton);

//         // Create a text input for configuration details

//         const tooltip_info = document.createElement('p')
//         tooltip_info.className = 'tooltip'
//         tooltip_info.textContent = "To get the configuration key, open or create a file in the SEB Configuration Tool. Under 'Exam,' check the box for 'Use Browser Exam Key and Configuration Key.' When left empty, the password for existing SEB won't be set."

//         const info = document.createElement('span')
//         info.textContent = 'info'
//         info.className = 'material-symbols-outlined'
//         info.id = 'info'

//         const tooltipContainer = document.createElement('div')
//         tooltipContainer.className = 'tooltipContainer'

//         tooltipContainer.appendChild(tooltip_info)
//         tooltipContainer.appendChild(info)

//         const configKeyInput = document.createElement('input');
//         configKeyInput.type = 'text';
//         configKeyInput.placeholder = 'Configuration Key';
//         configKeyInput.className = 'configKeyClass'

//         const infoContainer = document.createElement('div')
//         infoContainer.className = 'infoContainer'
//         infoContainer.appendChild(tooltipContainer)
//         infoContainer.appendChild(configKeyInput)

//         listItem.appendChild(infoContainer);

        
//         configKeyInput.addEventListener('input', function(){
//             configKey = configKeyInput.value
//             console.log("configKey:", configKey)
//         })


//         // Create the container for test details (initially hidden)
//         const detailsContainer = document.createElement('div');
//         detailsContainer.className = 'test-details';
//         detailsContainer.style.display = 'none';
//         listItem.appendChild(detailsContainer);

//         // Event listener for list item click (except the send button)
//         listItem.addEventListener('click', async (event) => {
//             if (event.target !== sendButton && event.target !== configKeyInput) {
//                 if (detailsContainer.style.display === 'none') {
//                     await loadTestDetails(fileName, detailsContainer); // Load details for the clicked test
//                 }
//                 detailsContainer.style.display = detailsContainer.style.display === 'none' ? 'block' : 'none';
//             }
//         });

//         sendButton.addEventListener('click', async (event) => {
//             event.stopPropagation(); // Prevent the list item click event

//             // Get the current configuration key for this test
//             configKey = configKeyInput.value || undefined;
//             console.log(`Config key for test ${fileName}:`, configKey);

//             // Send the current test data and the entered configuration details
//             await saveTest(fileName, configKey); 
//         });


//         // Append the list item to the list
//         list.appendChild(listItem);
//     });

//     // Append the list to the container
//     container.appendChild(list);

// }




// async function loadTestDetails(fileName, detailsContainer) {

//     try {
//         const response = await fetch(`/api/loadTest?userName=${encodeURIComponent(userName)}&fileName=${encodeURIComponent(fileName)}`);
//         if (!response.ok) {
//             throw new Error(`Error: ${response.statusText}`);
//         }
//         testData = await response.json();
//         displayTestDetails(testData, detailsContainer);
//         console.log('testData at load testDetails', testData)
//     } catch (error) {
//         console.error('Error loading test details:', error);
//     }
// }

// // Function to display test details within the specific test's div

// function displayTestDetails(testData, detailsContainer) {
//     if (!testData) {
//         detailsContainer.innerHTML = '<p>No details available.</p>';
//         return;
//     }

//     detailsContainer.innerHTML = `
//         ${testData.exercices.map(ex => `
//             <div class="exerciseDiv">
//                 <p id='title' class='titleEx'>${ex.title}</p>
//                 <p class='descEx'>${ex.description}</p>
//                 <p id='points'>Points: ${ex.points}</p>
//                 <pre><code>Code:<br>${ex.editorContent}</code></pre>
//                 <p id='testcase'>Testcase: ${ex.testcase}</p>
                
//                 <div id='line'></div>
//             </div>
//         `).join('')}

        
//     `;
// }


// async function saveTest(fileName, configFile) {
//     // Load test details based on the specific clicked test
//     const detailsContainer = document.createElement('div');
//     await loadTestDetails(fileName, detailsContainer);
//     console.log('cf:,', configFile)

//     const testValues = {
//         teachersName: teachersName,
//         testname: testData.testname,
//         exercices: testData.exercices,
//         configKey: configKey
//     };

//     try {
//         const response = await fetch('/api/saveTest', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify(testValues)
//         });

//         if (!response.ok) {
//             throw new Error(`Error: ${response.statusText}`);
//         }

//         console.log('testdata', testValues)
//         const data = await response.json();
//         testId = data.testId;

//         // Share this testId with the student
//         alert(`Test saved successfully. Share this ID with the students: ${testId}`);
//     } catch (error) {
//         console.error('Error saving test:', error);
//     }
// }


// document.addEventListener('DOMContentLoaded', () => {
//     alert('VERY IMPORTNAT!: When creating a SEB Configuration File make sure to set the starting URL the following: http://127.0.0.1:3000/main/student/solve/solve.html')
//     loadTestList();
// });




