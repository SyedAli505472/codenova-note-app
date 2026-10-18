"""Small SQLite helpers for the local notes database."""

import os
import sqlite3
from contextlib import contextmanager
from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parents[1]
SCHEMA_PATH = BACKEND_DIR / "schema.sql"


def database_path() -> Path:
    return Path(os.environ.get("NOTES_DB_PATH", str(BACKEND_DIR / "notes.db")))


def initialize_database() -> None:
    path = database_path()
    path.parent.mkdir(parents=True, exist_ok=True)
    with sqlite3.connect(path) as connection:
        connection.executescript(SCHEMA_PATH.read_text(encoding="utf-8"))


@contextmanager
def connect():
    connection = sqlite3.connect(database_path(), timeout=10)
    connection.row_factory = sqlite3.Row
    try:
        yield connection
        connection.commit()
    except Exception:
        connection.rollback()
        raise
    finally:
        connection.close()

