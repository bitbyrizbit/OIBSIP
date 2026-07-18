# Party Line

*pick up. someone's on the line.*

---

Before a phone line belonged to one house alone, it belonged to a
street. A party line. Lift the receiver and you might catch a neighbour
mid sentence, wait your turn, learn to recognise a ring meant for you
from one meant for someone three doors down. "The line's busy" was a
sentence with real weight behind it, a shared, slightly noisy, entirely
human way of staying in touch.

This is that instinct, rebuilt for a browser tab instead of a copper
wire. Not another Discord clone with rounded avatars and a green dot for
online. Rooms are lines. Being connected is being on the line. Sending a
message is ringing through. Leaving is hanging up. The vocabulary isn't
a coat of paint over a generic chat app, it decides what every screen
says, right down to the empty states.

Built for the AICTE Oasis Infobyte Python Programming internship,
Task 5, Advanced tier. Built past what the task card described.

---

## What it does

Register, and you're on the line. Join a room, or start one of your
own, and whoever else picks up the same line sees you arrive in real
time, sees you typing before you've finished the sentence, and reads
whatever you send the instant you send it. Leave, and the room quietly
notices that too.

- Messages arrive live, no refresh, across every open connection to a room
- Full accounts, registration and login, passwords hashed, sessions
  carried on a signed token
- Create a line or join one already running
- History waiting for you, the last messages in a room load before
  you've said a word
- A typing indicator that clears itself, so nobody's left "typing..."
  forever after they've walked away
- Real presence, who else is on the line, updated the moment someone
  arrives or leaves
- A browser notification when a message lands and the tab isn't the
  one you're looking at
- A small, curated set of emoji shortcodes, `:fire:`, `:wave:`, and a
  handful more, rendered as the real thing

## How it is built

**The backend** is FastAPI, held to the same discipline as this
internship's Weather App project, a clean separation between the raw
mechanics of a WebSocket connection, the logic that decides what a
message actually is, and the persistence underneath both.

backend/
app/
api/            rest routes, and the websocket endpoint itself
core/           jwt security, the connection manager, named errors
models/         user, room, message, the shape data actually takes
schemas/        what the api promises to send and expects to receive
services/       auth, rooms, messages, where the real thinking happens

The connection manager is worth understanding on its own. It tracks
which socket belongs to which room, broadcasts only to the people
actually on that line, and quietly forgets any connection that's gone
dead rather than letting a closed tab haunt the server's memory
indefinitely.

**The frontend** is Next.js, typed throughout, carrying its own visual
identity rather than reusing anything from this internship's other
submissions, warm paper tones in place of a dark instrument panel,
serif headlines instead of monospace certainty, and motion that settles
into place rather than snapping to attention.

frontend/
app/
components/     the visible product, screen by screen
lib/            the api client, the auth context, the socket itself

## Running it yourself

**The backend:**
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```
Add a `.env` file using `.env.example` as the pattern. Generate a real
secret rather than keeping the placeholder:
```bash
python -c "import secrets; print(secrets.token_hex(32))"
```
```bash
uvicorn app.main:app --reload
```
**The frontend, in a second terminal:**
```bash
cd frontend
npm install
```
Add a `.env.local` file:
```python
NEXT_PUBLIC_API_URL=http://localhost:8000
```
```bash
npm run dev
```

Visit `localhost:3000`, register, and pick up the line. Full interactive
API documentation lives at `localhost:8000/docs` once the backend is
running, generated automatically from the code itself.

## What it is honest about

Sessions are carried as JWTs stored in the browser's localStorage. That
is standard practice for a project at this scale, and worth naming
plainly rather than glossing over, a production system handling
sensitive conversations would more likely reach for httpOnly cookies,
which a script running in the page can't read even if it wanted to.

Messages sit in the database as plain text, not end to end encrypted.
Anyone with direct access to the server or its database could read
them. Appropriate for a project built to demonstrate real time
architecture honestly, not appropriate as written for anything genuinely
private, and worth saying so rather than letting a reader assume
otherwise.

The connection manager lives in the memory of a single running process.
It forgets everything on restart, and as written would not coordinate
correctly across multiple backend instances without something like
Redis pub/sub sitting between them. A reasonable next step for a system
meant to scale, and a reasonable line to hold for a project meant to
prove it works.

## What was used to build it

FastAPI, SQLAlchemy, python-jose, passlib, and native WebSockets on the
backend. Next.js, TypeScript, Tailwind CSS, and Framer Motion on the
frontend.

---

*The line is open. Someone will pick up.*