//! Structured Code

let exerciseCount = 0;
let lastNumber = null;
let index = 0;

const userName = sessionStorage.getItem('userName');

const newEx = document.querySelector(".sortable-list");

const saveButton = document.getElementById("saveButton-modal");
const modal_editExercise = document.getElementById("modal_editExercise");

const modal_closeEditExercise = document.getElementById("closeButton-editExercise");
const exerciseTitleTextInputedit = document.getElementById("exerciseTitleTextInputedit");
const exerciseDescTextInputedit = document.getElementById("exerciseDescTextInputedit");
const exercisePointsValueInputedit = document.getElementById('ExPointsInputModalEdit');
const exerciseTestcaseTextInputedit = document.getElementById('testCaseTextEdit');

const saveEditedExerciseButton = document.getElementById("saveButton-editExercise");
const closeEditedExerciseButton = document.getElementById("closeButton-editExercise");

const alert_div = document.querySelector(".alert");
const alert_cross = document.querySelector(".alert-cross");

const loadButton = document.getElementById("loadButton");
const fileInput = document.getElementById('fileInput');

const saveCode = document.getElementById("saveCode");
const checkbox_code = document.getElementById("checkbox_code");
const checkbox_code_edit = document.getElementById("checkbox_code_edit");

let editor;

window.onload = function() {
    editor = ace.edit("editor");
    editor.setTheme("ace/theme/tomorrow_night_bright");
    editor.session.setMode("ace/mode/javascript");
    editor.setOptions({
      enableBasicAutocompletion: true,
      enableLiveAutocompletion: true
    });

    //! Load the default file into the editor
    function loadDefaultFile() {
      fetch('js/default.js')
          .then(response => response.text())
          .then(data => {
              editor.setValue(data, -1); 
          })
          .catch(error => console.error('Error loading default.js:', error));
    }

    loadDefaultFile();

    editor.session.on("change", function(delta){
      const ace_content = editor.getValue();
    });
}

const output_place = document.getElementById("output");

var language = "node";

//! Change the programming language for the editor
function changeLanguage() {
  language = $("#languages").val();

  if (language == 'python') {
    editor.session.setMode("ace/mode/python");
  } else {
    editor.session.setMode("ace/mode/javascript");
  }

}

