import os
from dotenv import load_dotenv
from google import genai
from google.genai import types
from backend.databases import prompts
from fastapi import HTTPException
from pathlib import Path

# load_dotenv()
env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path=env_path)
gemini_api_key = os.getenv("GEMINI_API_KEY")

if not gemini_api_key:
    raise RuntimeError("Gemini API key missing")

client = genai.Client(api_key=gemini_api_key)


def get_ai_response(answer: str, level: int = 1):
    prompt = prompts.prompt

    if level == 0:
        prompt["examples"] = prompts.example_lvl1
        prompt["must include"] = ["little to no sexual or illegal question"]
    elif level == 1:
        prompt["examples"] = prompts.example_lvl1 + prompts.example_lvl2
        prompt["must include"] = ["mild sexual and illegal questions"]
    elif level == 2:
        prompt["examples"] = prompts.example_lvl2 + prompts.example_lvl3
        prompt["must include"] = ["severe sexual questions"]

    prompt_string = f"{prompt['task']}\nexamples: {str(prompt['examples'])}\nmust include: {prompt['must include']}\noutput format: {prompt['output format']}\nanswer:"
    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            # gemini-2.5-flash
            # gemini-2.5-flash-lite
            # gemma-3-27b-it
            contents=[
                {
                    "role": "user",
                    "parts": [{"text": f"{prompt_string} {answer}"}],
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
