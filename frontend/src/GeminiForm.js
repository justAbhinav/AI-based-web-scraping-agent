import React, { useState } from 'react';
import axios from 'axios';

const GeminiForm = () => {
  // State to store user input and response
  const [inputText, setInputText] = useState('');
  const [responseText, setResponseText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle input change
  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResponseText('');

    try {
      // Send POST request to Flask backend
      const response = await axios.post('http://127.0.0.1:5000/api/gemini', {
        data: inputText, // Pass the input data
      });

      // Set response from Flask to display
      setResponseText(response.data.response);
    } catch (err) {
      setError('Error: Could not get response from the server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Gemini API Request</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="inputText">Enter your request:</label>
          <textarea
            id="inputText"
            value={inputText}
            onChange={handleInputChange}
            rows="4"
            cols="50"
            placeholder="Write your request here..."
            required
          ></textarea>
        </div>
        <div>
          <button type="submit" disabled={loading}>
            {loading ? 'Processing...' : 'Submit'}
          </button>
        </div>
      </form>

      {/* Display the response */}
      {responseText && (
        <div>
          <h3>Response:</h3>
          <p>{responseText}</p>
        </div>
      )}

      {/* Display error message */}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default GeminiForm;
