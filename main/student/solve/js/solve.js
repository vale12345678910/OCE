//! Structured Code

let totalExercises = 0
const loadButton = document.getElementById("loadButton")
const fileInput = document.getElementById('fileInput');
const saveCode = document.getElementById("saveCode")

//!Important: Disables the default print function with a custom alert
window.print = function(){
  alert('You are not using the correct language!')
}


let editor;

//! Initializes the editor with specific settings on page load
window.onload = function() {
    editor = ace.edit("editor");
    editor.setTheme("ace/theme/tomorrow_night_bright");
    editor.session.setMode("ace/mode/javascript")
    editor.setOptions({
      enableBasicAutocompletion: true,
      enableLiveAutocompletion: true
    });


//end

    //! Tracks changes made in the editor
    editor.session.on("change", function(delta){
      const ace_content = editor.getValue();
    })
}



const output_place = document.getElementById("output")



let language = "node";

//! Changes the editor language based on user selection
function changeLanguage() {
  language = $("#languages").val();

  if (language == 'python') {
    editor.session.setMode("ace/mode/python");
  } else {
    editor.session.setMode("ace/mode/javascript");
  }

  console.log("Language:", language);
}

//! Runs the code based on the selected language (JavaScript or Python)
function runCode() {
  var outputDiv = document.getElementById("output");
  var code = editor.getValue(); // Get the code from the editor
  var captured_output = '';
  outputDiv.className = "";

  //! Create an iframe to run the code in isolation
  var iframe = document.createElement('iframe');
  document.body.appendChild(iframe);
  var iframeWindow = iframe.contentWindow;
  
  //! Overrides the console.log to capture output inside the iframe
  iframeWindow.console.log = function(output) {
    captured_output += output + '\n';
  };

  try {
    if (language === "node") { // Check if the language is JavaScript
      iframeWindow.print = function() {
        alert("Wrong language selected");
      };
      
      //! Runs JavaScript code inside the iframe
      iframeWindow.eval(code); 
      
      outputDiv.textContent = captured_output; // Display the captured output
    } else if (language === "python") { // Check if the language is Python
      runPython(); 
    } else {
      outputDiv.className = "error_text";
      outputDiv.innerHTML = "Unsupported language: " + language;
    }
  } catch (e) {
    outputDiv.className = "error_text";
    outputDiv.innerHTML = "Error running the code: " + e.message;
    console.error("Error running the code:", e);
  } finally {
    //! Removes the iframe after code execution
    document.body.removeChild(iframe);
  }
}


//! Function to run Python code using the Skulpt library
function runPython() {
  var code = editor.getValue();
  var outputDiv = document.getElementById("output");
  
  outputDiv.innerHTML = ''; // Clear previous output

  Sk.configure({
    output: function(text) {
      outputDiv.innerHTML += text + '\n';
    }
  });

  //! Asynchronously run the Python code and display output
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


//! Event listener for page load, prompts the user for a test ID
document.addEventListener('DOMContentLoaded', () =>{

  testId = prompt('enter the testId provided by your teacher')

  if(testId){
    //! Load test data using the provided test ID
    loadTestById(testId)
  } else{
    alert('Test ID is required!')
  }
})

//! Loads test data from the server using the test ID
async function loadTestById(testId) {
  
  try {
      const response = await fetch(`/api/getTestById?testId=${encodeURIComponent(testId)}`);
      if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
      }
      const testData = await response.json();
      testDataVar = testData
      //! Display the loaded test data in the UI
      displayTestData(testData)
      console.log("testName:", testData.testname)
      console.log("testData", testData)
  } catch (error) {
      console.error('Error loading test data:', error);
  }
}

