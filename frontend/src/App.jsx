import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
    const [question, setQuestion] = useState("");
    const [userReplies, setUserReplies] = useState([]);
    const [userInput, setUserInput] = useState("");
    const [badLevel, setBadLevel] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isInputDisabled, setIsInputDisabled] = useState(false);

    const API_URL = "http://127.0.0.1:8000/question"; // local server
    // const API_URL = "/question"; // web server

    const fetchQuestion = async () => {
        setIsInputDisabled(false);
        setIsLoading(true);
        setError(null);
        setUserReplies([]);
        setQuestion(""); // Clear old question immediately
        try {
            // Simulate network delay for loader visibility
            await new Promise((resolve) => setTimeout(resolve, 500));
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.text();
            setQuestion(data);
        } catch (e) {
            setError(
                `Failed to fetch question. Make sure your server is running on ${API_URL}.`
            );
            console.error(e);
            setIsInputDisabled(true);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchQuestion();
    }, []);

    const submitAnswer = async () => {
        if (!userInput.trim() || isInputDisabled) return;

        const currentInput = userInput;
        setUserReplies((prevReplies) => [...prevReplies, currentInput]);
        setUserInput("");
        setIsLoading(true); // Show loader while waiting for AI
        setIsInputDisabled(true);
        setError(null);

        const payload = {
            user_answer: currentInput,
            bad_level: badLevel,
        };

        try {
            // Simulate network delay for loader visibility
            await new Promise((resolve) => setTimeout(resolve, 500));
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
        } catch (e) {
            setError("Failed to post answer. Please try again.");
            console.error(e);
            setUserReplies((prevReplies) => prevReplies.slice(0, -1));
            // Allow user to try submitting again on error
            setIsInputDisabled(false);
        } finally {
            setIsLoading(false);
        }
    };

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
                    <div className="messages-container">
                        {/* {error && <p className="error-message">{error}</p>} */}
                        {error ? (
                            <div className="message ai-message error-message">
                                {error}
                            </div>
                        ) : (
                            question && (
                                <div className="message ai-message">
                                    {question}
                                </div>
                            )
                        )}
                        {userReplies.map((reply, index) => (
                            <div key={index} className="message user-message">
                                {reply}
                            </div>
                        ))}
                        {/* UPDATED: Animated loader */}
                        {isLoading && !error && (
                            <div className="message ai-message">
                                <div className="typing-loader">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="input-wrapper">
                        <div className="input-container">
                            <input
                                type="text"
                                className="user-input"
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder={
                                    isInputDisabled && !isLoading
                                        ? "Click 'Retry' to continue..."
                                        : "Type your answer..."
                                }
                                disabled={isLoading || isInputDisabled}
                            />
                            <div className="select-wrapper">
                                <select
                                    className="bad-level-select"
                                    value={badLevel}
                                    onChange={(e) =>
                                        setBadLevel(Number(e.target.value))
                                    }
                                    disabled={isLoading || isInputDisabled}
                                >
                                    <option value="0">0</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                </select>
                            </div>
                            <button
                                className="send-button"
                                onClick={submitAnswer}
                                disabled={
                                    isLoading ||
                                    isInputDisabled ||
                                    !userInput.trim()
                                }
                            >
                                <svg
                                    className="send-icon"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                >
                                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                                </svg>
                            </button>
                        </div>
                        <p className="content-warning">
                            May generate explicit content. Take it as a grain of
                            salt
                        </p>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default App;
