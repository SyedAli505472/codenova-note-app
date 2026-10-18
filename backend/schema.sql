CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL CHECK (length(trim(title)) BETWEEN 1 AND 120),
    content TEXT NOT NULL CHECK (length(trim(content)) BETWEEN 1 AND 5000),
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

