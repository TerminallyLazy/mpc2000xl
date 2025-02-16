from pydantic import BaseModel, Field
from typing import Optional, Dict, List, Literal

class Sample(BaseModel):
    id: str
    name: str
    file_type: Literal["wav", "mp3"]
    data: bytes
    start_point: int = 0
    end_point: Optional[int] = None
    loop_point: Optional[int] = None
    tune: int = Field(default=0, ge=-12, le=12)  # -12 to +12 semitones
    volume: int = Field(default=100, ge=0, le=100)  # 0-100

class PadAssignment(BaseModel):
    sample_id: Optional[str] = None
    velocity: int = Field(default=100, ge=0, le=127)  # 0-127, for future velocity sensitivity
    tune: int = Field(default=0, ge=-12, le=12)  # Per-pad tuning
    volume: int = Field(default=100, ge=0, le=100)  # Per-pad volume

class Program(BaseModel):
    id: str
    name: str
    pad_assignments: Dict[str, Dict[int, PadAssignment]] = Field(
        default_factory=lambda: {"A": {}, "B": {}, "C": {}, "D": {}}
    )  # bank -> pad -> assignment
    current_bank: Literal["A", "B", "C", "D"] = "A"

class DisplayState(BaseModel):
    line1: str
    line2: str
    current_mode: Literal["MAIN", "LOAD", "SAVE", "TRIM", "PROGRAM"]
    current_page: int = 1
    menu_items: List[str] = []
    selected_item: int = 0

class SoundParameters(BaseModel):
    start_point: int = 0
    end_point: Optional[int] = None
    loop_point: Optional[int] = None
    tune: int = Field(default=0, ge=-12, le=12)
    volume: int = Field(default=100, ge=0, le=100)
    loop_enabled: bool = False
