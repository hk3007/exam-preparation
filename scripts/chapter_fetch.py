import requests
from bs4 import BeautifulSoup
from pymongo import MongoClient
from datetime import datetime
import urllib3

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# Step 1: Connect to MongoDB
client = MongoClient("mongodb://localhost:27017/")
db = client["exam-preparation"]

subjects_col = db["subjects"]
chapters_col = db["chapters"]
contents_col = db["contents"]
exams_col = db["exams"]

# Step 2: Find exam (UPSC preferred, fallback JEE)
exam = exams_col.find_one({"name": "UPSC"}) or exams_col.find_one({"name": "JEE"})
if not exam:
    raise Exception("Neither UPSC nor JEE exam found in exams collection!")
exam_id = exam["_id"]

print(f"📘 Using exam: {exam['name']} ({exam_id})")


def fetch_description_from_web(topic):
    """Fetch description for a topic from Wikipedia (fallback: empty list)."""
    try:
        search_url = f"https://en.wikipedia.org/wiki/{topic.replace(' ', '_')}"
        res = requests.get(search_url, headers={"User-Agent": "Mozilla/5.0"}, timeout=10)
        if res.status_code != 200:
            print(f"⚠️ No wiki page for {topic}")
            return []

        soup = BeautifulSoup(res.text, "html.parser")

        # Extract first few paragraphs
        paragraphs = soup.select("p")
        description = []
        for p in paragraphs[:5]:  # limit to first 5 paragraphs
            text = p.get_text(strip=True)
            if text and len(text) > 40:
                description.append(text)

        # Convert into JSON-like structure
        final_desc = []
        for i, line in enumerate(description):
            if "example" in line.lower():
                final_desc.append({
                    "point": "Example",
                    "expression": line
                })
            else:
                final_desc.append(line)

        return final_desc if final_desc else []

    except Exception as e:
        print(f"⚠️ Error fetching {topic}: {e}")
        return []


# Step 3: Loop through chapters and topics
chapters = list(chapters_col.find({}))

for chapter in chapters:
    subject_id = chapter["subjectIds"][0]
    chapter_id = chapter["_id"]

    for topic in chapter.get("topics", []):
        now = datetime.utcnow()

        # Scrape from Wikipedia
        description = fetch_description_from_web(topic)

        content_doc = {
            "chapterIds": [chapter_id],
            "subjectId": subject_id,
            "title": topic.replace(".", ""),  # remove trailing dots
            "description": description,
            "views": 0,
            "createdAt": now
        }

        # Avoid duplicates
        exists = contents_col.find_one({
            "chapterIds": [chapter_id],
            "title": content_doc["title"]
        })

        if not exists:
            contents_col.insert_one(content_doc)
            print(f"✅ Inserted → {chapter['name']} → {topic}")
        else:
            print(f"⚠️ Skipped duplicate → {topic}")

print("🎉 All contents inserted with real web-scraped descriptions!")
