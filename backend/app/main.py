"""FastAPI endpoints for the Notes Application."""

from contextlib import asynccontextmanager
from datetime import datetime, timezone

from fastapi import FastAPI, HTTPException, Response, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, ConfigDict, field_validator

from .database import connect, initialize_database


def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat()


class NoteInput(BaseModel):
    model_config = ConfigDict(extra="forbid")

    title: str
    content: str

    @field_validator("title", "content")
    @classmethod
    def validate_text(cls, value: str, info):
        cleaned = value.strip()
        limit = 120 if info.field_name == "title" else 5000
        if not cleaned:
            raise ValueError(f"{info.field_name.capitalize()} is required.")
        if len(cleaned) > limit:
            raise ValueError(f"{info.field_name.capitalize()} must be {limit} characters or fewer.")
        return cleaned


class Note(NoteInput):
    id: int
    created_at: str
    updated_at: str


@asynccontextmanager
async def lifespan(_app: FastAPI):
    initialize_database()
    yield


app = FastAPI(title="CodeNova Notes API", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["Content-Type"],
)


def require_note(note_id: int):
    with connect() as connection:
        row = connection.execute("SELECT * FROM notes WHERE id = ?", (note_id,)).fetchone()
    if row is None:
        raise HTTPException(status_code=404, detail="Note not found.")
    return dict(row)


@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.get("/api/notes", response_model=list[Note])
def list_notes():
    with connect() as connection:
        rows = connection.execute(
            "SELECT * FROM notes ORDER BY updated_at DESC, id DESC"
        ).fetchall()
    return [dict(row) for row in rows]


@app.post("/api/notes", response_model=Note, status_code=status.HTTP_201_CREATED)
def create_note(note: NoteInput):
    now = utc_now()
    with connect() as connection:
        cursor = connection.execute(
            "INSERT INTO notes (title, content, created_at, updated_at) VALUES (?, ?, ?, ?)",
            (note.title, note.content, now, now),
        )
        row = connection.execute(
            "SELECT * FROM notes WHERE id = ?", (cursor.lastrowid,)
        ).fetchone()
    return dict(row)


@app.get("/api/notes/{note_id}", response_model=Note)
def get_note(note_id: int):
    return require_note(note_id)


@app.put("/api/notes/{note_id}", response_model=Note)
def update_note(note_id: int, note: NoteInput):
    now = utc_now()
    with connect() as connection:
        cursor = connection.execute(
            "UPDATE notes SET title = ?, content = ?, updated_at = ? WHERE id = ?",
            (note.title, note.content, now, note_id),
        )
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Note not found.")
        row = connection.execute(
            "SELECT * FROM notes WHERE id = ?", (note_id,)
        ).fetchone()
    return dict(row)


@app.delete("/api/notes/{note_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_note(note_id: int):
    with connect() as connection:
        cursor = connection.execute("DELETE FROM notes WHERE id = ?", (note_id,))
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Note not found.")
    return Response(status_code=status.HTTP_204_NO_CONTENT)
