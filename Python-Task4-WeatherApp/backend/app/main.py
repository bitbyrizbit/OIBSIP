from fastapi import FastAPI

app = FastAPI(
    title="Weather Intelligence API",
    version="0.1.0",
    description="Real-time weather data with dual-unit support.",
)


@app.get("/health")
async def health_check():
    return {"status": "ok"}