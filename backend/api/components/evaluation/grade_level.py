import textstat

def evaluate_readability(text: str) -> dict:

    grade_level = textstat.flesch_kincaid_grade(text)
    reading_ease = textstat.flesch_reading_ease(text)

    return {
        "flesch_kincaid_grade": grade_level,
        "flesch_reading_ease": reading_ease,
    }