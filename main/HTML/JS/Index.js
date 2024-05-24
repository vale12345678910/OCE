
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

      url: "/ide/app/compiler.php",

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



const modal = document.querySelector("#modal")
const openModal = document.querySelector(".add-button")
const closeModal = document.querySelector(".closeButton-modal")



openModal.addEventListener("click", () =>{
  exerciseCount++;

  const exerciseCountSpan = document.getElementById("exerciseCount")
  exerciseCountSpan.innerText = exerciseCount;
  modal.style.display = "flex" // -> Lüthi Fragen ob bessere Methode
  modal.showModal()
  console.log("MODAL OPEN")
});

closeModal.addEventListener("click", () =>{
  modal.style.display = "none"
  modal.close()
  exerciseCount--; 
  console.log("MODAL CLOSED")
});

// Textarea.Value is getting updated.
document.getElementById("textarea_1").value = "New text..."
textarea_1.addEventListener("input", function(){
  console.log("Value Updated")
  return textarea.value;
})




function saveModal(textareaValue){
  const content_1 = textarea_1.value;
  const content_2 = textarea_2.value;
  const container_list = document.querySelector(".container_list") //where the saved ex. should go.
  const newDiv = document.createElement("div") //create new ex.


  newDiv.id="newEx";
  newDiv.className="newEx"
  newDiv.textContent = textareaValue
  container_list.appendChild(newDiv)
  modal.style.display = "none"
  modal.close();
  console.log("MODAL SAVED")
}

document.querySelector(".saveButton-modal").addEventListener("click", function(){
  saveModal(textarea_1.value, textarea_2.value)
})






