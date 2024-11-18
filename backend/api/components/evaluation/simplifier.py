from transformers import AutoModelForCausalLM, AutoTokenizer
import textstat
import os
from dotenv import load_dotenv
import torch

def evaluate_text(text: str, fk_threshold: float, fre_threshold: float) -> bool:

    fk_grade = textstat.flesch_kincaid_grade(text)
    fre_score = textstat.flesch_reading_ease(text)

    print(f"FKGL: {fk_grade}, FRE: {fre_score}")

    return fk_grade <= fk_threshold and fre_score >= fre_threshold

def simplify_text_with_llama(text: str, model_name: str = "meta-llama/Llama-2-7b-chat-hf") -> str:
    """
    Simplify text using LLaMA 2 with secure Hugging Face token authentication.
    """
    load_dotenv()
    hf_access_token = os.getenv("HF_ACCESS_TOKEN")
    if not hf_access_token:
        raise ValueError("Hugging Face access token is missing. Ensure it is set in the .env file.")

    tokenizer = AutoTokenizer.from_pretrained(model_name, use_auth_token=hf_access_token)
    model = AutoModelForCausalLM.from_pretrained(model_name, use_auth_token=hf_access_token, device_map="auto")

    system_prompt = "You are a helpful assistant who simplifies text for an 8-year-old."
    user_prompt = f"Please simplify the following text:\n\n{text.strip()}"
    prompt = f"[INST] <<SYS>>\n{system_prompt}\n<</SYS>>\n\n{user_prompt} [/INST]"

    input_ids = tokenizer(prompt, return_tensors="pt").input_ids.to(model.device)
    input_length = input_ids.shape[1]  

    with torch.no_grad():
        outputs = model.generate(
            input_ids,
            max_new_tokens=150,
            do_sample=True,
            temperature=0.7,
            top_p=0.9,
            pad_token_id=tokenizer.eos_token_id,
            eos_token_id=tokenizer.eos_token_id
        )

    # Extract only the new tokens (the assistant's reply)
    generated_ids = outputs[0][input_length:]
    simplified_text = tokenizer.decode(generated_ids, skip_special_tokens=True).strip()
    return simplified_text




def iteratively_simplify_text(text: str, fk_threshold: float, fre_threshold: float, max_iterations: int = 10) -> str:
    for iteration in range(max_iterations):
        print(f"Starting Iteration {iteration + 1}: Current Text: {text}")

        if evaluate_text(text, fk_threshold, fre_threshold):
            print(f"Text meets thresholds after {iteration} iterations.")
            return text

        print(f"Iteration {iteration + 1}: Simplifying text...")
        try:
            simplified_text = simplify_text_with_llama(text)
            print(f"Simplified Text (Iteration {iteration + 1}): {simplified_text}")
            text = simplified_text  
        except Exception as e:
            print(f"Error during simplification in Iteration {iteration + 1}: {str(e)}")
            raise

    print("Max iterations reached. Returning the most simplified version.")
    return text
