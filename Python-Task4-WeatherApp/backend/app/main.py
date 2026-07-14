from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import location, weather

app = FastAPI(
    title="Weather Intelligence API",
    version="0.1.0",
    description="Real-time weather data with dual-unit support.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://your-actual-vercel-url.vercel.app"],
    allow_credentials=True,
    allow_methods=["GET"],
    allow_headers=["*"],
)

app.include_router(weather.router)
app.include_router(location.router)


@app.get("/health")
async def health_check():
    return {"status": "ok"}