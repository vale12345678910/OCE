// Import necessary modules
import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from "fs/promises"
import { writeFile } from 'fs';

// Convert file URL to file path
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Create an Express application
const app = express();

// Serve static files from the root folder
app.use(express.static(__dirname));

app.use(express.json());

// Serve login.html file at the root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

// Handle login requests
app.get('/login', (req, res) => {
  const userType = req.query.type; // Assume a query parameter to identify user type
  if (userType === 'teacher') {
    res.redirect('/main/teacher/teacher-home/teacher.html');
  } else if (userType === 'student') {
    res.redirect('/main/student/student-home/student.html');
  } else {
    res.send('Invalid user type!');
  }
});

// Middleware to protect teacher routes
const protectTeacherRoutes = (req, res, next) => {
  const userType = req.query.type;
  if (userType === 'teacher') {
    next();
  } else {
    res.status(403).send('Access denied');
  }
};

// Middleware to protect student routes
const protectStudentRoutes = (req, res, next) => {
  const userType = req.query.type;
  if (userType === 'student') {
    next();
  } else {
    res.status(403).send('Access denied');
  }
};

// Protected teacher route
app.get('/main/teacher/teacher.html', protectTeacherRoutes, (req, res) => {
  res.sendFile(path.join(__dirname, 'main', 'teacher', 'teacher.html'));
});

// Protected student route
app.get('/main/student/student-home/student.html', protectStudentRoutes, (req, res) => {
  res.sendFile(path.join(__dirname, 'main', 'student', 'student-home', 'student.html'));
});

// Dummy save request
app.post('/api/save', async (req, res) => {
  // Dummy logic for saving data
  let data = req.body
  console.log(data)

  let user = data.user
  let dirPath = path.join(__dirname, "dbv1", user)
  await fs.mkdir(dirPath, { recursive: true })
  await fs.writeFile(dirPath + "/demotest.json", JSON.stringify(req.body), "utf8")
  res.send('Data saved successfully!');
});

// Dummy load request
app.post('/api/load', (req, res) => {
  let data = req.body
  let user = data.user || "dummyLP"
  let testid = data.testid || "demotest"
  let dirPath = path.join(__dirname, "dbv1", user)
  // Dummy logic for loading data
  res.sendFile(dirPath + `/${testid}.json`);
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
