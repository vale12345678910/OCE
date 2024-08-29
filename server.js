
import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs/promises';
import multer from 'multer';


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
  console.log("userName at server listTests", userName )

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



app.post('/api/saveTest', async (req, res) => {
  const { testname, exercices, fileVar } = req.body;

  if (!testname || !exercices || !fileVar) {
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




//testing multer



const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, path.join(__dirname, '/OCE', '/dbv1', '/uploads'));
  },
  filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // Rename the file with a timestamp
  }
});


const upload = multer({ storage: storage });

// Serve the uploads folder as static
app.use('/uploads', express.static(path.join(__dirname, '/OCE', '/dbv1', '/uploads')));

// Route to upload file
app.post('/api/upload', upload.single('file'), (req, res) => {
  console.error('req.file', req.file)
    if (req.file) {
        res.json({ filePath: `/uploads/${req.file.name}` });
    } else {
        res.status(400).send('File upload failed');
    }
});

// Route to download file
app.get('/download/:filename', (req, res) => {
    const filePath = path.join(__dirname, 'uploads', req.params.filename);
    res.download(filePath);
});


















// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});