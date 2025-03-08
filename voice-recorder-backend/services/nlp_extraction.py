import spacy
from spacy.matcher import Matcher
import pymongo
from dotenv import load_dotenv
import os
import re
from datetime import datetime, timedelta
import sys

# Load environment variables
load_dotenv()
MONGO_URI = os.getenv("MONGO_URI")

# MongoDB Connection
client = pymongo.MongoClient(MONGO_URI)
db = client["SpeechDB"]
transcriptions_collection = db["Transcriptions"]
tasks_collection = db["Tasks"]

venv_path = os.path.join(os.path.dirname(__file__), '..', '.venv', 'Lib', 'site-packages')
sys.path.insert(0, venv_path)
# Load spaCy model
nlp = spacy.load("en_core_web_trf")
matcher = Matcher(nlp.vocab)

# Define important task keywords
TASK_KEYWORDS = ["meeting", "deadline", "submit", "complete", "review", "presentation", "follow-up", "finalize", "discussion"]

# Define date and time patterns
time_pattern = [
    {"SHAPE": "dd"},
    {"LOWER": {"IN": ["am", "pm", "a.m.", "p.m."]}}
]
matcher.add("TIME", [time_pattern])

relative_date_pattern = [{"LOWER": {"IN": ["today", "tomorrow", "yesterday", "following day"]}}]
matcher.add("RELATIVE_DATE", [relative_date_pattern])

DATE_REGEX = r"(\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{1,2}(?:st|nd|rd|th)?,?\s+\d{4}\b)"

def convert_relative_date(date_text):
    """Convert relative dates ('today', 'tomorrow') to actual dates."""
    today = datetime.today()

    if date_text.lower() == "today":
        return today.strftime("%d %B %Y") + " (Today)"
    elif date_text.lower() == "tomorrow":
        return (today + timedelta(days=1)).strftime("%d %B %Y") + " (Tomorrow)"
    elif date_text.lower() == "yesterday":
        return (today - timedelta(days=1)).strftime("%d %B %Y") + " (Yesterday)"
    elif date_text.lower() == "following day":
        return (today + timedelta(days=2)).strftime("%d %B %Y") + " (Following Day)"
    
    return date_text  # If it's already an absolute date, return as is.

def extract_tasks(text):
    """Extract only important tasks, dates, and times from text."""
    doc = nlp(text)
    dates, times, tasks = [], [], []

    # Extract absolute dates using regex
    absolute_dates = re.findall(DATE_REGEX, text)
    dates.extend(absolute_dates)

    # Extract time and relative dates using matcher
    for match_id, start, end in matcher(doc):
        match_text = doc[start:end].text
        if nlp.vocab.strings[match_id] == "RELATIVE_DATE":
            dates.append(convert_relative_date(match_text))
        elif nlp.vocab.strings[match_id] == "TIME":
            times.append(match_text)

    # Extract only important tasks
    for sent in doc.sents:
        if any(keyword in sent.text.lower() for keyword in TASK_KEYWORDS):
            important_words = [token.text for token in sent if token.pos_ in ["VERB", "NOUN", "PROPN"]]
            filtered_sentence = " ".join(important_words)
            tasks.append(filtered_sentence)

    return {"dates": dates, "times": times, "tasks": tasks}

def process_transcriptions():
    """Fetch transcriptions from MongoDB, extract tasks, and store results."""
    transcriptions = transcriptions_collection.find()  

    for transcription in transcriptions:
        text = transcription["transcription"]
        extracted_data = extract_tasks(text)

        # Store extracted data in MongoDB
        tasks_collection.insert_one({
            "audio_file": transcription["audio_file"],
            "extracted_data": extracted_data
        })

        # print(f"Processed: {transcription['audio_file']}")
        # print("Extracted Data:", extracted_data)

if __name__ == "__main__":
    process_transcriptions()  # Run NLP processing
