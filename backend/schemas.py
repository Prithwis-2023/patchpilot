from pydantic import BaseModel
from typing import List, Optional

class TimelineItem(BaseModel):
    t: int
    event: str

class AnalysisResponse(BaseModel):
    title: str
    timeline: List[TimelineItem]
    reproSteps: List[str]
    expected: str
    actual: str
    targetUrl: Optional[str] = None

class TestResponse(BaseModel):
    filename: str
    playwrightSpec: str

class PatchRequest(BaseModel):
    analysis: Optional[AnalysisResponse] = None
    error_log: str
    run_result: Optional[dict] = None
    failing_test: Optional[str] = None
    original_code: Optional[str] = None
    
class PatchResponse(BaseModel):
    diff: str
    rationale: List[str]
    risks: List[str] = []