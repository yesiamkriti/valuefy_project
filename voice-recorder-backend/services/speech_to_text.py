import whisper
import pymongo
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# MongoDB Connection
MONGO_URI = os.getenv("MONGO_URI")  # Ensure your .env file contains MONGO_URI
client = pymongo.MongoClient(MONGO_URI)
db = client["SpeechDB"]  # Database name
collection = db["Transcriptions"]  # Collection name

# Function to get the latest audio file from a directory
def get_latest_audio(directory):
    files = [f for f in os.listdir(directory) if f.endswith((".mp3", ".wav", ".m4a"))]  # Filter audio files
    if not files:
        raise FileNotFoundError("No audio files found in the directory.")
    
    latest_file = max(files, key=lambda f: os.path.getctime(os.path.join(directory, f)))  # Get the newest file
    return os.path.join(directory, latest_file)

# Function to transcribe audio
def transcribe_audio(file_path):
    model = whisper.load_model("small")  # Load Whisper small model
    result = model.transcribe(file_path)
    return result["text"]

# Function to store transcription in MongoDB
def save_to_mongo(audio_file):
    text = transcribe_audio(audio_file)
    data = {"audio_file": os.path.basename(audio_file), "transcription": text}
    collection.insert_one(data)  # Insert into MongoDB
    # print(f"Transcription saved for {audio_file}")

# Example usage
if __name__ == "__main__":
    directory = "./uploads"  # Set directory where new recordings are saved
    try:
        latest_audio_file = get_latest_audio(directory)  # Get latest recorded file
        save_to_mongo(latest_audio_file)  # Transcribe and save
    except FileNotFoundError as e:
        print(e)
