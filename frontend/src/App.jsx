import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
    const [question, setQuestion] = useState("");
    const [userInput, setUserInput] = useState("");
    const [badLevel, setBadLevel] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // CHANGE 1: Add new state to control the input lock after submission.
    // It's separate from `isLoading` which only handles the API call duration.
    const [isInputDisabled, setIsInputDisabled] = useState(false);

    const API_URL = "http://127.0.0.1:8000/question";

    // Function to fetch the initial or a new question
    const fetchQuestion = async () => {
        // CHANGE 4: Unlock the input field when the user clicks "Retry".
        setIsInputDisabled(false);

        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.text();
            setQuestion(data);
        } catch (e) {
            setError(
                `Failed to fetch question. Make sure your local server is running on ${API_URL}.`
            );
            console.error(e);
            // If fetching fails, re-enable the input so the user can try again.
            setIsInputDisabled(true);
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch the question when the component mounts
    useEffect(() => {
        fetchQuestion();
    }, []);

    // Function to handle form submission on "Enter"
    const handleKeyDown = async (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            if (!userInput) return;

            setIsLoading(true);
            setError(null);

            const payload = {
                user_answer: userInput,
                bad_level: badLevel,
            };

            try {
                const response = await fetch(API_URL, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                setQuestion(data.edited_output);

                // CHANGE 3: After successfully posting, lock the input field.
                setIsInputDisabled(true);
            } catch (e) {
                setError("Failed to post answer. Please try again.");
                console.error(e);
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="container">
            <div className="app-wrapper">
                <header className="app-header">
                    <h1 className="title">make me look bad</h1>
                    <button
                        className="retry-button"
                        onClick={fetchQuestion}
                        disabled={isLoading}
                    >
                        Retry
                    </button>
                </header>

                <main className="content">
                    <div className="question-container">
                        {error && <p className="error-message">{error}</p>}
                        {isLoading && !error && (
                            <p className="loading-message">Loading...</p>
                        )}
                        {!isLoading && !error && (
                            <h2 className="question">{question}</h2>
                        )}
                    </div>

                    <div className="bad-level-selector">
                        <span>Bad Level:</span>
                        {[0, 1, 2].map((level) => (
                            <button
                                key={level}
                                className={`level-button ${
                                    badLevel === level ? "active" : ""
                                }`}
                                onClick={() => setBadLevel(level)}
                            >
                                {level}
                            </button>
                        ))}
                    </div>

                    <div className="input-wrapper">
                        <input
                            type="text"
                            className="user-input"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={
                                isInputDisabled
                                    ? "Click 'Retry' to continue..."
                                    : "Type your answer and press Enter..."
                            }
                            // CHANGE 2: The input is disabled during API calls OR after a submission.
                            disabled={isLoading || isInputDisabled}
                        />
                    </div>
                </main>
            </div>
        </div>
    );
}

export default App;
