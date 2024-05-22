
//ChangeLanguage fun.

let exerciseCount = 0;



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



const modal = document.querySelector("#modal")
const openModal = document.querySelector(".add-button")
const closeModal = document.querySelector(".close-button")



openModal.addEventListener("click", () =>{
  modal.showModal();
  console.log("MODAL OPEN")
});

closeModal.addEventListener("click", () =>{
  modal.close()
  console.log("MODAL CLOSED")
});








function saveModal(){
  console.log("MODAL SAVED")
  // Code to save written Exercise -> Lüthi fragen
}







