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
            container.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
        })
        .catch(error => {
            console.error('Error fetching student data:', error.message);
        });
});