//! Displays test data, creates div elements for each exercise
function displayTestData(testData) {
  let i = 1;
  const container_list = document.querySelector('.container_list');

  testData.exercices.forEach(exercise => {
    const exerciseDiv = document.createElement('div');
    exerciseDiv.className = 'exerciseDiv';
    exerciseDiv.id = `exerciseDiv${i}`;
    exerciseDiv.dataset.code = exercise.editorContent; // Store the editor code value in a data attribute
    exerciseDiv.optionstatus = exercise.optionstatus;
    exerciseDiv.title = exercise.title;
    exerciseDiv.description = exercise.description;
    exerciseDiv.onclick = ExerciseClicked;
    i++;
    exerciseDiv.innerHTML = `<p class="title_ex">${exercise.title}</p><p class="desc_ex">${exercise.description}</p>`;
    container_list.appendChild(exerciseDiv);
    totalExercises = i - 1; // Total Exercises
  });

  //! Trigger click on the first exercise if available
  if (totalExercises > 0) {
    document.getElementById('exerciseDiv1').click();
  }
}


//! Loads exercise content into the editor based on the provided parameters
function loadExerciseContent(code, optionstatus, title, desc) {
  console.log(`Loading content: Optionstatus = ${optionstatus}, Title = ${title}`);
  
  if (optionstatus == 1 || code.trim() !== '') {
      //! Load the provided code into the editor only if there's content
      editor.setValue(code, 1);
      console.log("Editor content loaded:", code);
  } else {
      //! If there's no content, keep the editor empty (mainly for optionstatus == 0)
      editor.setValue('', 1);
      console.log("Editor content cleared.");
  }

  //! Updates the title and description fields
  changeTitleAndDesc(title, desc);
}


function changeTitleAndDesc(title, desc) {
  const titleDiv = document.getElementById('title')
  const descDiv = document.getElementById('desc')

  titleDiv.textContent = title
  descDiv.textContent = desc
}



//! Stores saved exercises and tracks saved exercise IDs
let savedExercises = {}; 
let savedExerciseIds = new Set();  // To track exercises saved at least once

// Reference to the submit button and text
const submitTestButton = document.querySelector('.submitTest');
const submitTestText = document.getElementById('submitTestText')


//! Handles saving the code of the currently selected exercise
saveCode.addEventListener('click', function() {
    // Get the currently selected exercise's div
    const selectedExercise = document.querySelector('.exerciseDiv.selected');
    
    if (!selectedExercise) {
        console.log("No exercise selected!");
        return; // Exit if no exercise is selected
    }

    //! Extract the exercise ID and code from the editor
    const exerciseId = selectedExercise.id.replace('exerciseDiv', '');
    const currentCode = editor.getValue();
    
    //! Save or update the exercise in savedExercises
    savedExercises[exerciseId] = {
        id: exerciseId,
        title: selectedExercise.title,
        description: selectedExercise.description,
        code: currentCode
    };
    
    alert('Exercise saved!');
    
    //! Mark the exercise as saved by adding its ID to savedExerciseIds
    savedExerciseIds.add(exerciseId);
    
    //! Change the title color to green for saved exercises
    const changeTitleColor = document.getElementById(`exerciseDiv${exerciseId}`);
    const titleElement = changeTitleColor.querySelector('.title_ex');
    if (titleElement) {
        titleElement.style.color = 'lightgreen';
    }

    //! Check if all exercises have been saved
    checkIfAllExercisesSaved();
});

//! Checks if all exercises have been saved and enables the submit button if true
function checkIfAllExercisesSaved() {
    if (savedExerciseIds.size === totalExercises) {
        submitTestButton.classList.remove('disabled');
        submitTestButton.classList.add('enabled');
        console.log("All exercises saved! Submit button enabled.");
    } else {
        console.log(`Saved ${savedExerciseIds.size} of ${totalExercises} exercises.`);
    }
}

