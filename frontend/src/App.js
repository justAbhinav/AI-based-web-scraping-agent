// import React from 'react';
// import GeminiForm from './GeminiForm';

// function App() {
//   return (
//     <div className="App">
//       <h1>AI Content Generator with Gemini API</h1>
//       <GeminiForm />
//     </div>
//   );
// }

// export default App;
import React, { useState } from "react";
import axios from "axios";
import './App.css';

function App() {
  const [file, setFile] = useState(null);
  const [query, setQuery] = useState('');
  const [responseData, setResponseData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Handle file input
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  // Handle query input
  const handleQueryChange = (event) => {
    setQuery(event.target.value);
  };

  // Handle form submission (send file and query to Flask backend)
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
      setResponseData(response.data.response);
      setErrorMessage('');
    } catch (error) {
      setErrorMessage("Error calling the backend: " + (error.response?.data?.error || error.message));
    }
  };

  return (
    <div className="App">
      <h1>Gemini API Integration</h1>
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

      {responseData && (
        <div>
          <h3>Response:</h3>
          <pre>{responseData}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