//! Run the code entered in the editor
function runCode() {
  var outputDiv = document.getElementById("output");
  var code = editor.getValue(); 
  var captured_output = '';
  outputDiv.className = "";

  var iframe = document.createElement('iframe');
  document.body.appendChild(iframe);
  var iframeWindow = iframe.contentWindow;

  iframeWindow.console.log = function(output) {
    captured_output += output + '\n';
  };

  try {
    if (language === "node") { 
      iframeWindow.print = function() {
        alert("Wrong language selected");
      };

      iframeWindow.eval(code); 
      
      outputDiv.textContent = captured_output; 
    } else if (language === "python") { 
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
    document.body.removeChild(iframe);
  }
}

//! Execute the Python code
function runPython() {
  var code = editor.getValue();
  var outputDiv = document.getElementById("output");
  
  outputDiv.innerHTML = ''; 

  Sk.configure({
    output: function(text) {
      outputDiv.innerHTML += text + '\n';
    }
  });

  Sk.misceval.asyncToPromise(function() {
    return Sk.importMainWithBody("<stdin>", false, code, true);
  }).then(function() {
    outputDiv.className = "";
    
  }, function(err) {
    console.error("error:", err.toString());
    outputDiv.className = "error_text";
    outputDiv.innerHTML += "error: " + err.toString();
  });
}

const exerciseTitleTextInput = document.getElementById('exerciseTitleTextInput');
const exerciseDescTextInput = document.getElementById('exerciseDescTextInput');
const exercisePointsValueInput = document.getElementById('ExPointsInputModal');
const exerciseTestcaseTextInput = document.getElementById('testCaseText');

const container_list = document.querySelector(".container_list"); 

const modal = document.getElementById("modal");
const openModal = document.getElementById("add-button");
const closeModal = document.getElementById("closeButton-modal");

//! Open the modal for adding a new exercise
openModal.addEventListener("click", () =>{
  optionstatus = 0; 
  checkbox_code.checked = false;
  exerciseTitleTextInput.value = "";
  exerciseDescTextInput.value = "";
  exercisePointsValueInput.value = '';
  exerciseTestcaseTextInput.value = '';
  modal.showModal();
  
});

//! Close the modal and clear inputs
closeModal.addEventListener("click", () =>{
  exerciseTitleTextInput.value = "";
  exerciseDescTextInput.value = "";
  exercisePointsValueInput.value = '';
  exerciseTestcaseTextInput.value = '';
  modal.close();
});


exerciseTitleTextInput.addEventListener("input", function() {
  return exerciseTitleTextInput.value;
});

exerciseDescTextInput.addEventListener("input", function() {
  
  return exerciseDescTextInput.value;
});

exercisePointsValueInput.addEventListener("input", function() {
  
  return exercisePointsValueInput.value;
});

exerciseTestcaseTextInput.addEventListener("input", function() {
  
  return exerciseTestcaseTextInput.value;
});

//! Save the exercise data from the modal
function saveModal() {
  exerciseCount++;
  index++;
  const newDiv = createNewEx();
  createTextinNewEx(newDiv);
  placeCrossInEx(newDiv);
  placePenInEx(newDiv);
  modal.close();
  
}

saveButton.addEventListener("click", function() {
  saveModal();
});

//! Create a new exercise element
function createNewEx() {
  const newDiv = document.createElement("div");
  newDiv.setAttribute("draggable", "true");
  newDiv.id = "newEx" + exerciseCount;
  newDiv.className = "newEx";
  container_list.appendChild(newDiv);
  return newDiv;
}

//! Populate the new exercise element with data
function createTextinNewEx(newDiv) {
  let content_1 = exerciseTitleTextInput.value;
  let content_2 = exerciseDescTextInput.value;
  let points_content = exercisePointsValueInput.value; 
  let testCases_content = exerciseTestcaseTextInput.value; 

  const exerciseTitleText = document.createElement("div");
  const exerciseDescText = document.createElement("div");
  const optionstatus_div = document.createElement("div");
  const ex_editor_content = document.createElement("div");
  const points = document.createElement("div");
  const testCases = document.createElement("div");

  exerciseTitleText.id = "exerciseTitleText" + exerciseCount;
  exerciseDescText.id = "exerciseDescText" + exerciseCount;
  optionstatus_div.id = "optionstatus" + exerciseCount;
  ex_editor_content.id = "ex_editor_content" + exerciseCount;
  points.id = "points" + exerciseCount;
  testCases.id = "testCases" + exerciseCount;

  optionstatus_div.className = "optionstatus";
  exerciseTitleText.className = "exerciseTitleText";
  exerciseDescText.className = "exerciseDescText";
  ex_editor_content.className = "ex_editor_content";
  points.className = "points";
  testCases.className = "testCases";

  exerciseTitleText.textContent = content_1;
  exerciseDescText.textContent = content_2;
  ex_editor_content.textContent = editor.getValue();
  points.textContent = points_content; 
  testCases.textContent = testCases_content; 

  checkOptionStatus(optionstatus_div);

  newDiv.appendChild(exerciseTitleText);
  newDiv.appendChild(exerciseDescText);
  newDiv.appendChild(optionstatus_div);
  newDiv.appendChild(ex_editor_content);
  newDiv.appendChild(points);
  newDiv.appendChild(testCases);
}

//! Add a cross icon to remove the exercise
function placeCrossInEx(newDiv) {
  const ExCross = document.createElement("span");
  ExCross.className = "material-symbols-outlined ExCross icons-animation";
  ExCross.id = "ExCross" + exerciseCount;
  ExCross.textContent = "close";
  ExCross.setAttribute("onclick", `handleExCrossClick(event, ${exerciseCount})`);
  newDiv.appendChild(ExCross);
}

//! Add a pencil icon to edit the exercise
function placePenInEx(newDiv) {
  const ExPen = document.createElement("span");
  ExPen.className = "material-symbols-outlined ExPen icons-animation";
  ExPen.id = "ExPen" + exerciseCount;
  ExPen.textContent = "edit";
  ExPen.setAttribute("onclick", `handleExPenClick(event, ${exerciseCount})`);
  newDiv.appendChild(ExPen);
}

//! Handle the edit action for the exercise
function handleExPenClick(event, number) {
  lastNumber = number; // Store in outer scope
  const newExDiv = event.target.closest('.newEx'); 
  if (newExDiv) {
    const divID = newExDiv.id;
    const lastNumber = divID.match(/\d+$/)[0]; 
    editExercise(lastNumber);
  }
}

//! Handle the cross click action to delete the exercise
function handleExCrossClick(event, number) {
  lastNumber = number;
  const newExDiv = event.target.closest('.newEx');
  if (newExDiv) {
    const divID = newExDiv.id;
    const lastNumber = divID.match(/\d+$/)[0]; 
    deleteExercise(lastNumber);
  }
}

//! Delete the specified exercise
function deleteExercise(lastNumber) {
  index--;
  const exerciseToRemove = document.getElementById("newEx" + lastNumber);
  container_list.removeChild(exerciseToRemove);
}

saveButton.addEventListener('click', function() {
  const ExTitle = document.getElementById("exerciseTitleText" + exerciseCount);

  if (ExTitle.textContent == "") {
    ExTitle.textContent = "Title undefined";
  } else {
    return;
  }
});

//! Save the edited exercise data
function saveEditedExercise() {
  

  document.getElementById("exerciseTitleText" + lastNumber).textContent = exerciseTitleTextInputedit.value || "Title undefined";
  document.getElementById("exerciseDescText" + lastNumber).textContent = exerciseDescTextInputedit.value;
  document.getElementById("points" + lastNumber).textContent = exercisePointsValueInputedit.value;
  document.getElementById("testCases" + lastNumber).textContent = exerciseTestcaseTextInputedit.value;
  checkOptionStatusEdit();
  modal_editExercise.close();
  
}

closeEditedExerciseButton.addEventListener("click", function() {
  modal_editExercise.close();
  
});

let checkbox_value = "";
let optionstatus_edit = 0;   

//! Load the exercise data into the edit modal
function editExercise(lastNumber) {
  optionstatus_edit = 0;
  exerciseTitleTextInputedit.value = document.getElementById("exerciseTitleText" + lastNumber).textContent;
  exerciseDescTextInputedit.value = document.getElementById("exerciseDescText" + lastNumber).textContent;
  exercisePointsValueInputedit.value = document.getElementById("points" + lastNumber).textContent;
  exerciseTestcaseTextInputedit.value = document.getElementById("testCases" + lastNumber).textContent;
  checkbox_value = document.getElementById("optionstatus" + lastNumber).textContent;
  
  if (checkbox_value == "1") {
    optionstatus_edit = 1;
    checkbox_code_edit.checked = true;
  } else {
    checkbox_code_edit.checked = false;
  }
  
  modal_editExercise.showModal();
  
}

let optionstatus = 0;

//! Check the option status for the exercise
function checkOptionStatus(optionstatus_div) {
  if (optionstatus % 2 == 0) {
    
    optionstatus_div.textContent = "0";
  } else {
    optionstatus_div.textContent = "1";
    
  }
}

//! Check the option status in the edit modal
function checkOptionStatusEdit() {
  const checkbox_div = document.getElementById("optionstatus" + lastNumber);
  if (optionstatus_edit % 2 == 0) {
   
    checkbox_div.textContent = "0";
  } else {
    checkbox_div.textContent = "1";
    
  }
}

//! Hide the alert when the close button is clicked
alert_cross.addEventListener("click", function() {
  alert_div.style.visibility = "hidden";
});

//! Open file explorer to load a file
loadButton.addEventListener("click", function() {
  fileInput.click(); // Open file explorer
});

//! Read the selected file and load its content into the editor
fileInput.addEventListener("change", function(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      editor.setValue(e.target.result, -1); 
      fileInput.value = ''; 
    };
    reader.readAsText(file); 
  }
});

