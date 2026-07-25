from groq import Groq

from app.config import settings
from app.core.exceptions import ActionExecutionError

QA_SYSTEM_PROMPT = """You are a voice assistant answering a spoken question out loud. \
Keep answers to 1-3 sentences, conversational, no markdown, no bullet points, no lists. \
This will be read aloud by text-to-speech, so write the way you'd actually speak an answer."""


class QAService:
    def __init__(self):
        self._client = Groq(api_key=settings.groq_api_key)

    async def answer(self, question: str) -> str:
        try:
            completion = self._client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[
                    {"role": "system", "content": QA_SYSTEM_PROMPT},
                    {"role": "user", "content": question},
                ],
                temperature=0.5,
                max_tokens=150,
            )
            return completion.choices[0].message.content.strip()
        except Exception as e:
            raise ActionExecutionError("general_question", f"couldn't get an answer: {e}")