# Start Here

This is the local Notes Application for CodeNova Batch 01, Task 1. You need two PowerShell terminals: one for the backend and one for the frontend. Start both terminals in the project's root folder.

The absolute paths below refer to the original Windows setup. If your project is stored somewhere else, replace the project folder paths with your current location. The bundled Python path must also point to a Python interpreter available on your computer.

## 1. Open the Project in VS Code

In PowerShell:

```powershell
cd 'C:\Users\mozam\OneDrive\Documents\ChatGPT\Intership'
code .
```

In VS Code, select **Terminal > New Terminal**. If the `code` command does not work, use **File > Open Folder** in VS Code to open the folder shown above.

## 2. Backend Terminal

On the computer used for the original setup, neither `python` nor `py` was available on PATH. The commands below use the available bundled Python interpreter to create a virtual environment:

```powershell
cd 'C:\Users\mozam\OneDrive\Documents\ChatGPT\Intership\backend'
& 'C:\Users\mozam\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Once the server starts, keep this terminal open. In your browser, open http://127.0.0.1:8000/api/health. The expected response is `{"status":"ok"}`.

You only need to create the virtual environment once. On subsequent runs, use only the last command to start the backend. After installing Python and adding it to PATH, you can also use `python -m venv .venv` to create a new environment.

## 3. Frontend Terminal

In VS Code, open a second terminal using **Terminal > New Terminal**:

```powershell
cd 'C:\Users\mozam\OneDrive\Documents\ChatGPT\Intership\frontend'
npm install
npm run dev
```

Open http://127.0.0.1:5173 in your browser. Enter a title and content, then click **Save note**. A green success message and a new note card should appear. Run `npm install` only the first time or when dependencies change.

See `README.md` for further explanations, tests, and troubleshooting.
