const API_URL = "http://127.0.0.1:8000/question"; // local server
// const API_URL = "/question"; // web server

export const fetchQuestion = async () => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    const response = await fetch(API_URL);
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.text();
};

export const submitAnswer = async (user_answer, bad_level) => {
    const payload = {
        user_answer,
        bad_level,
    };

    // Simulate network delay
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
    return await response.json();
};
