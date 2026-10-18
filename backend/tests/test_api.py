import pytest
from fastapi.testclient import TestClient

from app.main import app


@pytest.fixture
def client(tmp_path, monkeypatch):
    monkeypatch.setenv("NOTES_DB_PATH", str(tmp_path / "test_notes.db"))
    with TestClient(app) as test_client:
        yield test_client


def test_health_and_complete_note_lifecycle(client, tmp_path):
    assert client.get("/api/health").json() == {"status": "ok"}
    assert client.get("/api/notes").json() == []

    created = client.post(
        "/api/notes", json={"title": "  First idea  ", "content": "  Learn FastAPI  "}
    )
    assert created.status_code == 201
    note = created.json()
    assert note["title"] == "First idea"
    assert note["content"] == "Learn FastAPI"
    assert note["created_at"] == note["updated_at"]
    note_id = note["id"]

    assert client.get(f"/api/notes/{note_id}").json() == note
    assert [item["id"] for item in client.get("/api/notes").json()] == [note_id]

    changed = client.put(
        f"/api/notes/{note_id}",
        json={"title": "Better idea", "content": "Learn React and FastAPI"},
    )
    assert changed.status_code == 200
    assert changed.json()["title"] == "Better idea"
    assert changed.json()["created_at"] == note["created_at"]

    # A new app client reads the same SQLite file after its startup runs again.
    with TestClient(app) as restarted_client:
        assert restarted_client.get(f"/api/notes/{note_id}").json()["title"] == "Better idea"

    assert client.delete(f"/api/notes/{note_id}").status_code == 204
    assert client.get("/api/notes").json() == []
    assert client.get(f"/api/notes/{note_id}").status_code == 404
    assert (tmp_path / "test_notes.db").exists()


@pytest.mark.parametrize(
    "payload",
    [
        {"title": "", "content": "Text"},
        {"title": "   ", "content": "Text"},
        {"title": "Title", "content": ""},
        {"title": "Title", "content": "   "},
        {"title": "x" * 121, "content": "Text"},
        {"title": "Title", "content": "x" * 5001},
        {"title": "Title", "content": "Text", "extra": "not allowed"},
    ],
)
def test_invalid_notes_are_rejected_without_creating_rows(client, payload):
    response = client.post("/api/notes", json=payload)
    assert response.status_code == 422
    assert client.get("/api/notes").json() == []


def test_missing_notes_return_404(client):
    assert client.get("/api/notes/999").status_code == 404
    assert client.put("/api/notes/999", json={"title": "A", "content": "B"}).status_code == 404
    assert client.delete("/api/notes/999").status_code == 404

