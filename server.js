
import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs/promises';

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
    console.log("invalid user type")
  }
});

// Handle directory existence check
app.post('/api/checkDirectory', async (req, res) => {
  const { userName } = req.body;
  const userDirectoryPath = path.join(__dirname, 'dbv1', userName);

  try {
    const directoryExists = await fs.access(userDirectoryPath);
    res.json({ directoryExists: true });
  } catch (error) {
    res.json({ directoryExists: false });
  }
});

// Handle directory creation
app.post('/api/createDirectory', async (req, res) => {
  const { userName } = req.body;
  const userDirectoryPath = path.join(__dirname, 'dbv1', userName);

  try {
    await fs.mkdir(userDirectoryPath, { recursive: true });
    res.send('User directory created successfully!');
  } catch (error) {
    console.error('Error creating directory:', error);
    res.status(500).send('Failed to create user directory');
  }
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});



//TRYOUT (DELETABLE)
app.post('/api/save', async (req, res) => {
    // Dummy logic for saving data
    let data = req.body
    console.log(data)
  
    let user = user.data
    console.log("user:", user)
    let dirPath = path.join(__dirname, "dbv1", user)
    await fs.mkdir(dirPath, { recursive: true })
    await fs.writeFile(dirPath + "/demotest.json", JSON.stringify(req.body), "utf8")
    res.send('Data saved successfully!');
  });
  
  // Dummy load request
  app.post('/api/load', async (req, res) => {
    const { user } = req.body;
    const dirPath = path.join(__dirname, "dbv1", user);
    const userInfoPath = path.join(dirPath, "userinfo.json");

    try {
        // Read userINFO.json
        const userInfoData = await fs.readFile(userInfoPath, 'utf8');
        const userInfo = JSON.parse(userInfoData);
        const userName = userInfo.userName;

        // Now, load the requested test data
        const testid = req.body.testid || "demotest";
        const testFilePath = path.join(dirPath, `${testid}.json`);

        res.sendFile(testFilePath);
    } catch (error) {
        console.error('Error loading data:', error);
        res.status(500).send('Failed to load data');
    }
});

