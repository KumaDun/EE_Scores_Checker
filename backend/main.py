from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, List
from pydantic import BaseModel
from datetime import datetime
import httpx

app = FastAPI(title="EE Score Checker API", version="1.0.0")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# IRCC API endpoint
IRCC_API_URL = "https://www.canada.ca/content/dam/ircc/documents/json/ee_rounds_123_en.json"

# Pydantic models
class CRSRound(BaseModel):
    drawNumber: str
    drawDate: str
    drawDateFull: str
    drawName: str
    drawSize: str
    drawCRS: str
    drawDateTime: str
    drawCutOff: str
    drawText2: str

    class Config:
        json_schema_extra = {
            "example": {
                "drawNumber": "386",
                "drawDate": "2025-12-15",
                "drawDateFull": "December 15, 2025",
                "drawName": "Provincial Nominee Program",
                "drawSize": "399",
                "drawCRS": "731",
                "drawDateTime": "December 15, 2025 at 14:39:41 UTC",
                "drawCutOff": "October 18, 2025 at  7:18:52 UTC",
                "drawText2": "Provincial Nominee Program"
            }
        }


class IRCCResponse(BaseModel):
    classes: str
    rounds: List[CRSRound]


# Cache for API data
cached_data: Optional[List[CRSRound]] = None
cache_timestamp: Optional[datetime] = None


async def fetch_ircc_data() -> List[CRSRound]:
    """Fetch data from IRCC API with caching"""
    global cached_data, cache_timestamp
    
    # Cache for 5 minutes
    if cached_data and cache_timestamp:
        if (datetime.now() - cache_timestamp).seconds < 300:
            return cached_data
    
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(IRCC_API_URL)
            response.raise_for_status()
            data = response.json()
            
            # Parse rounds
            rounds = [CRSRound(**round_data) for round_data in data.get("rounds", [])]
            
            cached_data = rounds
            cache_timestamp = datetime.now()
            return rounds
    except httpx.HTTPError as e:
        raise HTTPException(status_code=503, detail=f"Failed to fetch IRCC data: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing IRCC data: {str(e)}")


@app.get("/")
async def root():
    return {
        "message": "EE Score Checker API",
        "version": "1.0.0",
        "endpoints": {
            "crs-scores": "/api/crs-scores",
            "docs": "/docs"
        }
    }


@app.get("/api/crs-scores", response_model=List[CRSRound])
async def get_crs_scores(
    start_date: Optional[str] = Query(None, description="Start date (YYYY-MM-DD)"),
    end_date: Optional[str] = Query(None, description="End date (YYYY-MM-DD)")
):
    """
    Query CRS scores from IRCC API by date range.
    
    - **start_date**: Start date for filtering (YYYY-MM-DD format)
    - **end_date**: End date for filtering (YYYY-MM-DD format)
    
    If no dates provided, returns all rounds.
    """
    try:
        rounds = await fetch_ircc_data()
        
        # Filter by date range if provided
        if start_date or end_date:
            if start_date and end_date:
                if start_date > end_date:
                    raise HTTPException(
                        status_code=400,
                        detail="Start date must be before or equal to end date"
                    )
                filtered = [
                    r for r in rounds 
                    if start_date <= r.drawDate <= end_date
                ]
            elif start_date:
                filtered = [r for r in rounds if r.drawDate >= start_date]
            elif end_date:
                filtered = [r for r in rounds if r.drawDate <= end_date]
            else:
                filtered = rounds
        else:
            filtered = rounds
        
        # Sort by date descending (most recent first)
        filtered.sort(key=lambda x: x.drawDate, reverse=True)
        
        return filtered
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing request: {str(e)}")


@app.get("/api/rounds/all", response_model=List[CRSRound])
async def get_all_rounds():
    """Get all CRS rounds without filtering"""
    return await fetch_ircc_data()
