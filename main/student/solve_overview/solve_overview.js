  let i = 1
  
  
  
  document.getElementById("corrections").addEventListener("click", function(){
    window.location.href = '../corrections/corrections.html'
  })
  
  
  document.getElementById("grades").addEventListener("click", function(){
    window.location.href = '../grades/grades.html'
  })
  
  document.getElementById("correctionChange").addEventListener("click", function(){
    window.location.href = '../correctionChange/correctionChange.html'
  })





  document.addEventListener('DOMContentLoaded', () => {
    const testName = 'demotest'; // You can dynamically set this based on the test you want to load

    fetch(`/api/getStudentData?testName=${encodeURIComponent(testName)}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch student data: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
          // Display the received data on the student page
          const container = document.getElementById('testValuesContainer');
          container.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`; // Removed extraneous $
      
          // Create and append the sebLink div
          const sebLink = document.createElement('div');
          sebLink.textContent = 'solve'
          sebLink.setAttribute('onclick', 'openSeb()')
          sebLink.className = 'sebLink';
          sebLink.id = `sebLink${i}`;
          i++;
          container.appendChild(sebLink);

          const chooseCofigurationFile = decument.createElement('div')
        })
        .catch(error => {
            console.error('Error fetching student data:', error.message);
        });
});


function openSeb(){

  console.log("Attempting to open SEB");

  // Define the URL that will be opened inside SEB
  const sebUrl = "seb://C:\Users\valer\AppData\Roaming\SafeExamBrowser\CreateTestTry.seb";

  // Attempt to open SEB with the specified URL
  window.location.href = sebUrl;
}