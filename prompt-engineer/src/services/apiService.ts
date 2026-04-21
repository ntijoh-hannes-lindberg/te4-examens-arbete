import { redirect } from "react-router-dom";

export async function newPrompt(prompt): Promise<string> {
    try {
        const response = await fetch(
            `http://localhost:8080/prompts`, {
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
        return new Error("Posting new prompt: " + e.message)
    }
}

export async function allPrompts() {
    try {
        const response = await fetch(
            `http://localhost:8080/prompts`, {
            method: "GET",
        });

        if (!response.ok) {
            throw new Error(response.status + " " + response.statusText);
        }
        const jsonResponse = await response.json()
        return jsonResponse 
    } catch (e) {
        console.error("Posting new prompt: ", e);
        throw e
    }
}

export async function deletePrompt(id: string) {
    try {
        const response = await fetch(
            `http://localhost:8080/prompts/delete/${id}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            throw new Error(response.status + " " + response.statusText);
        }
        return null
    } catch (e) {
        console.error("Deleting prompt: ", e);
        return e.message
    }
}

export function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}