saveCode.addEventListener("click", function() {
  var content = editor.getValue();  
  var filename;

  //! Determine the file name based on the selected language
  if (language == 'python') {
    filename = "script.py";
  } else {
    filename = "script.js";
  }

  //! Create a new blob with the content to be saved
  var blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  var link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click(); // Trigger download
  document.body.removeChild(link); // Clean up

 
});

document.getElementById('createTestButton').addEventListener('click', async function() {
  //! Check if there are any exercises before proceeding
  if (index == 0) {
    alert_div.style.visibility = "visible"; // Show alert if no exercises
  } else {
    testname = prompt("Testname:"); // Prompt user for a test name
    if (!testname) {
      alert('Testname required!'); // Alert if no test name is provided
      return;
    } else {
      const exercices = document.querySelectorAll('.container_list .newEx');
      const testValues = {
        userName: userName,
        testname: testname,
        exercices: []
      };

      //! Gather exercise data for the test
      exercices.forEach((exercise) => {
        const title = exercise.querySelector('.exerciseTitleText').textContent;
        const description = exercise.querySelector('.exerciseDescText').textContent;
        const optionstatus_div_test = exercise.querySelector('.optionstatus').textContent;
        const editor_content = exercise.querySelector('.ex_editor_content').textContent;
        const points = exercise.querySelector('.points').textContent;
        const testcase = exercise.querySelector('.testCases').textContent;

        testValues.exercices.push({
          title: title,
          description: description,
          optionstatus: optionstatus_div_test,
          editorContent: editor_content,
          points: points,
          testcase: testcase
        });
      });

      //! Save test values to local storage and send to the server
      localStorage.setItem('testValues', JSON.stringify(testValues));
      await fetchPost("/api/save", testValues);
    }
  }
});

