
import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs/promises';
import multer from 'multer';
import { exec } from 'child_process';
import { config } from 'process';

// Convert file URL to file path
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Create an Express application
const app = express();



// Serve static files from the root folder
app.use(express.static(__dirname));
app.use(express.json());


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      const uploadPath = path.join(__dirname, 'public');
      cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
      cb(null, file.originalname); // Save the file with its original name
  }
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
      const ext = path.extname(file.originalname);
      if (ext !== '.seb') {
          return cb(new Error('Only .seb files are allowed'));
      }
      cb(null, true);
  }
});


// Handle file upload via POST request
app.post('/upload-seb', upload.single('sebFile'), async (req, res) => {
  try {
      if (!req.file) {
          return res.status(400).json({ success: false, message: 'No file uploaded or invalid file type' });
      }
      
      const { testId, teacherName, studentName } = req.body; // Get testId, teacherName, and studentName from the request body
      const newFileName = `${testId}.seb`; // Set new file name
      
      // Read the uploaded file content
      let content = await fs.readFile(req.file.path, 'utf8');

      // Construct the new startURL with parameters
      const newStartURL = `http://127.0.0.1:3000/main/student/solve/solve.html?testId=${testId}&teacherName=${teacherName}&studentName=${studentName}`;

      // Modify the content as needed (change startURL)
      content = content.replace(/<key>startURL<\/key>\n\s*<string>.*?<\/string>/, `<key>startURL</key>\n    <string>${newStartURL}</string>`);

      // Write the modified content to the new .seb file
      await fs.writeFile(path.join(req.file.destination, newFileName), content);

      // Optionally delete the original uploaded file
      await fs.unlink(req.file.path);

      res.json({ success: true, message: 'File uploaded and modified successfully', fileName: newFileName });
  } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ success: false, message: 'Error uploading file' });
  }
});




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





// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});



//! Saving Test Post Req

app.post('/submitTest', async (req, res) => {
  const { savedExercisesToSubmit } = req.body;

  if (!savedExercisesToSubmit) {
      return res.status(400).json({ message: 'No exercises to submit' });
  }

  // Parse the exercises (if necessary)
  const exercises = JSON.parse(savedExercisesToSubmit);

  // Use placeholder values for teacherName, studentName, and testId
  const teacherName = "dummyLP";  // Placeholder teacher name
  const studentName = "Student";  // Placeholder student name
  const testId = "1";  // Placeholder test ID

  // Prepare the exercises object with placeholders
  const exercisesWithPlaceholders = {
      testId: testId,
      studentName: studentName,
      exercises: exercises // Include the original exercises here
  };

  // Define the base directory and the path where the test will be saved
  const baseDir = path.join(path.dirname(fileURLToPath(import.meta.url)), 'dbv1', teacherName, 'recieved_tests');

  try {
      // Ensure the directories exist, create them if not
      await fs.mkdir(baseDir, { recursive: true });

      // Create a unique filename for the test
      const fileName = `${testId}.json`;
      const filePath = path.join(baseDir, fileName);

      // Save the exercises with placeholders directly into the file
      await fs.writeFile(filePath, JSON.stringify(exercisesWithPlaceholders, null, 2));

      // Respond back to the client
      res.status(200).json({ message: 'Test submitted and saved successfully!', filePath });
  } catch (error) {
      console.error('Error saving test:', error);
      res.status(500).json({ message: 'Failed to save the test', error: error.message });
  }
});


app.get('/recieveTest', async (req, res) => {
  const userName = 'dummyLP'; // Replace with dynamic user input if necessary
  const dirPath = path.join(__dirname, 'dbv1', userName, 'recieved_tests');

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





app.post('/solve-test', async (req, res) => {
  const { configFile, teacherName, studentName, testId} = req.body; // Get parameters from the request body

  
  // Path to the uploaded SEB file (you might want to store this more dynamically)
  const sebFilePath = path.join(__dirname, 'public', `${configFile}`);
  
  try {
      // Read the file content
      let sebFileContent = await fs.readFile(sebFilePath, 'utf8');
      
      // Modify the startURL and allowQueryParameters in the content
      sebFileContent = sebFileContent.replace(
        /(<key>startURL<\/key>\s*<string>)(.*?)(<\/string>)/,
        (match, p1, p2, p3) => `${p1}http://127.0.0.1:3000/main/student/solve/solve.html?testId=${testId}&teacherName=${teacherName}&studentName=${studentName}${p3}`
      );
      
      sebFileContent = sebFileContent.replace(/(<key>allowQueryParameters<\/key>\s*<false \/>)/, '<key>allowQueryParameters</key>\n    <true />');

      // Write the modified content back to a new file or overwrite it
      const modifiedSebFilePath = path.join(__dirname, `modified_${configFile}.seb`);
      await fs.writeFile(modifiedSebFilePath, sebFileContent);

      // Send the modified file to the student
      res.download(modifiedSebFilePath, `test_${configFile}`);
  } catch (error) {
      console.error("Error modifying the SEB file:", error);
      res.status(500).json({ success: false, message: 'Error preparing the test file' });
  }
});
