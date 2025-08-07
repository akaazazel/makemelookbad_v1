import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
    const [question, setQuestion] = useState("");
    const [userInput, setUserInput] = useState("");
    const [badLevel, setBadLevel] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isInputDisabled, setIsInputDisabled] = useState(false);

    // const API_URL = "http://127.0.0.1:8000/question"; // local server
    const API_URL = "/question"; // web server

    // Function to fetch the initial or a new question
    const fetchQuestion = async () => {
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
            setIsInputDisabled(true);
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch the question when the component mounts
    useEffect(() => {
        fetchQuestion();
    }, []);

    // NEW: Extracted submission logic into its own function
    const submitAnswer = async () => {
        // Prevent submission if input is empty or locked
        if (!userInput || isInputDisabled) return;

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
            setIsInputDisabled(true); // Lock input after submission
        } catch (e) {
            setError("Failed to post answer. Please try again.");
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    // UPDATED: Keydown handler now calls the new function
    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            submitAnswer();
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

                    {/* UPDATED: JSX for input field and send button */}
                    <div className="input-wrapper">
                        <div className="input-container">
                            <input
                                type="text"
                                className="user-input"
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder={
                                    isInputDisabled
                                        ? "Click 'Retry' to continue..."
                                        : "Type your answer..."
                                }
                                disabled={isLoading || isInputDisabled}
                            />
                            <button
                                className="send-button"
                                onClick={submitAnswer}
                                disabled={isLoading || isInputDisabled}
                            >
                                Send
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default App;