//! Adds 'selected' class to clicked exercise and loads its content into the editor
function ExerciseClicked(event) {
  console.log("Exercise clicked!");

  // Save the current exercise's content before switching
  const currentSelectedExercise = document.querySelector('.exerciseDiv.selected');
  if (currentSelectedExercise) {
      const exerciseId = currentSelectedExercise.id.replace('exerciseDiv', '');
      const currentCode = editor.getValue();
      console.log(`Saving code for exercise ID ${exerciseId}:`, currentCode);

      // Save the content only if the editor has some content
      if (currentCode.trim() !== '') {
          savedExercises[exerciseId] = {
              id: exerciseId,
              title: currentSelectedExercise.title,
              description: currentSelectedExercise.description,
              code: currentCode
          };
          console.log(`Exercise ${exerciseId} saved!`);
      }
  }

  //! Deselect previous exercise
  document.querySelectorAll('.exerciseDiv').forEach(div => div.classList.remove('selected'));
  document.querySelectorAll('.exerciseDiv').forEach(div => div.classList.remove('selectedColor'));

  //! Select the clicked exercise
  const clickedDiv = event.currentTarget;
  clickedDiv.classList.add('selected');
  clickedDiv.classList.add('selectedColor');

  //! Check if the exercise has been saved before
  const exerciseId = clickedDiv.id.replace('exerciseDiv', '');
  const savedExercise = savedExercises[exerciseId];
  
  let editorCodeValue;
  
  if (savedExercise) {
      //! Load saved content if available
      editorCodeValue = savedExercise.code;
      console.log(`Loading saved code for exercise ID ${exerciseId}:`, editorCodeValue);
  } else if (clickedDiv.optionstatus == 1) {
      //! If no saved content, load default content if optionstatus is 1
      editorCodeValue = clickedDiv.dataset.code;
      console.log(`Loading default code for exercise ID ${exerciseId}:`, editorCodeValue);
  } else {
      //! If no saved content and optionstatus is 0, keep the editor empty
      editorCodeValue = ''; // Clear editor for unsaved exercises with no default code
      console.log(`No default code for exercise ID ${exerciseId}, starting with empty editor.`);
  }
  
  const optionstatus = clickedDiv.optionstatus;
  const title = clickedDiv.title;
  const desc = clickedDiv.description;
  
  console.log("optionstatus:", optionstatus);
  loadExerciseContent(editorCodeValue, optionstatus, title, desc);
}



// function ExerciseClicked(event) {
//     //! Deselect previous exercise
//     document.querySelectorAll('.exerciseDiv').forEach(div => div.classList.remove('selected'));
//     document.querySelectorAll('.exerciseDiv').forEach(div => div.classList.remove('selectedColor'));
//     //! Select the clicked exercise
    
//     const clickedDiv = event.currentTarget;
//     clickedDiv.classList.add('selected');
//     clickedDiv.classList.add('selectedColor')
//     //! Load exercise content into the editor
//     const editorCodeValue = clickedDiv.dataset.code; 
//     const optionstatus = clickedDiv.optionstatus;
//     const title = clickedDiv.title;
//     const desc = clickedDiv.description;
    
//     console.log("optionstatus:", optionstatus);
//     loadExerciseContent(editorCodeValue, optionstatus, title, desc);
// }




//! Event listener for the submit test button, handles test submission
submitTestButton.addEventListener('click', function() {
    if (submitTestButton.classList.contains('enabled')) {
        //! Confirmation dialog before submission
        const confirmed = confirm("Are you sure you want to submit the test?");
        
        if (confirmed) {
            //! Call the submitTest function and disable the submit button after submission
            submitTest();
            submitTestButton.classList.add('disabled');
            submitTestButton.classList.remove('enabled');
            submitTestButton.style.cursor = 'not-allowed';
            submitTestText.style.color = 'grey'; 
            submitTestButton.disabled = true;
            alert('You can quit SEB now with the password provided by your teacher.')
        } else {
            console.log("Test submission canceled.");
        }
    } else {
        console.log("Submission not allowed: Test has already been submitted or is not enabled.");
    }
});



