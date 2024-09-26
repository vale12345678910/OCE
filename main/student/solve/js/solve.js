

const loadButton = document.getElementById("loadButton")
const fileInput = document.getElementById('fileInput');
const saveCode = document.getElementById("saveCode")






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




//Opens explorer of client and tries to load code of script into editor.Content.

loadButton.addEventListener("click", function() {
  fileInput.click(); // Open file explorer
});

fileInput.addEventListener("change", function(event) {
  const file = event.target.files[0];
  if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
          editor.setValue(e.target.result, -1); // Set file content to the editor
          fileInput.value = ''; // Reset the input value to allow re-loading the same file
      };
      reader.readAsText(file); // Read the file as text
  }
});



//Saves the current editor.Content in a File on clients PC.

saveCode.addEventListener("click", function() {
  var content = editor.getValue();  // Get the content from the editor
  var filename;

  if (language == 'python') {
    filename = "script.py";
  } else {
    filename = "script.js";
  }

  var blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  var link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  console.log("File saved as:", filename);
});



//! LOAD TEST
//! LOAD TEST
//! LOAD TEST

document.addEventListener('DOMContentLoaded', () =>{
  const testId = prompt('Enter the test ID provided by your teacher:')
  
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
  });
}

function ExerciseClicked(event) {
  const clickedDiv = event.currentTarget;
  const divId = clickedDiv.id;
  const divNumber = divId.replace('exerciseDiv', '');
  console.log("Clicked div number:", divNumber);

  // Pass the editor code value to loadExerciseContent
  const editorCodeValue = clickedDiv.dataset.code; 
  const optionstatus = clickedDiv.optionstatus
  const title = clickedDiv.title
  const desc = clickedDiv.description
  console.log("optionstatus:", optionstatus)
  loadExerciseContent(editorCodeValue, optionstatus, title, desc);
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
