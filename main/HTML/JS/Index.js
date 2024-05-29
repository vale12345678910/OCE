
let editor;

window.onload = function() {
    editor = ace.edit("editor");
    editor.setTheme("ace/theme/twilight");
    editor.session.setMode("ace/mode/c_cpp");
}


//ChangeLanguage fun.

function changeLanguage() {

  let language = $("#languages").val();

  if(language == 'c' || language == 'cpp')editor.session.setMode("ace/mode/c_cpp");
  else if(language == 'php')editor.session.setMode("ace/mode/php");
  else if(language == 'python')editor.session.setMode("ace/mode/python");
  else if(language == 'node')editor.session.setMode("ace/mode/javascript");
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
let exerciseCount = 0;
const textarea_1 = document.getElementById('textarea_1');
const textarea_2 = document.getElementById('textarea_2');



const container_list = document.querySelector(".container_list") //where the saved ex. should go.


const modal = document.querySelector("#modal")
const openModal = document.querySelector(".add-button")
const closeModal = document.querySelector(".closeButton-modal")



openModal.addEventListener("click", () =>{
  exerciseCount++;
  modal.style.display = "flex" // -> Lüthi Fragen ob bessere Methode, Problem: Wenn Escape gedrückt (Modal offen), dann schliesst es sich, flex bleibt aber (nicht auf none gesetzt.)
  modal.showModal()
  console.log("MODAL OPEN")
});

closeModal.addEventListener("click", () =>{
  textarea_1.value ="";
  textarea_2.value = "";
  modal.style.display = "none"
  modal.close()
  exerciseCount--; 
  console.log("MODAL CLOSED")
});


// Textarea_1.updated() is getting updated.
textarea_1.addEventListener("input", function(){
  console.log("Value Updated")
  return textarea_1.value;
})

// Textarea_1.updated() is getting updated.
textarea_2.addEventListener("input", function(){
  console.log("Value Updated")
  return textarea_2.value;
})


function saveModal(){
  
  const newDiv = createNewEx()
  createTextinNewEx(newDiv)

  textarea_1.value ="";
  textarea_2.value = "";
  modal.style.display = "none"
  modal.close();
  console.log("MODAL SAVED")
}

document.querySelector(".saveButton-modal").addEventListener("click", function(){
  saveModal(textarea_1.value, textarea_2.value)
})

function createNewEx(){
  const newDiv = document.createElement("div") //create new ex.
  newDiv.id="newEx";
  newDiv.className="newEx"
  container_list.appendChild(newDiv)
  return newDiv;
}

function createTextinNewEx(newDiv){
  let content_1 = textarea_1.value;
  let content_2 = textarea_2.value;
  const text1 = document.createElement("div")
  const text2 = document.createElement("div")
  text1.id = "text1"
  text2.id = "text2"
  text1.className= "text1"
  text2.className= "text2"
  text1.textContent = content_1
  text2.textContent = content_2
  newDiv.appendChild(text1)
  newDiv.appendChild(text2)
}


document.addEventListener('DOMContentLoaded', function() {
  const textarea = document.getElementById('textarea_2');

  textarea.addEventListener('input', function() {
      this.style.height = 'auto';
      this.style.height = this.scrollHeight + 'px';
  });

  // Trigger the input event on page load to adjust the initial height
  textarea.dispatchEvent(new Event('input'));
});



