import React, { useState } from "react";
import axios from "axios";
import './App.css';

function App() {
  const [file, setFile] = useState(null);
  const [query, setQuery] = useState('');
  const [responseData, setResponseData] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleQueryChange = (event) => {
    setQuery(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!file || !query) {
      setErrorMessage("Please upload a file and enter a query.");
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('query', query);

    try {
      const response = await axios.post("http://localhost:5000/api/gemini", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSearchResults(response.data.responses); // Set search results
      setErrorMessage('');
    } catch (error) {
      setErrorMessage("Error calling the backend: " + (error.response?.data?.error || error.message));
    }
  };

  return (
    <div className="App">
      <h1>Gemini API & Web Search Integration</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Upload CSV File:</label>
          <input type="file" onChange={handleFileChange} />
        </div>
        <div>
          <label>Enter Query Template:</label>
          <input 
            type="text" 
            placeholder="e.g., Get the email address of {company}" 
            value={query} 
            onChange={handleQueryChange}
          />
        </div>
        <button type="submit">Submit</button>
      </form>

      {errorMessage && <div className="error">{errorMessage}</div>}

      {searchResults.length > 0 && (
        <div>
          <h3>Extracted Information:</h3>
          {searchResults.map((result, index) => (
            <div key={index}>
              <h4>Entity {index + 1}:</h4>
              <p><strong>Emails:</strong> {result.emails.join(', ')}</p>
              <p><strong>Phone Numbers:</strong> {result.phone_numbers.join(', ')}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
