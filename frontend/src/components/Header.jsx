// src/components/Header/Header.js
import React, { useState } from "react";
import InfoModal from "./InfoModal"; // Adjust path if needed

const Header = ({ onRetry, isLoading }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        // Use a React Fragment (<>... </>) to return multiple components
        <>
            <header className="app-header">
                <h1 className="title">Make Me Look Bad</h1>
                <div className="header-controls">
                    {/* This icon now opens the modal window */}
                    <span
                        className="question-mark-icon"
                        onClick={() => setIsModalOpen(true)}
                    >
                        ?
                    </span>
                    <button
                        className="retry-button"
                        onClick={onRetry}
                        disabled={isLoading}
                    >
                        Retry
                    </button>
                </div>
            </header>

            {/* Render the modal and pass it state and control functions */}
            <InfoModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    );
};

export default Header;
