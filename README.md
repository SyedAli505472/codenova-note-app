# CodeNova Batch 01 — Full Stack Development Task 1: Notes Application

This is a local full-stack application built with a React + Vite frontend, a Python + FastAPI backend, and a SQLite database. You can create, view, edit, and delete notes, and instantly search their titles and content. Data is stored in `backend/notes.db`, and the notes table is created automatically when the application starts.

## Required Tools

- **Node.js and npm** run the frontend.
- **Python** runs the backend. On the computer used for the original setup, neither `python` nor `py` was available on PATH, so `START_HERE.md` includes the exact path to the available bundled Python interpreter.
- **Git** records version history. You can run this project locally without pushing it to GitHub.

## Folder Map

| File/folder | Purpose |
| --- | --- |
| START_HERE.md | A short guide to running the project in VS Code for the first time |
| backend/app/main.py | API routes, validation, and note operations |
| backend/app/database.py | SQLite connection and database setup |
| backend/schema.sql | The notes table schema |
| backend/requirements.txt | Python packages required to run the backend |
| backend/requirements-dev.txt | Additional packages required for testing |
| backend/tests/test_api.py | API tests for creating, editing, and deleting notes, error handling, and data persistence |
| frontend/src/App.jsx | The application screen, form, search, messages, and note cards |
| frontend/src/api.js | API requests from the browser and readable error messages |
| frontend/src/styles.css | Responsive layout |
| frontend/vite.config.js | Frontend development server and `/api` proxy |
| frontend/package.json | npm dependencies and scripts |
| .gitignore | Excludes the local database, virtual environment, and build output from Git |

## What the Commands Do

Run these commands in the VS Code PowerShell terminal. See `START_HERE.md` for the exact startup commands.

| Command | Purpose |
| --- | --- |
| cd 'folder' | Changes the terminal's current folder |
| python --version / node --version / npm --version / git --version | Checks whether a tool is installed and displays its version |
| & 'Path to Python' -m venv .venv | Creates a separate Python environment inside the backend folder |
| .\.venv\Scripts\python.exe -m pip install -r requirements.txt | Installs the backend packages |
| .\.venv\Scripts\python.exe -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000 | Runs the backend locally on port 8000 and reloads it when files change |
| npm install | Installs the frontend packages |
| npm run dev | Runs the frontend locally on port 5173 |
| .\.venv\Scripts\python.exe -m pytest -q | Runs the backend API tests; install `requirements-dev.txt` first |
| npm run build | Checks that the frontend production build succeeds |

To stop a running server, press **Ctrl+C** in its terminal. Both servers must be running to use the application.

## What to Check in the Browser

1. Open http://127.0.0.1:8000/api/health. The expected JSON response is `{"status":"ok"}`.
2. Open http://127.0.0.1:5173 to view the Notes screen.
3. Enter a title and content, then click **Save note**. A success message and a new note card should appear.
4. Click **Edit** on a card, change the text, and click **Update note**. The card should display the updated text.
5. Type a word from a note's title or content into the search box. Matching cards should appear immediately.
6. Click **Delete**, then click **OK** in the browser confirmation dialog. The card should disappear.
7. Refresh the browser or restart the backend. Notes that have not been deleted should reappear from the database.
8. Stop the backend and try saving a note. An error message should appear, and your draft should remain in the form. Restart the backend and click **Save note** to retry.

## API

| Method | Route | Purpose |
| --- | --- | --- |
| GET | /api/health | Check whether the server is running |
| GET | /api/notes | Retrieve all notes, with the most recently updated first |
| POST | /api/notes | Create a note |
| GET | /api/notes/{id} | Retrieve a single note |
| PUT | /api/notes/{id} | Update a note |
| DELETE | /api/notes/{id} | Delete a note |

Example JSON body for POST and PUT requests:

```json
{"title":"My first note","content":"Today I learned FastAPI."}
```

After trimming leading and trailing whitespace, the title must contain 1–120 characters and the content must contain 1–5,000 characters. Both the browser and the server validate input. The API returns **422** for invalid input and **404** when a note is not found. Search runs in the browser on the loaded notes, so the results update as you type.

## Tests and Database

In the backend terminal:

```powershell
.\.venv\Scripts\python.exe -m pip install -r requirements-dev.txt
.\.venv\Scripts\python.exe -m pytest -q
```

In the frontend terminal:

```powershell
npm run build
```

The tests create a separate temporary SQLite database and do not modify your `backend/notes.db` file. You do not need to create the database manually. When the backend starts, it creates the table using `schema.sql`. Do not commit the database file to Git.

## Troubleshooting

- **"python not recognized":** Use the bundled Python path in `START_HERE.md`. For a permanent setup, install Python and add it to PATH.
- **The health URL does not open:** Check the backend terminal for errors. Make sure you are running the command from the `backend` folder and that port 8000 is available.
- **The frontend displays a server error:** Keep the backend terminal open, test the health URL, and then click **Try again** on the page.
- **npm is blocked by a PowerShell execution policy:** Run `npm.cmd install` or `npm.cmd run dev`.
- **Port 5173 or 8000 is already in use:** Stop the previous server by pressing **Ctrl+C** in its terminal.
- **Saving fails in the browser:** Your form draft is preserved. Start the backend and click **Save note** again.

## Next Learning Step

First, read the `saveNote` function in `frontend/src/App.jsx` to understand how the browser sends POST and PUT requests. Then find the corresponding route in `backend/app/main.py` and trace the flow to the SQLite connection in `database.py`.
