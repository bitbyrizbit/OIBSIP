from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import assistant

app = FastAPI(
    title="Relay — voice assistant API",
    version="0.1.0",
    description="LLM powered intent classification and action execution for voice commands.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(assistant.router)


@app.get("/health")
async def health_check():
    return {"status": "ok"}