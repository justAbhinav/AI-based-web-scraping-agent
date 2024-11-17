import os
import re
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from bs4 import BeautifulSoup
import google.generativeai as genai
from dotenv import load_dotenv
import random
import time

load_dotenv()

app = Flask(__name__)
CORS(app)

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

@app.route("/api/gemini", methods=["POST"])
def process_request():
    print("Processing request...")
    try:
        file = request.files.get("file")
        query_template = request.form.get("query")
        selected_column = request.form.get("selectedColumn")

        if not file or not query_template or not selected_column:
            return jsonify({"error": "Missing file, query template, or selected column."}), 400

        # Read CSV file and extract the selected column
        import pandas as pd
        data = pd.read_csv(file)
        if selected_column not in data.columns:
            return jsonify({"error": "Selected column not found in file."}), 400

        entities = data[selected_column].dropna().unique()  # Remove duplicates and NaNs
        responses = []

        query_template_new = gemini_generate_web_query(query_template)
        print(f"Formatted query by gemini: {query_template_new}")
        
        for i, entity in enumerate(entities):
            print(f"Processing entity: {entity}")
            entity = str(entity).strip()
            formatted_query = query_template_new.replace("{entity}", entity)
            print(f"Formatted query: {formatted_query}")
            search_results = fetch_web_results(formatted_query)
            print(f"Search results: {search_results}")
            if isinstance(search_results, dict) and "error" in search_results:
                responses.append({"entity": entity, "error": search_results["error"]})
            else:
                gemini_response = generate_with_gemini(search_results)
                responses.append({"entity": entity, **gemini_response})
            if(i>26):
                break
            
        return jsonify({"responses": responses})

    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500


def fetch_web_results(query):
    USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Safari/605.1.15",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0"
    ]
    search_url = f"https://www.google.com/search?q={query.replace(' ', '+')}"
    headers = {
        "User-Agent": random.choice(USER_AGENTS)
    }

    try:
        response = requests.get(search_url, headers=headers)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, "html.parser")
        results = []
        for g in soup.find_all("div", class_="tF2Cxc"):
            title = g.find("h3").text if g.find("h3") else "No Title"
            snippet = g.find("span", class_="aCOpRe").text if g.find("span", class_="aCOpRe") else "No Snippet"
            link = g.find("a")["href"] if g.find("a") else "No Link"
            results.append({"title": title, "snippet": snippet, "link": link})
        time.sleep(random.uniform(5, 10))  # Increase delay to avoid rate limiting
        return results
    except Exception as e:
        return {"error": f"Failed to fetch web results: {str(e)}"}

def gemini_generate_web_query(query):
    try:
        prompt = """Format the following text  query for a google websearch by beautiful soup to extract information. Keep the response concise. and add a {entity} in each query to be replaced later.
        Example: input: "find the ceo" 
        output: "who is the ceo of {entity}"
        only give the output as a reply and nothing else, add formatting to make the google search query more effective.
        The input query is:\n"""
        prompt += query

        model = genai.GenerativeModel("gemini-1.5-flash")
        gemini_response = model.generate_content(prompt)
        return gemini_response.text.split("\n")[0].strip()
    
    except Exception as e:
        return {"error": f"Gemini processing error: {str(e)}"}
    
def generate_with_gemini(search_results):
    try:
        # Format prompt for Gemini
        prompt = "Extract useful information from the following results, in a tabular form\n"
        for result in search_results:
            prompt += f"Title: {result['title']}\nSnippet: {result['snippet']}\nURL: {result['link']}\n\n"

        model = genai.GenerativeModel("gemini-1.5-flash")
        gemini_response = model.generate_content(prompt)
        # return {"emails": extract_emails(gemini_response.text), 
        #         "phone_numbers": extract_phone_numbers(gemini_response.text), 
        #         "additional_info": gemini_response.text}
        return {"info": gemini_response.text}
    except Exception as e:
        return {"error": f"Gemini processing error: {str(e)}"}


def extract_emails(text):
    return re.findall(r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}", text)


def extract_phone_numbers(text):
    return re.findall(r"\+?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}", text)


if __name__ == "__main__":
    app.run(debug=True)
