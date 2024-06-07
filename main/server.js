// Import necessary modules
import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';



// Convert file URL to file path
const __dirname = path.dirname(fileURLToPath(import.meta.url));



// Create an Express application
const app = express();

// Define the path to the static folder
const staticFolderPath = path.join(__dirname, 'HTML');

// Serve static files from the 'public' folder
app.use(express.static(staticFolderPath));

// Serve HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'HTML/teacher.html'));
});

app.get('/login', (req, res) => {
  res.redirect("/teacher.html");
});

// Dummy save request
app.post('/api/save', (req, res) => {
  // Dummy logic for saving data

  res.send('Data saved successfully!');
});

// Dummy load request
app.get('/api/save', (req, res) => {
  // Dummy logic for loading data
  const data = { name: 'John', age: 30 }; // Dummy data
  res.json(data);
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

// Button Function (add exersice)