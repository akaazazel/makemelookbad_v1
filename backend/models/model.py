from pydantic import BaseModel
from typing import Literal


# Input model
class Input(BaseModel):
    user_answer: str
    bad_level: Literal[0, 1, 2]


# Output model
class Output(BaseModel):
    edited_output: str