//! Submits the saved exercises to the server
function submitTest() {
  //! Convert saved exercises to a JSON string
  const savedExercisesToSubmit = JSON.stringify(savedExercises); 
  
  //! Add additional required fields for submission
  const submissionData = {
    savedExercisesToSubmit, 
    teacherName: testDataVar.teachersName, 
    studentName: testDataVar.studentName, 
    testname: testDataVar.testname, 
    testId: testId
  };

  console.log("submissionData:", submissionData, testDataVar);

  //! Make a POST request to submit the test data to the server
  fetch('/submitTest', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(submissionData),
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






//!ORIGIANL UNDSTRUCTRED CODE (if the functionality is not working of the structred one because of some changes of ChatGPT (should not be the case, but as a backup))

// let totalExercises = 0
// const loadButton = document.getElementById("loadButton")
// const fileInput = document.getElementById('fileInput');
// const saveCode = document.getElementById("saveCode")


// window.print = function(){
//   alert('You are not using the correct language!')
// }


// let editor;

// window.onload = function() {
//     editor = ace.edit("editor");
//     editor.setTheme("ace/theme/tomorrow_night_bright");
//     editor.session.setMode("ace/mode/javascript")
//     editor.setOptions({
//       enableBasicAutocompletion: true,
//       enableLiveAutocompletion: true
//     });

//     // Function to load default.js content into the editor
//     function loadDefaultFile() {
//       fetch('js/default.js')
//           .then(response => response.text())
//           .then(data => {
//               editor.setValue(data, -1); // Set file content to the editor
//           })
//           .catch(error => console.error('Error loading default.js:', error));
//   }

//   // Call the function to load the file content
//   loadDefaultFile();
// //end

//     editor.session.on("change", function(delta){
//       const ace_content = editor.getValue();
//     })
// }



// const output_place = document.getElementById("output")



// let language = "node";

// function changeLanguage() {
//   language = $("#languages").val();

//   if (language == 'python') {
//     editor.session.setMode("ace/mode/python");
//   } else {
//     editor.session.setMode("ace/mode/javascript");
//   }

//   console.log("Language:", language);
// }


// function runCode() {
//   var outputDiv = document.getElementById("output");
//   var code = editor.getValue(); // Get the code from the editor
//   var captured_output = '';
//   outputDiv.className = "";

//   // Create an iframe for isolated execution
//   var iframe = document.createElement('iframe');
//   document.body.appendChild(iframe);
//   var iframeWindow = iframe.contentWindow;
  
//   // Override console.log in the iframe context
//   iframeWindow.console.log = function(output) {
//     captured_output += output + '\n';
//   };

//   try {
//     if (language === "node") { // Check if the language is JavaScript
//       iframeWindow.print = function() {
//         alert("Wrong language selected");
//       };
      
//       // Execute the code in the iframe
//       iframeWindow.eval(code); 
      
//       outputDiv.textContent = captured_output; // Display the captured output
//     } else if (language === "python") { // Check if the language is Python
//       runPython(); 
//     } else {
//       outputDiv.className = "error_text";
//       outputDiv.innerHTML = "Unsupported language: " + language;
//     }
//   } catch (e) {
//     outputDiv.className = "error_text";
//     outputDiv.innerHTML = "Error running the code: " + e.message;
//     console.error("Error running the code:", e);
//   } finally {
//     // Remove the iframe after execution
//     document.body.removeChild(iframe);
//   }
// }






// function runPython() {
//   var code = editor.getValue();
//   var outputDiv = document.getElementById("output");
  
//   outputDiv.innerHTML = ''; // Clear previous output

//   Sk.configure({
//     output: function(text) {
//       outputDiv.innerHTML += text + '\n';
//     }
//   });

//   Sk.misceval.asyncToPromise(function() {
//     return Sk.importMainWithBody("<stdin>", false, code, true);
//   }).then(function() {
//     console.log("Python code executed");
//     outputDiv.className = "";
    
//   }, function(err) {
//     console.error("error:", err.toString());
//     outputDiv.className = "error_text";
//     outputDiv.innerHTML += "error: " + err.toString();
//   });
// }



// //OWN CODE

// const exerciseTitleTextInput = document.getElementById('exerciseTitleTextInput');
// const exerciseDescTextInput = document.getElementById('exerciseDescTextInput');
// const container_list = document.querySelector(".container_list") //where the saved ex. should go.




// document.addEventListener('DOMContentLoaded', () =>{

//   testId = prompt('enter the testId provided by your teacher')

//   if(testId){
//     loadTestById(testId)
//   } else{
//     alert('Test ID is required!')
//   }
// })



// async function loadTestById(testId) {
  
//   try {
//       const response = await fetch(`/api/getTestById?testId=${encodeURIComponent(testId)}`);
//       if (!response.ok) {
//           throw new Error(`Error: ${response.statusText}`);
//       }
//       const testData = await response.json();
//       testDataVar = testData
//       displayTestData(testData)
//       console.log("testName:", testData.testname)
//       console.log("testData", testData)
//   } catch (error) {
//       console.error('Error loading test data:', error);
//   }
// }




// function displayTestData(testData) {
//   let i = 1;

//   const container_list = document.querySelector('.container_list');

//   testData.exercices.forEach(exercise => {
//     const exerciseDiv = document.createElement('div');
//     exerciseDiv.className = 'exerciseDiv';
//     exerciseDiv.id = `exerciseDiv${i}`;
//     exerciseDiv.dataset.code = exercise.editorContent; // Store the editor code value in a data attribute
//     exerciseDiv.optionstatus = exercise.optionstatus;
//     exerciseDiv.title = exercise.title
//     exerciseDiv.description = exercise.description
//     exerciseDiv.onclick = ExerciseClicked;
//     i++;
//     exerciseDiv.innerHTML = `<p class="title_ex">${exercise.title}</p><p class="desc_ex">${exercise.description}</p>`;
//     container_list.appendChild(exerciseDiv);
//     totalExercises = i - 1 //Total Exercises
//   });
// }




// //!FIRST BREAK 
// //!FIRST BREAK 
// //!FIRST BREAK 
// //!FIRST BREAK 
// //!FIRST BREAK 
// //!FIRST BREAK 




// function loadExerciseContent(code, optionstatus, title, desc) {
  
//   if(optionstatus == 1){
//     editor.setValue(code, 1)    
//   } else{
//     editor.setValue('', 1)
//   }

//   changeTitleAndDesc(title, desc);
// }


// function changeTitleAndDesc(title, desc) {
//   const titleDiv = document.getElementById('title')
//   const descDiv = document.getElementById('desc')

//   titleDiv.textContent = title
//   descDiv.textContent = desc
// }




// let savedExercises = {}; // Stores the saved exercises and their details
// let savedExerciseIds = new Set();  // To track exercises that have been saved at least once

// // Reference to the submit button
// const submitTestButton = document.querySelector('.submitTest');
// const submitTestText = document.getElementById('submitTestText')


// saveCode.addEventListener('click', function() {
//     // Get the currently selected exercise's div
//     const selectedExercise = document.querySelector('.exerciseDiv.selected');
    
//     if (!selectedExercise) {
//         console.log("No exercise selected!");
//         return; // Exit if no exercise is selected
//     }

//     // Get the exercise ID
//     const exerciseId = selectedExercise.id.replace('exerciseDiv', '');
    
//     // Get the code from the editor
//     const currentCode = editor.getValue();
    
//     // Create or update the exercise entry in the savedExercises object
//     savedExercises[exerciseId] = {
//         id: exerciseId,
//         title: selectedExercise.title,
//         description: selectedExercise.description,
//         code: currentCode
//     };
    
//     alert('Exercise saved!');
    
//     // Mark the exercise as saved by adding its ID to the savedExerciseIds set
//     savedExerciseIds.add(exerciseId);
    
//     // Find the specific exercise div by its ID and change its title color to green
//     const changeTitleColor = document.getElementById(`exerciseDiv${exerciseId}`);
//     const titleElement = changeTitleColor.querySelector('.title_ex');
//     if (titleElement) {
//         titleElement.style.color = 'lightgreen';
//     }

//     // Check if all exercises have been saved
//     checkIfAllExercisesSaved();
// });

// // Function to check if all exercises have been saved at least once

// function checkIfAllExercisesSaved() {
//     if (savedExerciseIds.size === totalExercises) {
//         // Remove the 'disabled' class and add the 'enabled' class
//         submitTestButton.classList.remove('disabled');
//         submitTestButton.classList.add('enabled');
//         console.log("All exercises saved! Submit button enabled.");
//     } else {
//         console.log(`Saved ${savedExerciseIds.size} of ${totalExercises} exercises.`);
//     }
// }


// // Example of how you might add a 'selected' class when an exercise is clicked
// function ExerciseClicked(event) {
//     // Deselect previous exercise
//     document.querySelectorAll('.exerciseDiv').forEach(div => div.classList.remove('selected'));
    
//     // Select the clicked exercise
//     const clickedDiv = event.currentTarget;
//     clickedDiv.classList.add('selected');
    
//     // Pass the editor code value to loadExerciseContent
//     const editorCodeValue = clickedDiv.dataset.code; 
//     const optionstatus = clickedDiv.optionstatus;
//     const title = clickedDiv.title;
//     const desc = clickedDiv.description;
    
//     console.log("optionstatus:", optionstatus);
//     loadExerciseContent(editorCodeValue, optionstatus, title, desc);
// }






// // Event listener for the submit test button
// submitTestButton.addEventListener('click', function() {
//     // Check if the button has the 'enabled' class
//     if (submitTestButton.classList.contains('enabled')) {
//         // Show a confirmation dialog
//         const confirmed = confirm("Are you sure you want to submit the test?");
        
//         if (confirmed) {
//             // Call the submitTest function
//             submitTest();
            
//             // Disable the submit button after submission to prevent further clicks
//             submitTestButton.classList.add('disabled'); // Optionally use a class to style it as disabled
//             submitTestButton.classList.remove('enabled'); // Remove the enabled class
//             submitTestButton.style.cursor = 'not-allowed'; // Change cursor style
//             submitTestText.style.color = 'grey'; // Change text color to indicate it's disabled
//             submitTestButton.disabled = true; // Disable the button
//             alert('You can quit SEB now with the password provided by your teacher.')
//         } else {
//             // User clicked "Cancel", do nothing
//             console.log("Test submission canceled.");
//         }
//     } else {
//         console.log("Submission not allowed: Test has already been submitted or is not enabled.");
//     }
// });



// // Function to submit the savedExercises JSON from the client side
// function submitTest() {
//   // Assuming savedExercises is the object you want to send
//   const savedExercisesToSubmit = JSON.stringify(savedExercises); // Convert to JSON string

 
  
//   // Check if testData contains the required fields
  

//   // Add the required fields for submission from testData
//   const submissionData = {
//     savedExercisesToSubmit, 
//     teacherName: testDataVar.teachersName, 
//     studentName: testDataVar.studentName, 
//     testname: testDataVar.testname, // Assuming testname is used as testId
//     testId: testId
//   };

//   console.log("submissionData:", submissionData, testDataVar);

//   // Make a POST request to the server
//   fetch('/submitTest', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(submissionData), // Send the JSON in the request body
//   })
//   .then(response => {
//     if (!response.ok) {
//       throw new Error('Network response was not ok');
//     }
//     return response.json();
//   })
//   .then(data => {
//     console.log(data.message); // Handle success response
//   })
//   .catch(error => {
//     console.error('There was a problem with the fetch operation:', error);
//   });
// }