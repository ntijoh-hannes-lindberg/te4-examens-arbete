export async function newPrompt(prompt): Promise<string> {
    try {
        const response = await fetch(
            `http://localhost:8080/prompt`, {
            method: "POST",
            headers: {
                "Content-Type": "text/plain",
            },
            body: JSON.stringify({
                text: prompt
            })
        });

        if (!response.ok) {
            throw new Error(response.status + " " + response.statusText);
        }

        return null
    } catch (e) {
        console.error("Posting new prompt: ", e);
        return e.message
    }
}