//! Function to send a POST request
function fetchPost(url, data) {
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  };

  return fetch(url, options);
}

//! Update the option status when the checkbox is changed
checkbox_code.addEventListener("change", function() {
  optionstatus++;
  
});

//! Update the edit option status when the checkbox is changed
checkbox_code_edit.addEventListener("change", function() {
  optionstatus_edit++;
  
});

//! Navigate to the tests overview page
document.getElementById("testsOverview").addEventListener("click", function() {
  window.location.href = '../test-overview/test-overview.html';
});

//! Navigate to the receive page
document.getElementById("Recieve").addEventListener("click", function() {
  window.location.href = '../recieve/recieve.html';
});

//! Navigate to the correct page
document.getElementById("Correct").addEventListener("click", function() {
  window.location.href = '../correct/correct.html';
});
























//! Original Code for backup

// let exerciseCount = 0;
// let lastNumber = null;
// let index = 0;

// const userName = sessionStorage.getItem('userName')

// const newEx = document.querySelector(".sortable-list")

// const saveButton = document.getElementById("saveButton-modal")
// const modal_editExercise = document.getElementById("modal_editExercise")


// const modal_closeEditExercise = document.getElementById("closeButton-editExercise")
// const exerciseTitleTextInputedit = document.getElementById("exerciseTitleTextInputedit")
// const exerciseDescTextInputedit = document.getElementById("exerciseDescTextInputedit")
// const exercisePointsValueInputedit = document.getElementById('ExPointsInputModalEdit')
// const exerciseTestcaseTextInputedit = document.getElementById('testCaseTextEdit')


// const saveEditedExerciseButton = document.getElementById("saveButton-editExercise")
// const closeEditedExerciseButton = document.getElementById("closeButton-editExercise")

// const alert_div = document.querySelector(".alert")
// const alert_cross = document.querySelector(".alert-cross")

// const loadButton = document.getElementById("loadButton")
// const fileInput = document.getElementById('fileInput');

// const saveCode = document.getElementById("saveCode")
// const checkbox_code = document.getElementById("checkbox_code")
// const checkbox_code_edit = document.getElementById("checkbox_code_edit")





// let editor;

// window.onload = function() {
//     editor = ace.edit("editor");
//     editor.setTheme("ace/theme/tomorrow_night_bright");
//     editor.session.setMode("ace/mode/javascript")
//     editor.setOptions({
//       enableBasicAutocompletion: true,
//       enableLiveAutocompletion: true
//     });

    
//     function loadDefaultFile() {
//       fetch('js/default.js')
//           .then(response => response.text())
//           .then(data => {
//               editor.setValue(data, -1); 
//           })
//           .catch(error => console.error('Error loading default.js:', error));
//   }

 
//   loadDefaultFile();


//     editor.session.on("change", function(delta){
//       const ace_content = editor.getValue();
//     })
// }



