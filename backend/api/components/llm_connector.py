from openai import OpenAI
from llama_index.core.chat_engine import (
    CondensePlusContextChatEngine,
)
from llama_index.core.chat_engine.types import AgentChatResponse
from .rag import load_rag_index
from .data_structures import LlmResponse
from .constants import OPENAI_MODEL, OPENAI_MAX_TOKENS
from .utils.chat_history_formatter import ChatHistoryFormatter
from .utils.prompt_builder import PromptBuilder
from .utils.file_handler import FileHandler

from .evaluation.grade_level import evaluate_readability
from .evaluation.simplifier import iteratively_simplify_text


SHOWING_ONLY_ONE_CONTEXT = True
RAG_DISABLED = False


class LlmConnector:
    def __init__(self, llm_api_key):
        self.client = OpenAI(api_key=llm_api_key)
        self.file_handler = FileHandler()
        self.formatter = ChatHistoryFormatter()
        self.prompt_builder = PromptBuilder()

    def get_gpt_response(self, messages: list, response_format=None) -> str:
        response = self.client.chat.completions.create(
            model=OPENAI_MODEL,
            messages=messages,
            response_format=response_format,
            max_tokens=OPENAI_MAX_TOKENS,
            temperature=0,
        )
        gpt_response = response.choices[0].message.content
        gpt_response = gpt_response + "\nNormal REsponse"
        return gpt_response

    def clean_rag_context_text(self, context_text: str) -> str:
        cleaned_context = context_text.lstrip(" 0123456789")
        cleaned_context = context_text.rstrip(" 0123456789")
        return cleaned_context[:400]

    def clean_rag_context(self, context: list[dict]) -> list[dict]:
        cleaned_context = []
        visited_filenames = set()
        for item in context:
            if item["file_name"] not in visited_filenames:
                item["text"] = self.clean_rag_context_text(item["text"])
                cleaned_context.append(item)
                visited_filenames.add(item["file_name"])
        return cleaned_context

    def get_context_from_rag_response(self, response: AgentChatResponse) -> list[dict]:
        if SHOWING_ONLY_ONE_CONTEXT:
            source_nodes = [response.source_nodes[0]]
        else:
            source_nodes = response.source_nodes
        contexts = []
        for node in source_nodes:
            metadata = node.metadata
            text = node.text
            context = {"file_name": metadata["file_name"], "text": text}

            if "page_label" in metadata:
                context["page_label"] = metadata["page_label"]

            contexts.append(context)

        contexts = self.clean_rag_context(contexts)
        return contexts

    def get_gpt_response_with_rag(self, index, message, messages) -> dict[str, str]:
        retriever = index.as_retriever(similarity_top_k=3)
        hist_condenser_prompt = (
            self.prompt_builder.build_condense_chat_messages_prompt()
        )

        custom_chat_messages = [
            self.formatter.format_message_as_chatmessage(message)
            for message in messages
        ]

        chat_engine = CondensePlusContextChatEngine.from_defaults(
            retriever=retriever,
            condense_question_prompt=hist_condenser_prompt,
            chat_history=custom_chat_messages,
            verbose=True,
        )
        print("CondensePlusContextChatEngine")
        print("chat_history::")
        print(custom_chat_messages)
        print("chat message::")
        print(message)
        response = chat_engine.chat(message=message)

        contexts = self.get_context_from_rag_response(response)

        gpt_response = {
            "response": response.response,
            "contexts": contexts,
        }

        return gpt_response

    def get_response_from_question_and_messages(self, question: str, messages: list):
        print("get_response_from_question_and_messages")
        print("messages::")
        print(messages)
        if RAG_DISABLED:
            response = self.get_gpt_response(messages)
        else:
            index = load_rag_index()
            gpt_response = self.get_gpt_response_with_rag(index, question, messages)
            response, contexts = gpt_response["response"], gpt_response["contexts"]

        # gets the readability scores and if its above and below certain thresholds its made to be simpler
        readability_scores = evaluate_readability(response)
        flesch_kincaid_grade = readability_scores["flesch_kincaid_grade"]
        flesch_reading_ease = readability_scores["flesch_reading_ease"]


        if flesch_kincaid_grade > 6 or flesch_reading_ease < 70:
            response = iteratively_simplify_text(response, 6, 70)


        response = LlmResponse("assistant", response, contexts)

        return vars(response)

    def create_newchat(self, question: str):
        messages = self.prompt_builder.build_newchat_messages(question)
        try:
            res = self.get_response_from_question_and_messages(question, messages)
            return res
        except Exception as e:
            raise ValueError(f"Error requesting GPT response: {str(e)}")

    def create_followup(self, question: str, messages: list):
        try:
            messages = self.formatter.format_llm_messages(messages)
            messages = self.formatter.append_user_message_to_history(question, messages)

            res = self.get_response_from_question_and_messages(question, messages)
            return res
        except Exception as e:
            raise ValueError(f"Error requesting GPT response in follow-up: {str(e)}")
