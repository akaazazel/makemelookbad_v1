// const API_URL = "http://127.0.0.1:8000/question"; // to run in local server
const API_URL = "/question"; // comment this to run in local server
const API_MODEL_URL = `${API_URL}/model`; // to get ai model name

export const fetchQuestion = async () => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    const response = await fetch(API_URL);
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
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

export const fetchModelName = async () => {
    try {
        const response = await fetch(API_MODEL_URL); // Assumes the endpoint is on the same server
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        // The endpoint returns a plain string, so we use .text()
        const modelName = await response.json();
        console.log(modelName)
        return modelName;
    } catch (error) {
        console.error("Failed to fetch model name:", error);
        // Return a fallback name or re-throw the error
        return "configured model";
    }
};
