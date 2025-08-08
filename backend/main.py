from fastapi import FastAPI, HTTPException
import uvicorn, os
from fastapi.middleware.cors import CORSMiddleware
from backend.models.model import Input, Output
from backend.services.service import get_ai_response, pick_a_question, get_model_name
from backend.databases.questions import questions
import random, secrets

from pathlib import Path
from fastapi.staticfiles import StaticFiles
from starlette.responses import FileResponse

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
    return pick_a_question()
    # return secrets.choice(questions)


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


@app.get("/question/model")
def get_model():
    return get_model_name()


assets_directory = Path(__file__).resolve().parent / "static" / "dist" / "assets"
dist_directory = Path(__file__).resolve().parent / "static" / "dist"

app.mount("/static/assets", StaticFiles(directory=assets_directory), name="static")


# Serve index.html on root or frontend routes
@app.get("/{full_path:path}")
async def serve_frontend(full_path: str):
    index_path = dist_directory / "index.html"
    if index_path.exists():
        return FileResponse(index_path)
    raise HTTPException(status_code=404, detail="Frontend not found.")


if __name__ == "__main__":
    uvicorn.run(
        "backend.main:app",  # Import path to your app
        # host="0.0.0.0",
        host="127.0.0.1",
        port=8000,
        reload=True,  # Optional, useful in dev
    )
