# CodeNova Batch 01 — Full Stack Development Task 1: Notes Application

Ye ek local full stack project hai: React + Vite frontend, Python + FastAPI backend, aur SQLite database. Notes create, view, edit, delete aur title/content se instant search ho sakti hain. Data backend/notes.db mein rehta hai; app shuru hotay hi table khud banti hai.

## Aaj ke tool checks

- Node.js aur npm frontend chalate hain.
- Python backend chalata hai. Is machine par python/py PATH mein nahin mile, is liye START_HERE.md mein available bundled Python ka exact path diya hai.
- Git version history ke liye hai. Is project ko GitHub par push karna zaroori nahin.

## Folder map

| File/folder | Seedha matlab |
| --- | --- |
| START_HERE.md | VS Code mein pehli dafa chalane ki short guide |
| backend/app/main.py | API routes, validation aur note operations |
| backend/app/database.py | SQLite connection aur database setup |
| backend/schema.sql | notes table ka design |
| backend/requirements.txt | backend chalane ke Python packages |
| backend/requirements-dev.txt | tests ke extra packages |
| backend/tests/test_api.py | API ka create/edit/delete, error aur persistence test |
| frontend/src/App.jsx | screen, form, search, messages aur note cards |
| frontend/src/api.js | browser se API request aur readable errors |
| frontend/src/styles.css | responsive layout |
| frontend/vite.config.js | frontend dev server aur /api proxy |
| frontend/package.json | npm dependencies aur scripts |
| .gitignore | local database, virtual environment aur build ko Git se bahar rakhta hai |

## Commands ka matlab

Ye sab commands VS Code ke PowerShell terminal mein chalao. Exact start commands START_HERE.md mein hain.

| Command | Kya karta hai |
| --- | --- |
| cd 'folder' | terminal ko us folder mein le jata hai |
| python --version / node --version / npm --version / git --version | tool installed hai ya nahin, check karta hai |
| & 'Python ka path' -m venv .venv | backend ke andar alag Python environment banata hai |
| .\.venv\Scripts\python.exe -m pip install -r requirements.txt | backend packages install karta hai |
| .\.venv\Scripts\python.exe -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000 | backend local port 8000 par chalata hai; file badle to reload hota hai |
| npm install | frontend packages install karta hai |
| npm run dev | frontend local port 5173 par chalata hai |
| .\.venv\Scripts\python.exe -m pytest -q | backend API tests chalata hai (pehle requirements-dev.txt install karo) |
| npm run build | frontend ka production build check karta hai |

Har running server ko rokne ke liye us ke terminal mein Ctrl+C dabao. Dono servers saath chalne chahiye.

## Browser mein kya dekhna hai

1. http://127.0.0.1:8000/api/health par JSON {"status":"ok"} aayega.
2. http://127.0.0.1:5173 par Notes screen aayegi.
3. Title aur content likh kar Save note dabao. Success message aur card aayega.
4. Card ka Edit dabao, text badlo, Update note dabao. Card naya text dikhayega.
5. Search box mein title ya content ka lafz likho. Matching cards foran dikhengi.
6. Delete dabao. Browser confirmation mein OK karne par card hat jayega.
7. Browser refresh karo ya backend restart karo. Jo notes delete nahin hue, woh database se dobara dikhengi.
8. Backend rok kar save karo. Error message aayega aur form mein likha draft rahega. Backend dobara chala kar Save note retry karo.

## API

| Method | Route | Kaam |
| --- | --- | --- |
| GET | /api/health | server check |
| GET | /api/notes | saari notes, nayi update pehle |
| POST | /api/notes | note banao |
| GET | /api/notes/{id} | ek note lo |
| PUT | /api/notes/{id} | note update karo |
| DELETE | /api/notes/{id} | note delete karo |

POST aur PUT ka JSON example:

    {"title":"Meri pehli note","content":"Aaj FastAPI seekha."}

Title 1 se 120 non-space characters, content 1 se 5000 non-space characters hona chahiye. Browser aur server dono check karte hain. Invalid input par API 422 deti hai. Missing note par 404 milta hai. Search browser mein loaded notes par hoti hai, is liye type karte hi result badalta hai.

## Tests aur database

Backend terminal mein:

    .\.venv\Scripts\python.exe -m pip install -r requirements-dev.txt
    .\.venv\Scripts\python.exe -m pytest -q

Frontend terminal mein:

    npm run build

Tests alag temporary SQLite database banate hain; tumhari backend/notes.db ko nahin chhoote. Database manually banane ki zaroorat nahin. Backend shuru hotay hi schema.sql se table banti hai. Database file ko Git mein commit nahin karna.

## Agar masla aaye

- "python not recognized": START_HERE.md ka bundled Python path use karo. Long term mein Python install karke PATH mein add karo.
- Health URL na khule: backend terminal mein error dekho; sahi folder backend hai aur port 8000 free hona chahiye.
- Frontend par server error: backend terminal khula rakho, health URL test karo, phir page par Try again dabao.
- npm PowerShell policy error: npm.cmd install ya npm.cmd run dev chalao.
- Port 5173 ya 8000 already in use: purana server Ctrl+C se roko.
- Browser mein save fail ho: form draft safe rehta hai. Backend chala kar Save note dobara dabao.

## Agla learning step

Pehle frontend/src/App.jsx mein saveNote function padho. Dekho browser POST/PUT request kaise bhejta hai. Phir backend/app/main.py mein wahi route dhoondo aur database.py ke SQLite connection tak flow trace karo.
