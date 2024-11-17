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
from serpapi import GoogleSearch

load_dotenv()

app = Flask(__name__)
CORS(app)

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
serpapi_key = os.getenv("SERPAPI_API_KEY")

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
            if(i>=26):
                break
            print(f"Processing entity: {entity} {i}")
            entity = str(entity).strip()
            formatted_query = query_template_new.replace("{entity}", entity)
            print(f"Formatted query: {formatted_query}")
            search_results = fetch_web_results(formatted_query)
            print(f"Search results: {search_results}")
            if isinstance(search_results, dict) and "error" in search_results:
                responses.append({"entity": entity, "error": search_results["error"]})
            else:
                gemini_response = generate_with_gemini(search_results, formatted_query)
                responses.append({"entity": entity, **gemini_response})
            
        return jsonify({"responses": responses})

    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500


def fetch_web_results(query):
   
    try:          
        search = GoogleSearch({"q": query, "location": "India", "api_key": serpapi_key})
        response = search.get_dict()
        search_results = []
        
        for result in response.get("organic_results", []):
            search_results.append({
                "title": result.get("title", "No Title"),
                "snippet": result.get("snippet", "No Snippet"),
                "link": result.get("link", "No Link")
            })
        return search_results
    except Exception as e:
        print(f"Error using SerpAPI: {str(e)}")
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
    
def generate_with_gemini(search_results, query):
    try:
        # Format prompt for Gemini
        prompt = f"""With the context of this query: {query},
        Extract any useful information from the following results, and only return that information as plain text with no formatting,
        if information is not enough only return, 'not enough information available' but this should be the reply only when you can give no other output\n"""
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


if __name__ == "__main__":
    app.run(debug=True)
