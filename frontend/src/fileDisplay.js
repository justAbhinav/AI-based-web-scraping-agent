// FileDisplay.js
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import "./FileDisplay.css";

const FileDisplay = ({ content }) => {
  return (
    <div className="file-content-container">
      <TableContainer component={Paper}>
        <Table aria-label="content table">
          <TableHead>
            <TableRow>
              {Object.keys(content[0] || {}).map((key, index) => (
                <TableCell
                  sx={{
                    width: 100,
                    color: "whitesmoke",
                    textAlign: "center",
                    border: 2,
                    borderColor: "whitesmoke",
                    borderStyle: "dotted",
                    borderTop: 2,
                    borderTopColor: "#1e1e1e",
                    borderTopStyle: "solid",
                    borderBottom: 2,
                    borderBottomColor: "whitesmoke",
                    borderBottomStyle: "solid",
                    
                  }}
                  key={index}
                >
                  {key}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {content.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {Object.values(row).map((value, colIndex) => (
                  <TableCell sx={{
                    padding: 0,
                    paddingX: 1,
                    paddingY: 1,
                    color: "#1e1e1e",
                    textAlign: "center",
                    border: 2,
                    borderColor: "#1e1e1e",
                    borderStyle: "dotted",
                    borderTop: 2,
                    borderTopColor: "#1e1e1e",
                    borderTopStyle: "solid",
                    borderBottom: 2,
                    borderBottomColor: "#1e1e1e",
                    borderBottomStyle: "solid",
                  }}
                  key={colIndex}>{value}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default FileDisplay;
