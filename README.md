# GenAI STEM Tutor

A simple STEM tutor chatbot designed for elementary school students (e.g., 5th graders). 

## Screenshots

<p align="center">
  <img src="https://github.com/user-attachments/assets/5868d93b-716c-4733-9478-2b8931f23e44" width="48%" />
  <img src="https://github.com/user-attachments/assets/bf3f5200-2e67-445d-8770-ff9499ff8ff6" width="48%" />
</p>

---

**Optionally, the chatbot can ground its responses on a collection of grade-school level science teaching materials.** Below are screenshots of the bot answering an environmental science question using facts from an article in its RAG (Retrieval-Augmented Generation) vector store.

<p align="center">
  <img src="https://github.com/user-attachments/assets/647f657f-1d4a-4ad3-885a-30175b8eeb58" width="48%" />
  <img src="https://github.com/user-attachments/assets/ad416fab-c7bd-4417-bf89-5cde296670cf" width="48%" />
</p>

## Main Components
a
- **Frontend**: Built with React and styled using Tailwind CSS
- **Backend**: Developed with Django REST API; integrated with the OpenAI API for generating LLM responses
- **LLM Integration**: Used LlamaIndex to implement RAG, which helps to LLM to generate more accurate and relevant answers to student questions

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

With both frontend and backend servers running, you can access the application by navigating to `http://localhost:3000` in your web browser.

---

## License

MIT License
