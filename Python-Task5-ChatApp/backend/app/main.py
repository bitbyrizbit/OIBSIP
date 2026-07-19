from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import auth, chat, rooms
from app.database import Base, engine
from app.models import message, room, user  # noqa: F401

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Wire — real-time chat API",
    version="0.1.0",
    description="Authentication and real-time messaging backend.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://oibsip-2ac8.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(chat.router)
app.include_router(rooms.router)


@app.get("/health")
async def health_check():
    return {"status": "ok"}