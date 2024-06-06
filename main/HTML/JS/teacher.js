
let exerciseCount = 0;
let lastNumber = null; 


const newEx = document.getElementById("newEx")
const saveButton = document.getElementById("saveButton-modal")
const modal_editExercise = document.getElementById("modal_editExercise")


const modal_closeEditExercise = document.getElementById("closeButton-editExercise")
const exerciseTitleTextInputedit = document.getElementById("exerciseTitleTextInputedit")
const exerciseDescTextInputedit = document.getElementById("exerciseDescTextInputedit")


const saveEditedExerciseButton = document.getElementById("saveButton-editExercise")
const closeEditedExerciseButton = document.getElementById("closeButton-editExercise")

const alert_div = document.querySelector(".alert")
const alert_cross = document.querySelector(".alert-cross")

const loadButton = document.getElementById("loadButton")
const fileInput = document.getElementById('fileInput');




let editor;

window.onload = function() {
    editor = ace.edit("editor");
    editor.setTheme("ace/theme/twilight");
    editor.session.setMode("ace/mode/javascript")
    editor.setOptions({
      enableBasicAutocompletion: true,
      enableSnippets: true,
      enableLiveAutocompletion: false
    });

    // Function to load default.js content into the editor
    function loadDefaultFile() {
      fetch('default.js')
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

//ChangeLanguage fun.

var language = "node"

function changeLanguage() {

  language = $("#languages").val();

  if(language == 'c' || language == 'cpp')editor.session.setMode("ace/mode/c_cpp");
  else if(language == 'php')editor.session.setMode("ace/mode/php");
  else if(language == 'python')editor.session.setMode("ace/mode/python");
  else if(language == 'node')editor.session.setMode("ace/mode/javascript");

  console.log("Language:", language)
  
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
      output_place.textContent = captured_output; // Display the captured output
      console.log = original_console_log; // Restore original console.log
    } catch (e) {
      outputDiv.className = "error_text"
      outputDiv.innerHTML += ("Error running the code:", e)
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


const modal = document.getElementById("modal")
const openModal = document.getElementById("add-button")
const closeModal = document.getElementById("closeButton-modal")








openModal.addEventListener("click", () =>{
  exerciseCount++;
  exerciseTitleTextInput.value ="";
  exerciseDescTextInput.value = "";
  exerciseDescTextInput.style.height="20px";
  modal.showModal()
  console.log("MODAL OPEN")
});

closeModal.addEventListener("click", () =>{
  exerciseCount--;
  exerciseTitleTextInput.value ="";
  exerciseDescTextInput.value = "";
  modal.close()
  console.log("MODAL CLOSED")
});


// exerciseTitleTextInput.updated() is getting updated.
exerciseTitleTextInput.addEventListener("input", function(){
  console.log("Value Updated")
  return exerciseTitleTextInput.value;
})

// exerciseTitleTextInput.updated() is getting updated.
exerciseDescTextInput.addEventListener("input", function(){
  console.log("Value Updated")
  return exerciseDescTextInput.value;
})


function saveModal(){
  // if(getElementById("checkbox")){
  //   //Editor value (ace_content) should get appended to the exercise. but it does not have to be shown. (only for the student later on.)
  // }
  const newDiv = createNewEx()
  createTextinNewEx(newDiv)
  placeCrossInEx(newDiv)
  placePenInEx(newDiv)
  modal.close();
  console.log("MODAL SAVED")
}




saveButton.addEventListener("click", function(){
  saveModal(exerciseTitleTextInput.value, exerciseDescTextInput.value)
})

function createNewEx(){
  const newDiv = document.createElement("div") //create new ex.
  newDiv.id="newEx" + exerciseCount;
  newDiv.className="newEx"
  container_list.appendChild(newDiv)
  return newDiv;
}

function createTextinNewEx(newDiv){
  let content_1 = exerciseTitleTextInput.value;
  let content_2 = exerciseDescTextInput.value;
  const exerciseTitleText = document.createElement("div")
  const exerciseDescText = document.createElement("div")
  exerciseTitleText.id = "exerciseTitleText" + exerciseCount;
  exerciseDescText.id = "exerciseDescText" + exerciseCount;
  exerciseTitleText.className= "exerciseTitleText"
  exerciseDescText.className= "exerciseDescText"
  exerciseTitleText.textContent = content_1
  exerciseDescText.textContent = content_2
  newDiv.appendChild(exerciseTitleText)
  newDiv.appendChild(exerciseDescText)
}

function placeCrossInEx(newDiv){
  const ExCross = document.createElement("span")
  ExCross.className = "material-symbols-outlined ExCross icons-animation"
  ExCross.id ="ExCross" + exerciseCount;
  ExCross.textContent = "close"
  ExCross.setAttribute("onclick", `handleExCrossClick(event, ${exerciseCount})`);
  newDiv.appendChild(ExCross)

}

function placePenInEx(newDiv){
  const ExPen = document.createElement("span")
  ExPen.className = "material-symbols-outlined ExPen icons-animation"
  ExPen.id ="ExPen" + exerciseCount;
  ExPen.textContent = "edit"
  ExPen.setAttribute("onclick", `handleExPenClick(event, ${exerciseCount})`);
  newDiv.appendChild(ExPen)

}






document.addEventListener('DOMContentLoaded', function() {




    

  const textarea = document.getElementById('exerciseDescTextInput');
  console.log("scrollheight:", this.scrollHeight)
  textarea.addEventListener('input', function() {
      this.style.minHeight ="1" + "em";
      this.style.height = 'auto';
      this.style.height += 2 + 'em';
      console.log("scrollheight:", this.scrollHeight)
  });

  // Trigger the input event on page load to adjust the initial height
  textarea.dispatchEvent(new Event('input'));
});





document.addEventListener('DOMContentLoaded', function() {
  const textareaEdit = document.getElementById('exerciseDescTextInputedit');

  textareaEdit.addEventListener('input', function() {
      this.style.minHeight ="20" + "px";
      this.style.height = 'auto';
      this.style.height = (this.scrollHeight-5) + 'px';
  });

  // Trigger the input event on page load to adjust the initial height
  textareaEdit.dispatchEvent(new Event('input'));
});









function handleExPenClick(event, number) {
  lastNumber = number
  const newExDiv = event.target.closest('.newEx'); // Adjust the selector as needed
  if (newExDiv) {
      const divID = newExDiv.id;
      const lastNumber = divID.match(/\d+$/)[0]; // Store lastNumber in the outer scope
      editExercise(lastNumber);
  }
}


function handleExCrossClick(event, number){
  lastNumber = number  //VERY IMPORTANT BUT I DONT GET IT actually maybe i get it (check with lüthi maybe)
  const newExDiv = event.target.closest('.newEx');
  if(newExDiv){
    const divID = newExDiv.id;
      const lastNumber = divID.match(/\d+$/)[0]; // Store lastNumber in the outer scope
      deleteExercise(lastNumber)
  }
}

function deleteExercise(lastNumber){
  exerciseCount--;
  const exerciseToRemove = document.getElementById("newEx"+ lastNumber)
  container_list.removeChild(exerciseToRemove);
}






saveButton.addEventListener('click', function() {
  
  const ExTitle = document.getElementById("exerciseTitleText" + exerciseCount);

  if (ExTitle.textContent == "") {
    ExTitle.textContent ="Title undefined"
  } else {
    return
  }
});



// SAVE EDITED MODAL
function saveEditedExercise(){
  console.log(lastNumber); 

  document.getElementById("exerciseTitleText" + lastNumber).textContent = exerciseTitleTextInputedit.value || "Title undefined";
  document.getElementById("exerciseDescText" + lastNumber).textContent = exerciseDescTextInputedit.value;
  modal_editExercise.close();
  console.log("MODAL EDIT SAVED");
};




//CLOSE EDITED MODAL (DONT SAVE)
closeEditedExerciseButton.addEventListener("click", function(){
  modal_editExercise.close();
  console.log("MODAL EDIT CLOSED")
})

   
// EDIT EXERCISE
  function editExercise(lastNumber){
  exerciseTitleTextInputedit.value = document.getElementById("exerciseTitleText" + lastNumber ).textContent;
  exerciseDescTextInputedit.value = document.getElementById("exerciseDescText" + lastNumber).textContent;
  modal_editExercise.showModal();
  console.log("MODAL EDIT OPEN")
}



//createTest Function
document.getElementById('createTestButton').addEventListener('click', function() {
  if (exerciseCount == 0) {
    alert_div.style.visibility = "visible";
  } else {
    const exercises = document.querySelectorAll('.newEx');
    const zip = new JSZip();
    const testFolder = zip.folder('test');

    exercises.forEach((exercise, index) => {
      console.log(index);
      const title = exercise.querySelector(`#exerciseTitleText${index + 1}`).textContent;
      const description = exercise.querySelector(`#exerciseDescText${index + 1}`).textContent;
      const exerciseFolder = testFolder.folder(`exercise${index + 1}`);

      exerciseFolder.file('title.txt', title);
      exerciseFolder.file('description.txt', description);
    });

    zip.generateAsync({ type: 'blob' }).then(function(content) {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(content);
      a.download = 'test.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  }
});




alert_cross.addEventListener("click", function(){
  alert_div.style.visibility = "hidden"
})






loadButton.addEventListener("click", function() {
    fileInput.click(); // Open file explorer
});

fileInput.addEventListener("change", function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            editor.setValue(e.target.result, -1); // Set file content to the editor
        };
        reader.readAsText(file); // Read the file as text
    }
});