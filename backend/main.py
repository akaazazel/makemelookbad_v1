from fastapi import FastAPI, HTTPException
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
from backend.models.model import Input, Output
from backend.services.service import get_ai_response
from backend.databases.questions import questions
import random, secrets

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/question")
def get_question():
    return secrets.choice(questions)


@app.post("/question", response_model=Output)
def get_edited_question(input: Input):
    try:
        response = get_ai_response(
            input.user_answer,
            input.bad_level,
        )
        return Output(edited_output=response)
    except HTTPException:
        raise HTTPException(status_code=404, detail="Some error on API call.")


if __name__ == "__main__":
    uvicorn.run(
        "backend.main:app",  # Import path to your app
        host="127.0.0.1",
        port=8000,
        reload=True,  # Optional, useful in dev
    )
