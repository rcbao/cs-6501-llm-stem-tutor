class LlmInput(dict):
    def __init__(self, role: str, content: str) -> None:
        self.role = role
        self.content = content

    def __getattr__(self, attr):
        return self[attr]


class LlmResponse(dict):
    def __init__(self, role: str, content: str, context=None) -> None:
        self.role = role
        self.content = content
        self.context = context

    def __getattr__(self, attr):
        return self[attr]
