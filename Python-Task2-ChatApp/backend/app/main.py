from fastapi import FastAPI

from app.api import auth
from app.database import Base, engine
from app.models import message, room, user  # noqa: F401 - ensures models register before create_all

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Wire — real-time chat API",
    version="0.1.0",
    description="Authentication and real-time messaging backend.",
)

app.include_router(auth.router)


@app.get("/health")
async def health_check():
    return {"status": "ok"}