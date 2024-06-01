
let exerciseCount = 0;



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




let editor;

window.onload = function() {
    editor = ace.edit("editor");
    editor.setTheme("ace/theme/twilight");
    editor.session.setMode("ace/mode/c_cpp");


    editor.session.on("change", function(delta){
      const ace_content = editor.getValue();
    })
}











//ChangeLanguage fun.

function changeLanguage() {

  let language = $("#languages").val();

  if(language == 'c' || language == 'cpp')editor.session.setMode("ace/mode/c_cpp");
  else if(language == 'php')editor.session.setMode("ace/mode/php");
  else if(language == 'python')editor.session.setMode("ace/mode/python");
  else if(language == 'node')editor.session.setMode("ace/mode/javascript");

  console.log("Language:", language)
}




function executeCode() {

  $.ajax({

      url: "/app/compiler.php",

      method: "POST",

      data: {
          language: $("#languages").val(),
          code: editor.getSession().getValue()
      },

      success: function(response) {
          $(".output").text(response)
      }
  })
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
  exerciseDescTextInput.style.height="18px";
  modal.style.display = "flex" // -> Lüthi Fragen ob bessere Methode, Problem: Wenn Escape gedrückt (Modal offen), dann schliesst es sich, flex bleibt aber (nicht auf none gesetzt.)
  modal.showModal()
  console.log("MODAL OPEN")
});

closeModal.addEventListener("click", () =>{
  exerciseCount--;
  exerciseTitleTextInput.value ="";
  exerciseDescTextInput.value = "";
  modal.style.display = "none"
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
  modal.style.display = "none"
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


document.addEventListener('DOMContentLoaded', function() {
  const textarea = document.getElementById('exerciseDescTextInput');

  textarea.addEventListener('input', function() {
      this.style.minHeight ="20" + "px";
      this.style.height = 'auto';
      this.style.height = (this.scrollHeight-5) + 'px';
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






















let lastNumber = null; // Define lastNumber outside the event listeners

// Event listener for container_list
container_list.addEventListener("click", function(event) {
  // Check if the clicked element or its parent has the class "newEx", "exerciseTitleText", or "exerciseDescText"
  if (
    event.target.classList.contains("newEx") ||
    event.target.classList.contains("exerciseTitleText") ||
    event.target.classList.contains("exerciseDescText") ||
    event.target.parentElement.classList.contains("newEx")
  ) {
    // Find the closest ancestor with the class "newEx"
    const newExDiv = event.target.closest(".newEx");
    if (newExDiv) {
      const divID = newExDiv.id;
      lastNumber = divID.match(/\d+$/)[0]; // Store lastNumber in the outer scope
      editExercise(lastNumber);
  
      
    }
  }
});


saveButton.addEventListener('click', function() {
  
  const ExTitle = document.getElementById("exerciseTitleText" + exerciseCount);

  if (ExTitle.textContent == "") {
    ExTitle.textContent ="Title undefined"
  } else {
    return
  }
});



// SAVE EDITED MODAL
saveEditedExerciseButton.addEventListener("click", function() {
  console.log(lastNumber); // Access lastNumber from the outer scope
  // Now you can use lastNumber here
  document.getElementById("exerciseTitleText" + lastNumber).textContent = exerciseTitleTextInputedit.value || "Title undefined";
  document.getElementById("exerciseDescText" + lastNumber).textContent = exerciseDescTextInputedit.value;
  modal_editExercise.style.display = "none";
  modal_editExercise.close();
  console.log("MODAL EDIT SAVED");
});


//CLOSE EDITED MODAL (DONT SAVE)
closeEditedExerciseButton.addEventListener("click", function(){
  modal_editExercise.style.display = "none"
  modal_editExercise.close();
  console.log("MODAL EDIT CLOSED")
})

   
// EDIT EXERCISE
  function editExercise(lastNumber){
  exerciseTitleTextInputedit.value = document.getElementById("exerciseTitleText" + lastNumber ).textContent;
  exerciseDescTextInputedit.value = document.getElementById("exerciseDescText" + lastNumber).textContent;
  modal_editExercise.style.display = "flex"
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