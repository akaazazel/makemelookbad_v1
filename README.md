# Make Me Look Bad

**A useless (but hilarious) AI experiment**
You answer a question — _anything you like_.
Then the AI edits the **question** to make **your answer look bad**.

Built with:

-   **FastAPI** backend (serves API + built frontend)
-   **React + Vite** frontend
-   **Gemini API** for the question-twisting magic

---

## Features

-   Adjustable _meanness_ level:

    -   `0` – Play nice
    -   `1` – Mild roast
    -   `2` – Full-on reputation assassination

-   Runs as a combined FastAPI + React app, or with the frontend and backend separate.
-   Totally useless, probably offensive — perfect for TinkerHub 2025’s "Useless Projects" showcase.

---

## 📸 Media

> Usage
> ![using](/media/makemelookbad.gif)

<!-- > Before
> ![before](/media/img_01.png)
> After
> ![after](/media/img_02.png) -->

---

## Installation

### 1️⃣ Clone the repository

```bash
git clone https://github.com/akaazazel/makemelookbad_v1.git
cd makemelookbad_v1
```

Project structure:

```
backend/    # FastAPI backend, serves built React frontend
frontend/   # React Vite source code
```

---

### 2️⃣ Install dependencies

**Backend:**

```bash
cd backend
pip install -r requirements.txt
```

**Frontend:**

```bash
cd ../frontend
npm install
```

---

### 3️⃣ Environment setup

Create a `.env` file inside:

```
./makemelookbad_v1/backend
```

Add:

```
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash
```

---

### 4️⃣ Running the project

**Option A — Run with built frontend:**

```bash
# From project root
uvicorn backend.main:app --reload
```

Visit: **[http://127.0.0.1:8000](http://127.0.0.1:8000)**

---

**Option B — Run frontend separately (dev mode):**

1. Start the backend:

    ```bash
    uvicorn backend.main:app --reload
    ```

2. Update `API_URL` in:

    ```
    frontend/src/api/questionService.js
    ```

    to:

    ```javascript
    API_URL = "http://127.0.0.1:8000/question";
    ```

3. Run frontend:

    ```bash
    cd frontend
    npm run dev
    ```

    Visit: **[http://localhost:5173/static/](http://localhost:5173/static/)**

---

### 5️⃣ Building the frontend

When you're ready to ship:

1. Set `API_URL` in:

    ```
    frontend/src/api/questionService.js
    ```

    to:

    ```javascript
    API_URL = "/question";
    ```

2. Build:

    ```bash
    cd frontend
    npm run build
    ```

3. Copy `dist/` to backend’s static folder:

    ```
    ./backend/static
    ```

---

## ⚠️ Disclaimer

AI may generate **offensive, inappropriate, or generally mean** content.
It’s a joke — don’t take it personally.

---

> Created for _TinkerHub 2025 – Useless Projects_ as a test project
> Never submitted thou
