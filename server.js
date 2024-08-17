
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
    res.redirect('/main/teacher/teacher.html');
  } else if (userType === 'student') {
    res.redirect('/main/student/student.html');
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



//TRYOUT (DELETABLE)
app.post('/api/save', async (req, res) => {
    // Extract userName and testValues from the body
    const { userName, testname, exercices } = req.body;

    // Log the extracted values
    console.log('userName:', userName);
    console.log('testname:', testname);
    console.log('exercices:', exercices);

    if (!userName) {
        return res.status(400).send('User name is missing!');
    }

    let dirPath = path.join(__dirname, "dbv1", userName);
    let baseFileName = 'demotest';
    let fileExtension = '.json';
    let filePath = path.join(dirPath, baseFileName + fileExtension);
    
    // Check if file already exists and increment the file number if necessary
    let fileIndex = 1;
    while (await fileExists(filePath)) {
        filePath = path.join(dirPath, `${baseFileName}${fileIndex}${fileExtension}`);
        fileIndex++;
    }

    try {
        await fs.mkdir(dirPath, { recursive: true });
        await fs.writeFile(filePath, JSON.stringify(req.body), "utf8");
        res.send(`Data saved successfully as ${path.basename(filePath)}!`);
    } catch (error) {
        console.error('Error saving data:', error);
        res.status(500).send('Error saving data.');
    }
});

// Helper function to check if a file exists
async function fileExists(filePath) {
    try {
        await fs.access(filePath);
        return true;
    } catch {
        return false;
    }
}


  // Dummy load request
  // Endpoint to list all test files for a specific user
  app.get('/api/loadTest', async (req, res) => {
    const { userName, fileName } = req.query;

    if (!userName || !fileName) {
        return res.status(400).send('User name or file name is missing!');
    }

    const filePath = path.join(__dirname, 'dbv1', userName, fileName);

    try {
        const fileContent = await fs.readFile(filePath, 'utf8');
        const testData = JSON.parse(fileContent);
        res.json(testData);
    } catch (error) {
        console.error('Error loading test file:', error);
        res.status(500).send('Error loading test file.');
    }
});

app.get('/api/listTests', async (req, res) => {
  const { userName } = req.query; // Retrieve userName from query parameters

  if (!userName) {
      return res.status(400).send('User name is missing!');
  }

  const dirPath = path.join(__dirname, 'dbv1', userName);
  try {
      const files = await fs.readdir(dirPath);
      const testFiles = files.filter(file => file.startsWith('demotest') && file.endsWith('.json'));
      res.json(testFiles);
  } catch (error) {
      console.error('Error listing files:', error);
      res.status(500).send('Error listing files.');
  }
});






// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});





//TRY FOR COMMITING TESTS

app.post('/api/commitTest', async (req, res) => {
  const { userName, fileName, targetUrl } = req.body;

  if (!userName || !fileName || !targetUrl) {
    return res.status(400).send('User name, file name, or target URL is missing!');
  }

  try {
    const filePath = path.join(__dirname, 'dbv1', userName, fileName);
    console.log('File path:', filePath);
    const fileContent = await fs.readFile(filePath, 'utf8');

    console.log('Forwarding data to:', targetUrl);
    console.log('File content being sent:', fileContent);

    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fileContent }) // Adjust according to what targetUrl expects
    });

    const responseData = await response.text();
    console.log('Response status:', response.status);
    console.log('Response data:', responseData);

    res.status(response.status).send(responseData);
  } catch (error) {
    console.error('Error forwarding data:', error);
    res.status(500).send('Error forwarding data.');
  }
});

app.get('/api/getTestData', async (req, res) => {
  try {
    const filePath = path.join(__dirname, 'dbv1', 'valery.sturm', 'demotest.json'); // Adjust path if necessary
    const fileContent = await fs.readFile(filePath, 'utf8');
    const testData = JSON.parse(fileContent);

    // Extract the testName from the testData
    const testName = testData.testName; // Adjust this if your test data structure is different

    // Send only the testName
    res.json({ testName });
  } catch (error) {
    console.error('Error reading test data:', error);
    res.status(500).send('Error reading test data.');
  }
});




app.post('/api/solve_overview', (req, res) => {
  const data = req.body;
  console.log('Received data:', data);

  // Process or store the data as necessary
  // Respond to the client
  res.status(200).send('Data received and processed');
});




app.get('/api/getStudentData', async (req, res) => {
  const testName = req.query.testName;  // Get testName from query parameters

  if (!testName) {
      return res.status(400).send('Test name is missing!');
  }

  try {
      // Assuming that test files are named based on the testName, you would construct the file path like this:
      const filePath = path.join(__dirname, 'dbv1', 'valery.sturm', `${testName}.json`); // Replace 'valery.sturm' with the correct user folder
      console.log("File path:", filePath);

      const fileContent = await fs.readFile(filePath, 'utf8');
      res.json(JSON.parse(fileContent));
  } catch (error) {
      console.error('Error reading student data:', error);
      res.status(500).send('Error reading student data.');
  }
});
