// src/components/InfoModal/InfoModal.js
import React from "react";

const InfoModal = ({ isOpen, onClose }) => {
    // If the modal isn't open, render nothing.
    if (!isOpen) {
        return null;
    }

    // This function ensures that clicking inside the modal doesn't close it.
    const handleModalContentClick = (e) => {
        e.stopPropagation();
    };

    return (
        // The backdrop covers the screen. Clicking it will close the modal.
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-content" onClick={handleModalContentClick}>
                <div className="modal-header">
                    <h2 className="modal-title">How It Works</h2>
                    <button className="modal-close-button" onClick={onClose}>
                        &times;
                    </button>
                </div>
                <div className="modal-body">
                    <p>
                        The application asks you a question. You answer it. Then
                        the AI rewrites the original question to make you look
                        like a moron.
                    </p>
                    <p>3 levels of questions:</p>
                    <ul>
                        <li>0 - Normal</li>
                        <li>1 - Mild</li>
                        <li>2 - Severe</li>
                    </ul>
                    <p>
                        Some questions may be offensive or overly explicit.
                        Don’t take it seriously. It’s all for fun.
                    </p>
                    <div className="api-usage-limit">
                        <p>
                            <i>
                                This demo application runs on the{" "}
                                <strong>Gemini 2.5 Flash Lite </strong>
                                free tier (’cause I can’t host my own trained
                                model or rent a GPU server). It’s capped at{" "}
                                <strong>1000 RPD</strong> and{" "}
                                <strong>15 RPM</strong>, so heavy use might
                                trigger errors or slowdowns
                            </i>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InfoModal;
