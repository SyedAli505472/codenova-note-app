# Start yahan se

Ye CodeNova Batch 01, Task 1 ka local Notes Application hai. Do PowerShell terminals chahiye: ek backend ke liye, ek frontend ke liye. Dono terminals mein starting folder is project ka root ho.

## 1. VS Code mein project kholo

PowerShell mein:

    cd 'C:\Users\mozam\OneDrive\Documents\ChatGPT\Intership'
    code .

VS Code mein Terminal > New Terminal kholo. Agar code command na chale, VS Code ke File > Open Folder se upar wala folder kholo.

## 2. Backend terminal

Is computer par abhi python aur py PATH mein nahin mile. Aaj ke liye available bundled Python se virtual environment banao:

    cd 'C:\Users\mozam\OneDrive\Documents\ChatGPT\Intership\backend'
    & 'C:\Users\mozam\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' -m venv .venv
    .\.venv\Scripts\python.exe -m pip install -r requirements.txt
    .\.venv\Scripts\python.exe -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000

Server chalne par is terminal ko khula rakho. Browser mein http://127.0.0.1:8000/api/health kholo. Expected result: {"status":"ok"}.

Virtual environment ek dafa banani hoti hai. Agli dafa sirf aakhri command chalao. Jab apna Python install karke PATH mein add kar lo, nayi environment ke liye python -m venv .venv bhi use kar sakte ho.

## 3. Frontend terminal

VS Code mein doosra Terminal > New Terminal kholo:

    cd 'C:\Users\mozam\OneDrive\Documents\ChatGPT\Intership\frontend'
    npm install
    npm run dev

Browser mein http://127.0.0.1:5173 kholo. Title aur content likho, Save note dabao. Green success message aur naya card nazar aana chahiye. npm install sirf pehli dafa ya dependencies badalne par chalao.

Mazeed samajhne, tests aur troubleshooting ke liye README.md dekho.

