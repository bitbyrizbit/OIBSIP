# Glass

*a reading of the sky*

---

There is an old nautical phrase, "the glass is falling," meaning a storm is
on its way, spoken long before satellites, long before an app could tell you
anything at all. A ship's barometer did the telling. A number moved, and a
captain believed it.

This project borrows that instinct. Weather, treated not as decoration but
as a measurement worth trusting. No cartoon suns. No rounded gradient cards
pretending to be friendly. Numbers set the way a scientific instrument would
set them, wind read as a needle finding true direction, and a sky that
changes character on screen the same way it changes outside a window.

Built for the AICTE Oasis Infobyte Python Programming internship, Task 4,
Advanced tier. Built past what the task asked for.

---

## What it does

Search a place. The glass takes a reading. What comes back is not a weather
report so much as a short account of the sky above that place right now,
alongside the days ahead.

- Present conditions, temperature, humidity, pressure, visibility, wind
- Wind rendered as a live compass needle, rotated to the true degree reading
- The week ahead, shown as a range across each day rather than five identical cards
- The next few hours, honestly labelled for what the data actually provides
- Every reading available in either Celsius or Fahrenheit, recalculated instantly
- A background that shifts on its own, warmth for clear skies, a drift for
  cloud, a quiet fall of rain for storms, none of it announced, all of it felt

## How it is built

Two halves, kept honest about what each one is for.

**The backend** speaks to OpenWeatherMap so the rest of the system never has
to. A client wraps the raw calls. A service layer takes what comes back,
often inconsistent, sometimes oddly shaped, and turns it into something
clean and dependable. The route layer only ever deals with what a request
needs and what a response should look like. Three separate concerns,
three separate files, nothing tangled together.

backend/
app/
api/            the routes a request actually touches
core/           caching, the errors worth naming
models/         what a clean reading looks like
services/       the translation from raw to trustworthy
utils/          the small conversions, kelvin, wind, nothing glamorous

**The frontend** is where the instrument becomes visible. Built in Next.js,
typed throughout, styled without a single default. A serif for anything
meant to be read, a monospace for anything meant to be measured, motion
that settles rather than snaps.

frontend/
app/
components/     the visible instrument, panel by panel
lib/            the api client, the types, the voice it speaks in

## Running it yourself

**The backend:**
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```
Add a `.env` file using `.env.example` as the pattern, an OpenWeatherMap
key is required, free to generate at openweathermap.org.
```bash
uvicorn app.main:app --reload
```

**The frontend, in a second terminal:**
```bash
cd frontend
npm install
```
Add a `.env.local` file:
```text
NEXT_PUBLIC_API_URL=http://localhost:8000
```
```bash
npm run dev
```

Visit `localhost:3000`. Log a location. Wait for the reading.

Full interactive API documentation lives at `localhost:8000/docs` once the
backend is running, FastAPI builds this automatically from the code itself.

## What it is honest about

OpenWeatherMap's free tier gives readings in three hour steps, not true
hourly data. What this project calls "next hours" is the next two real
readings available, not an invented twenty four hour breakdown. The week
ahead is built by grouping those steps into calendar days and taking their
range, an aggregation choice, disclosed rather than hidden.

Location search will occasionally resolve a broader query, a country
rather than a city, for instance, to some default point inside it rather
than refusing the request. This is upstream behaviour, not a validation
this project currently enforces.

Location detection by IP address is implemented and functional, but has
little meaningful to resolve when run from a local machine during
development. It becomes accurate once the service is reachable from a
real network.

## What was used to build it

FastAPI, httpx, Pydantic, and the OpenWeatherMap API on the backend.
Next.js, TypeScript, Tailwind CSS, and Framer Motion on the frontend.

---

*Instrument no. 01. The reading holds until the next one is taken.*