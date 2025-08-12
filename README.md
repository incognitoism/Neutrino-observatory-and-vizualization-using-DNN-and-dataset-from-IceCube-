🌌 Cosmic Anomaly Observatory
A full-stack, AI-powered web application to discover anomalous events in real astrophysical data from the IceCube Neutrino Observatory.

This project is an end-to-end scientific pipeline that takes raw, high-level neutrino event data, uses an unsupervised machine learning model to identify outliers, and presents the findings in a polished, interactive web dashboard.

✨ Key Features
Unsupervised Anomaly Detection: At its core is a Tabular Autoencoder, built from scratch in PyTorch, that learns the features of "normal" events to find scientifically interesting anomalies.

Full-Stack Architecture: The application is built with a modern, decoupled architecture:

Backend: A robust API built with FastAPI (Python) serves the trained model and performs all the heavy data analysis.

Frontend: A sleek, multi-page user interface built with Next.js, React, and TypeScript, styled with Tailwind CSS.

Interactive Data Visualization: Results are displayed in a sophisticated dashboard featuring multiple analytical plots created with Plotly, including:

An interactive 3D celestial sky map to visualize the location of events.

Plots showing the relationship between anomaly scores and physical properties like energy.

Cloud-Native Deployment: The backend is designed for stable, "always-on" hosting on platforms like Fly.io or Render, while the frontend is optimized for deployment on Vercel.

🛠️ Technology Stack
Backend (The Brain):

Language: Python

ML Framework: PyTorch

API Framework: FastAPI

Data Handling: Pandas, NumPy

Server: Uvicorn

Frontend (The Face):

Framework: Next.js / React

Language: TypeScript

Styling: Tailwind CSS

UI Components: Shadcn/UI

Visualization: Plotly.js

Icons: Lucide React

🚀 Getting Started
To run this project locally, you'll need to set up both the backend and frontend servers.

1. Backend Setup
The backend requires a Conda environment.

# Navigate to the backend directory
cd backend

# Create and activate the conda environment (if you haven't already)
# Note: On Apple Silicon, you may need to create an x86 environment
conda create --name cosmic-env python=3.9
conda activate cosmic-env

# Install dependencies
pip install -r requirements.txt

# Run the FastAPI server
uvicorn main:app --reload

The backend API will now be running at http://127.0.0.1:8000.

2. Frontend Setup
The frontend requires Node.js.

# Navigate to the frontend directory
cd cosmic-anomaly-observatory

# Install dependencies
npm install

# Run the Next.js development server
npm run dev

Open your browser and navigate to http://localhost:3000 to see the web application.

🛰️ How to Use the Application
Navigate to the Dashboard: The main page of the application is the analysis dashboard.

Upload Data: Click the "Upload Data File" button and select a .txt file containing reconstructed neutrino event data. The file must be space-delimited with columns for MJD, RA_deg, Dec_deg, Unc_deg, and log10_Ereco.

Run Analysis: Click the "Run Analysis" button. The frontend will send the file to the live backend API for processing.

Explore Results: Once the analysis is complete, the dashboard will populate with the 3D sky map and other analytical plots, highlighting the most anomalous events discovered by the model.
