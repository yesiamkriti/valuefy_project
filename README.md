# Valuefy Project - Meeting Assistant App

## Project Overview
Professionals often struggle to capture action items and key discussion points during meetings while remaining engaged in conversations. This project aims to solve this problem by developing a mobile application prototype that records voice conversations and converts them into structured digital actions such as tasks, calendar events, and meeting notes.

## Features
### 1. Voice Processing
- Records and transcribes voice conversations in real-time
- Supports English language processing
- Handles basic variations in accents

### 2. Action Extraction
- Identifies and extracts:
  - Action items and tasks
  - Meeting details (date, time)
  - Key discussion points

### 3. Action Generation
- Creates calendar events from extracted meeting details
- Generates to-do items with deadlines
- Produces meeting summary notes
- Allows sharing of key points via email/messaging

### 4. User Interface
- Simple, functional mobile UI
- Displays transcribed text in real-time
- Allows users to edit extracted information
- Shows processing status

## Tech Stack
- **Frontend:** React Native
- **Backend:** Node.js, MongoDB, Python (for voice processing and NLP tasks)
- **APIs/Libraries:**
  - Speech-to-text API (Google Speech-to-Text, OpenAI Whisper, or similar)
  - Natural Language Processing (NLTK, spaCy, or custom models)
  - Calendar and task management integration (Google Calendar API, Todoist API)
  - Cloud storage for audio recordings (AWS S3, Firebase Storage)

## Installation & Setup
### Prerequisites
- Node.js and npm installed
- MongoDB setup
- Python environment with required libraries installed
- React Native development environment (Expo or CLI setup)

### Steps to Run
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/valuefy_project.git
   cd valuefy_project
   ```
2. Install dependencies:
   ```bash
   npm install
   cd backend && npm install
   ```
3. Start the backend server:
   ```bash
   cd backend
   node server.js
   ```
4. Start the frontend application:
   ```bash
   cd frontend
   npm start
   ```
5. Ensure MongoDB is running locally or connect to a cloud database.

## Deliverables
1. **Source Code** - Hosted on GitHub with clean documentation.
2. **Demo Video** (5-min) covering:
   - Key features in action
   - Explanation of technical architecture
   - Main challenges faced and solutions implemented

## Challenges & Solutions
### Challenges:
- Accurate transcription with noisy backgrounds
- Extracting structured actions from unstructured speech
- Seamless integration of calendar and task management

### Solutions:
- Used robust speech-to-text APIs with noise reduction
- Implemented NLP models for extracting action items
- Integrated third-party APIs for event/task creation

## Future Improvements
- Support for multiple languages
- More advanced NLP models for better context understanding
- Cloud-based storage and synchronization
- AI-powered summarization of meetings

## Contributors
- **Kriti** - Developer
- **Team Members (if any)**

## License
This project is licensed under the MIT License.

