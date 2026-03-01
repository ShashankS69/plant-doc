# Plant Doctor 🌱

A full-stack web application that uses AI to diagnose plant health issues. Upload an image of your plant, and get instant analysis and solutions using Google's Gemini AI.

## Features

- 📸 **Image Upload**: Upload plant images directly from your device
- 🤖 **AI Diagnosis**: Powered by Google Gemini 1.5 Pro for accurate plant health analysis
- 💬 **Interactive Chat**: Get solutions and recommendations through a chat interface
- 🎨 **Modern UI**: Clean, responsive design with a dark theme
- ⚡ **Real-time Processing**: Fast image analysis and responses

## Tech Stack

### Frontend
- **React** 18.3.1 - UI framework
- **Vite** 5.4.10 - Fast build tool
- **Axios** - HTTP client
- **Lucide React** - Icon library
- **ESLint** - Code quality

### Backend
- **Express.js** 4.21.1 - Node.js web framework
- **Multer** 1.4.5 - File upload handling
- **Google Generative AI** 0.21.0 - AI model integration
- **CORS** - Cross-origin requests
- **dotenv** - Environment variable management

## Project Structure

```
plant-doc/
├── clientreact/          # React frontend application
│   ├── src/
│   │   ├── App.jsx       # Main application component
│   │   ├── main.jsx      # Entry point
│   │   ├── App.css       # Application styles
│   │   ├── index.css     # Global styles
│   │   └── assets/       # Static assets
│   ├── public/           # Public assets
│   ├── index.html        # HTML template
│   ├── vite.config.js    # Vite configuration
│   ├── eslint.config.js  # ESLint configuration
│   └── package.json      # Frontend dependencies
│
├── server/               # Express.js backend
│   ├── server.js         # Main server file
│   ├── uploads/          # Temporary file storage
│   └── package.json      # Backend dependencies
│
└── README.md            # This file
```

## Installation

### Prerequisites
- Node.js 14+ and npm/yarn
- Google API Key with Gemini access

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd plant-doc
```

### Step 2: Install Frontend Dependencies
```bash
cd clientreact
npm install
cd ..
```

### Step 3: Install Backend Dependencies
```bash
cd server
npm install
cd ..
```

## Setup

### 1. Get Google Gemini API Key
1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Create a new API key
3. Copy your API key

### 2. Configure Environment Variables
Create a `.env` file in the `server/` directory:
```env
GEMINI_API_KEY=your_api_key_here
```

## Usage

### Development Mode

#### Terminal 1 - Start the Backend Server
```bash
cd server
npm start
# Server runs on http://localhost:3000
```

#### Terminal 2 - Start the Frontend Development Server
```bash
cd clientreact
npm run dev
# Frontend runs on http://localhost:5173
```

### Building for Production

#### Frontend
```bash
cd clientreact
npm run build
# Creates optimized build in dist/
```

## How It Works

1. **Upload Plant Image**: User selects and uploads a plant image through the React interface
2. **Image Processing**: The backend receives the image and uploads it to Google's file management API
3. **AI Analysis**: Gemini 1.5 Pro analyzes the image using the system instruction: "You are a plant doctor who sees the image and gives a solution"
4. **Display Results**: Results are displayed in the chat interface with detailed diagnosis and recommendations

## API Endpoints

### `POST /api/plant-diagnosis`
Analyzes a plant image and returns diagnosis.

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body: `image` (file)

**Response:**
- JSON object with plant diagnosis and recommendations

## Configuration

### Generative AI Settings (server.js)
- **Model**: Gemini 1.5 Pro
- **Temperature**: 1.0
- **Max Output Tokens**: 8192
- **Top P**: 0.95
- **Top K**: 40

## Troubleshooting

### Image Upload Fails
- Check if the backend server is running
- Verify CORS is enabled
- Check file size limits in multer configuration

### No Response from AI
- Verify your Gemini API key is valid
- Check API quota limits
- Ensure the API is enabled in Google Cloud Console

### Frontend Won't Connect to Backend
- Check if backend is running on the correct port
- Verify CORS settings in server.js
- Check console for network errors

## Future Enhancements

- [ ] Plant identification from image
- [ ] Detailed care instructions
- [ ] Seasonal plant care tips
- [ ] Plant disease database
- [ ] Treatment recommendations with products
- [ ] User accounts and history
- [ ] Mobile app version

## License

ISC

## Support

For issues or questions, please create an issue in the repository.

---

**Happy gardening! 🌿**
