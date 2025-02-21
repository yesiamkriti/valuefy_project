import spacy
from spacy.matcher import Matcher

text =""
with open("file.txt", "r") as file:
    text = file.read()


nlp = spacy.load("en_core_web_trf")
matcher = Matcher(nlp.vocab)

time_pattern = [
    {"SHAPE": "dd"},  # Matches numbers like "10", "3", etc.
    {"LOWER": {"IN": ["am", "pm", "a.m.", "p.m."]}}  # Matches "am", "pm", "a.m.", "p.m."
]
matcher.add("TIME", [time_pattern])

# Pattern for dates like "today", "tomorrow", etc.
date_pattern = [{"LOWER": {"IN": ["today", "tomorrow", "yesterday", "following day"]}}]
matcher.add("DATE", [date_pattern])

# Process the imported text
doc = nlp(text)

# Extract dates and times
dates = []
times = []
for match_id, start, end in matcher(doc):
    if nlp.vocab.strings[match_id] == "DATE":
        dates.append(doc[start:end].text)
    elif nlp.vocab.strings[match_id] == "TIME":
        times.append(doc[start:end].text)

# Extract tasks (improved logic)
tasks = []
for sent in doc.sents:
    if any(keyword in sent.text.lower() for keyword in ["meeting", "session", "discuss", "review", "brainstorming"]):
        tasks.append(sent.text)

# Print results
print("Extracted Dates:", dates)
print("Extracted Times:", times)
print("Extracted Tasks:", tasks)