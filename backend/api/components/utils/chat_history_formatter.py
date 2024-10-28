from llama_index.core.llms import ChatMessage
from ..data_structures import LlmInput


class ChatHistoryFormatter:
    @staticmethod
    def format_llm_message_as_dict(chat_history_record):
        role = chat_history_record["role"]
        content = chat_history_record["content"]
        return {"role": role, "content": content}

    @staticmethod
    def format_message_as_chatmessage(message):
        return ChatMessage(role=message["role"], content=message["content"])

    @staticmethod
    def validate_llm_message(chat_history_record):
        return "role" in chat_history_record and "content" in chat_history_record

    @staticmethod
    def format_llm_messages(chats: list):
        return [
            ChatHistoryFormatter.format_llm_message_as_dict(r)
            for r in chats
            if ChatHistoryFormatter.validate_llm_message(r)
        ]

    @staticmethod
    def append_user_message_to_history(user_message, chat_history):
        followup_input = LlmInput("user", user_message)
        followup_message = vars(followup_input)
        chat_history.append(followup_message)

        return chat_history