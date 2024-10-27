import re
from llama_index.core import PromptTemplate
from .file_handler import FileHandler
from ..constants import prompt_paths


class PromptBuilder:
    def __init__(self):
        self.file_handler = FileHandler()

    def build_newchat_user_prompt(self, question: str) -> str:
        user_prompt = prompt_paths["new_chat"].user
        user_prompt = self.file_handler.read_file(user_prompt)

        return user_prompt.format(question=question)

    def build_newchat_system_prompt(self) -> str:
        system_prompt = prompt_paths["new_chat"].system
        return self.file_handler.read_file(system_prompt)

    def build_condense_chat_history_prompt(self) -> str:
        prompt_path = prompt_paths["condense_chat_history"].user
        prompt_content = self.file_handler.read_file(prompt_path)
        custom_prompt = PromptTemplate(prompt_content)
        return custom_prompt

    def build_messages(self, system_prompt, user_prompt):
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ]
        return messages

    def build_newchat_messages(self, question):
        system_prompt = self.build_newchat_system_prompt()
        user_prompt = self.build_newchat_user_prompt(question)

        return self.build_messages(system_prompt, user_prompt)
