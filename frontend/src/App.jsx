import React, { useState, useEffect, useCallback } from "react";
import "./styles/style.css";
import Header from "./components/Header";
import MessageList from "./components/MessageList";
import UserInput from "./components/UserInput";
import {
    fetchQuestion as fetchQuestionApi,
    submitAnswer as submitAnswerApi,
} from "./api/questionService";

function App() {
    const [question, setQuestion] = useState("");
    const [userReplies, setUserReplies] = useState([]);
    const [userInput, setUserInput] = useState("");
    const [badLevel, setBadLevel] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isInputDisabled, setIsInputDisabled] = useState(false);

    const handleFetchQuestion = useCallback(async () => {
        setIsInputDisabled(false);
        setIsLoading(true);
        setError(null);
        setUserReplies([]);
        setQuestion("");
        try {
            const data = await fetchQuestionApi();
            setQuestion(data);
        } catch (e) {
            setError(
                `Failed to fetch question. Make sure your server is running.`
            );
            console.error(e);
            setIsInputDisabled(true);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        handleFetchQuestion();
    }, [handleFetchQuestion]);

    const handleSubmitAnswer = async () => {
        if (!userInput.trim() || isInputDisabled) return;

        const currentInput = userInput;
        setUserReplies((prevReplies) => [...prevReplies, currentInput]);
        setUserInput("");
        setIsLoading(true);
        setIsInputDisabled(true);
        setError(null);

        try {
            const data = await submitAnswerApi(currentInput, badLevel);
            setQuestion(data.edited_output);
        } catch (e) {
            setError("Failed to post answer. Please try again.");
            console.error(e);
            setUserReplies((prevReplies) => prevReplies.slice(0, -1));
            setIsInputDisabled(false);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="app-wrapper">
                <Header onRetry={handleFetchQuestion} isLoading={isLoading} />
                <main className="content">
                    <MessageList
                        question={question}
                        userReplies={userReplies}
                        error={error}
                        isLoading={isLoading}
                    />
                    <UserInput
                        userInput={userInput}
                        setUserInput={setUserInput}
                        badLevel={badLevel}
                        setBadLevel={setBadLevel}
                        submitAnswer={handleSubmitAnswer}
                        isLoading={isLoading}
                        isInputDisabled={isInputDisabled}
                    />
                </main>
            </div>
        </div>
    );
}

export default App;
