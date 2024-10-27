from collections import namedtuple

PromptPath = namedtuple("PromptPath", ["system", "user"])

prompt_paths = {
    "new_chat": PromptPath(
        system="../llm_prompts/stem_tutor_sys.txt",
        user="../llm_prompts/stem_tutor_user.txt",
    ),
    "condense_chat_history": PromptPath(
        system=None,
        user="../llm_prompts/chat_history_summarizer.txt",
    ),
}

OPENAI_MODEL = "gpt-4o"
OPENAI_MAX_TOKENS = 400