// const output_place = document.getElementById("output")



// var language = "node";

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
//   var code = editor.getValue(); 
//   var captured_output = '';
//   outputDiv.className = "";

//   var iframe = document.createElement('iframe');
//   document.body.appendChild(iframe);
//   var iframeWindow = iframe.contentWindow;
  

//   iframeWindow.console.log = function(output) {
//     captured_output += output + '\n';
//   };

//   try {
//     if (language === "node") { 
//       iframeWindow.print = function() {
//         alert("Wrong language selected");
//       };
      
   
//       iframeWindow.eval(code); 
      
//       outputDiv.textContent = captured_output; 
//     } else if (language === "python") { 
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
   
//     document.body.removeChild(iframe);
//   }
// }






// function runPython() {
//   var code = editor.getValue();
//   var outputDiv = document.getElementById("output");
  
//   outputDiv.innerHTML = ''; 

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





// const exerciseTitleTextInput = document.getElementById('exerciseTitleTextInput');
// const exerciseDescTextInput = document.getElementById('exerciseDescTextInput');
// const exercisePointsValueInput = document.getElementById('ExPointsInputModal')
// const exerciseTestcaseTextInput = document.getElementById('testCaseText')

// const container_list = document.querySelector(".container_list") 


// const modal = document.getElementById("modal")
// const openModal = document.getElementById("add-button")
// const closeModal = document.getElementById("closeButton-modal")








// openModal.addEventListener("click", () =>{
//   optionstatus = 0 
//   checkbox_code.checked = false;
//   exerciseTitleTextInput.value ="";
//   exerciseDescTextInput.value = "";
//   exercisePointsValueInput.value ='';
//   exerciseTestcaseTextInput.value = '';
//   modal.showModal()
//   console.log("MODAL OPEN")
// });

// closeModal.addEventListener("click", () =>{
//   exerciseTitleTextInput.value ="";
//   exerciseDescTextInput.value = "";
//   exercisePointsValueInput.value ='';
//   exerciseTestcaseTextInput.value = '';
//   modal.close()
//   console.log("MODAL CLOSED")
// });





// exerciseTitleTextInput.addEventListener("input", function(){
//   console.log("Value Updated")
//   return exerciseTitleTextInput.value;
// })

// exerciseDescTextInput.addEventListener("input", function(){
//   console.log("Value Updated")
//   return exerciseDescTextInput.value;
// })

// exercisePointsValueInput.addEventListener("input", function(){
//   console.log("Value Updated")
//   return exercisePointsValueInput.value;
// })

// exerciseTestcaseTextInput.addEventListener("input", function(){
//   console.log("Value Updated")
//   return exerciseTestcaseTextInput.value;
// })



// function saveModal(){
//   exerciseCount++;
//   index++;
//   const newDiv = createNewEx()
//   createTextinNewEx(newDiv)
//   placeCrossInEx(newDiv)
//   placePenInEx(newDiv)
//   modal.close();
//   console.log("MODAL SAVED")
// }




// saveButton.addEventListener("click", function(){
//   saveModal()
// })

// function createNewEx(){
//   const newDiv = document.createElement("div") 
//   newDiv.setAttribute("draggable", "true")
//   newDiv.id="newEx" + exerciseCount;
//   newDiv.className="newEx"
//   container_list.appendChild(newDiv)
//   return newDiv;
// }

// function createTextinNewEx(newDiv) {
//   let content_1 = exerciseTitleTextInput.value;
//   let content_2 = exerciseDescTextInput.value;
//   let points_content = exercisePointsValueInput.value; 
//   let testCases_content = exerciseTestcaseTextInput.value; 

//   const exerciseTitleText = document.createElement("div");
//   const exerciseDescText = document.createElement("div");
//   const optionstatus_div = document.createElement("div");
//   const ex_editor_content = document.createElement("div");
//   const points = document.createElement("div");
//   const testCases = document.createElement("div");

//   exerciseTitleText.id = "exerciseTitleText" + exerciseCount;
//   exerciseDescText.id = "exerciseDescText" + exerciseCount;
//   optionstatus_div.id = "optionstatus" + exerciseCount;
//   ex_editor_content.id = "ex_editor_content" + exerciseCount;
//   points.id = "points" + exerciseCount;
//   testCases.id = "testCases" + exerciseCount;

