import { useEffect, useMemo, useRef, useState } from "react";
import { apiRequest } from "./api.js";

const emptyForm = { title: "", content: "" };

function formatDate(value) {
  return new Intl.DateTimeFormat(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export default function App() {
  const [notes, setNotes] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [notice, setNotice] = useState(null);
  const [loadError, setLoadError] = useState("");
  const editorRef = useRef(null);

  async function loadNotes() {
    setLoading(true);
    setLoadError("");
    try {
      const result = await apiRequest("/api/notes");
      setNotes(result);
    } catch (error) {
      setLoadError(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadNotes();
  }, []);

  const visibleNotes = useMemo(() => {
    const query = search.trim().toLowerCase();
    return notes.filter((note) =>
      (note.title + " " + note.content).toLowerCase().includes(query)
    );
  }, [notes, search]);

  function changeField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setFieldErrors((current) => ({ ...current, [name]: "" }));
  }

  function startNew() {
    if (
      (form.title.trim() || form.content.trim()) &&
      !window.confirm("Discard the current draft and start a new note?")
    ) return;
    setForm(emptyForm);
    setEditingId(null);
    setFieldErrors({});
    setNotice(null);
    editorRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  function startEdit(note) {
    if (
      (form.title.trim() || form.content.trim()) &&
      !window.confirm("Discard the current draft and edit this note?")
    ) return;
    setForm({ title: note.title, content: note.content });
    setEditingId(note.id);
    setFieldErrors({});
    setNotice(null);
    editorRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  async function saveNote(event) {
    event.preventDefault();
    const title = form.title.trim();
    const content = form.content.trim();
    const errors = {};
    if (!title) errors.title = "A title is required.";
    else if (title.length > 120) errors.title = "Use 120 characters or fewer.";
    if (!content) errors.content = "Some content is required.";
    else if (content.length > 5000) errors.content = "Use 5,000 characters or fewer.";
    setFieldErrors(errors);
    if (Object.keys(errors).length) return;

    setSaving(true);
    setNotice(null);
    try {
      const saved = await apiRequest(
        editingId === null ? "/api/notes" : "/api/notes/" + editingId,
        {
          method: editingId === null ? "POST" : "PUT",
          body: JSON.stringify({ title, content }),
        }
      );
      setNotes((current) => {
        const remaining = current.filter((note) => note.id !== saved.id);
        return [saved, ...remaining];
      });
      setForm(emptyForm);
      setEditingId(null);
      setNotice({ type: "success", text: editingId === null ? "Note saved." : "Note updated." });
    } catch (error) {
      setNotice({ type: "error", text: error.message + " Your draft is still here." });
    } finally {
      setSaving(false);
    }
  }

  async function deleteNote(note) {
    if (!window.confirm('Delete "' + note.title + '"? This cannot be undone.')) return;
    setDeletingId(note.id);
    setNotice(null);
    try {
      await apiRequest("/api/notes/" + note.id, { method: "DELETE" });
      setNotes((current) => current.filter((item) => item.id !== note.id));
      if (editingId === note.id) {
        setForm(emptyForm);
        setEditingId(null);
      }
      setNotice({ type: "success", text: "Note deleted." });
    } catch (error) {
      setNotice({ type: "error", text: error.message + " The note was not removed." });
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark" aria-hidden="true">N</div>
          <div><strong>Notes</strong><span>CodeNova · Task 01</span></div>
        </div>
        <div className="sidebar-body">
          <p className="eyebrow">YOUR SPACE</p>
          <div className="side-link active"><span aria-hidden="true">▦</span> All notes <span className="count">{notes.length}</span></div>
          <button className="side-link side-button" onClick={startNew} type="button"><span aria-hidden="true">＋</span> New note</button>
        </div>
        <div className="sidebar-foot"><span className="status-dot" /> Saved locally with SQLite</div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="mobile-brand"><span className="brand-mark small">N</span><strong>Notes</strong></div>
          <span className="topbar-label">A calm place for your ideas</span>
          <span className="topbar-badge">BATCH 01</span>
        </header>

        <div className="content-wrap">
          <section className="welcome">
            <div>
              <p className="eyebrow">YOUR WORKSPACE</p>
              <h1>Good ideas deserve<br /><em>a little space.</em></h1>
              <p className="intro">Capture a thought, keep it close, and find it whenever you need it.</p>
            </div>
            <div className="welcome-art" aria-hidden="true"><div className="art-sheet sheet-back" /><div className="art-sheet sheet-front"><i /><i /><i /></div><span>✦</span></div>
          </section>

          {notice && (
            <div className={"notice " + notice.type} role="status">
              <span>{notice.type === "success" ? "✓" : "!"}</span>
              <p>{notice.text}</p>
              <button type="button" aria-label="Dismiss notification" onClick={() => setNotice(null)}>×</button>
            </div>
          )}

          <section className="editor-panel" ref={editorRef} aria-labelledby="editor-title">
            <div className="section-heading">
              <div><p className="eyebrow">WRITE IT DOWN</p><h2 id="editor-title">{editingId === null ? "Create a note" : "Edit your note"}</h2></div>
              <span className="editor-icon" aria-hidden="true">✎</span>
            </div>
            <form onSubmit={saveNote} noValidate>
              <label htmlFor="title">Title</label>
              <input id="title" name="title" value={form.title} onChange={changeField} maxLength={121} placeholder="Give your note a title..." disabled={saving} aria-invalid={Boolean(fieldErrors.title)} />
              {fieldErrors.title && <p className="field-error">{fieldErrors.title}</p>}
              <label htmlFor="content">Your note</label>
              <textarea id="content" name="content" value={form.content} onChange={changeField} maxLength={5001} placeholder="What's on your mind?" rows="5" disabled={saving} aria-invalid={Boolean(fieldErrors.content)} />
              {fieldErrors.content && <p className="field-error">{fieldErrors.content}</p>}
              <div className="form-footer">
                <span>{form.content.length.toLocaleString()} / 5,000 characters</span>
                <div className="form-actions">
                  {editingId !== null && <button className="button secondary" type="button" onClick={startNew} disabled={saving}>Cancel edit</button>}
                  <button className="button primary" type="submit" disabled={saving}>{saving ? "Saving..." : editingId === null ? "Save note" : "Update note"} <span aria-hidden="true">→</span></button>
                </div>
              </div>
            </form>
          </section>

          <section className="notes-section" aria-labelledby="notes-title">
            <div className="notes-header">
              <div><p className="eyebrow">THE COLLECTION</p><h2 id="notes-title">Your notes <span>{notes.length}</span></h2></div>
              <label className="search-box"><span aria-hidden="true">⌕</span><span className="sr-only">Search notes by title or content</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search your notes..." /></label>
            </div>

            {loadError && <div className="load-error" role="alert"><p>{loadError}</p><button className="button secondary" type="button" onClick={loadNotes}>Try again</button></div>}
            {loading ? (
              <div className="note-grid" aria-label="Loading notes"><div className="skeleton-card" /><div className="skeleton-card" /><div className="skeleton-card" /></div>
            ) : loadError && notes.length === 0 ? null : visibleNotes.length === 0 ? (
              <div className="empty-state"><div className="empty-icon" aria-hidden="true">✧</div><h3>{search ? "No matching notes" : "No notes yet"}</h3><p>{search ? "Try a different word in your search." : "Your first idea is only a few words away."}</p></div>
            ) : (
              <div className="note-grid">
                {visibleNotes.map((note) => (
                  <article className="note-card" key={note.id}>
                    <div className="card-top"><span className="card-pin" aria-hidden="true">✦</span><time dateTime={note.updated_at}>{formatDate(note.updated_at)}</time></div>
                    <h3>{note.title}</h3>
                    <p className="note-preview">{note.content}</p>
                    <div className="card-actions">
                      <button type="button" onClick={() => startEdit(note)} disabled={deletingId === note.id}>Edit <span aria-hidden="true">↗</span></button>
                      <button className="delete-button" type="button" onClick={() => deleteNote(note)} disabled={deletingId === note.id}>{deletingId === note.id ? "Deleting..." : "Delete"}</button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
          <footer className="page-footer">Made for learning · CodeNova Batch 01</footer>
        </div>
      </main>
    </div>
  );
}
