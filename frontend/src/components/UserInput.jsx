import React from "react";

const UserInput = ({
    userInput,
    setUserInput,
    badLevel,
    setBadLevel,
    submitAnswer,
    isLoading,
    isInputDisabled,
}) => {
    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            submitAnswer();
        }
    };

    return (
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
                        onChange={(e) => setBadLevel(Number(e.target.value))}
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
                    disabled={isLoading || isInputDisabled || !userInput.trim()}
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
                May generate explicit or offensive content. Don’t take it
                seriously.
            </p>
        </div>
    );
};

export default UserInput;
