require("dotenv").config();
const express = require("express");
const cors = require("cors"); // Import cors
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { GoogleAIFileManager } = require("@google/generative-ai/server");

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const fileManager = new GoogleAIFileManager(apiKey);

const app = express();
const upload = multer({ dest: "uploads/" });

// Enable CORS (allow all origins or configure it as needed)
app.use(cors()); // This will allow requests from any origin.

// Serve the static front-end files
app.use(express.static("public"));

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-pro",
  systemInstruction:
    "You are a plant doctor who sees the image and gives a solution.",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

// Uploads image file to Gemini API
async function uploadToGemini(path, mimeType) {
  const uploadResult = await fileManager.uploadFile(path, {
    mimeType,
    displayName: path,
  });
  const file = uploadResult.file;
  console.log(`Uploaded file ${file.displayName} as: ${file.name}`);
  return file;
}

app.post("/api/plant-diagnosis", upload.single("image"), async (req, res) => {
  try {
    const imageFile = req.file;
    const userMessage = req.body.message;

    if (!imageFile || !userMessage) {
      return res.status(400).json({ error: "Missing image or message." });
    }

    // Upload image to Gemini
    const uploadedFile = await uploadToGemini(
      imageFile.path,
      imageFile.mimetype
    );
    console.log(`Uploaded image: ${uploadedFile.uri}`);

    // Start chat with the model using the file URI
    const chatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [
            {
              fileData: {
                mimeType: imageFile.mimetype,
                fileUri: uploadedFile.uri, // Use the uploaded file URI here
              },
            },
            { text: userMessage },
          ],
        },
      ],
    });

    // Get solution from model
    const result = await chatSession.sendMessage(userMessage);
    const solution = result.response.text();
    console.log(`Received solution from model: ${solution}`);

    // Clean up uploaded file
    fs.unlinkSync(imageFile.path);

    // Send solution to the frontend
    res.json({ solution: solution });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to process image and message." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
