# CS-6501 LLM STEM Tutor

This project is a web-based tutoring platform designed to enhance STEM education for elementary school students. Leveraging advanced large language models (LLMs) and Retrieval-Augmented Generation (RAG), this application provides an interactive and supportive learning environment tailored to young learners.

---

## Project Overview

- **Target Audience**: Elementary school students
- **Frontend**: Built with React and styled using Tailwind CSS
- **Backend**: Developed with Django and integrated with the OpenAI API for generating responses
- **LLM Integration**: Utilizes LlamaIndex to implement RAG, enabling more accurate and contextually relevant answers to student questions

---

## Requirements

### Prerequisites

1. **Node.js**: [Download Node.js](https://nodejs.org/) (required for frontend setup)
2. **Python**: [Download Python](https://www.python.org/downloads/) (required for backend setup)
3. **OpenAI API Key**: An API key from OpenAI is required to enable LLM functionalities. [Get an API key](https://platform.openai.com/)

---

## Setup Instructions

To set up the project, follow these steps:

### 1. Clone the Repository

```bash
git clone https://github.com/rcbao/cs-6501-llm-stem-tutor.git
cd cs-6501-llm-stem-tutor
```

### 2. Set Up the Virtual Environment

A virtual environment is recommended to manage Python dependencies.

```bash
virtualenv venv
source venv/bin/activate   # On Windows, use venv\Scripts\activate
```

### 3. Install Backend Dependencies

Navigate to the project root directory and install the required Python packages.

```bash
pip install -r requirements.txt
```

### 4. Run Backend Server

Navigate to the backend directory and start the Django server.

```bash
cd backend
python manage.py runserver
```

The backend will start running at `http://127.0.0.1:8000`.

### 5. Set Up and Run the Frontend

Navigate to the `frontend` directory to install dependencies and start the development server.

```bash
cd frontend
npm install
npm run dev
```

The frontend development server should now be running on `http://localhost:5173`.

### 6. Add OpenAI API Key

To enable the OpenAI-powered tutoring features, add your API key to the environment. Create a `.env` file in the backend directory and include:

```plaintext
OPENAI_API_KEY=your_openai_api_key
```

### 7. Create RAG Vector Store

```bash
cd backend/
python api/components/rag.py
```

---

## Running the Project

With both frontend and backend servers running, you can access the application by navigating to `http://localhost:3000` in your web browser.

---

## Features

- **Interactive STEM Tutoring**: Uses LLMs to provide answers, explanations, and guidance on STEM topics suited for elementary students.
- **Tailored Styling with Tailwind CSS**: Provides a user-friendly, responsive interface optimized for young learners.
- **Retrieval-Augmented Generation (RAG)**: LlamaIndex enables context-aware tutoring, using RAG techniques to retrieve relevant information and improve response accuracy.

---

## Troubleshooting

- **Frontend Issues**: Ensure Node.js and npm are installed correctly. Clear the npm cache if there are dependency issues.
- **Backend Issues**: Verify that all dependencies from `requirements.txt` are installed. Ensure `venv` is activated when running backend commands.
