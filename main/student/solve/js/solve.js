
let totalExercises = 0
const loadButton = document.getElementById("loadButton")
const fileInput = document.getElementById('fileInput');
const saveCode = document.getElementById("saveCode")


window.print = function(){
  alert('You are not using the correct language!')
}


let editor;

window.onload = function() {
    editor = ace.edit("editor");
    editor.setTheme("ace/theme/tomorrow_night_bright");
    editor.session.setMode("ace/mode/javascript")
    editor.setOptions({
      enableBasicAutocompletion: true,
      enableLiveAutocompletion: true
    });

    // Function to load default.js content into the editor
    function loadDefaultFile() {
      fetch('js/default.js')
          .then(response => response.text())
          .then(data => {
              editor.setValue(data, -1); // Set file content to the editor
          })
          .catch(error => console.error('Error loading default.js:', error));
  }

  // Call the function to load the file content
  loadDefaultFile();
//end

    editor.session.on("change", function(delta){
      const ace_content = editor.getValue();
    })
}



const output_place = document.getElementById("output")



let language = "node";

function changeLanguage() {
  language = $("#languages").val();

  if (language == 'python') {
    editor.session.setMode("ace/mode/python");
  } else {
    editor.session.setMode("ace/mode/javascript");
  }

  console.log("Language:", language);
}


function runCode() {
  var outputDiv = document.getElementById("output");
  if (language == "node") {
    console.log("js executed");
    var code = editor.getValue();
    var captured_output = '';
    outputDiv.className = "";
    
    // Override console.log to capture its output
    var original_console_log = console.log;
    console.log = function(output) {
      captured_output += output + '\n';
    };
    
    try {
      // Check for syntax errors by creating a Function from the code
      new Function(code); 
      // If there are no syntax errors, execute the code
      eval(code); 
      output_place.textContent = ""
      output_place.textContent = captured_output; // Display the captured output
      console.log = original_console_log; // Restore original console.log
    } catch (e) {
      outputDiv.className = "error_text"
      outputDiv.innerHTML = ""
      outputDiv.innerHTML = ("Error running the code:", e)
      console.error("Error running the code:", e);
      console.log = original_console_log; // Restore original console.log in case of error
    }
  } else {
    runPython()
  }
}

function runPython() {
  var code = editor.getValue();
  var outputDiv = document.getElementById("output");
  
  outputDiv.innerHTML = ''; // Clear previous output

  Sk.configure({
    output: function(text) {
      outputDiv.innerHTML += text + '\n';
    }
  });

  Sk.misceval.asyncToPromise(function() {
    return Sk.importMainWithBody("<stdin>", false, code, true);
  }).then(function() {
    console.log("Python code executed");
    outputDiv.className = "";
    
  }, function(err) {
    console.error("error:", err.toString());
    outputDiv.className = "error_text";
    outputDiv.innerHTML += "error: " + err.toString();
  });
}



//OWN CODE

const exerciseTitleTextInput = document.getElementById('exerciseTitleTextInput');
const exerciseDescTextInput = document.getElementById('exerciseDescTextInput');
const container_list = document.querySelector(".container_list") //where the saved ex. should go.



//! LOAD TEST
//! LOAD TEST
//! LOAD TEST

document.addEventListener('DOMContentLoaded', () =>{

  testId = prompt('enter the testId provided by your teacher')

  if(testId){
    loadTestById(testId)
  } else{
    alert('Test ID is required!')
  }
})



async function loadTestById(testId) {
  
  try {
      const response = await fetch(`/api/getTestById?testId=${encodeURIComponent(testId)}`);
      if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
      }
      const testData = await response.json();
      testDataVar = testData
      displayTestData(testData)
      console.log("testName:", testData.testname)
      console.log("testData", testData)
  } catch (error) {
      console.error('Error loading test data:', error);
  }
}




function displayTestData(testData) {
  let i = 1;

  const container_list = document.querySelector('.container_list');

  testData.exercices.forEach(exercise => {
    const exerciseDiv = document.createElement('div');
    exerciseDiv.className = 'exerciseDiv';
    exerciseDiv.id = `exerciseDiv${i}`;
    exerciseDiv.dataset.code = exercise.editorContent; // Store the editor code value in a data attribute
    exerciseDiv.optionstatus = exercise.optionstatus;
    exerciseDiv.title = exercise.title
    exerciseDiv.description = exercise.description
    exerciseDiv.onclick = ExerciseClicked;
    i++;
    exerciseDiv.innerHTML = `<p class="title_ex">${exercise.title}</p><p class="desc_ex">${exercise.description}</p>`;
    container_list.appendChild(exerciseDiv);
    totalExercises = i - 1 //Total Exercises
  });
}

function loadExerciseContent(code, optionstatus, title, desc) {
  
  if(optionstatus == 1){
    editor.setValue(code, 1)    
  } else{
    editor.setValue('', 1)
  }

  changeTitleAndDesc(title, desc);
}


