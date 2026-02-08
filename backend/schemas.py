from pydantic import BaseModel
from typing import List

class TimelineItem(BaseModel):
    t: int
    event: str

class AnalysisResponse(BaseModel):
    title: str
    timeline: List[TimelineItem]
    reproSteps: List[str]
    expected: str
    actual: str

class TestResponse(BaseModel):
    filename: str
    playwrightSpec: str

class PatchRequest(BaseModel):
    failing_test: str
    error_log: str
    original_code: str = None
    
class PatchResponse(BaseModel):
    diff: str
    rationale: List[str]