//   optionstatus_div.className = "optionstatus";
//   exerciseTitleText.className = "exerciseTitleText";
//   exerciseDescText.className = "exerciseDescText";
//   ex_editor_content.className = "ex_editor_content";
//   points.className = "points";
//   testCases.className = "testCases";

//   exerciseTitleText.textContent = content_1;
//   exerciseDescText.textContent = content_2;
//   ex_editor_content.textContent = editor.getValue();
//   points.textContent = points_content; 
//   testCases.textContent = testCases_content; 

//   checkOptionStatus(optionstatus_div);

//   newDiv.appendChild(exerciseTitleText);
//   newDiv.appendChild(exerciseDescText);
//   newDiv.appendChild(optionstatus_div);
//   newDiv.appendChild(ex_editor_content);
//   newDiv.appendChild(points);
//   newDiv.appendChild(testCases);
// }


// function placeCrossInEx(newDiv){
//   const ExCross = document.createElement("span")
//   ExCross.className = "material-symbols-outlined ExCross icons-animation"
//   ExCross.id ="ExCross" + exerciseCount;
//   ExCross.textContent = "close"
//   ExCross.setAttribute("onclick", `handleExCrossClick(event, ${exerciseCount})`);
//   newDiv.appendChild(ExCross)

// }

// function placePenInEx(newDiv){
//   const ExPen = document.createElement("span")
//   ExPen.className = "material-symbols-outlined ExPen icons-animation"
//   ExPen.id ="ExPen" + exerciseCount;
//   ExPen.textContent = "edit"
//   ExPen.setAttribute("onclick", `handleExPenClick(event, ${exerciseCount})`);
//   newDiv.appendChild(ExPen)

// }



// function handleExPenClick(event, number) {
//   lastNumber = number //Store in outer scope
//   const newExDiv = event.target.closest('.newEx'); 
//   if (newExDiv) {
//       const divID = newExDiv.id;
//       const lastNumber = divID.match(/\d+$/)[0]; 
//       editExercise(lastNumber);
//   }
// }


// function handleExCrossClick(event, number){
//   lastNumber = number 
//   const newExDiv = event.target.closest('.newEx');
//   if(newExDiv){
//     const divID = newExDiv.id;
//       const lastNumber = divID.match(/\d+$/)[0]; 
//       deleteExercise(lastNumber)
//   }
// }

// function deleteExercise(lastNumber){
//   index--;
//   const exerciseToRemove = document.getElementById("newEx"+ lastNumber)
//   container_list.removeChild(exerciseToRemove);
// }






// saveButton.addEventListener('click', function() {
  
//   const ExTitle = document.getElementById("exerciseTitleText" + exerciseCount);

//   if (ExTitle.textContent == "") {
//     ExTitle.textContent ="Title undefined"
//   } else {
//     return
//   }
// });




// function saveEditedExercise(){
//   console.log(lastNumber); 

//   document.getElementById("exerciseTitleText" + lastNumber).textContent = exerciseTitleTextInputedit.value || "Title undefined";
//   document.getElementById("exerciseDescText" + lastNumber).textContent = exerciseDescTextInputedit.value;
//   document.getElementById("points" + lastNumber).textContent = exercisePointsValueInputedit.value;
//   document.getElementById("testCases" + lastNumber).textContent = exerciseTestcaseTextInputedit.value;
//   checkOptionStatusEdit()
//   modal_editExercise.close();
//   console.log("MODAL EDIT SAVED");
// };





// closeEditedExerciseButton.addEventListener("click", function(){
//   modal_editExercise.close();
//   console.log("MODAL EDIT CLOSED")
// })

// let checkbox_value = ""
// let optionstatus_edit = 0   


//   function editExercise(lastNumber){
//   optionstatus_edit = 0 
//   exerciseTitleTextInputedit.value = document.getElementById("exerciseTitleText" + lastNumber ).textContent;
//   exerciseDescTextInputedit.value = document.getElementById("exerciseDescText" + lastNumber).textContent;
//   exercisePointsValueInputedit.value = document.getElementById("points" + lastNumber ).textContent;
//   exerciseTestcaseTextInputedit.value = document.getElementById("testCases" + lastNumber ).textContent;
//   checkbox_value = document.getElementById("optionstatus" + lastNumber).textContent;
//   if(checkbox_value == "1"){
//     optionstatus_edit = 1
//     checkbox_code_edit.checked = true
//   } else{
//     checkbox_code_edit.checked = false
//   }
//   modal_editExercise.showModal();
//   console.log("MODAL EDIT OPEN")
// }

