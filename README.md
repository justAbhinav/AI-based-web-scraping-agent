![ai-agent-logo](logo192.png)

# AI Based Web-Scraping Agent

## Project Overview

This project is an AI-based web-scraping agent designed to extract data from various websites efficiently. It leverages modern web technologies and machine learning algorithms to provide a robust and scalable solution for web scraping tasks.

## Features

- **Automated Data Extraction**: Automatically extracts data from specified websites.
- **AI Integration**: Uses AI algorithms to enhance data extraction accuracy.
- **Scalability**: Designed to handle large-scale web scraping tasks.
- **Customizable**: Easily configurable to target different websites and data points.
- **Environment Management**: Utilizes environment variables for secure API key management.

## Applications

- **Market Research**: Gather data from competitors' websites for market analysis.
- **Price Monitoring**: Track prices of products across various e-commerce platforms.
- **Content Aggregation**: Aggregate content from multiple sources for news or blog websites.
- **Data Mining**: Extract large datasets for machine learning and data analysis.

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- Python (v3.8 or higher)
- pip (Python package installer)
- virtualenv (Python virtual environment tool)

### Backend Setup

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/justAbhinav/AI-based-web-scraping-agent
   cd AI-based-web-scraping-agent/backend
   ```

2. **Create and Activate Virtual Environment**:

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

3. **Install Dependencies**:

   ```bash
   pip install -r requirements.txt
   ```

4. **Set Up Environment Variables**:
   Create a `.env` file in the topmost `backend` directory and add your API keys and other environment variables:

   ```env
   GEMINI_API_KEY=     # Your Gemini API Key
   SERPAPI_API_KEY=   # Your SerpApi API Key
   ```

5. **Run the Backend Server**:
   ```bash
   python app.py
   ```

### Frontend Setup

1. **Navigate to Frontend Directory**:

   ```bash
   cd ../frontend
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Set Up Environment Variables**:
   Create a `.env` file in the `frontend` directory and add your environment variables:

   ```env
   none here
   ```

4. **Run the Frontend Server**:
   ```bash
   npm start
   ```

## Additional Information

- **Documentation**: Detailed documentation is available in the `docs` directory.
- **Contributing**: Contributions are welcome!
- **License**: This project is licensed under the MIT License. See the `LICENSE` file for details.

## Learn More

- [Create React App Documentation](https://facebook.github.io/create-react-app/docs/getting-started)
- [React Documentation](https://reactjs.org/)
- [Python Virtual Environments](https://docs.python.org/3/library/venv.html)
- [Flask Documentation](https://flask.palletsprojects.com/)

## Troubleshooting

For common issues and troubleshooting steps, please refer to the [Troubleshooting Guide](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify).

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

For any questions or inquiries, please contact [22ucs004@lnmiit.ac.in](mailto:22ucs004@lnmiit.ac.in).
