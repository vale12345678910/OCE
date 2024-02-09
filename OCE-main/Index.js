// Import necessary modules
import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';

// Convert file URL to file path
const __dirname = path.dirname(fileURLToPath(import.meta.url));


this is a chagne in the code i guess and hope


// Create an Express application
const app = express();

// Serve HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Dummy save request
app.post('/api/save', (req, res) => {
  // Dummy logic for saving data

  res.send('Data saved successfully!');
});

// Dummy load request
app.get('/api/load', (req, res) => {
  // Dummy logic for loading data
  const data = { name: 'John', age: 30 }; // Dummy data
  res.json(data);
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});