function changeTitleAndDesc(title, desc) {
  const titleDiv = document.getElementById('title')
  const descDiv = document.getElementById('desc')

  titleDiv.textContent = title
  descDiv.textContent = desc
}




let savedExercises = {}; // Stores the saved exercises and their details
let savedExerciseIds = new Set();  // To track exercises that have been saved at least once

// Reference to the submit button
const submitTestButton = document.querySelector('.submitTest');
const submitTestText = document.getElementById('submitTestText')


saveCode.addEventListener('click', function() {
    // Get the currently selected exercise's div
    const selectedExercise = document.querySelector('.exerciseDiv.selected');
    
    if (!selectedExercise) {
        console.log("No exercise selected!");
        return; // Exit if no exercise is selected
    }

    // Get the exercise ID
    const exerciseId = selectedExercise.id.replace('exerciseDiv', '');
    
    // Get the code from the editor
    const currentCode = editor.getValue();
    
    // Create or update the exercise entry in the savedExercises object
    savedExercises[exerciseId] = {
        id: exerciseId,
        title: selectedExercise.title,
        description: selectedExercise.description,
        code: currentCode
    };
    
    alert('Exercise saved!');
    
    // Mark the exercise as saved by adding its ID to the savedExerciseIds set
    savedExerciseIds.add(exerciseId);
    
    // Find the specific exercise div by its ID and change its title color to green
    const changeTitleColor = document.getElementById(`exerciseDiv${exerciseId}`);
    const titleElement = changeTitleColor.querySelector('.title_ex');
    if (titleElement) {
        titleElement.style.color = 'lightgreen';
    }

    // Check if all exercises have been saved
    checkIfAllExercisesSaved();
});

// Function to check if all exercises have been saved at least once

function checkIfAllExercisesSaved() {
    if (savedExerciseIds.size === totalExercises) {
        // Remove the 'disabled' class and add the 'enabled' class
        submitTestButton.classList.remove('disabled');
        submitTestButton.classList.add('enabled');
        console.log("All exercises saved! Submit button enabled.");
    } else {
        console.log(`Saved ${savedExerciseIds.size} of ${totalExercises} exercises.`);
    }
}


// Example of how you might add a 'selected' class when an exercise is clicked
function ExerciseClicked(event) {
    // Deselect previous exercise
    document.querySelectorAll('.exerciseDiv').forEach(div => div.classList.remove('selected'));
    
    // Select the clicked exercise
    const clickedDiv = event.currentTarget;
    clickedDiv.classList.add('selected');
    
    // Pass the editor code value to loadExerciseContent
    const editorCodeValue = clickedDiv.dataset.code; 
    const optionstatus = clickedDiv.optionstatus;
    const title = clickedDiv.title;
    const desc = clickedDiv.description;
    
    console.log("optionstatus:", optionstatus);
    loadExerciseContent(editorCodeValue, optionstatus, title, desc);
}






// Event listener for the submit test button
submitTestButton.addEventListener('click', function() {
    // Check if the button has the 'enabled' class
    if (submitTestButton.classList.contains('enabled')) {
        // Show a confirmation dialog
        const confirmed = confirm("Are you sure you want to submit the test?");
        
        if (confirmed) {
            // Call the submitTest function
            submitTest();
            
            // Disable the submit button after submission to prevent further clicks
            submitTestButton.classList.add('disabled'); // Optionally use a class to style it as disabled
            submitTestButton.classList.remove('enabled'); // Remove the enabled class
            submitTestButton.style.cursor = 'not-allowed'; // Change cursor style
            submitTestText.style.color = 'grey'; // Change text color to indicate it's disabled
            submitTestButton.disabled = true; // Disable the button
            alert('You can quit SEB now with the password provided by your teacher.')
        } else {
            // User clicked "Cancel", do nothing
            console.log("Test submission canceled.");
        }
    } else {
        console.log("Submission not allowed: Test has already been submitted or is not enabled.");
    }
});



// Function to submit the savedExercises JSON from the client side
function submitTest() {
  // Assuming savedExercises is the object you want to send
  const savedExercisesToSubmit = JSON.stringify(savedExercises); // Convert to JSON string

 
  
  // Check if testData contains the required fields
  

  // Add the required fields for submission from testData
  const submissionData = {
    savedExercisesToSubmit, 
    teacherName: testDataVar.teachersName, 
    studentName: testDataVar.studentName, 
    testname: testDataVar.testname, // Assuming testname is used as testId
    testId: testId
  };

  console.log("submissionData:", submissionData, testDataVar);

  // Make a POST request to the server
  fetch('/submitTest', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(submissionData), // Send the JSON in the request body
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    console.log(data.message); // Handle success response
  })
  .catch(error => {
    console.error('There was a problem with the fetch operation:', error);
  });
}



//!TEST END (STORAGE)

//!TEST END (STORAGE)

//!TEST END (STORAGE)