// let optionstatus = 0

// function checkOptionStatus(optionstatus_div){
//   if(optionstatus % 2 == 0){
//     console.log("off", optionstatus)
//     optionstatus_div.textContent = "0"
//   } else{
//     optionstatus_div.textContent = "1"
//     console.log("on", optionstatus)
//   }
// }

// function checkOptionStatusEdit(){
//   const checkbox_div = document.getElementById("optionstatus"+lastNumber)
//   if(optionstatus_edit % 2 == 0){
//     console.log("off", optionstatus_edit)
//     checkbox_div.textContent = "0"
//   } else{
//     checkbox_div.textContent = "1"
//     console.log("on", optionstatus_edit)
//   }
// }



// alert_cross.addEventListener("click", function(){
//   alert_div.style.visibility = "hidden"
// })



// loadButton.addEventListener("click", function() {
//   fileInput.click(); // Open file explorer
// });

// fileInput.addEventListener("change", function(event) {
//   const file = event.target.files[0];
//   if (file) {
//       const reader = new FileReader();
//       reader.onload = function(e) {
//           editor.setValue(e.target.result, -1); 
//           fileInput.value = ''; 
//       };
//       reader.readAsText(file); 
//   }
// });






// saveCode.addEventListener("click", function() {
//   var content = editor.getValue();  
//   var filename;

//   if (language == 'python') {
//     filename = "script.py";
//   } else {
//     filename = "script.js";
//   }

//   var blob = new Blob([content], { type: "text/plain;charset=utf-8" });
//   var link = document.createElement("a");
//   link.href = URL.createObjectURL(blob);
//   link.download = filename;
//   document.body.appendChild(link);
//   link.click();
//   document.body.removeChild(link);

//   console.log("File saved as:", filename);
// });


// document.getElementById('createTestButton').addEventListener('click', async function() {
//   if (index == 0) {
//     alert_div.style.visibility = "visible";
//   } else {
//     testname = prompt("Testname:");
//     if (!testname) {
//       alert('Testname required!');
//       return;
//     } else {
//       const exercices = document.querySelectorAll('.container_list .newEx');
//       const testValues = {
//         userName: userName,
//         testname: testname,
//         exercices: []
//       };

//       exercices.forEach((exercise) => {
//         const title = exercise.querySelector('.exerciseTitleText').textContent;
//         const description = exercise.querySelector('.exerciseDescText').textContent;
//         const optionstatus_div_test = exercise.querySelector('.optionstatus').textContent;
//         const editor_content = exercise.querySelector('.ex_editor_content').textContent;
//         const points = exercise.querySelector('.points').textContent;
//         const testcase = exercise.querySelector('.testCases').textContent;

        
//         testValues.exercices.push({
//           title: title,
//           description: description,
//           optionstatus: optionstatus_div_test,
//           editorContent: editor_content,
//           points: points,
//           testcase: testcase
//         });
//       });

//       localStorage.setItem('testValues', JSON.stringify(testValues));

//       await fetchPost("/api/save", testValues);
//     }
//   }
// });

// function fetchPost(url, data) {
//   const options = {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(data)
//   };

//   return fetch(url, options);
// }



// checkbox_code.addEventListener("change", function(){
//   optionstatus++;
//   console.log("optionstatus",optionstatus)
// })
  

// checkbox_code_edit.addEventListener("change", function(){
//   optionstatus_edit++;
//   console.log("optionstatus_edit",optionstatus_edit)
// })

// document.getElementById("testsOverview").addEventListener("click", function(){
//   window.location.href = '../test-overview/test-overview.html'
// })


// document.getElementById("Recieve").addEventListener("click", function(){
//   window.location.href = '../recieve/recieve.html'
// })

// document.getElementById("Correct").addEventListener("click", function(){
//   window.location.href = '../correct/correct.html'
// })


