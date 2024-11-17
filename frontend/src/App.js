import React, { useState } from "react";
import axios from "axios";
import Papa from "papaparse";
import {
  Container,
  Typography,
  Box,
  Tab,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  TextField,
  FormHelperText,
} from "@mui/material";
import FileDisplay from "./fileDisplay";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [query, setQuery] = useState("");
  const [columns, setColumns] = useState([]);
  const [selectedColumn, setSelectedColumn] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [uploadStatus, setUploadStatus] = useState("");
  const [fileContent, setFileContent] = useState([]);

  const handleFileChange = (event) => {
    const uploadedFile = event.target.files[0];

    if (!uploadedFile) {
      setUploadError("No file selected.");
      setUploadStatus("");
      return;
    }

    if (uploadedFile.type !== "text/csv") {
      setUploadError("Invalid file type. Please upload a CSV file.");
      setUploadStatus("");
      return;
    }

    setFile(uploadedFile);
    setUploadStatus("Uploading...");

    // Parse CSV to extract column names and content
    Papa.parse(uploadedFile, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.data && results.meta.fields) {
          setColumns(results.meta.fields); // Extract column names
          setFileContent(results.data); // Store file content
          setUploadStatus("Uploaded successfully ✔");
          setUploadError("");
        } else {
          setError("Failed to parse the file. Ensure it's a valid CSV.");
          setUploadStatus("");
        }
      },
      error: (error) => {
        setError("Error reading the file: " + error.message);
        setUploadStatus("");
      },
    });
  };

  const handleQueryChange = (event) => {
    setQuery(event.target.value);
  };

  const handleColumnChange = (event) => {
    setSelectedColumn(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file || !query || !selectedColumn) {
      setError("Please upload a file, select a column, and enter a query.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("query", query);
    formData.append("selectedColumn", selectedColumn);

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/api/gemini",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      if (response.data.responses) {
        setResults(response.data.responses);
        setError("");
      } else {
        setError("Unexpected response format from server.");
      }
    } catch (error) {
      setError(
        "Error communicating with backend: " +
          (error.response?.data?.error || error.message)
      );
    }
  };

  return (
    <div className="body">
      <Container maxWidth="lg">
        <Box sx={{ my: 5 }}>
          <div className="App">
            <Typography
              variant="h4"
              component="h5"
              align="center"
              paddingBottom={"0.5rem"}
            >
              AI Agent based data processing
            </Typography>
            <Typography
              variant="body2"
              component="h6"
              align="center"
              paddingBottom={"1rem"}
            >
              Extract emails, phone numbers, and additional info from a CSV file
            </Typography>
          </div>
        </Box>
      </Container>

      {/* Upload file section */}
      <Container maxWidth="sm">
        <Box sx={{ my: 5 }}>
          <div className="container">
            <h1>Please upload a CSV file</h1>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              style={{ display: "none" }}
              id="upload-file"
            />
            <label htmlFor="upload-file">
              <button
                className="upload-button"
                onClick={() => document.getElementById("upload-file").click()}
              >
                Browse File
              </button>
            </label>
            {uploadStatus && <p>{uploadStatus}</p>}
            {uploadError && <p style={{ color: "red" }}>{uploadError}</p>}
          </div>
        </Box>
      </Container>

      <div className="file-content-container-div">
        <Container maxWidth="lg">
        
          {fileContent.length > 0 && (
            <div>
              <Typography
                variant="h8"
                component="h3"
                align="center"
                fontFamily={"Montserrat"}
              >
                Uploaded file: {file.name}
              </Typography>
              <Typography
                variant="body2"
                component="data"
                align="center"
                fontFamily={"Montserrat"}
              >
                Number of rows: {fileContent.length}
                <Tab />
                Number of columns: {columns.length}
              </Typography>
              <Typography
                variant="h8"
                component="h3"
                align="center"
                fontFamily={"Montserrat"}
              >
                File Content
              </Typography>
              <div className="file-content-table-view">
                <FileDisplay content={fileContent} />
              </div>
            </div>
          )}
          </Container>
        </div>
      

      {columns.length > 0 && (
        <form onSubmit={handleSubmit}>
          <Container maxWidth="sm" className="container_process_req">
            <Box sx={{ my: 2 }}>
              <FormControl>
                <InputLabel
                  id="select-column-label"
                  sx={{
                    color: "whitesmoke",
                    width: "fit-content",
                    backgroundColor: "#1e1e1e",
                    paddingX: "0.5rem",
                  }}
                >
                  Select main Column
                </InputLabel>
                <Select
                  labelId="select-column-label"
                  id="select-column"
                  value={selectedColumn}
                  label="Select a Column"
                  onChange={handleColumnChange}
                  sx={{
                    color: "whitesmoke",
                    width: "15rem",
                    marginBottom: "1rem",
                    "& .MuiInputLabel-root": {
                      color: "whitesmoke", // Change the color of the label
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "whitesmoke", // Change the border color
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "whitesmoke", // Change the border color on hover
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "whitesmoke", // Change the border color when focused
                    },
                    "&": {
                      borderColor: "whitesmoke", // Change the border color when focused
                    },
                  }}
                >
                  {columns.map((col, index) => (
                    <MenuItem key={index} value={col}>
                      {col}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <div className="query-box">
                <InputLabel
                  id="query-label"
                  sx={{
                    color: "whitesmoke",
                    width: "fit-content",
                    marginBottom: "0.5rem",
                    fontSize: "1.2rem",
                    fontFamily: "Montserrat",
                  }}
                >
                  Please enter your query
                </InputLabel>

                <TextField
                  id="outlined-basic"
                  label="type your query here"
                  variant="outlined"
                  value={query}
                  onChange={handleQueryChange}
                  multiline
                  InputLabelProps={{
                    style: { color: "whitesmoke" },
                  }}
                  sx={{
                    width: "100%",
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "whitesmoke", // Change the border color
                      },
                      "&:hover fieldset": {
                        borderColor: "whitesmoke", // Change the border color on hover
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "whitesmoke", // Change the border color when focused
                      },
                      "&": {
                        color: "whitesmoke", // Change the text color
                      },
                    },
                  }}
                />
                <FormHelperText
                  sx={{ color: "whitesmoke", marginBottom: "1rem" }}
                >
                  e.g. What is the valuation of the companies
                </FormHelperText>
              </div>
              {fileContent.length > 26 && (
                <Typography
                  variant="body2"
                  component="p"
                  align="center"
                  color="error"
                  fontFamily={"Montserrat"}
                  marginBottom={"1rem"}
                >
                  Due to rate limitations, only the first 25 entries will be processed.
                </Typography>
              )}
              <button type="submit" className="upload-button">
                Process
              </button>
              
              {error && <div className="error" style={{ color: "red" }}>{error}</div>}
            </Box>
          </Container>
        </form>
      )}

      <div className="Result-display">
      {results.length > 0 && (
        <div className="">
          <h3>Results:</h3>
          {results.map((result, index) => (
            <div key={index}>
              <h4>Entity {index + 1}</h4>
              <p>
                <strong>Extracted Information: </strong> {result.info || "N/A"}
              </p>
              {/* <p>
                <strong>Phone Numbers:</strong>{" "}
                {result.phone_numbers?.join(", ") || "N/A"}
              </p>
              <p>
                <strong>Additional Info:</strong>{" "}
                {result.additional_info || "N/A"}
              </p> */}
            </div>
          ))}
        </div>
      )}
      </div>
    </div>
  );
}

export default App;
