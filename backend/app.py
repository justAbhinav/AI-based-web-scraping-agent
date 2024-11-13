import os
from flask import Flask, request, jsonify
from flask_cors import CORS  # Importing CORS
import google.generativeai as genai
from requests.exceptions import RequestException  # For catching network-related errors
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Initialize the Flask app
app = Flask(__name__)

# Enable CORS for all routes
CORS(app)  # This enables CORS for your app

print("Starting server...")

# Configure Gemini API key from environment variable
genai.configure(api_key=os.environ["GEMINI_API_KEY"])

# Define a route for the API to call Gemini
@app.route('/api/gemini', methods=['POST'])
def generate_content():
    try:
        # Extract file and query data from the form data
        file = request.files.get('file')  # Get the file from the form data
        query = request.form.get('query')  # Get the query from the form data

        if not file or not query:
            return jsonify({"error": "File or query is missing"}), 400  # Bad request if file or query is missing

        # Handle the uploaded file (For example, assuming it's a CSV)
        file_data = file.read().decode('utf-8')  # Read file contents as string (for simplicity)

        # Create the Gemini model and generate content using the query and file data
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(f"{query} from the following data: {file_data}")

        # Return the generated content
        return jsonify({"response": response.text})

    except RequestException as e:
        # Handle network-related errors (e.g., issues with reaching Gemini API)
        return jsonify({"error": f"Network error: {str(e)}"}), 503  # Service Unavailable (503) for network issues

    except Exception as e:
        # Handle other errors (e.g., invalid API usage, unexpected issues)
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500  # Internal Server Error (500) for generic issues

# Error handling for connection issues to Flask server
@app.errorhandler(500)
def internal_server_error(error):
    return jsonify({"error": "Internal server error, please try again later."}), 500

@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Endpoint not found."}), 404

@app.errorhandler(400)
def bad_request(error):
    return jsonify({"error": "Bad request, invalid or missing data."}), 400

if __name__ == "__main__":
    try:
        app.run(debug=True)
    except Exception as e:
        print(f"Error starting server: {e}")
        # Here you could log the error or take other actions to alert the user
