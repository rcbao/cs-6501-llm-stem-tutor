import os
import csv
from textstat import flesch_kincaid_grade, flesch_reading_ease
from api.components.llm_connector import LlmConnector

# Set your API key (if needed)
# os.environ["OPENAI_API_KEY"] = "your_openai_key_here"

# Initialize the connector
connector = LlmConnector(llm_api_key=os.getenv("OPENAI_API_KEY"))

# Read questions from file
current_dir = os.path.dirname(__file__)
questions_path = os.path.join(current_dir, 'questions.txt')

questions = []
with open(questions_path, 'r', encoding='utf-8') as f:
    for line in f:
        line = line.strip()
        if line:
            questions.append(line)

baseline_results = []
pipeline_results = []

for q in questions:
    # Baseline: just call get_gpt_response with minimal formatting
    baseline_messages = [{"role": "user", "content": q}]
    baseline_response = connector.get_gpt_response(baseline_messages)
    baseline_fk = flesch_kincaid_grade(baseline_response)
    baseline_fre = flesch_reading_ease(baseline_response)
    baseline_results.append((q, baseline_response, baseline_fk, baseline_fre))

    # Pipeline: use create_newchat which includes RAG and simplification
    pipeline_res_dict = connector.create_newchat(q)  # returns something like {'role':'assistant','content':'...','contexts':...}
    pipeline_text = pipeline_res_dict['content']
    pipeline_fk = flesch_kincaid_grade(pipeline_text)
    pipeline_fre = flesch_reading_ease(pipeline_text)
    pipeline_results.append((q, pipeline_text, pipeline_fk, pipeline_fre))

# Save results to CSV
with open('baseline_results.csv', 'w', newline='', encoding='utf-8') as f:
    writer = csv.writer(f)
    writer.writerow(["Question", "Response", "FK_Grade", "FRE_Score"])
    writer.writerows(baseline_results)

with open('pipeline_results.csv', 'w', newline='', encoding='utf-8') as f:
    writer = csv.writer(f)
    writer.writerow(["Question", "Response", "FK_Grade", "FRE_Score"])
    writer.writerows(pipeline_results)
