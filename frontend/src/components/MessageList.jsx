import React from 'react';

const MessageList = ({ question, userReplies, error, isLoading }) => {
    return (
        <div className="messages-container">
            {error ? (
                <div className="message ai-message error-message">{error}</div>
            ) : (
                question && <div className="message ai-message">{question}</div>
            )}
            {userReplies.map((reply, index) => (
                <div key={index} className="message user-message">
                    {reply}
                </div>
            ))}
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
    );
};

export default MessageList;
