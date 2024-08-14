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
    fetch('/api/getTestData')
      .then(response => response.json())
      .then(data => {
        const container = document.getElementById('testValuesContainer');
        container.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
      })
      .catch(error => console.error('Error fetching test data:', error));
  });
  