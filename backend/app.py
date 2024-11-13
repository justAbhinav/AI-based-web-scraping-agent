import os
import requests
import re
from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
from requests.exceptions import RequestException
from dotenv import load_dotenv

load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Configure Gemini API key
genai.configure(api_key=os.environ["GEMINI_API_KEY"])

# SerpAPI configurations (replace with your SerpAPI key)
SERPAPI_KEY = os.environ["SERPAPI_API_KEY"]
SERPAPI_URL = "https://serpapi.com/search"

@app.route('/api/gemini', methods=['POST'])
def generate_content():
    try:
        # Extract file and query data
        file = request.files.get('file')
        query = request.form.get('query')

        if not file or not query:
            return jsonify({"error": "File or query is missing"}), 400

        # Read the file content (e.g., CSV)
        file_data = file.read().decode('utf-8')

        # Parse file data (simplified for now, you can expand this for CSV parsing)
        entities = file_data.splitlines()

        # Loop through the entities (e.g., company names)
        search_results = []
        for entity in entities:
            search_query = query.format(entity=entity)
            search_results.append(fetch_search_results(search_query))

        # Process the search results with Gemini API
        responses = []
        for result in search_results:
            response = generate_with_gemini(result)
            responses.append(response)

        return jsonify({"responses": responses})

    except RequestException as e:
        return jsonify({"error": f"Network error: {str(e)}"}), 503

    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500


def fetch_search_results(query):
    """Fetch search results using SerpAPI and filter them"""
    params = {
        'q': query,
        'api_key': SERPAPI_KEY,
        'engine': 'google',
    }
    try:
        response = requests.get(SERPAPI_URL, params=params)
        response.raise_for_status()  # Raise an error for bad status codes
        results = response.json().get('organic_results', [])
        filtered_results = filter_search_results(results)
        return filtered_results
    except requests.exceptions.RequestException as e:
        return {"error": f"Error fetching search results: {str(e)}"}


def filter_search_results(results):
    """Filter and clean up search results"""
    filtered = []
    for result in results:
        title = result.get("title", "")
        snippet = result.get("snippet", "")
        link = result.get("link", "")
        
        # Only add results with a valid URL and relevant content
        if link and snippet:
            filtered.append({
                "title": title,
                "snippet": snippet,
                "url": link
            })
    return filtered


def generate_with_gemini(search_results):
    """Generate content using Gemini API and process extracted data"""
    try:
        # Combine the search results into a readable prompt for Gemini
        results_text = "\n".join([f"Title: {r['title']}\nSnippet: {r['snippet']}\nURL: {r['url']}" for r in search_results])

        # Structure the prompt to instruct Gemini on extracting data like emails or phone numbers
        prompt = f"Extract the following information from the search results:\n{results_text}\n\nInformation to extract: email addresses, phone numbers, and other contact information."

        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(prompt)
        
        # Here we can use regular expressions to process the raw text further
        extracted_info = extract_contact_info(response.text)

        return extracted_info
    except Exception as e:
        return f"Error processing with Gemini: {str(e)}"


def extract_contact_info(text):
    """Use regex to extract email addresses and phone numbers from text"""
    emails = re.findall(r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}", text)
    phone_numbers = re.findall(r"\+?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}", text)

    return {
        "emails": emails,
        "phone_numbers": phone_numbers
    }

if __name__ == "__main__":
    app.run(debug=True)
