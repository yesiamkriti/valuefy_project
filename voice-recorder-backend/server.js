require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const { exec } = require('child_process');
const { MongoClient } = require('mongodb');

// Initialize Express App
const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
const mongoURI = process.env.MONGO_URI;
const client = new MongoClient(mongoURI);
let db, transcriptionsCollection, tasksCollection;

async function connectDB() {
    try {
        await client.connect();
        db = client.db("SpeechDB");
        transcriptionsCollection = db.collection("Transcriptions");
        tasksCollection = db.collection("Tasks");
        console.log("✅ Connected to MongoDB");
    } catch (error) {
        console.error("❌ MongoDB Connection Failed:", error);
        process.exit(1);
    }
}

// Connect to MongoDB
connectDB();

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});
const upload = multer({ storage });

// Path to the Python interpreter within the virtual environment
const venvPython = path.join(__dirname, 'venv', 'Scripts', 'python.exe');

// Function to execute a Python script using the virtual environment's Python interpreter
const runPythonScript = (scriptPath, args = []) => {
    return new Promise((resolve, reject) => {
        const command = `"${venvPython}" "${scriptPath}" ${args.join(' ')}`;
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`❌ Error executing ${scriptPath}:`, error);
                return reject(error);
            }
            if (stderr) {
                console.error(`⚠️ Stderr from ${scriptPath}:`, stderr);
            }
            resolve(stdout);
        });
    });
};

// Upload & Process Audio Route
app.post('/upload', upload.single('audio'), async (req, res) => {
    try {
        const filePath = path.resolve(__dirname, 'uploads', req.file.filename);
        console.log("🔄 Processing file:", filePath);

        // Run speech_to_text.py
        await runPythonScript(path.resolve(__dirname, 'services/speech_to_text.py'), [filePath]);
        console.log("📝 Transcription completed and saved to MongoDB.");

        // Run nlp_extraction.py
        await runPythonScript(path.resolve(__dirname, 'services/nlp_extraction.py'));
        console.log("📌 NLP extraction completed and data updated in MongoDB.");

        res.json({ message: "✅ Processing Successful" });
    } catch (error) {
        console.error("❌ Error during processing:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
app.get('/api/tasks', async (req, res) => {
    try {
        const latestTask = await tasksCollection.findOne({}, { sort: { _id: -1 } });

        if (!latestTask || !latestTask.extracted_data) {
            return res.json({ message: "No extracted tasks found.", data: {} });
        }

        const { dates = [], times = [], tasks = [] } = latestTask.extracted_data;

        res.json({
            dates,
            times,
            tasks
        });
    } catch (error) {
        console.error("❌ Error fetching tasks:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
// Serve Uploaded Files
app.use('/uploads', express.static('uploads'));

// Start Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
