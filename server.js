import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs/promises';
import session from 'express-session';


// Convert file URL to file path
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Create an Express application
const app = express();


// Serve static files from the root folder
app.use(express.static(__dirname));
app.use(express.json());
app.use(express.urlencoded({ extended: true }))



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
      await fs.access(userDirectoryPath);
      res.json({ directoryExists: true });
  } catch (error) {
      console.error(`Directory check failed: ${error.message}`);
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
    let baseFileName = testname;
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

  
  app.get('/api/loadTest', async (req, res) => {
    const { userName, fileName } = req.query;

    if (!userName || !fileName) {
        return res.status(400).send('User name, testname or file name is missing!');
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
      const testFiles = files.filter(file => file.endsWith('.json'));
      res.json(testFiles);
  } catch (error) {
      console.error('Error listing files:', error);
      res.status(500).send('Error listing files.');
  }
});




app.post('/api/saveTest', async (req, res) => {
  const { testname, exercices } = req.body;

  if (!testname || !exercices) {
      return res.status(400).send('Test name or exercises are missing!');
  }

  // Generate a unique test ID (can use UUID or a simple counter)
  const testId = Date.now().toString(); // Simple example using timestamp

  const dirPath = path.join(__dirname, 'tests');
  const filePath = path.join(dirPath, `${testId}.json`);

  try {
      await fs.mkdir(dirPath, { recursive: true });
      await fs.writeFile(filePath, JSON.stringify(req.body), 'utf8');
      res.json({ testId });
  } catch (error) {
      console.error('Error saving test:', error);
      res.status(500).send('Error saving test.');
  }
});




app.get('/api/getTestById', async (req, res) => {
  const { testId } = req.query;

  if (!testId) {
      return res.status(400).send('Test ID is missing!');
  }

  const filePath = path.join(__dirname, 'tests', `${testId}.json`);

  try {
      const fileContent = await fs.readFile(filePath, 'utf8');
      const testData = JSON.parse(fileContent);
      res.json(testData);
  } catch (error) {
      console.error('Error loading test file:', error);
      res.status(500).send('Error loading test file.');
  }
});









//! Saving Test Post Req


app.post('/submitTest', async (req, res) => {
  const { savedExercisesToSubmit, teacherName, studentName, testname, testId } = req.body;

  console.log("req.body", req.body)

  if (!savedExercisesToSubmit || !teacherName || !studentName || !testname || !testId) {
      return res.status(400).json({ message: 'Missing required data to submit the test' });
  }

  // Parse the exercises (if necessary)
  const exercises = JSON.parse(savedExercisesToSubmit);

  // Prepare the exercises object with actual teacherName, studentName, and testId
  const exercisesWithDetails = {
      testId: testId,
      testname: testname,
      studentName: studentName,
      exercises: exercises // Include the original exercises here
  };

  // Define the base directory where the test will be saved
  const baseDir = path.join(path.dirname(fileURLToPath(import.meta.url)), 'dbv1', teacherName, 'recieved_tests');

  try {
      // Ensure the directories exist, create them if not
      await fs.mkdir(baseDir, { recursive: true });

      // Generate a unique filename for the test
      let fileName = `${testId}.json`;
      let filePath = path.join(baseDir, fileName);
      let counter = 1;

      // Check if the file already exists, and if so, append a number to the filename
      while (await fileExists(filePath)) {
          fileName = `${testId} ${counter}.json`;
          filePath = path.join(baseDir, fileName);
          counter++;
      }

      // Save the exercises with the actual details into the unique file
      await fs.writeFile(filePath, JSON.stringify(exercisesWithDetails, null, 2));

      // Respond back to the client with success and the file path
      res.status(200).json({ message: 'Test submitted and saved successfully!', filePath });
  } catch (error) {
      console.error('Error saving test:', error);
      res.status(500).json({ message: 'Failed to save the test', error: error.message });
  }
});


app.get('/recieveTest', async (req, res) => {
  // Extract userName from query parameters
  const userName = req.query.userName; // Get the userName from the request
  const dirPath = path.join(__dirname, 'dbv1', userName, 'recieved_tests'); // Use userName to construct the path

  try {
      const files = await fs.readdir(dirPath);
      const jsonFiles = files.filter(file => file.endsWith('.json'));
      const receivedTests = [];

      for (const file of jsonFiles) {
          const filePath = path.join(dirPath, file);
          const fileContent = await fs.readFile(filePath, 'utf-8');
          receivedTests.push(JSON.parse(fileContent)); // Parse and add to the array
      }

      res.status(200).json(receivedTests);
  } catch (error) {
      console.error('Error reading received tests:', error);
      res.status(500).json({ message: 'Error retrieving received tests.' });
  }
});


// Dynamic endpoint to append data to the JSON file based on testId
app.post('/api/replace-student-name', async (req, res) => {
  const { testId, studentName } = req.body;

  // Create the file path using the testId
  const filePath = path.join(__dirname, 'tests', `${testId}.json`);

  try {
      // Read the existing content of the JSON file
      const data = await fs.readFile(filePath, 'utf-8');
      const jsonData = JSON.parse(data);

      // Replace the student name
      jsonData.studentName = studentName; // Directly replace the studentName field

      // Log the updated JSON data
      console.log('Updated JSON:', jsonData);

      // Write the updated content back to the JSON file
      await fs.writeFile(filePath, JSON.stringify(jsonData, null, 2)); // Pretty print for readability
      res.status(200).json({ message: 'Student name replaced successfully', updatedData: jsonData }); // Return the updated JSON in the response as well
  } catch (error) {
      console.error('Error replacing student name:', error);
      res.status(500).json({ error: 'Failed to replace student name' });
  }
});



// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});


//! JUST SOME IDEA TO MAYBE HANDLE THE STUDNET INTERFACE BETTER

//! JUST SOME IDEA TO MAYBE HANDLE THE STUDNET INTERFACE BETTER

//! JUST SOME IDEA TO MAYBE HANDLE THE STUDNET INTERFACE BETTER

// app.post('/solve-test', async (req, res) => {
//   const { configFile, teacherName, studentName, testId } = req.body; // Get parameters from the request body

//   Path to the uploaded SEB file
//   const sebFilePath = path.join(__dirname, 'public', configFile);

//   try {
//       Read the SEB file content
//       let sebFileContent = await fs.readFile(sebFilePath, 'utf8');

//       Construct the URL based on the provided parameters
//       const startUrl = `http://127.0.0.1:3000/main/student/solve/solve.html?testId=${testId}&teacherName=${teacherName}&studentName=${studentName}`;

//       Modify the SEB file content with the new startURL
//       sebFileContent = sebFileContent.replace(
//           /(<key>startURL<\/key>\s*<string>)(.*?)(<\/string>)/,
//           (match, p1, p2, p3) => `${p1}${startUrl}${p3}`
//       );

//       Log the constructed URL before generating the configKey
//       console.log('Start URL:', startUrl); // Print the constructed URL

//       Log the modified SEB file content
//       console.log('Modified SEB File Content:', sebFileContent); // Print the content of the modified SEB file

//       Generate the SHA256 hash (configuration key) of the modified content
//       const hash = crypto.createHash('sha256');
//       hash.update(sebFileContent); // Use the modified SEB file content
//       const configKey = hash.digest('hex');

//       Log the configuration key
//       console.log('Configuration Key:', configKey);

//       Send only the configuration key as response
//       res.json({ success: true, configKey: configKey });

//   } catch (error) {
//       console.error("Error modifying the SEB file:", error);
//       res.status(500).json({ success: false, message: 'Error preparing the test file' });
//   }
// });




