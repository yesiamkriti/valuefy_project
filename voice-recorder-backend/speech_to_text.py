import whisper

# Define text as a global variable
text = ""

# Function to transcribe audio
def transcribe_audio(file_path):
    model = whisper.load_model("base")  # Load small model for fast processing
    result = model.transcribe(file_path)
    return result["text"]

# Update the global variable text with transcribed content
def update_text(audio_file):
    global text  # Declare text as global to modify it
    text += transcribe_audio(audio_file)

# Example usage
if _name_ == "_main_":
    audio_file = "1740081731450.mp3"
    update_text(audio_file)  # Update the global text variable
    print(text)  # Print the transcribed text (optional)

# Open the file in write mode ('w' creates or overwrites the file)
with open("file.txt", "w") as file:
    file.write(text)