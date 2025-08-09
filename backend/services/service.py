import os, secrets
from dotenv import load_dotenv
from google import genai
from google.genai import types
from backend.databases import prompts
from fastapi import HTTPException
from pathlib import Path
from collections import deque
from backend.databases.questions import questions


# load_dotenv()
env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path=env_path)
gemini_api_key = os.getenv("GEMINI_API_KEY")
gemini_model = os.getenv("GEMINI_MODEL")

if not gemini_api_key:
    raise RuntimeError("Gemini API key missing")

client = genai.Client(api_key=gemini_api_key)


def get_ai_response(answer: str, level: int = 1):
    prompt = prompts.prompt

    if level == 0:
        prompt["examples"] = prompts.example_lvl1
        prompt["must include"] = ["no sexual question, less illegal questions"]
    elif level == 1:
        prompt["examples"] = prompts.example_lvl1 + prompts.example_lvl2
        prompt["must include"] = ["mild sexual and illegal questions"]
    elif level == 2:
        prompt["examples"] = prompts.example_lvl3
        prompt["must include"] = [
            "severe sexual jokes, offensive, racist questions only"
        ]

    prompt_string = f"{prompt['task']}\nexamples: {str(prompt['examples'])}\nbad examples: {str(prompt["bad examples"])}\nmust include: {prompt['must include']}\noutput format: {prompt['output format']}\nanswer:"
    try:
        gemini_model = os.getenv("GEMINI_MODEL")
        response = client.models.generate_content(
            model=gemini_model,
            # gemini-2.5-flash
            # gemini-2.5-flash
            # gemini-2.5-flash-lite
            # gemma-3-27b-it
            contents=[
                {
                    "role": "user",
                    "parts": [{"text": f"{prompt_string} {answer}, question: "}],
                }
            ],
            config=types.GenerateContentConfig(
                thinking_config=types.ThinkingConfig(
                    thinking_budget=0
                )  # Disables thinking
            ),
        )

    except Exception as e:
        raise HTTPException(status_code=404, detail=f"API can't be reached! {str(e)}")

    return response.text


# ---

recent_indices = deque(maxlen=50)


def pick_a_question() -> str:
    total_questions = len(questions)

    if total_questions <= 50:
        return secrets.choice(questions)

    attempts = 0
    while attempts < 100:
        idx = secrets.randbelow(total_questions)
        if idx not in recent_indices:
            recent_indices.append(idx)
            return questions[idx]
        attempts += 1

    # Fallback if unable to find a unique one
    return questions[idx]


def get_model_name():
    return gemini_model
