from fastapi import APIRouter, HTTPException
from litellm import completion
from typing import List, Optional

router = APIRouter()

@router.post("/generate-beat")
async def generate_beat(
    model: str,
    soundbank: str,
    tempo: int = 120,
    style: Optional[str] = None
):
    try:
        prompt = f"Create a {style if style else 'hip-hop'} beat at {tempo} BPM using {soundbank} sounds"
        response = completion(
            model=model,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7
        )
        
        # Parse response and convert to pattern
        return {"pattern": parse_beat_response(response.choices[0].message.content)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def parse_beat_response(content: str) -> dict:
    """Parse the LLM response into a pattern format."""
    # TODO: Implement pattern parsing logic
    # For now, return a simple pattern structure
    return {
        "tempo": 120,
        "steps": 16,
        "tracks": [
            {
                "name": "Kick",
                "pattern": [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0]
            },
            {
                "name": "Snare",
                "pattern": [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0]
            },
            {
                "name": "Hi-Hat",
                "pattern": [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
            }
        ]
    }
